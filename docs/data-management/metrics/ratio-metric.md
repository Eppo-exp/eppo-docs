---
sidebar_position: 2
---

# Ratio metrics
## Overview
Ratio metrics allow you to calculate the ratio of two [simple metrics](/data-management/metrics/simple-metric). The most common use case for this is when the randomization entity is different from the analysis entity. 
For example, consider the metric _average order value_. Typically, experiments are not randomized at the _order_ level because a user can have multiple orders. 
Consequently, randomizing orders could lead to users experiencing multiple variants. When the experiment is randomized at the user level, it is not statistically valid to consider each
_order_ an independent observation because orders from the same user are related. Treating the orders as statistically independent observations in experiments with user-based
randomization typically leads to overconfident results (underestimating the variance). A proper estimation of the variance must recognize the fact that the observations (orders) are clustered
at the user level. Although there are several valid approaches for estimating this variance, including [clustered standard errors](https://en.wikipedia.org/wiki/Clustered_standard_errors),
Eppo uses the approach described in [Deng et al.](https://alexdeng.github.io/public/files/kdd2018-dm.pdf) and recommended in 
Chapter 18 of _Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing_ by Ron Kohavi.


The approach is to redefine the metric of interest as a ratio of two simple metrics. For example, take _average order value_, which is defined by 
dividing revenue (sum of prices) by the number of orders (sum of items purchased or count of prices).


$$
\text{Average order value} = \frac{\text{Revenue}}{\text{Number of orders}}
$$

We can multiply both the numerator and the denominator by the number of _users_ in the experiment:

$$
\text{Average order value} = \frac{\text{(Revenue)(Number of users)}}{\text{(Number of orders)(Number of users)}}
$$

which we can rearrange as follows:
$$
\text{Average order value} = \bigg(\frac{\text{Revenue}} {\text{Number of users}}\bigg) \bigg(\frac{\text{Number of users}} {\text{Number of orders}}\bigg)
$$

which can be expressed as the ratio of two simple metrics:
$$
\text{Average order value} = \frac{\text{Revenue per user}}{\text{Number of orders per user}}
$$

Both the numerator and the denominator are simple metrics whose analysis entity matches the randomization entity (a user). In general, the steps to define a ratio metric are
as follows:
1. Define the metric you wish to calculate and identify its analysis entity (e.g., an order in _average order value_).
2. Divide both the numerator and the denominator by the _randomization_ entity (often a user).
3. Identify the numerator metric and the denominator metric. The numerator metric will typically be a fact quantity per randomization entity (e.g., revenue per user). The denominator metric will typically be a count of the analysis entity per randomization entity (e.g., number of orders per user).
4. Create the desired ratio metric by following the steps in the next section.

### Common examples
- _Average order value_ as discussed in the example above.
- _Average revenue per DAU_. In this case, the randomization entity is typically a user, while the analysis entity is technically an _active day_. The corresponding numerator and denominator metrics are _revenue per user_ (sum of order values) and _number of active days per user_ (count distinct active days).


:::note
Ratio metrics are computed by first computing averaged values for the numerator and the denominator, and then dividing them to compute the ratio, rather than computing the ratio on a user level and then taking the average.

:::

:::info
We use the [Delta method](/statistics/confidence-intervals/statistical-nitty-gritty) to compute valid statistical results for ratio metrics.

:::

## Creating a ratio metric

Creating a ratio metric follows the same approach as creating a simple metric.
Of course, the difference is that for a ratio metric, you have to select both a fact and aggregation for numerator and denominator.

![Creating a ratio metric](/img/data-management/metrics/create-ratio-metric.png)
