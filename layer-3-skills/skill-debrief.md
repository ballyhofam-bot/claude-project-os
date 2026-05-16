# /debrief — Post-Meeting Debrief

Trigger: User types `/debrief` or pastes a meeting transcript.

---

## Step 1: Get the transcript
- If `/debrief` with no qualifier — search for today's most recent meeting via transcript integration
- If `/debrief [name]` — search for meeting involving that person
- If transcript is pasted directly — skip search, process what's there
- If transcript tool returns empty — ask user to paste manually

## Step 2: Process — output in this order

### TOP — Floor/Field Action Items (read this walking out)
2-3 specific things to go check, verify, or follow up on. Include who to talk to.

### Tasks Extracted
For each action item: title, description, priority, suggested due date, who's involved.
- `ownership: mine` = your responsibility
- `ownership: fyi` = someone else's, you're tracking it
- **Do NOT over-assign.** If transcript mentions something without explicitly directing you to own it, default to FYI.

### People Intel
- New people mentioned → prepare database records
- Updated intel on existing people → prepare updates
- Relationship-building opportunities

### BOTTOM — Strategic Debrief (read this sitting down)
- **Hidden risks** — what was discussed that nobody fully appreciates?
- **Power dynamics** — who gained or lost influence?
- **Unowned problems** — gaps you could step into
- **48-hour highest-value action** — not most urgent, most valuable
- **Blind spots** — questions you should have asked

## Step 3: Present for review
Show the full output. Do NOT push to database yet. Wait for explicit approval.

## Step 4: Push to database (after approval only)
Include `source_label` and `source_meeting_id` on every task. No orphan tasks.

## Step 5: Update project files
- Tribal knowledge → `kb-tribal-knowledge.md`
- People intel → `kb-people-intel.md`
