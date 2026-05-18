# /weekly — Weekly Review

Trigger: User types `/weekly`. Run Friday afternoon.

---

## Execute:

### 1. Pull the week's data
```
GET /export — full snapshot
GET /moves?since=[monday]
GET /tasks?status=done — filter to this week
```

### 2. Output

```
WEEKLY REVIEW — Week of [Monday date]

📊 SCOREBOARD:
  Tasks: [closed] closed / [open] open / [overdue] overdue
  Leadership moves logged: [count]

✓ WINS THIS WEEK:
  → [completed tasks and accomplishments]

⚠ GAPS:
  → [overdue items]
  → [goals falling behind]

★ LEADERSHIP MOVES:
  → [list with categories]

🎯 NEXT WEEK PRIORITIES:
  1. [highest value]
  2. [second]
  3. [third]

💬 CITATION LOG:
  → [moments worth capturing as repeatable statements for performance review]
```

### 3. Reflection prompt
Ask three questions:
- What did you influence this week vs. just execute?
- Where did you create clarity that didn't exist before?
- What did you learn about how your organization actually works?

## Rules
- Pull real numbers. Don't estimate.
- Be honest about gaps.
