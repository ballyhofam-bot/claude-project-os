# /manager-prep — 1-on-1 Prep

Trigger: User types `/manager-prep` before a scheduled 1-on-1.

---

## Execute:

### 1. Pull current state
```
GET /tasks?ownership=mine&status=todo
GET /tasks?waiting_on=[MANAGER_NAME]
GET /tasks?status=done (filter to last 7 days)
GET /moves?since=[7 days ago]
```

### 2. Check recent debriefs
Search past conversations for open items from previous meetings with this manager.

### 3. Build prep doc

```
1-ON-1 PREP — [Date]

SINCE LAST MEETING:
  ✓ Completed: [tasks closed]
  → In progress: [active items]
  🚧 Blocked on [manager]: [items waiting on them]

LEAD WITH:
  → [Most impressive thing you did — framed for your company's performance language]

QUESTIONS TO ASK:
  1. [Specific, context-aware question]
  2. [Question about a gap or upcoming event]
  3. [Development or relationship question]

VISIBILITY MOVE:
  → [One natural way to make work visible]

CLOSE THE LOOP ON:
  → [Unresolved item from last meeting]

KNOWLEDGE TO EXTRACT:
  → [1-2 things your manager knows that aren't documented]
```

## Rules
- Every question connects to a real task, project, or gap.
- The "lead with" item should be something your manager can repeat upward.
- Keep it short enough to glance at on your phone walking to the meeting.
