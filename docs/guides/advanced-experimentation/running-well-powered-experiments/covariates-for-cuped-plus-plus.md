---
sidebar_position: 4
---

# Rich covariates for CUPED++

Standard CUPED that only uses **pre-experiment activity** on the outcome metric helps less for **brand-new users**, because there is little or no pre-period behavior to condition on. Eppo’s CUPED++ uses a **regression** on pre-period metrics available in the experiment **and** on properties attached to assignments. Passing informative fields through assignment logs can materially shrink confidence intervals.

You often have more information than you think:

### Acquisition and intent

- **Origination**: channel, campaign, UTM parameters, app install source. These encode what was promised to the user and which media they trust.
- **First-session context**: landing page, referral type, or signup flow variant.

### Geography and environment

- **GeoIP** gives at least country; finer location can support features such as urban density, commute patterns, or proximity to relevant physical infrastructure (for example education or retail anchors), when those map to your product.

### Weather and season

Weather can look quaint, but it shifts time indoors, commute friction, and mood. Encoding **rain, cold snaps, or seasonal buckets** can improve predictions for engagement-heavy products when those patterns line up with usage.

### Time structure

- Time of day, day of week, proximity to **payday**, school holidays, major retail events. Many products see spikes on “fresh start” dates or long weekends. Give each feature **a small number of meaningful levels** so the model can use them without overfitting.

### Demographics and firmographics

When available and appropriate for your use case and policies, demographic or account-level descriptors can explain baseline differences—used responsibly and in line with privacy commitments.

### What to expect in the product

Eppo’s analysis UI summarizes **lift and uncertainty**, not the full regression table. For stakeholders who want to go deeper into **which factors** drove adjustment, teams sometimes export aggregates or replicate a slice of the logic in a notebook; that workflow is outside the default UI path.

If you need a convincing narrative before launch, a **historical rehearsal** (a fake or retrospective split on pre-period data) can illustrate how much variance reduction you get from a given covariate set—paired with the intuition that a **large CUPED adjustment** usually means strong pre-existing differences between arms, not a frivolous correction.
