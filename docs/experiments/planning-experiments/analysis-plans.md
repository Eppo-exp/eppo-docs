# Analysis plans

A central goal of running an experiment is to use data to make decisions that
are rigorous and repeatable; an **analysis plan** is a set of choices and
parameters that will govern how Eppo translates the experiment data into
dashboards and visualizations–and thus into ship/no-ship decisions.

In general, an experimentaiton program is most effective if decisions are made
in a consistent way across an entire company, and so most of the analysis plan
settings can be set on the
[administration](../../administration/setting-statistical-analysis-plan-defaults.md)
page. However, occasionally you may want to have different settings for certain
individual experiments; for example, a website that connects homeowners to
contractors is likely to have many more users who are homeowners than
contractors, and therefore might use a different statistical approach for an
experiment on the contractor on-boarding flow than on the homeowners' search
page.

## Settings

The experiment-level analysis plan settings are on the
[experiment setup page](../building-experiments/experiments/creating-experiments.md#analysis-plan-settings).

![Experiment Analysis Plan Settings](/img/building-experiments/experiment-setup-statistical-analysis-plans.gif)

### 1. Confidence interval method {#confidence-interval-method}

Which [analysis method](../interpreting-experiments/lift-estimates-and-confidence-intervals/analysis-methods.md)
to use to estimate the lift and construct the confidence interval.

### 2. Confidence level {#confidence-level}

The confidence level represents how often we want the true lift to be inside the
confidence interval. The higher the confidence **level**, the wider the
confidence **interval** needs to be to ensure that it contains the true lift
with that level of probability.

A 95% confidence level (the default) means that, for 95% of experiments, the
true lift will lie within the respective confidence intervals.[^pval] Lower
confidence levels will mean _narrower_ confidence intervals, which in turn means
that it is _easier_ to detect a lift as being different from zero (but also more
likely that you would incorrectly flag random noise as being a true treatment
effect).

[^pval]:
    For anyone used to thinking in
    [p-values](https://en.wikipedia.org/wiki/P-value), this corresponds to a
    p-value of 0.05 (that is, $1 - 95\%$)

### 3. Multiple testing correction {#multiple-testing}

Normally, the confidence intervals for metric indivitually control their error rates; a 95% confidence interval fails to cover to true underlying parameter 5% of the time.
Thus for an experiment with 20 confidence intervals (one variant with 20 metrics, or 2 variants with 10 metrics each), we can expect one of these to fail its coverage.

We can avoid this by making our confidence intervals more conservative (wider) in order to control the [Family-wise error rate](https://en.wikipedia.org/wiki/Family-wise_error_rate) (FWER), that is, the probability that any single confidence interval does not cover its underlying true parameter. Naturally, the more confidence intervals we look at, the more stringest this approach is.

We allow for control of FWER using the **preferential Bonferroni** method. This is similar to the well-known [Bonferroni correction](https://en.wikipedia.org/wiki/Bonferroni_correction) except that it gives additional weight to the primary metric:

![Multiple testing settings](/img/planning-experiments/multiple-testing-settings.png)

To be precise, if $\gamma$ indicates the weighted alpha spending, and assume we have $k$ treatment variants and $m$ metrics, then the preferential Bonferroni method gives us $\gamma \frac{\alpha}{k}$-confidence intervals for the primary metrics ands $(1-\gamma)\frac{\alpha}{k (m-1)}$-confidence intervals for all other metrics.
The benefit of this approach over the classical Bonferroni correction is that the power to detect changes in the primary metric does not depend on how many other metrics are added to the experiment.

Note, this setting is unavailable for the Bayesian methodology.

### 4. Minimum Requirements {#minimum-requirements}

If enabled by your admin, these are the minimum run requirements before an experiment status can be "Ready for Review". Experiments must meet both the minimum duration (days run) as well as sample size per variant. This is to help prevent premature experiment decisions.

If your admin has not enabled this setting, then minimum requirements will not be visible on experiments.
![Minimum requirements](/img/planning-experiments/min-requirements-exp-settings.png)

### 5. Precision {#precision}

[Precision](../interpreting-experiments/experiment-progress-bar.md#precision) captures the uncertainty in the point estimate as defined by the width of the confidence interval.
Precision is set at the metric level.
However, it is possible to override this and set it to a particular value at the experiment level using the analysis plan
This is used to power the [progress bar](../interpreting-experiments/experiment-progress-bar.md),
helping you decide when the experiment has run sufficiently long for you to make a decision confidently.

## Considerations for setting an analysis plan

You are running an experiment in order to make a decision: should I ship the
treatment? Different analysis methodologies might change:

1. _Which_ decision you make (and thus _whether you make the right decision_)
2. _When_ you make a decision (which affects development velocity)
3. _How_ you make a decision (that is, the decision-making process)

Different methodologies put different constraints on how your team operates
day-to-day, and therefore it's important to select one that is compatible with
the broader organizational context (such as how velocity is traded off for
quality, or any business-determined deadlines or cadences). Perhaps more
importantly, though, how experiments are analyzed can dramatically affect
how much value you get from running experiments, or even whether you get any
value at all.

Here we zoom out to show how the parameters that make up an analysis plan
translate to business priorities and constraints, which we hope will help in
choosing those parameters.

### What's the best way to be wrong?

When picking an analysis methodology, it's important to think about different
ways your decision can be _wrong_:

1. **False positive** (also called _Type I error_): The treatment has _no_
   effect, but you think it does[^posneg]
2. **False negative** (also called _Type II error_): The treatment has an effect, but you think it does _not_

Because you don't _know_, even after running the experiment, whether the treatment
had an effect, you don't know whether observing a nonzero lift is a
_true positive_ or a _false positive_; simarly, _not_ observing a lift
could be a _true negative_ or a _false negative_.

Of course, for any given experiment, you either detect a difference or you
don't, and what you _want_ to know is: is this difference (or lack thereof) a
_true_ or _false_ positive (or negative)? That is, unfortunately, not possible
to know: you can only see the data you've observed, never the underlying process
that created the data.

What you _can_ do is (given some assumptions) _control_ the rate of false
positives _assuming there is no effect_, or the rate of false negatives
_assuming a real effect exists_.

:::tip Stats jargon

In general, _statistical
[**significance**](https://en.wikipedia.org/wiki/Statistical_significance)_
is about limiting the _false **positive** rate_: If your treatment doesn't do
anything at all, you want to make sure the random differences between groups are
unlikely to be flagged as a significant metric movement.[^statsig]

Having more _statistical [**power**](https://en.wikipedia.org/wiki/Power_of_a_test)_,
on the other hand, means that you'll have a lower _false **negative** rate_:
If there's a real treatment effect, the more power you have the
more likely you are to be able to detect a significant metric movement.

Note, though, that these terms don't have the same meaning if using a
[Bayesian analysis](../interpreting-experiments/lift-estimates-and-confidence-intervals/analysis-methods.md#bayesian-analysis)
analysis method, although the concepts can still be useful.

:::

### Frequentist methods: taking control

The [fixed-sample](../interpreting-experiments/lift-estimates-and-confidence-intervals/analysis-methods.md#fixed-sample-analysis)
and [sequential](../interpreting-experiments/lift-estimates-and-confidence-intervals/analysis-methods.md#sequential-analysis)
analysis methods use the framework of
[null hypothesis significance testing](https://en.wikipedia.org/wiki/Statistical_significance)
to control the _false positive rate_: that is, the rate at which a non-effectual treatment
would be incorrectly flagged as causing a metric to move. This limits the risk
that you will ship treatments based on _random noise_. Since most treatments
don't have much of an effect, this is a useful protection.

These methods do not, however, inherently control the _false **negative** rate_:
the rate at which a treatment with a real effect will go undetected; that
requires ensuring that you have enough data (and therefore enough
[power](https://en.wikipedia.org/wiki/Power_of_a_test)) to detect any treatment
effect that actually exists.
(Using Eppo's [Sample Size Calculator](./using_the_sample_size_calculator.md)
is a great way to do that.)

The biggest difference between these methods is in how flexible they are, given
the guarantees: fixed-sample analysis can detect a lift more quickly, but you
only have one shot to look at the results and make a decision, while sequential
analysis is more forgiving and allows you to continuously check the results and
make a decision at any point.

### Bayesian methods: telling you what you actually want to know

[Bayesian](../interpreting-experiments/lift-estimates-and-confidence-intervals/analysis-methods.md#bayesian-analysis)
methods, in contrast, make no guarantees about either false
positive or false negative rates. Instead, the goal is to provide a description
of _your beliefs_ about what the true lift is (meaning, how likely is any
particular lift, not just whether the lift is zero or nonzero).

Before you run the experiment, you have some _prior beliefs_ about the treatment
(that is, your best guess of what the lift will be, as well as your
_level of certainty about that guess_). Once you run the experiment, you use the data you
observe to _update_ your prior beliefs, resulting in a _posterior distribution_
that describes how likely you believe different lifts to be.

Although it can be disconcerting not to have the "guarantees" provided by
frequentist methods, a Bayesian would argue that those guarantees don't actually
guarantee anything useful: they can tell you how likely a true lift will be
missed or a nonexistent lift will be falsely detected, but not
_how likely a lift (or lack thereof) is to be true_.
Bayesian methods _can_ tell you this–as long as you trust your prior
and your assumptions about the structure of the data.

And, importantly, while frequentist methods provide a binary structure for
making decisions—an effect exists or does not—Bayesian methods allow for a more
nuanced way of making decisions, which in particular is useful when sample sizes
are too small to be able to detect even reasonable lifts with a frequentist
method. Bayesian methods also allow you to make descisions at any time, and make
it easier to tailor the level of rigor to the potential costs of being wrong:
you can move fast when being wrong is cheap, and be more thorough when it is
expensive.

### Being the right amount of wrong

Setting the _confidence level_ determines how easy it is to flag a difference in
a metric as "significant"; thus—regardless of the analysis method—a **lower**
confidence level means you will be **more likely** to treat _random noise_ as if
it were a real treatment effect. It will also mean, however, that a _real
treatment effect_ will be detected **more quickly**.

Collecting **more data** will—regardless of the analysis method—mean that you
will be **less likely** to miss a real treatment effect. It also means, though,
that you will have to wait **longer** to recognize when there is _no_ treatment
effect—you'll make decisions **more slowly**.

The goal for picking an analysis plan is to balance:

- How often you will be wrong in each direction (false positive or false
  negative)
- The _costs_ of being wrong in each direction (would you rather miss a true
  effect, or ship a dud?)
- How long it will take to make a decision
- How easy it will be to make a decision (including how easy it is to
  _communicate about_ and _align on_ a decision)

[^posneg]:
    "Postive" here means _effect detected_, and "negative" means _no effect
    detected_; think of a diagnostic test for a disease, where "positive" means
    that the desease is present, and "negative" means it is not. In particular,
    a "positive" result in this sense would be _observing a difference, in
    **either** direction, between treatment and control_. That is, having a
    confidence interval that is entirely above _or_ below zero would be
    considered a "positive" result in the sense of _false (or true) positive (or
    negative_.

[^statsig]:
    Specifically, if your confidence level is set to 95%, then a statistically
    significant result should happen no more than 5% (i.e. 1 - 95%) of the time
    in an A/A test that compares different groups receiving identical
    experiences.
