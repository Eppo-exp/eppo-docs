---
sidebar_position: 2
---

# Running Clustered Experiments

## Overview

In a standard A/B test, the analysis unit matches the randomization unit. For example, it is common to split users (the
randomization unit)
randomly between multiple variants and then analyze "per user" metrics such as conversion rate (defined as the
percentage of users who convert)
or average revenue per user.

However, there are cases when it is desirable to define an analysis unit that does not match the randomization unit.
Typically, these cases arise when
randomizing at the same grain as the analysis would lead to undesirable interference effects. Examples include:

- A business wants to measure a treatment effect on the metric _average order value_. This metric has an analysis unit
  of an _order_; however, because users can have multiple orders, randomizing at the order level could lead to some
  users seeing multiple variants, which is an inconsistent user experience. Also, exposure to the treatment could change
  their behavior in a way that would persist even if they were later assigned to the control group. As a result, it's
  better to randomize at the user level, even though the analysis metric is "per order" rather than "per user."
- A business has other companies as customers. The business wants to measure a treatment effect on a "per user" metric.
  However, randomizing at the user level would lead to users from the same company receiving different treatment
  assignments, which may be problematic. For example, if the product is an internal messaging software, then an
  effective treatment could cause users in the treatment group to send more messages to their coworkers in the control
  group, which would also increase the engagement of the control group. As a result, it may be better to randomize at
  the company level rather than the user level.

Both of these examples illustrate use cases for running _clustered_ experiments, meaning that we randomize _groups_ of
analysis units. Although clustered experiments can be useful
for preventing interference issues, there is a statistical challenge because observations from the same cluster are not
statistically independent. Treating observations from the same cluster
as statistically independent typically leads to overconfident results (underestimating the variance).

Fortunately, [Ratio Metrics](/data-management/metrics/ratio-metric)
address this issue based on the approach described
in [Deng et al.](https://alexdeng.github.io/public/files/kdd2018-dm.pdf) and recommended in Chapter 18 of _Trustworthy
Online Controlled Experiments_. The approach is to recognize that a metric defined at a finer grain than the
randomization unit can be expressed as the ratio of two metrics at the same grain as the randomization unit. To
illustrate this,
we will outline two examples.

## Example 1: Average Order Value (AOV)

_Average order value_ is one of the examples mentioned in the [Ratio Metrics](/data-management/metrics/ratio-metric)
documentation. Although we can recognize that it is a Ratio
Metric because it is normalized by a count of orders rather than a count of assigned users (which would make it a Simple
Metric), it is also a good example of a clustered metric.
Typically average order value is calculated in experiments that are randomized at the user level, but AOV is a "per
order" metric. Each user can have multiple orders, so a user is
a _cluster_ of orders. As a result, we need to make sure that our statistical calculations recognize the user-level
randomization rather than treat each order as an independent observation.

Starting from the definition of _average order value_ which is defined by dividing revenue (sum of prices) by the number
of orders (sum of items purchased or count of prices).

$$
\text{Average order value} = \frac{\text{Revenue}}{\text{Number of orders}}
$$

We can multiply both the numerator and the denominator by the number of _users_ in the experiment:

$$
\text{Average order value} = \frac{\text{(Revenue)(Number of users)}}{\text{(Number of orders)(Number of users)}}
$$

which we can rearrange as follows:
$$
\text{Average order value} = \bigg(\frac{\text{Revenue}} {\text{Number of users}}\bigg) \bigg(\frac{\text{Number of
users}} {\text{Number of orders}}\bigg)
$$

which can be expressed as the ratio of two simple metrics:
$$
\text{Average order value} = \frac{\text{Revenue per user}}{\text{Number of orders per user}}
$$

Both the numerator and the denominator are [Simple Metrics](/data-management/metrics/simple-metric) whose analysis
entity matches the randomization entity (a user). Recall that Simple Metrics automatically normalize
by the number of users (the assignment unit). Therefore, to specify AOV as a ratio metric, the numerator is the sum of
revenue, and the denominator is the count of orders.

## Example 2: Calculating a User level Conversion Rate in a Company-Randomized Experiment

Another helpful example is calculating a user-level conversion rate in an experiment that is randomized at the company
level rather than the user level. This example is similar
to the previous one, except now the experiment is randomized at a coarser grain (previously, it was randomized at the
user level; now, it is randomized at the company level). An interesting
feature of this example is that it requires specifying conversion rate as a Ratio Metric even though it typically is
specified as a Simple Metric in user-randomized experiments.

Starting from the definition of conversion rate which is defined by dividing the number of paying users by the number of
all eligible users.

$$
\text{Conversion rate} = \frac{\text{Number of paying users}}{\text{Number of users}}
$$

We can multiply both the numerator and the denominator by the number of _companies_ in the experiment:

$$
\text{Conversion rate} = \frac{\text{(Number of paying users)(Number of companies)}}{\text{(Number of users)(Number of
companies)}}
$$

which we can rearrange as follows:
$$
\text{Conversion rate} = \bigg(\frac{\text{Number of paying users}} {\text{Number of companies}}\bigg) \bigg(
\frac{\text{Number of companies}} {\text{Number of users}}\bigg)
$$

which can be expressed as the ratio of two simple metrics (in this case, simple metrics are normalized by the number of
companies):
$$
\text{Conversion rate} = \frac{\text{Payers per company}}{\text{Users per company}}
$$

Once again, both the numerator and the denominator are now [Simple Metrics](/data-management/metrics/simple-metric)
whose analysis unit matches the randomization unit (a company). To specify this metric in Eppo,
create a [Ratio Metric](/data-management/metrics/ratio-metric) whose numerator is a count of paying users and whose
denominator is a count of all users.

## Conclusion

Running clustered experiments can be helpful in cases when randomizing at a coarser grain than the analysis unit helps
mitigate interference effects. Eppo's [Ratio Metrics](/data-management/metrics/ratio-metric)
allow users to conduct valid inferences for metrics that analyze units that are a finer grain than the experiment's
randomization.
