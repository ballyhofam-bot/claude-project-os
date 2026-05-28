# Code-Side Templates

Templates for running this OS in Claude Code (the CLI) alongside Claude Project. If you're new and Chat-only is still working, skip this folder — come back when skill iteration gets painful or you need to deploy the Worker from the same place you edit it.

---

## When to add Code

Signals that Chat-only is hurting:

- You've stopped iterating on skills because re-uploading is too annoying
- Your `.md` files are duplicating each other and you can't tell which is true
- The morning brief pulls full tables just to count rows
- Worker debugging means "paste curl commands and hope"
- You've made a decision that's now lost because it lived only in a compacted conversation

If 2+ of those apply, it's time.

---

## What Code adds

Claude Code is a CLI that runs bash, edits files in place with precise diffs, deploys Workers via `wrangler`, and chains operations in parallel.

Specifically, it solves:

- **In-place skill editing.** Open `skill-morning.md`, change a line, save. No re-upload, no auto-versioning, no clutter.
- **Single source of truth.** `CLAUDE.md` is auto-loaded every session. Project Instructions becomes a mirror.
- **Worker maintenance.** `wrangler deploy` from the same place you edit the source. Secrets stay intact between deploys.
- **Token rotation.** One file: `infra/env.sh`. Every skill references it. Rotation = edit one line.
- **The audit.** A `/audit` slash command that's allowed to pull full bodies and run the heavy semantic checks — too expensive to run weekly, but right for monthly.

---

## Files in this folder

| File | Purpose |
|---|---|
| `CLAUDE.md.example` | Top-level rules file. Auto-loaded by Claude Code every session. Mirror of Project Instructions. |
| `infra/env.sh.example` | Bearer token + API URL + helper function. Sourced by every skill. Single rotation point. |
| `infra/wrangler.toml.example` | Cloudflare Worker deploy config (D1 binding, cron, account ID). |
| `infra/WORKER_ROUTES.md` | Line-number index of the Worker source file. Lets Claude read targeted slices instead of the whole file. |
| `.claude/commands/skill-morning.md` | Example of a Code-flavored skill — bash-based, sources `env.sh`, uses parallel fetches and `jq` for parsing. |

---

## How Code-side skills differ from Chat-side skills

Same logic, different syntax. Side-by-side:

**Chat (Project) version of `/morning` Step 1:**
```
Fetch GET WORKER_API/stats with header Authorization: Bearer WORKER_TOKEN
Fetch GET WORKER_API/tasks?status=todo&ownership=mine
Fetch GET WORKER_API/tasks?waiting_on=any
```

**Code version of `/morning` Step 1:**
```bash
source ~/projects/your-project/infra/env.sh
api /stats | jq .
api "/tasks?status=todo&ownership=mine" | jq .
api "/tasks?waiting_on=any" | jq .
```

Code wins on:
- Parallel execution (multiple fetches at once)
- Pipe to `jq` for parsing in the same line
- The `api` helper hides auth boilerplate

Chat wins on:
- Mobile access
- No setup overhead (no env.sh to source)

Both produce the same brief.

---

## Setting up Code-side from scratch

1. Pick a folder. Anywhere — `~/projects/yourproject/` works.
2. `cp CLAUDE.md.example CLAUDE.md` and fill in your details
3. `mkdir -p infra .claude/commands`
4. `cp infra/env.sh.example infra/env.sh` — paste your real token + URL
5. Add `infra/env.sh` to `.gitignore` (it contains your token — never commit)
6. `cp infra/wrangler.toml.example infra/wrangler.toml` — fill in your D1 IDs
7. Copy the Code-flavored skills from `.claude/commands/skill-morning.md` (and any others you want) into your `.claude/commands/`
8. Test: `source infra/env.sh && api /health` — should return your Worker version

From here forward, edit skills in Code. When you change one, regenerate the Chat-formatted version (see `../chat-sync/README.md`) and re-upload to Project.

---

## Rules

- **`infra/env.sh` is the single source of truth for the bearer token.** Never copy the literal token into skill files. Skills reference `$WORKER_TOKEN` or call the `api` helper, never paste the token inline.
- **`.claude/settings.local.json`** should allow `Bash(api *)` and `Bash(source ~/projects/your-project/infra/env.sh*)` to avoid permission prompts on every fetch.
- **Code → Chat sync is one-way.** If you edit a Chat-side skill directly, the next Code-side regeneration will overwrite it. Always edit in Code.
