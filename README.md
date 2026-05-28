# Claude Project OS

A system that turns Claude into a persistent work assistant. Three-layer architecture, drift-aware, bidirectional between memory and database. Originally built in Claude Projects (Chat); now supports Claude Code as a second execution surface, with a one-way bridge between them.

Credit to [u/Available-Spend2443](https://www.reddit.com/r/Agent_AI/) for the Claude Code OS post that inspired the framework.

---

## Visual Blueprint

**[View the full architecture reference →](https://ballyhofam-bot.github.io/claude-project-os/blueprint.html)**

Covers the three-layer architecture, data flow between layers, slash commands, drift checks, failure protocol, daily routine, common mistakes, cost breakdown, and how to start building your own.

---

## How It Works

**Three layers, each with a defined role:**

1. **Memories / rules layer** (Claude's built-in memory + `CLAUDE.md` / Project Instructions) hold the big picture — identity, current state, behavioral rules, architecture decisions. Updated when context shifts, not when numbers change.
2. **Project files** (markdown files in a Claude Project, or `.md` files in a Code repo) hold the stable playbook — org context, skill scripts, deploy notes, lessons learned.
3. **D1 database** (Cloudflare D1 + Workers API) holds live operational data — tasks, people, tribal knowledge, intel, scoreboard metrics. Source of truth.

**Skills are the glue.** Each slash command (`/morning`, `/debrief`, `/close`, `/weekly`, `/audit`) is a markdown file with step-by-step instructions. Every skill explicitly declares which data sources it pulls from and writes back.

**Drift checks keep the layers in sync.** `/morning` runs a lightweight scan. `/close` runs a bidirectional check. `/weekly` nags you to run `/audit` every 21+ days for a full semantic sweep.

---

## Two Surfaces: Project + Code

The original system ran entirely in Claude Projects (mobile-first, capture-oriented). After ~5 weeks of use, the limits become clear: no in-place skill editing, no `wrangler deploy`, no bash. So the system now supports two surfaces with one shared backbone:

- **Claude Project (Chat)** — capture surface. Mobile-friendly. Pasting transcripts, quick `/tribal` logs, status checks between meetings.
- **Claude Code (CLI)** — execution surface. Desktop. Editing skills in place, deploying the Worker, rotating tokens, running the heavy `/audit`.
- **D1 + Worker** — shared. Same URL, same auth, same data behind both.
- **`chat-sync/` folder** — the bridge. Code-side files are source of truth; Project mirrors them via drag-and-drop re-upload.

Same architecture, two surfaces, one bridge. Code edits → regenerate `chat-sync/` → re-upload to Project. One-way flow, no two-way merge.

See [`code-side/README.md`](code-side/README.md) for the Code-side templates and [`chat-sync/README.md`](chat-sync/README.md) for the bridge pattern.

---

## Repo Structure

```
├── blueprint.html                      ← Visual architecture reference (open in browser)
├── project-instructions-template.md    ← Paste into Claude Project's Instructions field
│
├── reference/                          ← Stable context for the rules layer
│   └── ref-context.md
│
├── knowledge-base/                     ← Layered context files
│   ├── kb-tribal-knowledge.md
│   ├── kb-people-intel.md
│   ├── kb-lessons.md                   ← Force-read every morning
│   ├── log-decisions.md
│   └── log-sessions.md
│
├── skills/                             ← Skill files (Chat-flavored / portable)
│   ├── skill-morning.md
│   ├── skill-debrief.md
│   ├── skill-close.md
│   ├── skill-weekly.md
│   ├── skill-audit.md                  ← NEW: heavy semantic audit, split out of /weekly
│   ├── skill-status.md
│   ├── skill-1on1-prep.md
│   └── skill-grill-me.md
│
├── infrastructure/
│   ├── worker-api.mjs                  ← Cloudflare Worker source (with filter conventions)
│   ├── schema.sql                      ← D1 schema (includes scoreboard table)
│   └── deploy-notes.md
│
├── code-side/                          ← NEW: Claude Code templates
│   ├── README.md
│   ├── CLAUDE.md.example
│   ├── .claude/commands/               ← Code-flavored skill example
│   │   └── skill-morning.md
│   └── infra/
│       ├── env.sh.example              ← Single source of truth for token + URL
│       ├── wrangler.toml.example
│       └── WORKER_ROUTES.md            ← Line-number index of the Worker file
│
└── chat-sync/                          ← NEW: the bridge
    └── README.md                       ← How to keep Code and Project in sync
```

---

## Quick Start

**Project (Chat) only:**

1. Create a Claude Project. Upload `reference/` and `knowledge-base/` files with your details filled in.
2. Set up Cloudflare (free tier) — create a D1 database, deploy the Worker from `infrastructure/worker-api.mjs`, run `infrastructure/schema.sql`.
3. Paste `project-instructions-template.md` into Project Instructions. Fill in your API URL and token.
4. Upload skill files from `skills/`. Start with `/morning` and `/close`.
5. Deploy a dashboard to Netlify (free tier) — single HTML file that pulls from your API.

**Adding Code (when Chat-only starts hurting):**

6. Read `code-side/README.md`. Copy `code-side/CLAUDE.md.example` into your local repo as `CLAUDE.md`.
7. Copy `code-side/infra/env.sh.example` as `infra/env.sh`. Paste your token there. Add `infra/env.sh` to `.gitignore`.
8. Copy the Code-flavored skill examples into `.claude/commands/`. They source `env.sh` and use bash chaining.
9. Set up `chat-sync/` per the README. From here on, Code is source of truth, Project mirrors.

Detailed setup in the [blueprint](https://ballyhofam-bot.github.io/claude-project-os/blueprint.html).

---

## Filter Conventions (Worker v3.3.0+)

Every GET endpoint accepts these query params. Skills should always use them.

| Param | Purpose |
|---|---|
| `?since=YYYY-MM-DD` | Filter rows by `created_at >= date` |
| `?completed_since=YYYY-MM-DD` | (`/tasks` only) Filter by `completed_at >= date` |
| `?fields=a,b,c` | Project columns. Use for drift scans, never for content reads. |
| `?limit=N` | Cap rows (max 1000). |

The morning brief should drop ~95% in payload once you add these. See `infrastructure/worker-api.mjs` for the implementation pattern.

---

## Cost

| Component | Cost |
|---|---|
| Claude Max (or Pro) | $20–100/mo |
| Cloudflare D1 + Workers | Free tier |
| Netlify | Free tier |

---

## Customization

Genericized from a real system. Your version should reflect your actual work. Swap Cloudflare for Supabase, Netlify for Vercel, Otter for Fireflies — the pattern is what matters, not the specific tools. The three-layer architecture, drift checks, and (now) the two-surface bridge are the core ideas.

---

## License

MIT
