// Project OS Worker API — deploy to Cloudflare Workers
// D1 binding: DB | Secrets: API_TOKEN, ANTHROPIC_API_KEY
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,PATCH,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization"};
function json(d,s=200){return new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json",...CORS}})}
function err(m,s=400){return json({error:m},s)}
function mp(p,pat){const r=new RegExp("^"+pat.replace(/:([^/]+)/g,"([^/]+)")+"$");const m=p.match(r);return m?m.slice(1).map(decodeURIComponent):null}

export default{
  async fetch(request,env){
    if(request.method==="OPTIONS")return new Response(null,{headers:CORS});
    const url=new URL(request.url),path=url.pathname,method=request.method,db=env.DB;
    if(path==="/health"&&method==="GET")return json({status:"ok",ts:new Date().toISOString()});
    const t=(request.headers.get("Authorization")||"").replace("Bearer ","");
    if(t!==env.API_TOKEN)return err("Unauthorized",401);
    try{
      // ── TASKS ──
      if(path==="/tasks"&&method==="GET"){
        let sql="SELECT t.*,p.name as assignee_name FROM tasks t LEFT JOIN people p ON t.assignee_id=p.id";
        const params=[],conds=[];
        for(const[k,col]of[["status","t.status"],["ownership","t.ownership"],["target_period","t.target_period"],["priority","t.priority"]]){
          const v=url.searchParams.get(k);if(v){conds.push(col+"=?");params.push(v);}
        }
        const wo=url.searchParams.get("waiting_on");
        if(wo==="any")conds.push("t.waiting_on IS NOT NULL");
        else if(wo){conds.push("t.waiting_on LIKE ?");params.push("%"+wo+"%");}
        const q=url.searchParams.get("q");
        if(q){conds.push("(t.title LIKE ? OR t.description LIKE ?)");params.push("%"+q+"%","%"+q+"%");}
        if(conds.length)sql+=" WHERE "+conds.join(" AND ");
        sql+=" ORDER BY CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,t.due_date ASC";
        const{results}=await db.prepare(sql).bind(...params).all();
        return json({tasks:results,count:results.length});
      }
      if(path==="/tasks"&&method==="POST"){
        const b=await request.json();if(!b.title)return err("title required");
        const r=await db.prepare("INSERT INTO tasks(title,description,due_date,priority,status,assignee_id,source,tags,notes,ai_extracted,source_label,source_meeting_id,ownership,waiting_on,knowledge_type,target_period)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(b.title,b.description||null,b.due_date||null,b.priority||"Medium",b.status||"todo",b.assignee_id||null,b.source||"manual",b.tags||null,b.notes||null,b.ai_extracted?1:0,b.source_label||null,b.source_meeting_id||null,b.ownership||"mine",b.waiting_on||null,b.knowledge_type||null,b.target_period||null).run();
        return json(await db.prepare("SELECT*FROM tasks WHERE id=?").bind(r.meta.last_row_id).first(),201);
      }
      if(mp(path,"/tasks/:id")&&method==="PATCH"){
        const[id]=mp(path,"/tasks/:id"),b=await request.json();
        const ok=["title","description","due_date","priority","status","assignee_id","tags","notes","ownership","waiting_on","knowledge_type","target_period"];
        const sets=["updated_at=datetime('now')"],vals=[];
        for(const k of ok)if(b[k]!==undefined){sets.push(k+"=?");vals.push(b[k]);}
        if(b.status==="done")sets.push("completed_at=datetime('now')");
        vals.push(id);await db.prepare("UPDATE tasks SET "+sets.join(",")+" WHERE id=?").bind(...vals).run();
        return json(await db.prepare("SELECT*FROM tasks WHERE id=?").bind(id).first());
      }
      if(mp(path,"/tasks/:id")&&method==="DELETE"){const[id]=mp(path,"/tasks/:id");await db.prepare("DELETE FROM tasks WHERE id=?").bind(id).run();return json({deleted:true});}

      // ── PEOPLE ──
      if(path==="/people"&&method==="GET"){const{results}=await db.prepare("SELECT*FROM people ORDER BY name").all();return json({people:results,count:results.length});}
      if(path==="/people"&&method==="POST"){const b=await request.json();if(!b.name)return err("name required");const r=await db.prepare("INSERT INTO people(name,department,area,expertise,notes)VALUES(?,?,?,?,?)").bind(b.name,b.department||null,b.area||null,b.expertise||null,b.notes||null).run();return json(await db.prepare("SELECT*FROM people WHERE id=?").bind(r.meta.last_row_id).first(),201);}
      if(mp(path,"/people/:id")&&method==="PATCH"){const[id]=mp(path,"/people/:id"),b=await request.json();const ok=["name","department","area","expertise","notes"],sets=["updated_at=datetime('now')"],vals=[];for(const k of ok)if(b[k]!==undefined){sets.push(k+"=?");vals.push(b[k]);}vals.push(id);await db.prepare("UPDATE people SET "+sets.join(",")+" WHERE id=?").bind(...vals).run();return json(await db.prepare("SELECT*FROM people WHERE id=?").bind(id).first());}

      // ── LEADERSHIP MOVES ──
      if(path==="/moves"&&method==="GET"){const s=url.searchParams.get("since");let sql="SELECT*FROM leadership_moves";if(s)sql+=" WHERE date>=?";sql+=" ORDER BY date DESC";const{results}=s?await db.prepare(sql).bind(s).all():await db.prepare(sql).all();return json({moves:results,count:results.length});}
      if(path==="/moves"&&method==="POST"){const b=await request.json();if(!b.description)return err("description required");const r=await db.prepare("INSERT INTO leadership_moves(date,description,category,context,people_involved,source_label)VALUES(?,?,?,?,?,?)").bind(b.date||new Date().toISOString().split("T")[0],b.description,b.category||"proactive",b.context||null,b.people_involved||null,b.source_label||null).run();return json(await db.prepare("SELECT*FROM leadership_moves WHERE id=?").bind(r.meta.last_row_id).first(),201);}

      // ── STATS ──
      if(path==="/stats"&&method==="GET"){
        return json({
          total_tasks:(await db.prepare("SELECT COUNT(*)as c FROM tasks").first()).c,
          by_status:(await db.prepare("SELECT status,COUNT(*)as c FROM tasks GROUP BY status").all()).results,
          overdue:(await db.prepare("SELECT COUNT(*)as c FROM tasks WHERE due_date<date('now')AND status NOT IN('done')").first()).c,
          blocked:(await db.prepare("SELECT COUNT(*)as c FROM tasks WHERE waiting_on IS NOT NULL AND status NOT IN('done')").first()).c,
          total_people:(await db.prepare("SELECT COUNT(*)as c FROM people").first()).c
        });
      }

      // ── EXPORT ──
      if(path==="/export"&&method==="GET"){
        return json({
          exported_at:new Date().toISOString(),
          tasks:(await db.prepare("SELECT*FROM tasks ORDER BY id").all()).results,
          people:(await db.prepare("SELECT*FROM people ORDER BY id").all()).results,
          moves:(await db.prepare("SELECT*FROM leadership_moves ORDER BY date DESC").all()).results
        });
      }

      return err("Not found",404);
    }catch(e){return err(e.message||"Internal error",500);}
  }
};
