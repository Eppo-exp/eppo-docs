---
sidebar_position: 9
---

# Why interaction effects are not symmetrical

When two experiments run concurrently and you check whether they interact, you are asking: *"Does being in Experiment B's treatment group change the lift I observe in Experiment A?"*

But you could ask the reverse: *"Does being in Experiment A's treatment group change the lift I observe in Experiment B?"*

These are different questions, and they will generally give different answers — even though they describe the same group of users and the same underlying data. This guide explains why, and what it means in practice.

## Why the answers differ

Interaction effects in Eppo are expressed as a change in **relative lift** (a percentage change). Relative lift is always computed against a baseline, and the two questions above use different baselines:

| Question | What is being measured | Baseline used |
|---|---|---|
| From Experiment A's page | Does B's arm change A's relative lift? | A-control users, split by B arm |
| From Experiment B's page | Does A's arm change B's relative lift? | B-control users, split by A arm |

Because the baselines are different, the measured interaction magnitude will differ — sometimes by a factor of two or more.

## Example 1: Homepage redesign and newsletter CTA

Two experiments are running simultaneously:

- **Experiment A**: A complete homepage redesign, expected to roughly double daily sign-ups (+100%)
- **Experiment B**: A small "Subscribe to newsletter" call-to-action, expected to add a modest +5% to sign-ups

Daily sign-ups across the four groups:

|  | B: Control (no CTA) | B: Treatment (CTA shown) |
|---|---|---|
| **A: Control (old homepage)** | 100 | 105 |
| **A: Treatment (new homepage)** | 200 | 215 |

### From Experiment A's perspective

*Does the newsletter CTA change how much lift the homepage redesign produces?*

- Lift of A with no CTA: (200 − 100) / 100 = **+100%**
- Lift of A with CTA: (215 − 105) / 105 = **+104.8%**
- **Interaction: +4.8 percentage points**

### From Experiment B's perspective

*Does the homepage redesign change how much lift the newsletter CTA produces?*

- Lift of B on old homepage: (105 − 100) / 100 = **+5%**
- Lift of B on new homepage: (215 − 200) / 200 = **+7.5%**
- **Interaction: +2.5 percentage points**

The underlying phenomenon is identical — both experiments amplify each other beyond what pure additivity would predict. But the measured interaction is nearly **twice as large** when viewed from the big experiment's perspective (+4.8 pp vs +2.5 pp).

## Example 2: Recommendation engine and card design

- **Experiment A**: A new ML-powered recommendation engine, expected to triple clicks on product cards (+200%)
- **Experiment B**: Larger product card thumbnails, expected to add +10% to clicks

Daily product card clicks:

|  | B: Control (small thumbnails) | B: Treatment (large thumbnails) |
|---|---|---|
| **A: Control (old engine)** | 1,000 | 1,100 |
| **A: Treatment (new engine)** | 3,000 | 3,400 |

### From Experiment A's perspective

- Lift of A with small thumbnails: (3,000 − 1,000) / 1,000 = **+200%**
- Lift of A with large thumbnails: (3,400 − 1,100) / 1,100 = **+209%**
- **Interaction: +9 percentage points**

### From Experiment B's perspective

- Lift of B with old engine: (1,100 − 1,000) / 1,000 = **+10%**
- Lift of B with new engine: (3,400 − 3,000) / 3,000 = **+13.3%**
- **Interaction: +3.3 percentage points**

Here the same interaction appears **three times larger** from the big experiment's perspective. The new recommendation engine raises the baseline so much that even a larger absolute improvement in thumbnail clicks represents a smaller percentage gain.

## Example 3: Checkout flow and free shipping threshold

- **Experiment A**: A streamlined checkout flow, expected to increase purchase conversions by +40%
- **Experiment B**: Lowering the free shipping threshold from $50 to $25, expected to add +15% to conversions

Purchase conversion rate (purchases per session):

|  | B: Control ($50 threshold) | B: Treatment ($25 threshold) |
|---|---|---|
| **A: Control (old checkout)** | 5.0% | 5.75% |
| **A: Treatment (new checkout)** | 7.0% | 8.25% |

### From Experiment A's perspective

*Does the free shipping threshold change how much the checkout improvement helps?*

- Lift of A with $50 threshold: (7.0% − 5.0%) / 5.0% = **+40%**
- Lift of A with $25 threshold: (8.25% − 5.75%) / 5.75% = **+43.5%**
- **Interaction: +3.5 percentage points**

### From Experiment B's perspective

*Does the streamlined checkout change how much lowering the shipping threshold helps?*

- Lift of B with old checkout: (5.75% − 5.0%) / 5.0% = **+15%**
- Lift of B with new checkout: (8.25% − 7.0%) / 7.0% = **+17.9%**
- **Interaction: +2.9 percentage points**

A moderate difference here (+3.5 pp vs +2.9 pp), but still worth noting — especially because statistical significance thresholds are sensitive to effect size.

## What this means in practice

**The same interaction looks bigger when viewed from the experiment with the larger effect.**

When the large experiment shifts the baseline significantly, the smaller experiment's relative lift changes less in percentage terms even if the absolute difference is the same. A few implications to keep in mind:

1. **Significance can differ between perspectives.** An interaction effect might cross the significance threshold when viewed from one experiment's results page but not the other. Both conclusions are correct — they answer different questions about different lifts.

2. **Neither view is "wrong".** Experiment A's interaction result tells you about the robustness of A's lift across B's arms. Experiment B's interaction result tells you about the robustness of B's lift across A's arms. Both are valid.

3. **"No interaction" is also asymmetric.** Just because Experiment A shows no significant interaction with B does not mean Experiment B will show no significant interaction with A. If the decision is high-stakes, check both directions.

4. **When shipping both, think in absolute terms.** If you plan to roll out both experiments to 100% of users, neither relative-lift perspective captures the full picture. Work with your data team to measure the combined outcome directly and compare it against the sum of the individual effects.

:::info Interaction effects are only available for Simple metrics
Interaction effect analysis is currently limited to **Simple** metric types (sum, count, unique entities, threshold). Ratio metrics and funnel metrics are not supported. If you need to check for interactions on a ratio metric, consider adding the numerator and denominator as separate Simple metrics to your experiment.
:::

For background on how Eppo detects and surfaces interaction effects, see [Interaction Detection](/statistics/interaction-detection).
