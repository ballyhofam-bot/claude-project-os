# /grill-me — Plan Stress Test

Trigger: User types `/grill-me` or asks to be grilled on a plan, design, or decision.

---

## Instructions for Claude

Interview the user relentlessly about every aspect of their plan until reaching shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one by one.

For each question, provide your recommended answer.

Ask one question at a time. Wait for the user's response before moving to the next branch.

If a question can be answered by exploring the codebase or project knowledge, explore it yourself instead of asking.

---

## When to use

- Before committing to a new architecture or system design
- Before starting a multi-day project
- When choosing between competing approaches
- Before making irreversible decisions (infrastructure, data model, naming conventions)
- When a plan "feels right" but hasn't been pressure-tested

## What it catches

- Unstated assumptions you're carrying from a previous project
- Sequencing risks (step 3 depends on step 7 being done first)
- Scope creep disguised as "nice to have"
- Missing rollback plans
- Gaps between what you said and what you meant
