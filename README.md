# Claude Project OS — 3-Layer Operating System for Claude Projects

A system that turns Claude Projects into a persistent operational command center. Context survives compaction, tasks get tracked in a real database, and skill commands keep everything synchronized.

Credit to [u/Available-Spend2443](https://www.reddit.com/r/Agent_AI/) for his Claude Code OS post that inspired the framework. Same problem, different platform — this runs on Claude Projects instead of Claude Code, with a database layer instead of flat files.

---

## The Problem

Claude forgets. Long conversations get compacted. New sessions start cold. You re-explain your situation, lose decisions, repeat yourself. If you're using Claude for real work — not one-off questions — this kills you.

## The Fix: Three Layers

### Layer 1 — .md Files (Permanent Memory)

Project files Claude reads at session start. Your role, key people, relationship dynamics, institutional knowledge, decision log, session history. Project files don't get compacted — they're always there.

| File | Purpose |
|------|---------|
| `ref-context.md` | Session briefing. Who you are, what you're doing, what Claude should watch for |
| `kb-tribal-knowledge.md` | Undocumented institutional knowledge — the stuff that lives in people's heads |
| `kb-people-intel.md` | Relationship dynamics, political reads, working styles |
| `log-decisions.md` | Key decisions with date, context, rationale. Prevents re-litigating |
| `log-sessions.md` | Running session history. What was covered, what changed, what carries forward |
| `00-index.md` | File index and naming conventions |

### Layer 2 — Database + Artifacts (Live Working Data)

A Cloudflare D1 database with a Worker API and a Netlify dashboard. Structured task tracking, people directory, leadership moves log. Plus interactive artifacts — React components that run inside Claude's artifact system.

Layer 1 tells Claude *why* something matters. Layer 2 tells Claude *what* the current state is. Different jobs.

### Layer 3 — Skill Commands (Cadence)

Markdown files in the project that act as executable commands. Type `/morning` and Claude reads the skill file, pulls live data, and builds a brief. Type `/debrief` after a meeting and it extracts tasks, captures intel, runs analysis.

The cadence is what holds it together. Without Layer 3, Layers 1 and 2 drift apart.

| Command | When | What it does |
|---------|------|-------------|
| `/morning` | Start of day | Pulls DB state, checks for unprocessed meetings, surfaces overdue/blocked items, builds brief |
| `/debrief` | After any meeting | Extracts tasks, people intel, metrics, strategic analysis from transcript |
| `/close` | End of day | Reconciles what happened, updates .md files, logs session |
| `/status` | Anytime | 10-second pulse — counts, overdue, blocked |
| `/weekly` | Friday | Full week review — scoreboard, wins, gaps, leadership moves audit |
| `/manager-prep` | Before 1-on-1 | Data-driven prep using tasks, recent debriefs, knowledge gaps |

---

## Setup Guide

### What You Need

- **Claude Pro or Team account** with Projects access
- **Cloudflare account** (free tier works) for D1 database + Worker
- **Netlify account** (free tier works) for dashboard hosting
- Basic comfort with copy-pasting code and clicking deploy buttons. No CLI required, but it helps.

### Step 1 — Layer 1: Create Your Project and Upload .md Files

1. Create a new Project in Claude
2. Customize every file in the `layer-1-memory/` folder:
   - `ref-context.md` — Replace all `[PLACEHOLDER]` values with your actual role, company, goals, daily cadence
   - `kb-tribal-knowledge.md` — Start empty, this fills up over time from debriefs
   - `kb-people-intel.md` — Add your key contacts and relationship notes
   - `log-decisions.md` — Start empty
   - `log-sessions.md` — Start empty
   - `00-index.md` — Update to match your actual file list
3. Upload all .md files to your Claude Project

### Step 2 — Layer 2: Set Up Infrastructure

**Database + API:**

1. Sign up at [Cloudflare](https://dash.cloudflare.com/) (free)
2. Go to Workers & Pages → D1 → Create Database
3. Name it whatever you want, note the database ID
4. Go to Workers & Pages → Create Worker
5. Paste the contents of `layer-2-infrastructure/worker-api.mjs` into the editor
6. In the Worker settings:
   - Add a D1 binding: variable name `DB`, select your database
   - Add a secret `API_TOKEN` — make up a long random string, this is your bearer token
   - Add a secret `ANTHROPIC_API_KEY` — your Claude API key (for transcript extraction)
7. Deploy the Worker, note the URL

**Create the database tables** — run these SQL statements in the D1 console (Workers & Pages → D1 → your database → Console):

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'todo',
  assignee_id INTEGER,
  automatable INTEGER DEFAULT 0,
  recurring INTEGER DEFAULT 0,
  recurrence_pattern TEXT,
  template_id INTEGER,
  source TEXT DEFAULT 'manual',
  tags TEXT,
  notes TEXT,
  ai_extracted INTEGER DEFAULT 0,
  source_label TEXT,
  source_meeting_id TEXT,
  ownership TEXT DEFAULT 'mine',
  waiting_on TEXT,
  knowledge_type TEXT,
  target_period TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT,
  area TEXT,
  expertise TEXT,
  strength TEXT,
  go_to_for TEXT,
  reliability TEXT DEFAULT 'watching',
  contact_info TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  default_priority TEXT DEFAULT 'Medium',
  default_status TEXT DEFAULT 'todo',
  default_tags TEXT,
  checklist TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leadership_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'proactive',
  context TEXT,
  people_involved TEXT,
  source_label TEXT,
  source_meeting_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weekly_reflections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_of TEXT NOT NULL,
  influenced_vs_executed TEXT,
  clarity_created TEXT,
  learned_about_eaton TEXT,
  time_allocation_note TEXT,
  source_label TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

**Dashboard:**

1. Sign up at [Netlify](https://app.netlify.com/) (free)
2. Create a new site from the Netlify dashboard (manual deploy)
3. Build your own dashboard HTML or start from `layer-2-infrastructure/dashboard-template.html`
4. Update the API URL and bearer token in the dashboard code to point to your Worker
5. Deploy

**Artifacts:**

Artifacts are React components (.jsx files) you upload to your Claude Project. They render as interactive tools inside conversations. Check the `examples/` folder for a starter. Build your own based on what you actually need on the job.

### Step 3 — Layer 3: Upload Skill Files

1. Customize every file in the `layer-3-skills/` folder:
   - Replace `[YOUR_API_URL]` with your Worker URL
   - Replace `[YOUR_PERSON_ID]` with your ID in the people table
   - Replace `[YOUR_NAME]`, `[YOUR_ROLE]`, `[YOUR_COMPANY]` throughout
   - Adjust the daily cadence times to match your schedule
   - Modify `/manager-prep` for your specific boss and relationship
2. Upload all skill files to your Claude Project

### Step 4 — Configure Project Instructions

Add project-level instructions that tell Claude:
- To read `ref-context.md` at session start
- Your API URL and bearer token for D1 access
- Your person_id in the database
- Which integrations are connected (Otter.ai, Gmail, Calendar, etc.)

See `project-instructions-template.md` for a starting point.

### Step 5 — Start Using It

First session:
1. Type `/morning` — it'll be sparse since nothing's in the system yet
2. After your first meeting, type `/debrief` and paste the transcript
3. At end of day, type `/close`

By day 3, the system has meaningful context. By week 2, Claude knows your job.

---

## How the Layers Reinforce Each Other

```
/morning reads ──→ .md files (Layer 1) + D1 database (Layer 2)
                   ↓
              Builds briefing with full context

/debrief writes ──→ Tasks to D1 (Layer 2) + Knowledge to .md files (Layer 1)
                    ↓
              Both layers updated from one meeting

/close reconciles ──→ Session logged (Layer 1) + Tasks updated (Layer 2)
                      ↓
              Clean handoff to next session's /morning
```

Without the cadence (Layer 3), the .md files go stale and the database has data Claude never contextualizes. The skill commands force synchronization every single day.

---

## Customization Notes

This template is genericized from a real system I run for my job as an EHS manager at a manufacturing plant. Your version should reflect your actual work:

- **If you don't have meeting transcripts**, strip the Otter.ai parts from `/debrief` and just paste notes
- **If you don't need a people directory**, simplify the D1 schema
- **If your job doesn't have a daily cadence**, adjust the skill triggers to match your rhythm
- **The leadership moves table** tracks moments where you proactively led, influenced, or created clarity beyond your basic duties — useful for performance reviews regardless of industry

The system works because it matches how you actually work, not because of the specific tools. Swap Cloudflare for Supabase, Netlify for Vercel, Otter for Fireflies — the three-layer pattern is what matters.

---

## License

MIT — use it however you want.
