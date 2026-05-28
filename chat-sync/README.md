# Chat-Sync — The Bridge Between Code and Project

If you run skills in both Claude Code AND Claude Project, you need exactly one source of truth and a one-way path to the mirror. That's what `chat-sync/` is.

---

## The pattern

**Code is the source of truth.** Skills, CLAUDE.md, infrastructure references — all canonical in Code.

**Project mirrors Code.** Same logic, different syntax. Bash → HTTP fetch instructions. Variables → placeholders Claude resolves from Project Instructions.

**Sync direction:** Code → Project. Never the reverse.

When you change a Code-side skill:
1. Update the Code version (`.claude/commands/skill-morning.md`)
2. Regenerate the Project-flavored version (`chat-sync/skill-morning.md`)
3. Delete the old version from your Project's Files panel
4. Upload the new one

Never edit a Project-side skill directly. The next Code regeneration will overwrite it.

---

## What goes in this folder

Mirror your Code-side skill files, translated to Project-compatible syntax:

```
chat-sync/
├── README.md                       ← this file
├── project-instructions.md         ← paste into Chat's Project Instructions field
├── skill-morning.md                ← Chat-formatted /morning
├── skill-debrief.md
├── skill-close.md
├── skill-weekly.md
├── skill-audit.md
├── skill-status.md
├── skill-tribal.md
└── (one per Code-side skill)
```

Plus an optional `CHANGES.md` log:

```
chat-sync/CHANGES.md
─────────────────────
## 2026-05-28
- project-instructions.md → re-paste (added /scoreboard endpoint, v3.5.0 worker)
- skill-morning.md → replace (Step 1 + Step 9 reference scoreboard)

## 2026-05-27 (initial migration)
- All skills migrated to Chat-format
- Project Instructions seeded
```

Open `CHANGES.md` to see what to re-upload since last sync. ~30-second triage instead of trying to remember what changed.

---

## Code-to-Chat translation rules

**Bash helper → natural language fetch:**
```bash
# Code
source ~/projects/your-project/infra/env.sh
api /stats | jq .
```
becomes
```
# Chat
Fetch GET WORKER_API/stats with header Authorization: Bearer WORKER_TOKEN
(WORKER_API and WORKER_TOKEN are defined in Project Instructions)
```

**Date computation → instruction:**
```bash
# Code
SINCE=$(date --date='7 days ago' +%Y-%m-%d)
```
becomes
```
# Chat
Compute SINCE = 7 days before today (YYYY-MM-DD format)
```

**Pipe to jq → leave to Claude:**
```bash
# Code
api /stats | jq '.knowledge.total'
```
becomes
```
# Chat
Fetch GET WORKER_API/stats and extract knowledge.total from the response
```

Same semantics, different mechanics.

---

## Why one-way only

Two-way merge between Code and Project is a trap. There's no diff tool that understands both, no way to resolve conflicts cleanly, and you'd burn weekends untangling. One-way (Code → Project) means:

- Edit canonical content in one place
- Project Files panel becomes effectively read-only (uploads only)
- No surprise drift between environments

The cost: every Code change requires regenerating `chat-sync/` and re-uploading. ~2 minutes. The benefit: no two-way merge nightmare, ever.

---

## When to skip Chat-sync entirely

You don't need this folder if:

- You only use Claude Project (Chat-only) — skip Code entirely, no bridge needed
- You only use Claude Code — your laptop is your workflow, no mobile capture

This folder exists for the hybrid case: capture in Chat, edit/deploy in Code, sync between them.

---

## Setup

1. Make `chat-sync/` a folder in your Code repo root
2. Create Chat-formatted versions of each Code skill — same logic, fetch-based syntax
3. Add an entry to `CHANGES.md` each time you change something
4. When sync-time comes: open the folder, drag the changed files into Project's Files panel, paste updated Project Instructions if changed

That's the whole pattern.
