---
sidebar_position: 3
---

# Targeting, dilution, and proximal metrics

Power is not only a property of your formulas—it is a property of **who** enters the analysis and **what** you measure.

## Very small audiences

If you have **fewer than roughly a hundred** subjects per variant, treat the experiment as partly qualitative: talk to users, review support tickets, and run interviews. The numbers may still rule out huge effects, but you will not resolve fine-grained product questions by statistics alone.

## Prefer metrics close to the change

Pick outcomes that the intervention plausibly moves **directly**: engagement with the new UI, task completion, satisfaction on the flow you changed. Downstream metrics (long-term retention, company-wide revenue) are legitimate as guardrails or long-horizon follow-ups, but they dilute signal when the sample is small and the change is narrow.

Where it helps, **binarize or bucket** continuous outcomes so they carry more information at your scale—for example, the share of users who needed **more than fifteen minutes** to complete a task can be more stable and interpretable than the average completion time alone.

## Targeting and segments

Define **indicative categories** (cohorts, intents, or lifecycle stages) so you can focus analysis on the population the change actually affects. A broad average can hide a clear win in the subgroup you care about—or hide harm outside it.

## Remove dilution with entry points

When assignment happens before exposure, including users who never see the treatment adds noise. Use [entry points](/guides/advanced-experimentation/entry_points) (qualifying events) so the experiment analyzes people who were actually eligible for the experience under test.

## A higher-conversion proxy metric

When a strategic outcome is rare, decompose the decision into **steps** with higher base rates: e.g. measuring whether users successfully used an improved search experience (queries reformulated, clicks on results) before you insist on revenue impact. Pair that with the [tactical vs. strategic](/guides/advanced-experimentation/running-well-powered-experiments/ambition-tactical-strategic-measurement/) framing so tactical A/B tests do not silently substitute for a strategic bet.
