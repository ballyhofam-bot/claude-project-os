# Claude Project OS

A system that turns Claude Projects into a persistent work assistant. Context survives between chats, tasks get tracked in a real database, and slash commands keep everything synchronized.

Credit to [u/Available-Spend2443](https://www.reddit.com/r/Agent_AI/) for the Claude Code OS post that inspired the framework.

---

## Visual Blueprint

**[View the full architecture reference →](https://ballyhofam-bot.github.io/claude-project-os/blueprint.html)**

Covers every file, the data flow, slash commands, daily routine, common mistakes, cost breakdown, and how to start building your own.

---

## How It Works

**~20 markdown files** live in a Claude Project and give Claude permanent context — who you are, how your job works, key people, and executable slash commands. Claude reads them at the start of every conversation.

**A Cloudflare D1 database** stores dynamic state that changes daily — tasks, people, tribal knowledge, relationship intel. Claude reads from and writes to it via a Worker API during conversations.

**A Netlify dashboard** pulls from the same API and gives you a visual command center without opening Claude.

Slash commands (`/morning`, `/debrief`, `/close`, `/weekly`) are markdown files with step-by-step instructions Claude follows like a script. The cadence is what holds the layers together.

---

## Repo Structure

```
├── blueprint.html                  ← Visual architecture reference (open in browser)
├── project-instructions-template.md
├── layer-1-memory/
│   ├── ref-context.md              ← Who you are, daily cadence, what to watch for
│   ├── kb-tribal-knowledge.md      ← Undocumented institutional knowledge
│   ├── kb-people-intel.md          ← Relationship dynamics and working styles
│   ├── log-decisions.md            ← Key decisions with context and rationale
│   ├── log-sessions.md             ← Running session history
│   └── 00-index.md                 ← File index and naming conventions
├── layer-2-infrastructure/
│   ├── worker-api.mjs              ← Cloudflare Worker source
│   ├── schema.sql                  ← D1 database schema
│   └── deploy-notes.md             ← Deploy patterns and gotchas
└── layer-3-skills/
    ├── skill-morning.md            ← /morning — daily brief
    ├── skill-debrief.md            ← /debrief — post-meeting extraction
    ├── skill-close.md              ← /close — end of session reconciliation
    ├── skill-status.md             ← /status — quick pulse
    ├── skill-weekly.md             ← /weekly — Friday review and audit
    └── skill-manager-prep.md       ← /manager-prep — 1-on-1 prep
```

---

## Quick Start

1. **Create a Claude Project** and upload the `layer-1-memory/` files with your details filled in
2. **Set up Cloudflare** (free tier) — create a D1 database, deploy the Worker, run the schema
3. **Add your API URL and token** to `project-instructions-template.md` and upload it
4. **Upload the skill files** from `layer-3-skills/` with your details filled in
5. **Deploy a dashboard** to Netlify (free tier) — single HTML file that pulls from your API

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

This is genericized from a real system. Your version should reflect your actual work. Swap Cloudflare for Supabase, Netlify for Vercel, Otter for Fireflies — the pattern is what matters, not the specific tools.

---

## License

MIT
