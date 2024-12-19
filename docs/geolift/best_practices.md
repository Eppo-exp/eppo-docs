---
sidebar_position: 2
---
# Statistical Assumptions and Best Practices

## Strong assumptions of quasi-experiments

In traditional randomized controlled trials (RCTs), the random assignment of participants to treatment and control groups ensures that, in expectation, all observed and unobserved confounding variables are balanced across groups. This randomization provides a strong foundation for causal inference.

In contrast, in quasi-experiments like Geolift, we cannot rely on randomization since the number of units is dramatically smaller than in an RCT. Instead, we look to observance of a set of Assumptions (rules) that help ensure that the units are actually similar enough to compare.

:::info
Think of it like this: When you run a randomized experiment, it's like thoroughly shuffling a deck of cards before dealing them. The shuffling ensures that any patterns in how the cards were previously arranged are broken up completely by chance. This randomization does the heavy lifting of making the groups comparable.

In quasi-experiments, you're working with cards that are already dealt - maybe some players already picked their cards. Since you couldn't shuffle first, you need to do extra work to convince yourself that the groups you're comparing are actually similar enough for a fair comparison. You need to carefully check for patterns and differences that might explain any results you see, beyond just the thing you're studying.
:::

### Separating Treatment and Control

1. **Minimal Spillover Between Units:** Users in treatment regions should generally not interact with control regions during the test. This is why we recommend using larger geographic units (DMAs, states, ZIP clusters) over individual ZIP codes - people frequently cross ZIP codes in daily life.
2. **No Early Reactions:** Users shouldn't change behavior before the test starts. For example, if you're testing a store opening but start advertising it months in advance, users might shift behavior before your official "start date".
3. **Units Stay Independent:** Each region's performance should only be affected by what happens in that region, not by changes in other regions, or weather. If weather or another factor is likely to significantly affect your KPI, the region should be removed from the analysis.

### Stability through Time

4. **Parallel Trends:** Regions should behave mostly similarly over time when nothing special is happening. In theory, if NYC and Chicago historically move together, they should continue to do so unless we intervene. Natural random variation is fine.
5. **No Major Disruptions:** Avoid or exclude regions with big unusual events during your test. Examples include pop culture phenomena like Taylor Swift touring through specific markets, natural disasters, major league sports championships, or major elections.

### Data Reliability

6. **Accurate Location Data:** We need to reliably know which region users belong to. IP geolocation isn't perfect, so using larger regions helps minimize these errors.
7. **Enough Historical Data:** We recommend 12-18 months of data so we can learn seasonal patterns and normal relationships between region, but can scale down to as little as 3-4 months.
8. **Consistent Measurement:** How we define and measure regions shouldn't change during the test period.
