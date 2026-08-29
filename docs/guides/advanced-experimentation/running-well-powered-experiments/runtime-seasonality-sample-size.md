---
sidebar_position: 2
---

# Runtime, seasonality, and sample size

When treatment and control look very different compared to what you would expect from random noise alone, the first question to ask is whether you can **collect more data**—not only because larger $N$ tightens intervals, but because a large imbalance can mean the variants were not comparable at the start, and time can help average over that misspecification when paired with good covariate adjustment.

## Run longer when you can

Doubling precision in the standard error roughly requires **four times** the sample size when you are trying to detect a proportionally smaller effect. There is no substitute for duration or traffic when the effect you care about is subtle.

Longer runs have benefits beyond raw power:

- You accumulate a **baseline** of behavior that you can compare to holidays, major marketing pushes, weather, or product incidents—so you are less likely to mistake a one-off context for a lasting lift.
- They **normalize** the idea that some questions need weeks or months, which in turn makes it acceptable to ship **more impactful** changes that would never clear a “result this week” bar.
- They allow **compounding** and habit formation to show up when the hypothesis is about sustained behavior change rather than a one-session tweak.

In highly nuanced cases—for example a subscription or premium tier where the value proposition plays out over seasons and repeated use—it can take a very long horizon to measure the trade-offs fairly. In those situations, the constraint is often not the statistical toolkit but the **business patience** to align the metric window with the actual decision.

## When runtime is not enough

If you cannot extend the test, return to the levers in the main guide: [variance reduction](/guides/advanced-experimentation/running-well-powered-experiments/#reducing-variance), [CUPED++ with rich covariates](/guides/advanced-experimentation/running-well-powered-experiments/covariates-for-cuped-plus-plus/), [targeting and entry points](/guides/advanced-experimentation/running-well-powered-experiments/design-targeting-dilution-proximal-metrics/), and [experiment ambition](/guides/advanced-experimentation/running-well-powered-experiments/ambition-tactical-strategic-measurement/). Runtime is the best fix when imbalance is the core issue; the other options help when time is capped.
