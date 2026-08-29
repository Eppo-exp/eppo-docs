---
sidebar_position: 1
---

# Running well powered experiments with smaller sample size

Running poorly powered experiments can be harmful to experimentation practices. Not only do low powered experiments lead to insignificant results, they also exaggerate the winner's curse: winning experiments will have overestimated lift estimates.

This page provides best practices for conducting well-powered experiments and illustrates how to optimally configure Eppo for experiments in power-constrained situations.

## What is statistical power

In one sentence: statistical power measures the sensitivity to detect differences between variations in your experiment. That is, suppose treatment actually does work better than control. In that case, does the experiment come to the same conclusion.

Statistical power is all about the signal-to-noise ratio: the more we can make the signal stand out, the easier it is to detect changes. 

## What contributes to statistical power?

There are four ingredients that determine the statistical power:

- The effect size: larger effects are easier to detect
- Sample size: more observations make it easier to detect effects
- The variance of the metric: lower variance makes it easier to see the signal through the noise
- The statistical methodology: some statistical methods are better at maximizing power than others.

We are not in control of the effect size for a given experiment (of course, we can design a different experiment that might have a larger effect size), though metric choice matters: in particular, often effect sizes are larger for metrics that are close to the intervention compared to those that are far downstream. For example, when we make a change to the checkout flow, it is much easier to detect changes in the checkout conversion metric as compared to the 90-day churn rate or the customers LTV.

Increasing the sample size is also a simple knob to improve statistical power, but it can only get us so far. A good rule of thumb to keep in mind is that to be able to detect an effect that’s twice as small, we need four times as much data. No one wants to run experiments for months.

Fortunately, there are two more ways to increase statistical power: by controlling the variance of the metric, and by carefully choosing the statistical methodology. We dive into each of these in more detail.

## Reducing variance

### Selecting an appropriate metric

Above, we discussed how the choice of metric can impact the effect size by picking metrics with inherently large signal. But there are also differences between noise levels for different metrics. Selecting metrics with low variance (and hence less noise) is the most effective way to improve power. Often, we can come up with variations of a metric that have much lower variance and are therefore a good choice when we are looking to increase power.

#### Binarizing continuous metrics

For example, consider replacing your continuous primary metric with its binary counterpart; instead of using revenue per user as your primary metric, consider using revenue conversion (how many unique users put in an order, e.g., using a unique entities aggregation), or how many users spent more than $100. Well-chosen binary metrics often have lower variance than their continuous counterparts and can accordingly lead to better powered experiments.

It is important to be mindful that an experiment could increase conversion but still lower overall revenue. Given this, it's recommended to look at both the continuous and binary version as well as revenue per conversion (i.e., average order value). If any revenue metrics are trending in the wrong direction, it's worth reconsidering your experiment design and potentially running the experiment longer.

#### Avoiding rare events

Another common pitfall is to use metrics that measure very rare events. It is very difficult to detect relative differences between variations when the base rate is close to zero (a 10% increase of a conversion rate that sits at 1% means detecting a 0.1% difference; when the conversion rate is 10%, we need to detect a difference of 1% — a factor of 10 difference in effect size means having to run the first experiment 100x longer).

Therefore, avoid focusing on metrics with low base rates. 

### Handling outliers using winsorization

Almost every business has metrics that follow heavy tail distributions due to “whale” users. These users contribute an outsized proportion of revenue, engagement, etc. While you don't want to ignore these users, they make statistical inference a lot more difficult as they can increase the variance of metrics significantly. Therefore, it is good practice to winsorize metrics, which means clipping the top $q$ percentile (often 99% or 99.9%). Any user with a metric above this threshold has their metric replaced with said threshold. 

Eppo allows users to customize winsorization at the metric level, as some metrics benefit from stronger winsorization, while it is not needed at all for others.

### Fully leveraging historical data with CUPED++

Another powerful technique to improve the signal-to-noise ratio in your experiments is to leverage existing historical data to augment your estimates. A subject that was very active prior to the experiment is more likely to be active during the experiment as well, and we can use this idea to “remove” variance from our estimates. In particular, the better we can predict a subject’s outcomes during the experiment, the better our variance reduction.

Most implementations of CUPED control for only one variable: the pre-experiment metric value. For instance, when looking at a metric like revenue, the common CUPED approach is to adjust based on revenue before the experiment:

$$
\mathrm{Revenue_{adjusted}} = \mathrm{Revenue_{post}} - \alpha \cdot \mathrm{Revenue_{pre}}
$$ 

