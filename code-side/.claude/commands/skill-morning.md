Run the morning brief. No pleasantries — start with the data.

## Setup
```bash
source ~/projects/your-project/infra/env.sh
```

## Step 1: Pull D1 status
```bash
api /stats | jq .
api "/tasks?status=todo&ownership=mine" | jq .
api "/tasks?waiting_on=any" | jq .
api /scoreboard | jq .
```

## Step 2: Pull lean context for drift scan (projected, not full bodies)
```bash
# Names only — for waiting_on validation
api "/people?fields=id,name" | jq .

# Recent intel only — for key-person freshness check
SINCE=$(date --date='14 days ago' +%Y-%m-%d)
api "/intel?since=$SINCE&fields=person_name,intel_type,created_at" | jq .
```

Counts (knowledge, intel, people, leadership_moves) come from `/stats` in Step 1 — do NOT fetch full bodies for counts.

## Step 2.5: Lightweight drift scan
- Scan open tasks from Step 1 — for each `waiting_on` value, check if name appears in the projected people list
- From the projected intel-since-14d response, identify key people with NO entry in the window
- If `/stats` counts feel off vs. what you remember from last session, flag it

Output drift as single line: `🔍 DRIFT: [count] items — [one-liner per finding]` or omit if clean.

## Step 3: Force-read lessons
Read `kb/lessons.md`. Surface any entries added since last session under `⚠ RECENT LESSONS`. Skip if none.

## Step 4: Detect dashboard changes
```bash
YESTERDAY=$(date --date='1 day ago' +%Y-%m-%d)
api "/tasks?completed_since=$YESTERDAY&fields=id,title,completed_at,priority,notes" | jq .
```
Parse `[COMPLETED: reason]` tags in notes field.

## Step 5: Output — one screenful, phone-readable

```
MORNING BRIEF — [Day, Date]

🔍 DRIFT: [findings or omit]
⚠ RECENT LESSONS: [or omit]
↕ DASHBOARD CHANGES SINCE LAST SESSION: [completed/changed tasks]
🔴 OVERDUE: [count] → [top 3 by priority]
⚡ TODAY: [calendar + tasks due today]
🚧 BLOCKED: [count] → [top blockers]
📋 THIS WEEK: [compliance items, deadlines]
📚 KNOWLEDGE THIS WEEK: [X] new entries
💡 HEADS UP: [floor follow-up, standing items]
```

## Step 6: Safety pulse (or domain pulse)
From `/scoreboard` (pulled in Step 1):
- Key metrics vs targets
- Flag any drifting trends

If `last_updated` on `/scoreboard` is older than 7 days, flag: "⚠ Scoreboard stale — update during next `/weekly` close."

## Step 7: Close with one line
"Highest-value move today: [specific action based on the data]"

## Rules
- No pleasantries. Start with the brief.
- One phone screen max.
- If tools fail, say what failed and work with what's available.
- Don't repeat known info — if nothing changed since yesterday, say so.
- **Never fetch full `/knowledge`, `/intel`, or `/people` bodies** for counts. Use `/stats` (free) or `?fields=` projection.
