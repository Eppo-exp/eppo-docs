---
sidebar_position: 1
---

import RedHighlight from '@site/src/components/RedHighlight'

# Analysis methods

Eppo has four different methods for estimating the expected lift from
experiment data and constructing a confidence interval around that estimate.

## Overview

The details of each method, and the pros and cons are explained in detail
[below](#how-we-calculate-the-lift-estimates-and-confidence-intervals), but, in
brief, the methods are:

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
  </thead>
<tbody>
  <tr>
    <td class="row-header">Fixed-sample frequentist</td>
    <td>
      Pick a target sample size, wait until you achieve that sample size, then make a decision
    </td>
    <td>
      Maximizes ability to detect a treatment effect for a given sample size
    </td>
    <td>
      Requires you to plan how long to run the experiment and then stick to the plan (even if the assumptions underlying the plan end up being incorrect)
    </td>
  </tr>
  <tr>
    <td class="row-header">Sequential frequentist <em>(default)</em></td>
    <td>
      Just start running your experiment, and make a decision when you want
    </td>
    {/* TODO: When we ship progress bar v2 we should add a note here about the need to meet minimum requirements */}
    <td>
      Doesn't require a rigid plan and allows you to be flexible while still ensuring a certain false positive rate
    </td>
    <td>
      Less power than fixed-sample, so need more sample to be able to reliably detect a lift
    </td>
  </tr>
  <tr>
    <td class="row-header">Sequential hybrid</td>
    <td>
      This is a combination of the sequential and fixed sample methods: while the experiment is running we use sequential analysis, and once the experiment has finished, it switches to a fixed confidence interval. To maintain statistical guarantees, confidence intervals are slightly wider.
    </td>
    <td>
      Combines the benefits of sequential and fixed sample testing: early stopping and high power at the end of an experiment
    </td>
    <td>
      Requires to plan how long to run the experiment and slightly larger confidence intervals both during and at the end of the experiment
    </td>
  </tr>
  <tr>
    <td class="row-header">Bayesian</td>
    <td>
      Combine data from the experiment with a <em>prior belief</em> about how likely different lifts are, and use the result to make a decision
    </td>
    <td>
      Allows for making nuanced decisions based on the full distribution of expected lifts, which is particularly helpful when sample sizes are small
    </td>
    <td>
      <p>
      Aligning with stakeholders on how to interpret and use the results may require more effort,
      due to the very nuance and flexibility of the method
      (as well as lack of familiarity with Bayesian methods)
      </p><p>
      Also, if prior beliefs are incorrect, and you don't have much data,
      then the lift estimates and confidence intervals will be incorrect
      </p>
    </td>
  </tr>
</tbody>
</table>

We chose to make sequential analysis the default because it allows for maximum
flexibility while still making ship/no-ship decisions relatively
straightforward: you can peek—and make a decision—at any time, without risking
unacceptably high rates of detecting phantom effects.

While fixed-sample analysis might be more likely to detect an effect that _is_
there _if everything goes as planned_, in practice experiments often don't go as
planned, and that [can invalidate](#failures) the statistical guarantees of
fixed-sample analyses.[^failures] In this way, sequential is the safest choice:
it provides useful protections while maximizing the ability to adapt the
experimentation process to a dynamic reality.

Sequential is not, however, always the _best_ choice. Indeed, when sample size
is hard to come by, it may not be a realistic option at all, which is why we've
provided the others. We describe each method in more depth below, with a focus
on the broad concepts, caveats to be aware of, and tips for how to best use
and interpret the results; we provide all the Greek-letter-laden equations
underlying each method on the [statistical nitty-gritty](statistical-nitty-gritty.md) page.

If you want to learn more about what you might want to consider when choosing an
analysis method, you can find some
[discussion of that on the Analysis Plans](/experiment-analysis/configuration/analysis-plans.md#considerations-for-setting-an-analysis-plan)
page.

[^failures]:
    Problems arise with fixed-sample tests whenever _how long_ an
    experiment is run is influenced by the early results. We describe some
    common but problematic practices [here](#failures).

## Fixed-sample analysis

A fixed-sample analysis is the most basic way to analyze the results from an
experiment. First, you decide when you will look at the experiment results and
make a decision: either after a fixed period of time, or once you have enough
subjects in the experiment. Then, you start your experiment, wait until that
predetermined decision point, and make a decision based on which, if any,
metrics show significant movement compared to control.

The hard part with fixed-sample analysis is the first step:
**deciding when to look at the experiment results** (and choose to ship or
shut down). If you look at results too early, you might not have
enough statistical power to detect a treatment effect even if it exists.
If you look at results too late, then you've wasted time.

:::danger

<span id="failures"></span>

Choosing when to make a decision is particularly fraught because, once you look
at the results, **you can only decide to ship, or to shut down**—you can't
decide to keep running and collect more data.

There are two primary ways this requirement gets violated, in practice:

1. You plan to run an experiment for a few weeks, but after a few days you
   notice that your metric has dropped by 10%. Faced with the prospect of weeks
   of lost engagement and revenue if you keep running, you decide to shut down
   the experiment.
2. You estimate how much sample size you need to be able to detect a lift, wait
   until you have collected that much data, then look at the results: the
   estimated lift is positive (or negative), but the confidence interval is too
   wide to exclude zero. So, you decide to continue running for a couple more
   weeks to "achieve significance"; if it then has an unambiguously positive
   lift, you ship it.

The problem in both cases stems from the fact that early on in an experiment,
when you have less data, the lift estimate will fluctuate a lot purely by
chance; if you collect more data, the fluctuations will tend to settle down, and
the lift estimate will move closer to the true lift. The problem comes when
you change _how much data you collect_ based on the highly variable early
results:

- If you _stop_ an experiment if it has a randomly _negative_ early lift,
  but _continue_ it for an equally random _positive_ lift, you don't give
  experiments that have _bad_ luck early on a chance to recover; you will tend to
  shut down experiments that might, ultimately, have had positive lifts (thus
  missing out on potential improvements) and therefore bias your results
  _downward_ (you will tend to think experiments have worse results than they
  actually do, and you'll miss). This is what would happen in scenario 1 above.

- If you _stop_ an experiment if it has a randomly _large_ early lift, but
  _continue_ it if the lift is mediocre, you don't give experiments with outlier
  lifts (positive or negative) the chance to come back to earth. You will tend
  to conclude that experiments had a (positive or negative) effect that was
  actually just random noise. Since you only ship the positive experiments,
  while shutting down both negative and neutral ones, in practice the result is
  that you will _overestimate_ how much positive impact you got from
  experiments. This is what would happen in scenario 2 above.[^scenario2]

In order to avoid pitfalls like the two above scenarios, it's important, when
using fixed-sample analysis, to set a decision-making process (for example, when
you will make a decision, and what criteria you will use to make the decision)
_before_ starting the experiment, and then **stick to it**.

:::

[^scenario2]:
    Although scenario 2 was described as reaching the decision point
    and then continuing, it is identical to one where you peek early and then
    ship if you detect an effect or else let the experiment run to the end.

There are primarily two ways to pick a decision point before running the experiment:

1. **Pick a set period of time to run an experiment.**

Sometimes organizational or business constraints determine how long an
experiment can be run. This is fine as long as the duration is long enough to
actually be able to detect a difference, if there is one, but there's no way
to know how long is "long enough" without...

2. **Do a power analysis to determine target sample size.**

A _power analysis_ looks at the historical data for a given metric, and tries
to predict how many subjects will be needed in order to be able to detect a
lift of a given size. First, you determine the minimum lift you care about (the
[minimum detectable effect](/statistics/sample-size-calculator/mde),
or MDE) for _each metric_ you're going to observe in the experiment. Then, you
can use a tool like Eppo's
[Sample Size Calculator](/statistics/sample-size-calculator)
to get the estimated sample size needed to detect that MDE.

One danger with a power analysis is that historical behavior is not always a
perfect predictor of future behavior, which can leave you unable to detect a
true effect even after achieving the predetermined sample size. In addition,
some metrics and populations might not have historical data at all—as with new
users, or recently created metrics.

A more pernicious danger is that your power analysis is based on some
fundamental assumptions about the experiment—such as which metrics you care
about, which metrics are likely to move, and how you'll balance tradeoffs
between different metrics—and if those assumptions are wrong it can force you
into suboptimal decisions in order to ensure statistical validity. For
example, sometimes an experiment uncovers unexpected patterns of behavior or
even potential bugs, and you might want to be able to gather more data in
order to confirm and explore such anomalies, without putting the whole
experiment at risk; a fixed-sample analysis precludes that option.

### Pros of fixed-sample analysis

- **Minimizes false-negative rate for a given sample size.** If you have small
  sample sizes and struggle to get enough data to detect treatment effects, a
  fixed-sample experiment will give you the best shot at detecting an effect.

### Cons of fixed-sample analysis

- **You have to select your sample size or duration ahead of time.** Eppo's
  [Sample Size Calculator](/statistics/sample-size-calculator) makes this
  significantly easier, but if the assumptions you put into it end up not
  holding (for example, if the variance in your metrics is higher than it
  historically has been), then you can still end up underpowered at the
  predetermined sample size.

- **You cannot make decisions before the sample size is achieved.** (AKA: No
  peeking! 🙈) Shipping/shutting down experiments with big gains/drops _early_
  will violate the statistical guarantees of fixed-sample analysis[^rerun]

- **If you end up not seeing a treatment effect, you cannot decide to continue running the experiment to collect more data.**
  The flip side of the peeking problem, continuing to run an experiment because
  of a _lack_ of significant metric movement will also violate the guarantees on
  false positive rate. This also means that, if, after looking at the results, you
  decide you want to understand how the experiment affected different segments or
  subpopulations, you can't just keep running to be able to slice and dice
  accordingly. Instead, you need to start a _new_ experiment, and run it longer
  before making a decision.[^keeprunning]

- **You cannot adapt when you decide to ship or shut down based on experiment results.**
  If, for example, you see hints of a surprising trend, you cannot decide to
  continue running to be able to confirm or disprove that trend. Or, if the
  business needs change—for example, a metric that you didn't care that much
  about when you planned the experiment has since become much more important—you
  can't adapt to those changes.

[^rerun]:
    Even if you do restart the experiment, you may be unable to measure
    the intended treatment effect, as some portion of the new control group will
    have been in the old treatment group, and so don't represent a true control.

[^keeprunning]:
    Specifically, that confidence interval correctly limits the
    false positive rate in a way that reflects the confidence level you've set.

## Sequential analysis _(the default)_ {#sequential-analysis}

Sequential analysis allows you to run your experiment without predetermining the
duration or sample size, and allows you to make a ship or shutdown decision at
any time—while still guaranteeing the specified false positive rate. To do this,
we give up some power compared to the fixed-sample method. In exchange, you get
much more flexibility in _when_ and _how_ you make decisions; you can monitor
experiment results continuously without causing problems; and you can avoid the
time and error-prone choices (such as what MDE is acceptable for each metric)
required to plan an analysis ahead of time.

### Pros of sequential analysis

- **You don't have to predetermine your sample size.**
  Unlike with fixed-sample analysis, sequential analysis does not
  _require_ you to do a power analysis beforehand.[^powerrequire] More
  importantly, it also does not require you to restart the experiment if any of
  the parameters of that power analysis (such as the expected metric values and
  variances) end up being incorrect. Note that it can still be insightful to use Eppo's
  [Sample Size Calculator](/statistics/sample-size-calculator) to understand,
  operationally, when you can expect to be able to detect an effect if it
  exists.

- **You can make any decision at any time, safely.**
  Go ahead, peek away 👀! If you want, you can check the results every day and
  **ship as soon as you detect a nonzero treatment effect**: you don't have to
  worry about it being a false positive just because you haven't reached a
  predetermined sample size.[^earlystop] Also, you can decide to keep running
  the experiment to collect more sample, and, unlike with fixed-sample analysis,
  doing so will not invalidate the statistical guarantees.

### Cons of sequential analysis

- **You will have less power, which means experiments might take longer.**
  For a given sample size, sequential analysis is less likely to detect a true
  effect than is fixed-sample analysis. In other words, to have the same
  statistical power as fixed-sample analysis, you'll need to run your experiment
  longer if you use sequential analysis. However, if you see strong effects,a
  sequential analysis you can **ship early**, which you usually _cannot_ do with
  fixed-sample analysis. The ultimate result is that, _in general_, sequential
  can allow you to make decisions faster when the lifts are large (positive or negative):

  | Lift is...                                       | Decision  | Faster method |
  | ------------------------------------------------ | --------- | ------------- |
  | Substantially bigger than MDE                    | Ship      | Sequential    |
  | Moderately larger or equal to MDE                | Ship      | Fixed-sample  |
  | Small or nonexistent                             | Shut down | Fixed-sample  |
  | Moderately <RedHighlight>negative</RedHighlight> | Shut down | Fixed-sample  |
  | Very <RedHighlight>negative</RedHighlight>       | Shut down | Sequential    |

  Another caveat is that, if you end up having to _restart_ a fixed-sample
  experiment because the initial power analysis was wrong, or because you just
  got unlucky, it's possible that you could still make a decision faster with
  sequential analysis.

[^powerrequire]:
    Technically, fixed-sample methods do not _require_ a power
    analysis, but without one there is no way to know when is an appropriate to
    look at the results.

## Sequential hybrid analysis {#hybrid-analysis}

The sequential analysis method is attractive because it allows us to continuously monitor experiment results.
However, the downside is that the confidence intervals necessarily have to be more conservative.
On average, it may or may not be faster than the fixed sample analysis depending on assumptions, but in the worst case it definitely requires much more samples. This can make for a difficult decision between the two options.

The sequential hybrid option aims to take the best of both worlds: continuous monitoring as well as tight confidence intervals at the end of the experiment. We achieve this by combining (slightly more conservative versions of) the sequential approach while the experiment is running, and then switching to the fixed sample analysis once the end date has been reached.

Of course, there is no free lunch; there is a price to pay: first, the confidence intervals during each of the two phases are slightly wider (about 10-15%), and second it requires setting an end date of the experiment ahead of time. However, we believe this makes for an attractive trade-off.

:::tip Sequential hybrid as two one-sided tests
Another way to use sequential hybrid to take the best of both worlds is to stop early for degradations only but wait until the pre-planned end date to declare winning variants. The inflexibility of the fixed-sample methodology is often most apparent when the test is doing poorly; if a variant is significantly degrading metrics, you will likely want to pull the plug instead of fulfilling your promise not to peek. 
Significant degradations due to poor user experiences also often have large effect sizes that offset the loss of power from the sequential methodology. In these cases, the point estimates for the lift are also of less interest compared to experiments with "winning" variants.

Conversely, for detecting improvements, it is often helpful to have additional power and to have more reliable estimates of the treatment effect, which are both advantages of the fixed-sample approach. As a result, a sensible approach is to use sequential hybrid's sequential test for early detection of poorly performing variants 
and its fixed-sample approach for detecting improvements. 

This approach is effectively two one-sided tests: a sequential test with a significance level $\frac{\alpha}{4}$ is performed continuously on the degradation tail and a fixed-sample test with a significance level $\frac{\alpha}{4}$ is performed on the experiment's end date on the improvement tail. To understand where the $\frac{\alpha}{4}$ comes from, first recognize that
the core idea of the sequential hybrid methodology is that we allocate half of the "alpha budget" to the sequential test and half to the fixed sample test. This means that the two-tailed sequential test has a significance level $\frac{\alpha}{2}$ and half of _that_ alpha is allocated to each tail, leaving $\frac{\alpha}{4}$ for each tail. If we stop the test early only for degradations, 
we only reject the null hypothesis on the degradation tail, which means that this test is effectively a one-sided test with significance level $\frac{\alpha}{4}$. Similarly, when we run the fixed-sample test at the end of the experiment, the two-sided test has significance level $\frac{\alpha}{2}$ and the one-sided test (improvements only) has significance level $\frac{\alpha}{4}$. Note that if you use this approach, you may want to consider
setting the confidence level to 90% ($\alpha = 0.1$) to follow the convention of allocating $\alpha$ = 0.025 to each tail, which normally would be achieved by setting the confidence level to 95%.
:::

## Bayesian analysis {#bayesian-analysis}

Both fixed-sample and sequential methods described above use a
[frequentist](https://en.wikipedia.org/wiki/Frequentist_inference) approach,
where we test how likely it would be to see the observed data under the
assumption that the treatment and the control were identical; that is, they take
it as _given_ that the lift will be zero on average—but with random
fluctuations—and ask how often those fluctuations would produce the kind of
results observed during the experiment.[^nhst] In contrast, the
[Bayesian](https://en.wikipedia.org/wiki/Bayesian_inference) approach takes
_the data as given_, as well as what we believed _before we collected data_, and
asks what _distribution of lifts_ are most compatible with the combination of
the two.

More formally, the Bayesian method starts with a _prior distribution_ for the
lift, which describes our beliefs about what the lift might be
_before we run the experiment_. Then, we use the data gathered in the experiment
to _update_ that prior and produce a _posterior distribution_ (so called because
it comes _after_ the data), which describes our _new_ beliefs about what the
lift might be, given both the prior we started with and the data we've observed.

:::caution

One important difference between Bayesian and the frequentist methods described
above is that the center of the confidence interval is _not_ the lift measured
from the data, even when [CUPED](/statistics/cuped) is disabled.[^cupedlift] Instead, the
lift measured from the data is used to update our prior, and the resulting
_posterior distribution_ determines both the center _and_ bounds of the confidence
interval.

:::

The prior we use is described specifically on the
[Statistical nitty-gritty](statistical-nitty-gritty.md) page, but in essence
we set our pre-experiment belief to be that the lift on any given metric will
be, on average, zero, and that there will be random fluctuations around that
average such that for 50% of experiments the lift will fall between -21% and
+21%, and for 95% of experiments the lift will fall between -62% and +62%; if
your experiments tend to show bigger lifts in either direction, then our
Bayesian confidence intervals[^credible] might be too narrow (biasing toward
showing an effect when there is none).

:::tip Many ways to be Bayesian

Being "Bayesian" simply means that you start with a prior belief, update it with
data, and make decisions using the resulting posterior—it doesn't dictate _how_
to set your prior. You might use a prior on the distribution of a metric at the
per-subject level, or you might set your prior on the distribution of the _mean_
of the metric, across subjects. If you have a deep understanding of each metric
and of the patterns in your data, you can establish a complex prior that
captures all the dynamics of your product and user base; using a correct prior
can allow you to make correct decisions with less data than with frequentist
methods.

However, developing such a deep understanding of a complicated system requires a
lot of research and specific knowledge, and using a complex prior also requires
using computational methods that do not scale well.[^mcmc] In general, there is
a tradeoff between doing a very specific analysis that requires less _data_ but
more _time and expertise_; vs. doing an analysis that requires more _data_ but less
_time and expertise_—and that is more generalizable to different metrics and different
contexts.

We may not have a deep understanding of your particular product, but we do have
a deep understanding of experiments and the lifts that are typical across many
kinds of experiment. So, we establish our priors on the _lift itself_, rather
than on the aggregation of each metric or the behavior of individual subjects,
which allows us to take advantage of our prior knowledge and provide experiment
results in a way that Bayesians can use to make nuanced decisions.

**Wait, what is the N you're using to update your prior?**

The N is 1!

:::

In general, compared to frequentist methods, Bayesian methods can be more
straightforward to communicate about, but also provide fewer guarantees. In many
ways, they hide fewer things from you than frequentist methods do, but as a
result they force you to confront assumptions and choices that frequentist
methods can sweep under the rug. They require more care and attention but are
less rigid. This means that they also allow you to adapt the level of rigor with
which you make decisions to the business and data context; you can set a very
high bar for mission-critical decisions where data is readily available, or you
can relax requirements if you need to move quickly despite low sample sizes.
This is of course both a strength and weakness: it allows for greater
flexibility in the decision-making process but requires more decisions _about_
that process.

Some summary statistics that can help make decisions surrounding Bayesian
experiments are described in the documentation on
[statistical details](/experiment-analysis#statistical-details).

You can, of course, decide to use Bayesian results like you would frequentist
results: if the confidence interval is above zero, there was a positive lift,
and the experiment gets shipped. In some ways, that negates key benefits of a
Bayesian approach, and since that approach depends so much on a choice of prior
it's often prudent to think more about
[_what happens if I'm wrong_](/experiment-analysis/configuration/analysis-plans.md#whats-the-best-way-to-be-wrong)
than with frequentist methods (luckily, Bayesian methods make it much easier to
think about exactly that question). However, even if you apply a simple decision
rule to Bayesian experiment results, there are a number of ways where Bayesian
analysis can better allow you to make experiment decisions quickly and
rigorously.

[^nhst]: That is,\*\*\*\* they use [Null Hypothesis Significance Testing](https://en.wikipedia.org/wiki/Null_hypothesis).
[^credible]: Technically, [_credible intervals_](https://en.wikipedia.org/wiki/Credible_interval).
[^mcmc]: In particular, [Markov chain Monte Carlo](https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo) methods.

### Pros of Bayesian analysis

- **You don't have to be quite so careful with statistical terminology.**
  A frequentist confidence interval is much easier to _use_ than it is to
  explain, in a precise way. But Bayesian _credible intervals_ allow you to
  describe experiment results in a way that is often more natural, especially
  for non-technical stakeholders. So, you can freely say things like "There is
  an 85% chance the treatment is better than the control," which is a no-no for
  frequentist confidence intervals.[^freqcis]

- **You can make a decision based on a nuanced understanding of the probabilities.**
  Frequentist methods for experimentation inevitably boil down to: Are we
  confident that the lift is above (or below) zero? With Bayesian results, you
  have the whole posterior _distribution_, not just a binary "yes" or "no". For
  example: even if the lift is very likely to be positive, how likely is it to
  be big enough to actually matter? When an experiment can move metrics in
  different ways, and different movements in different metrics can have very
  different costs to the business, this level of nuance allows you to make the
  best decision for each particular situation.

- **You can make decisions even with little data.**
  In the context of small samples, it can often be very difficult to be
  confident that the treatment is actually moving a metric. In essence,
  frequentist methods start "from scratch": even if you know a lot about your
  system outside of the data you've collected, there's no way to use that
  information—the data stands on its own. Bayesian methods allow you to discount
  very unlikely theories (like having a lift be 1,000%), and therefore the data
  doesn't need to do as much work all on its own to narrow down the possible
  explanations for what the treatment is doing.

- **You can make a decision at any time.**
  Bayesian analysis is
  [not immune to peeking](http://varianceexplained.org/r/bayesian-ab-testing/),
  but it does avoid the issue simply by making no promises about the false
  positive rate. The idea of there being a "true effect" or "no effect" doesn't
  really make sense in a Bayesian paradigm: the lift is not simply zero vs.
  non-zero, but rather has a continuous _distribution_ of values. Since there is
  no "positive result" or "negative result", there can't be a _false_ positive
  or _false_ negative, which means there are no statistical guarantees to
  violate by making a decision too early.

### Cons of Bayesian analysis

- **You have to trust the prior.**
  With enough data, having an incorrect prior won't significantly bias your
  results. But since one of the benefits of Bayesian approaches is that they are
  easier to make decisions with when sample sizes are small, and the prior plays
  a larger role in just these cases, the choice of prior can sometimes determine
  whether a variant gets shipped or not. Even if you establish that the prior
  reflects the historical patterns in your pre-experiment data, you still have
  to assume that the experiment you're running is similar to those you've run in
  the past, and (particularly when your product is growing rapidly) this might not
  be true.

- **Stakeholders might not be used to the Bayesian way of thinking.**
  Although some Bayesian concepts are more intuitive than their frequentist
  counterparts, frequentism is still the more common paradigm people learn for
  doing statistical inference, so switching from "This metric had a
  statistically significant increase" to "The treatment is 89% likely to have
  increased this metric" might require educating stakeholders on how to use
  Bayesian results.

- **You have to decide _how_ to make decisions.**

  The output of Bayesian inference is a statistical distribution, rather than a
  "yes"/"no" answer to the question "Is the treatment better than control?" This
  means that decision-makers need to align on how to translate that distribution
  into a decision on whether to ship a particular treatment. For example, do you
  care more about risk, or probability the treatment beats control? What
  probability that the lift exceeds the
  [MDE](/statistics/sample-size-calculator/mde)
  is considered "good enough to ship"? (The documentation on Bayesian
  [summary statistics](/experiment-analysis#statistical-details)
  might provide some useful decision-making procedures.)

[^freqcis]:
    Technically, and pedantically, a frequentist confidence interval
    allows you to say "If we ran this experiment many times, 95% of the
    confidence intervals would contain the true lift value," but _not_ "The true
    lift is 95% likely to be in this interval" or even "If we ran this
    experiment many times, our _estimate_ of the lift would fall within this
    interval 95% of the time."

[^cupedlift]:
    When using CUPED, the frequentist methods display the _predicted
    lift_ after controlling for pre-experiment differences between variants.
