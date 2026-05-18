# /morning — Morning Brief

Trigger: User types `/morning` or starts a session with a morning greeting on a workday.

---

## Execute in this order:

### 1. Pull database state
```
GET /stats — current task counts, overdue, blocked
GET /tasks?status=todo&ownership=mine — open items
GET /tasks?waiting_on=any — blocked items
```

### 2. Check for unprocessed meetings
If you have a meeting transcript integration (Otter.ai, Fireflies, etc.), search for meetings since last session that haven't been debriefed. Flag them — don't auto-process.

### 3. Output — one screenful, phone-readable

```
MORNING BRIEF — [Day, Date]

🔴 OVERDUE: [count]
   → [top 3 by priority]

⚡ TODAY:
   → [tasks due today]
   → [meetings/calendar items if available]

🚧 BLOCKED: [count] waiting on someone
   → [top blockers]

📋 THIS WEEK:
   → [upcoming deadlines]
   → [standing items due]

💡 HEADS UP:
   → [anything from recent debriefs needing follow-up]
```

### 4. Close with one line
"Highest-value move today: [specific action based on the data]"

---

## Rules
- No pleasantries. Start with the brief.
- Keep it to one phone screen.
- If tools fail, say what failed and work with what's available.
- Don't repeat information from yesterday if nothing changed.
