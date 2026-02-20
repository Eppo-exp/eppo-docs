import Term from '@site/src/components/glossary/Term'

# Confidence intervals

This page goes into more depth about the different methods Eppo provides for
estimating lifts caused by a treatment and calculating confidence intervals
around those lifts. In addition, we provide advice on how to choose between the
different methods and the implications each method has for interpreting
experiment results.

For information on how to find the lift estimates and
confidence intervals in Eppo, and the essentials of using experiment results to
make ship/no-ship decisions, see the main [Interpreting experiments](/experiment-analysis)
page.

## Basics of estimating lift {#estimating-lift}

In order to provide effect estimates consistently across all metric types
(counts, rates, percentages, etc.), we use the <Term def={true}>relative
lift</Term> between treatment and control (that is, $\frac{Treatment -
Control}{Control}$), rather than their absolute difference. This means that the
lift is always expressed as a _percentage of the metric value in the control
group_. That is, a lift of 5% means the average metric value among subjects in
the treatment variant is 5% higher than the average among subjects in the
control variant.

:::note
If the estimate for Control is close to zero, that ratio becomes unreliable.
We do not compute the relative lift when the Control is less than 10 standard deviations around zero.
This corresponds to Kuethe's criterion for an accurate Normal approximation.[^diaz-frances-rubio]
:::

For a lot of metrics, this is pretty straightforward: if the average revenue per
subject in the control variant was \$10, a 5% lift would mean that the average
revenue in the treatment variant was \$10.50, a 50-cent increase. For
_percentage_ and _ratio_ metrics, however, such as conversion rates and
click through rates, there are some pitfalls to interpreting relative lifts. A 5%
lift in retention rate (that is, share of users returning to the product after a
period of time) from a control baseline of 20% would mean the treatment
retention rate is **21%** (a 1-percentage-point increase), _not_ 25%. For ratio
metrics, such as clicks per page impression, if the denominator (in this case,
number of page impressions) goes _down_ by 10%, while the numerator (clicks) goes
_up_ by 10%, the ratio goes _up_ not by 20% (that is, $10\% - (-10\%)$), but by **22%**
(that is, $\frac{100\% + 10\%}{100\% - 10\%} = \frac{110\%}{90\%}$).

