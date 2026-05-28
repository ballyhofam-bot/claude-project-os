# /audit — Full Semantic Audit + Drift Scan

Heavy data fetch. Only run on demand, not weekly. Target cadence: every 21–30 days, or when something feels off.

`/weekly` checks when `/audit` last ran. If it's been 21+ days, it nags you. That's the cadence trigger.

---

## Step 1: Pull full bodies (only here, not in /morning or /weekly)

This is the only command allowed to pull full bodies of `/knowledge` and `/intel`. Every other skill uses `?since=` and `?fields=` filters.

```
GET /knowledge
GET /intel
GET /people?fields=id,name,department,area
GET /tasks?waiting_on=any
GET /tasks?status=todo
```

---

## Step 2: Semantic checks

**Knowledge contradictions** — same `subject`, conflicting `detail`. Newer entry presumed correct. Flag the older one for archive.

**Intel conflicts** — same `person_name`, conflicting entries within the same `intel_type` (e.g., two `reliability` entries that say opposite things). Newer wins.

**Orphaned references** — for every open task with `waiting_on` set, check that the name appears in the people list. Flag mismatches. Also flag tasks with `ai_extracted=true` and null `source_meeting_id`.

**Duplicates** — same `subject`+`area` in knowledge with overlapping `detail`. Same person represented under multiple name variants (first name vs full name).

---

## Step 3: Drift checks

**Stale knowledge** — knowledge entries older than 30 days with no newer entry on the same subject. Could be stale facts.

**Cold relationships** — key people (defined in your rules layer) with no intel entry in 21+ days.

**Skill drift** — scan skill files for references to deleted files, removed endpoints, stale field names. Flag any found.

---

## Step 4: Output — severity tagged

```
AUDIT — [Date]

🔴 CONTRADICTIONS / CONFLICTS:
  → [knowledge or intel entries that disagree — show both with IDs and dates]

🟡 STALE / DRIFT:
  → [stale knowledge, cold key relationships, skill file references to dead things]

🔵 CLEANUP:
  → [duplicates, name variants, orphaned references, ai_extracted with no source_meeting_id]

✓ HEALTHY:
  → [one-liner counts: knowledge OK / intel OK / orphans 0 / etc.]
```

Wait for review before acting on any finding. Don't auto-delete or auto-merge.

---

## Step 5: Record the audit baseline

After review (regardless of whether findings are acted on), write a baseline knowledge entry:

```
POST /knowledge
{
  "category": "metric",
  "area": "workflow",
  "subject": "audit-baseline-YYYY-MM-DD",
  "detail": "[N] contradictions, [N] drift, [N] cleanup. Acted: [summary]",
  "source_label": "/audit run YYYY-MM-DD"
}
```

This is what `/weekly` checks to decide whether to nag.

---

## Rules

- Never auto-act on findings. Always present, wait for approval, then push fixes.
- The audit-baseline knowledge entry MUST be written even if nothing was changed — it's the cadence marker.
- If `/audit` is run twice in the same week, that's fine. The most recent baseline wins.
- Findings should reference IDs (`knowledge #142`, `intel #67`, `task #289`) so you can act precisely.
