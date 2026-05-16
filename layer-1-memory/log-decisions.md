# Decisions Log

Key decisions with date, context, and rationale. New entries at the top. Once logged, a decision stands unless explicitly reversed with a new entry.

---

## [DATE] — [Decision title]
**Decision:** [What was decided]
**Context:** [Why this came up]
**Rationale:** [Why this option was chosen over alternatives]

## Example: 2026-01-10 — Infrastructure stack
**Decision:** Use Cloudflare D1 + Worker for backend, Netlify for frontend.
**Context:** Needed persistent structured storage accessible from Claude Projects.
**Rationale:** All services connect via MCP integrations. Free tier covers the use case. Single-file HTML dashboard with no build step keeps it simple.