While the pre-experiment metric value is often a powerful predictor of the metric outcome, Eppo goes one step further and performs a full linear regression onto all of the metrics in the experiment, as well as any property data added to the assignment logs. This allows us to better predict outcomes and hence reduce variance even further.

Imagine you are running an experiment with revenue as the primary metric. The standard CUPED approach would only look at pre-period revenue and no other metrics. In most situations there are other pre-period metrics that will highly correlate with post-period revenue: how many visits has this customer had in the previous 30 days, how many products did they view, etc. By adding these additional metrics to your experiment, you'll often see a meaningful increase in CUPED++ accelerations. 

This example focuses on a continuous variable (revenue), but the same concept applies to binary metrics like conversion. (The traditional CUPED setting breaks down for conversion metrics as “pre-period conversion” is not well defined)

If we do not have any pre-period data to leverage, for example because we run an experiment on new users, assignment properties can still help you lower the variance in your experiment. Any property added to your assignment definition will also get included in the regression. For instance, if you add the source a user came from, their region, and their device, Eppo's CUPED++ model will use those values to reduce variance. Note that this can help speed up both new user experiments and existing user experiments.

For intuition when presenting CUPED to stakeholders: a **large adjustment** after CUPED is usually not arbitrary—it reflects that control and treatment were far apart on predictable dimensions before the test, and the model is doing the work of separating signal from that imbalance. When audiences are very small (on the order of dozens of subjects per variant), supplement numbers with qualitative conversations.

For a deeper discussion of **which covariates to pass** (assignment properties, geography, time, and other features) and how they help new-user experiments in particular, see [Rich covariates for CUPED++](/guides/advanced-experimentation/running-well-powered-experiments/covariates-for-cuped-plus-plus/).

## Choosing a statistical paradigm

This leaves one final lever: the statistical methodology we choose to use to analyze the results. In general, [there are no miracles](https://www.geteppo.com/blog/comparing-frequentist-vs-bayesian-approaches) here but certainly the choice will affect results.

Both the fixed sample t-test and Bayesian approach are excellent for maximizing power given a specific time frame. Furthermore, the Bayesian approach helps prevent underpowered tests over-inflate effect sizes due to its natural shrinkage. Either are solid choices.

However, particularly the t-test is susceptible to peeking. If this is a problem, then consider the hybrid-sequential approach. This gives sequentially valid confidence intervals during the experiment without sacrificing much power at the end of the test.

We want to stay away from the fully sequential paradigm when we struggle to find enough power in the first place. We cannot afford the cost in width of the confidence intervals for the added flexibility. Furthermore, it is unlikely we would be able to stop the experiment early anyway.

## Beyond variance reduction and statistical methodology

Lowering metric variance (including via winsorization and CUPED++) and picking an analysis paradigm are powerful levers, but they are not the only ones. When power is constrained, also consider:

- **[Runtime, seasonality, and sample size](/guides/advanced-experimentation/running-well-powered-experiments/runtime-seasonality-sample-size/)** — Running longer is often the best response when the observed gap between variants is large relative to noise; longer runs also build baselines you can compare to holidays, campaigns, and external shocks.
- **[Targeting, dilution, and proximal metrics](/guides/advanced-experimentation/running-well-powered-experiments/design-targeting-dilution-proximal-metrics/)** — Who you measure, how you [filter to true exposure](/guides/advanced-experimentation/entry_points), and whether outcomes are close to the change.
- **[Rich covariates for CUPED++](/guides/advanced-experimentation/running-well-powered-experiments/covariates-for-cuped-plus-plus/)** — Passing informative assignment and context features into the model beyond pre-period activity alone.
- **[Ambition, disagreement, and tactical vs. strategic measurement](/guides/advanced-experimentation/running-well-powered-experiments/ambition-tactical-strategic-measurement/)** — Whether the idea is large enough to justify scarce traffic, how to learn from users who did not convert, and when A/B tests should be paired with holdouts or decomposed decisions.

## Conclusion

In certain situations, we really need to make the most out of a limited sample size. In this case, remember that it is all about optimizing the signal-to-noise ratio. First and foremost, we should make sure we choose our metrics carefully. With winsorization, CUPED++, and a choice of statistical methodology, Eppo helps you make the most out of our data—and [design choices outside pure variance reduction](/guides/advanced-experimentation/running-well-powered-experiments/runtime-seasonality-sample-size/) matter just as much when samples are small.
