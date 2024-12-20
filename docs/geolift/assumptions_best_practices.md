---
sidebar_position: 2
---
# Statistical Assumptions and Best Practices

## Strong Assumptions of Quasi-experiments

In traditional randomized controlled trials (RCTs), the random assignment of participants to treatment and control groups ensures that, in expectation, all observed and unobserved confounding variables are balanced across groups. This randomization provides a strong foundation for causal inference.

In contrast, in quasi-experiments like Geolift, we cannot rely on randomization since the number of units is dramatically smaller than in an RCT. Instead, we look to observance of a set of Assumptions (rules) that help ensure that the units are actually similar enough to compare.

:::info
In a randomized experiment, participants are randomly assigned to either the treatment group (those exposed to the intervention) or the control group (those who aren’t). This random assignment ensures that the decision of who gets the treatment is completely unrelated—or "uncorrelated"—to personal factors like where someone is from, what they’ve done in the past, or any other characteristic.

This randomness creates a fair, "apples-to-apples" comparison between the two groups. Because the groups are similar in every way except for the treatment, we can confidently say that any difference in results (like an increase in sales or engagement) is caused by the treatment—not by other factors.

Sometimes, it’s not feasible to use a fully randomized approach. This is where Quasi-experiments and Geolift come in. For example, you might want to maintain marketing spend in key markets and decide those markets should stay in the "control" group. In this case, treatment status is linked to certain characteristics of those markets (like size, location, or performance history), making the assignment "correlated" with those qualities.

This introduces a challenge: the differences between the groups might already exist before the treatment, making it harder to pinpoint whether the treatment itself caused any observed lift. To overcome this, we need to do additional analysis to create a fair, apples-to-apples comparison. This helps ensure that any lift we see can be attributed to the treatment rather than pre-existing differences between the groups.
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

## Best Practices

### Choosing your unit of randomization

Choose larger geographic units like DMAs, Commuting Zones, states, or countries rather than small units like ZIP codes. Smaller units suffer from spillover effects as users move between them frequently throughout the day, violating key assumptions. Larger units provide more stable populations, better data quality through IP-location mapping, and less day-to-day variance in metrics. This improved signal-to-noise ratio helps the model detect true treatment effects.

For non-geographic units, please contact the Eppo team in Slack for assistance with test design.

### Seasonality

Seasonality appears in most metrics - retail sales spike during holidays, ride-sharing demand follows weather patterns, travel bookings have clear high and low seasons. While synthetic controls naturally handle seasonality by learning patterns across regions, you need enough historical data to capture full seasonal cycles. Plan to have 12-18 months of data so the model can distinguish between treatment effects and normal seasonal variations.

### Holidays and Peak Periods

Holidays impact incrementality testing in two ways: test validity and result generalizability.

For validity, synthetic controls work best when holidays affect treatment and control regions similarly. If a holiday uniquely impacts specific regions during the test period, those regions may need to be excluded. For example, in a global country-randomized test where your product sees unique spikes during country-specific holidays, the holiday-driven sales increase could be confused with treatment effects.

For generalizability, peak periods like Black Friday/Cyber Monday or elections create increased "noise" in the media ecosystem, typically reducing the effect sizes of marketing interventions. While testing during these periods can be more challenging, it's often necessary since many businesses concentrate significant spend in these windows. For the most complete view of campaign incrementality, we recommend running tests during both peak and non-peak periods.

### When to exclude specific regions from analysis

Exclude regions that experience unique events making them poor controls or treatment units. Examples include markets hosting major sporting events, areas hit by natural disasters, and regions with unique competitive changes like a new market entry. Also consider excluding mega-markets that are too important to risk in treatment. The key is maintaining stable relationships between regions during the test period - exclude any region where that assumption breaks down.

If you need to remove a region during or after an experiment from the synthetic control group or treatment, the Eppo team can assist.
