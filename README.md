# Claude Project OS

A system that turns Claude Projects into a persistent work assistant with a three-layer architecture. Context survives between chats, data flows bidirectionally between memory and database, and slash commands keep everything synchronized.

Credit to [u/Available-Spend2443](https://www.reddit.com/r/Agent_AI/) for the Claude Code OS post that inspired the framework.

---

## Visual Blueprint

**[View the full architecture reference →](https://ballyhofam-bot.github.io/claude-project-os/blueprint.html)**

Covers the three-layer architecture, data flow between layers, slash commands, drift checks, failure protocol, daily routine, common mistakes, cost breakdown, and how to start building your own.

---

## How It Works

**Three layers, each with a defined role:**

1. **Memories** (Claude's built-in memory) hold the big picture — identity, current state, behavioral rules, architecture decisions. Updated monthly.
2. **Project files** (~20 markdown files in a Claude Project) hold the stable playbook — org context, skill scripts, deploy notes, lessons learned. Rarely change.
3. **D1 database** (Cloudflare D1 + Workers API) holds live operational data — tasks, people, tribal knowledge, relationship intel. Source of truth. Updated daily.

**Skills are the glue.** Each slash command (`/morning`, `/debrief`, `/close`, `/weekly`, `/grill-me`) is a markdown file with step-by-step instructions. Every skill explicitly declares which data sources it pulls from and in what order, consulting all three layers and writing back.

**Drift checks keep the layers in sync.** `/morning` runs a lightweight comparison. `/close` runs a bidirectional check after every session (D1 → memories and memories → D1). `/weekly` runs a full semantic audit. When D1 is down, the system degrades to memories + project files, buffers failed writes, and recovers next session.

---

## Repo Structure

```
├── blueprint.html                      ← Visual architecture reference (open in browser)
├── project-instructions-template.md
│
├── reference/
│   ├── ref-context.md                  ← Who you are, daily cadence, what to watch for
│   └── ref-stable.md                   ← Stable reference pruned from memories (org, rules)
│
├── knowledge-base/
│   ├── kb-tribal-knowledge.md          ← Undocumented institutional knowledge
│   ├── kb-people-intel.md              ← Relationship dynamics and working styles
│   ├── kb-lessons.md                   ← Dead ends and mistakes (force-read every morning)
│   ├── log-decisions.md                ← Key decisions with context and rationale
│   └── log-sessions.md                 ← Running session history
│
├── skills/
│   ├── skill-morning.md                ← /morning — daily brief + lightweight drift scan
│   ├── skill-debrief.md                ← /debrief — post-meeting extraction with review gate
│   ├── skill-close.md                  ← /close — end of session + bidirectional drift check
│   ├── skill-status.md                 ← /status — quick pulse
│   ├── skill-weekly.md                 ← /weekly — Friday full audit across all three layers
│   ├── skill-1on1-prep.md              ← /1on1-prep — 1-on-1 meeting prep
│   └── skill-grill-me.md              ← /grill-me — stress-test plans and designs
│
└── infrastructure/
    ├── worker-api.mjs                  ← Cloudflare Worker source
    ├── schema.sql                      ← D1 database schema
    └── deploy-notes.md                 ← Deploy patterns and gotchas
```

---

## Quick Start

1. **Create a Claude Project** and upload the `reference/` and `knowledge-base/` files with your details filled in
2. **Set up Cloudflare** (free tier) — create a D1 database, deploy the Worker, run the schema
3. **Add your API URL and token** to `project-instructions-template.md` and upload it
4. **Upload the skill files** from `skills/` — start with `/morning` and `/close` to establish the daily loop
5. **Build drift checks into `/close` from day one** — memory vs D1 comparisons catch problems before they compound
6. **Deploy a dashboard** to Netlify (free tier) — single HTML file that pulls from your API

Detailed setup instructions are in the [blueprint](https://ballyhofam-bot.github.io/claude-project-os/blueprint.html).

---

## Cost

| Component | Cost |
|-----------|------|
| Claude Max (or Pro) | $20–100/mo |
| Cloudflare D1 + Workers | Free tier |
| Netlify | Free tier |

---

## Customization

This is genericized from a real system. Your version should reflect your actual work. Swap Cloudflare for Supabase, Netlify for Vercel, Otter for Fireflies — the pattern is what matters, not the specific tools. The three-layer architecture and drift checks are the core ideas. Everything else is implementation.

---

## License

MIT