The simplest way to calculate the lift is to get the difference in the average
(per subject) metric value between each treatment variant and corresponding
control variant, and then divide that by the control average to produce a
_relative_ value. However, there are a number of methods we can use to improve
on this naive calculation. For example, because we randomly allocate users to
each variant, we can expect that there will be random differences between the users
in each variant (perhaps a lot of really unengaged users were randomly assigned
to the treatment variant, say); using [CUPED](/statistics/cuped) can make it easier to
get a reliable estimate of the lift by mitigating these random fluctuations.
Another example is [<Term>winsorization</Term>](https://en.wikipedia.org/wiki/Winsorizing),
which reduces the impacts of extreme outliers.

:::caution

For any metric where you have elected to use
[<Term>winsorization</Term>](/data-management/metrics/simple-metric)
to handle outliers, the metric totals displayed in the tooltip when hovering
over the lift are the _winsorized_ totals, not raw values.

:::

The end result of these more sophisticated methods is that we show
_estimated lifts_, rather than just the raw percentage change between
variants, and therefore the numbers on our dashboards might not line up with
back-of-the-envelope calculations.

:::info

If you use [Bayesian analysis](/statistics/confidence-intervals/analysis-methods.md#bayesian-analysis), the estimated lift might be
_quite_ different from the naive calculation, because the prior can influence
the estimate a lot, particularly if the sample size is not large. For an
accessible explanation with a worked example, see
[Why Bayesian lift doesn't match (Treatment − Control) / Control](/statistics/bayesian-lift-vs-naive).

:::

## Basics of calculating confidence intervals

The confidence intervals around the estimated lift show the range of lifts that
could be plausibly supported by the data from the experiment; lifts outside that
confidence interval are possible, but unlikely. (The exact meaning of
"plausible" and "unlikely" depend on the particular
[methodology](/statistics/confidence-intervals/analysis-methods), of course.[^ci-defn]) If the entire confidence
interval is above zero, then it is unlikely for the true lift to be zero, or
negative: the experiment data indicates that the treatment had a positive effect
on that metric (and vice versa if the entire confidence interval is _below_
zero).

The distance between the lift estimate and the lower (or upper[^symmetric]) bound of the
confidence interval is called the _precision_; the width of the confidence
interval is twice the precision. In order for the confidence interval to be
entirely above or below zero, the precision needs to be less than the lift
estimate itself. In other words, the confidence interval needs to be _narrow_
enough to exclude zero.

In general, the width of a particular confidence interval is determined by four
factors:

1. **How spread out the metric values are.**

   If different subjects tend to have similar metric values, then the range of
   plausible values will be smaller.[^varreduc]

2. **How many subjects are in the experiment (that is, the _sample size_).**

   Even if a metric tends to have values within a fairly narrow range, if we
   have only observed a few subjects in the experiment, it's possible that we
   (by unlucky chance) happened to observe outliers with unusually extreme (high
   or low) metric values. The more subjects we can observe a given metric for,
   the more likely it is that the sample of subjects that are in the experiment
   will be representative of the population as a whole (and therefore the more
   confident we can be that the true lift is close to the lift from our sample).

3. **The [<Term>confidence level</Term>](/experiment-analysis/configuration/analysis-plans.md#confidence-level) specified for the experiment (which is 95% by default), which dictates _how_ confident we want to be.**

   The <Term>confidence level</Term> represents how often we want the true lift to be inside
   the <Term>confidence interval</Term>, and thus the confidence interval needs to be wide
   enough to ensure that is true: the _higher_ the confidence **level**, the _wider_
   the confidence **interval**.

4. **The [<Term>analysis method</Term>](/statistics/confidence-intervals/analysis-methods.md) being used**

   Although the confidence level indicates how confident we want to be in our
   lift estimate, the analysis method dictates _under what circumstances_ we can
   have that level of confidence. For example, fixed-sample analysis only
   guarantees a given confidence level if you make a decision based on a single
   examination of the experiment results, while sequential analysis guarantees a
   confidence level no matter how many times you look at the results (there are
   of course other requirements for those guarantees to hold). In order
   to achieve the stronger guarantees, however, the sequential method will produce
   wider confidence intervals for the same data than the fixed-sample method.

[^ci-defn]:
    Indeed, the very term "confidence interval" is only used in the
    [frequentist](https://en.wikipedia.org/wiki/Frequentist_inference)
    framework, while
    [Bayesian](https://en.wikipedia.org/wiki/Bayesian_inference) methods
    use "credible interval" to describe a similar (though distinct!) concept.
    For simplicity, we'll use "confidence interval" throughout, and discuss the
    distinction with Bayesian credible intervals [here](statistics/confidence-intervals/analysis-methods.md#bayesian-analysis).

[^symmetric]:
    We use symmetric confidence intervals, so the upper and lower bounds are
    the same distance from the lift estimate.

[^varreduc]:
    In technical terms, this is called the _variance_, and it's one of the
    reasons we put a lot of emphasis on _variance reduction_ through methods
    like CUPED and winsorization: reducing the variance of the metric (by
    controlling for, and therefore removing, random variation) makes the
    confidence intervals narrower, which makes it easier to tell when a
    treatment has an effect.

[^diaz-frances-rubio]:
    See
    [Díaz-Francés and Rubio (2004), "On the Existence of a Normal Approximation to the Distribution of the Ratio of Two Independent Normal Random Variables."](https://www.researchgate.net/profile/F-Rubio/publication/257406150_On_the_existence_of_a_normal_approximation_to_the_distribution_of_the_ratio_of_two_independent_normal_random_variables/links/53d7a18a0cf2e38c632ddabc/On-the-existence-of-a-normal-approximation-to-the-distribution-of-the-ratio-of-two-independent-normal-random-variables.pdf)
    for more details on the validity of the normal approximation.