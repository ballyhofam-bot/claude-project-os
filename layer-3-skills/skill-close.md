# /close — Session Close

Trigger: User types `/close` or signals end of day.

---

## Execute:

### 1. Scan today's conversation
Extract: tasks completed, new tasks surfaced, decisions made, knowledge captured, unresolved items.

### 2. Push updates (with approval)
- New tasks → confirm, then POST to database
- Status changes → PATCH
- People intel → present before pushing

### 3. Update project files
- Append to `log-sessions.md` (date, covered, changed, carries forward)
- If decisions were made → append to `log-decisions.md`
- If tribal knowledge surfaced → append to `kb-tribal-knowledge.md`

### 4. Output

```
SESSION CLOSE — [Date]

✓ DONE TODAY:
  → [what got completed/moved]

→ CARRIES FORWARD:
  → [unresolved items with next step]

📝 LOGGED:
  → [what was updated in database and files]

⚡ TOMORROW:
  → [1-2 things to hit first]
```

## Rules
- Don't pad. Light day = 3 lines.
- Never update files without showing what's changing first.
