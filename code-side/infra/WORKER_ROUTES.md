# Worker Routes Index — `worker-api.mjs`

Navigation aid so Claude (and you) can read targeted slices instead of the whole file. **Update this index when adding/removing routes** — keep line ranges accurate.

Current version: **v3.5.0** (line 1 header)

## File structure (typical layout)

| Lines | Section |
|---|---|
| 1–10 | Header comment (version, secrets, cron) |
| 11–15 | CORS constants |
| 17–25 | `json()` + `err()` helpers |
| 27–32 | `matchPath()` helper |
| 34–48 | `projectFields()` + `limitClause()` helpers (v3.3.0+) |
| 50–100 | `buildWeeklyDigest()` |
| 103–170 | `formatDigestEmail()` |
| 175–197 | `sendDigestEmail()` |
| 199–220 | `export default { scheduled, fetch }` — entry + auth |

## Route map

Read the line range below to edit a route. The Read tool's `offset`/`limit` lets you pull exactly these slices.

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | `/health` | Version probe | Keep version string in sync with header |
| GET | `/digest/preview` | Composed weekly digest | |
| POST | `/digest/send` | Sends digest via email service | |
| GET | `/tasks` | Task CRUD with filters | `status, ownership, since, completed_since, fields, limit` |
| POST | `/tasks` | Insert task | |
| PATCH | `/tasks/:id` | Update task | |
| DELETE | `/tasks/:id` | Delete task | |
| GET | `/moves` | Leadership moves | `category, since` |
| POST/PATCH/DELETE | `/moves` | CRUD for moves | |
| GET | `/export` | **Heavy** — full DB dump | Only `/audit` should call this |
| GET | `/people` | People directory | `department, since, fields, limit` |
| POST/PATCH/DELETE | `/people` | CRUD for people | |
| GET | `/people/:id/intel` | Convenience — intel for one person | |
| GET | `/templates` | Task templates | |
| POST | `/otter/extract` | AI extraction | Uses ANTHROPIC_API_KEY |
| GET | `/intel` | People intel | `person_name, intel_type, since, fields, limit` |
| POST/PATCH/DELETE | `/intel` | CRUD for intel | |
| GET | `/knowledge` | Tribal knowledge | `category, area, q, since, fields, limit` |
| POST/PATCH/DELETE | `/knowledge` | CRUD for knowledge | |
| GET | `/scoreboard` | Single-row metrics dashboard | Live TRIR, observations, man-hours |
| PATCH | `/scoreboard` | Update scoreboard fields | Auto-stamps `last_updated` |
| GET | `/stats` | Counts dashboard | Always cheap — use for counts |

## How to use this index

**Editing a route:** `Read worker-api.mjs offset=N limit=M` pulls only that route's handler. Edit, then deploy.

**Adding a filter to a GET route:** the four filterable GETs (`/tasks`, `/people`, `/intel`, `/knowledge`) all follow the same pattern — copy from one to another.

**Bumping version:** edit lines 1 (header comment) AND `/health` response. They must match.
