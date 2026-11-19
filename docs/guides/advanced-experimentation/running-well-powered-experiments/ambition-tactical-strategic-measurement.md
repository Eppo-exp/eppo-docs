---
sidebar_position: 5
---

# Ambition, disagreement, and tactical vs. strategic measurement

When traffic is scarce, the limiting factor is often **not** whether a 2% lift is detectable—it is whether the idea is worth shipping at all.

## Test bolder ideas

Marginal tweaks rarely justify weeks of engineering and coordination when each variant only receives a trickle of users. **Ambitious, controversial** ideas can fail more often, but when they move, they move enough to measure—and they clarify strategic disagreements.

Experimentation is a safety net: use it to try concepts that would not pass a consensus deck. Expect that **many** ideas will not win on the first iteration; treat that as a reason to **explore widely**, not to stop testing.

## Learn from non-users and unhappy users

Some of the best hypotheses come from people who **considered** your product and walked away, or from churned and dissatisfied users. Ask structured questions about blockers and anxieties.

Do not treat every feature request literally—the classic “faster horses” warning still applies. A useful framing (from performance feedback) is that **the proposed fix may be wrong, but the note is right**: something is off, and it is your job to invent the right solution. Catalog complaints, then design **your own** responses; internally, surface **where teams disagree** and prioritize experiments that resolve those disagreements.

## Tactical A/B tests vs. strategic holdouts

Not every decision should be settled with a standard A/B on a distant revenue metric.

**Tactical** questions suit randomized comparisons on **immediate** outcomes: Did the new search UI reduce redundant queries? Did the form capture valid emails more reliably?

**Strategic** questions—whether sustained investment in an area (search, onboarding, a new surface) is worth the opportunity cost—often need **longer horizons**, **holdouts**, or separate program-level measurement so you separate “did we ship a good iteration?” from “should we fund this bet for the next year?”

### Example: search

- **Tactical**: A/B changes that improve query reformulation, latency, or click position—metrics close to the product surface.
- **Strategic**: Whether the organization should fund a larger search initiative; that may be better served by a **holdout** or long-running program metric than by a single short A/B.

### Example: email capture

- **Tactical**: Experiments on the “Send me more” flow—copy, validation, UX—to improve capture quality.
- **Tactical follow-on**: What you do with those emails (reactivation journeys) and how that moves downstream conversions.
- **Strategic**: Whether relying on that intermediate step matches the company’s long-term relationship to customers—often a slower, broader evaluation than one funnel test.

Use [proximal metrics and entry points](/guides/advanced-experimentation/running-well-powered-experiments/design-targeting-dilution-proximal-metrics/) so tactical tests stay measurable; use [runtime and baselines](/guides/advanced-experimentation/running-well-powered-experiments/runtime-seasonality-sample-size/) when the strategic question truly needs time.
