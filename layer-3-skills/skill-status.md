# /status — Quick Status Pulse

Trigger: User types `/status`.

---

## Execute:
```
GET /stats
GET /tasks?status=todo&ownership=mine
GET /tasks?waiting_on=any&status=todo
```

## Output — compact, 10-second read:

```
STATUS — [Date]

Open: [X] mine / [Y] fyi / [Z] total
Overdue: [X] | Due soon: [X] | Blocked: [X]

TOP OVERDUE:
  1. [title] — due [date]
  2. [title] — due [date]

TOP BLOCKERS:
  → [task] waiting on [who]
```

## Rules
- No analysis, no recommendations. Just numbers.
- Clean board? Say "Clean board" and show counts only.
