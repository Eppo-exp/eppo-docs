# Lift Estimates and Confidence Intervals
By navigating to the detail view of any experiment, you can view the effect that any of the treatments have had on each of the selected metrics for that experiment. You can get to the detail view of any experiment by clicking the **Experiments** tab on the left panel and then clicking on the name of the experiment you're interested in from the list. In order to provide effect estimates consistently across all metric types (counts, rates, percentages, etc.), we use the **relative lift** between treatment and control (that is, $\frac{Treatment - Control}{Control}$), rather than their absolute difference.

The effect on each metric comes with an accompanying **confidence interval**, showing the range of values we consider plausible at the specified **significance level**, which defaults to 5%. The significance level represents how likely a treatment that was identical to the control (that is, an A/A test) would show an effect at least as large as what you've observed in your experiment.[^1] A *higher* significance level means that you are willing to accept more risk of seeing an effect that isn't actually there[^2], but also that you can make a decision with less data; it will also mean that the confidence intervals will be narrower.

If zero falls within the confidence interval, then we cannot rule out (at the given significance level) the possibility that the treatment is no different from control. In that case, the confidence interval will be colored gray. On the other hand, if the entire confidence interval is above or below zero, then the effect is *statistically significant*. In that case, the confidence interval and the lift estimate box will be colored <span class="positive-change-green-bg">green</span> if the change is good, and <span class="negative-change-red-bg">red</span> if the change is bad. If the change is good, there will also be a 🎉 symbol in the lift estimate box.

:::info
In general, a positive lift will be *good* (colored green) and a negative lift will be *bad* (colored red). However, for metrics such as page load time or app crashes, a higher number is *bad*. If you've set the "Desired Change" field in the fact definition to "Metric Decreasing", then positive lifts will be in <span class="negative-change-red-bg">red</span> and negative lifts will be in <span class="positive-change-green-bg">green</span>.
:::

![Confidence intervals](../../static/img/measuring-experiments/confidence.png)

[^1]: This is the [frequentist](https://en.wikipedia.org/wiki/Frequentist_inference) interpretation of the significance level. See [below](TK) for a discussion of what the significance level means if you are using our [Bayesian](https://en.wikipedia.org/wiki/Bayesian_inference) method.
[^2]: That is, a higher *false positive* or *Type I error* rate.

## How we calculate the lift estimates and confidence intervals

Eppo provides three methods for estimating the lift and calculating confidence intervals:

1. Fixed-sample frequentist
2. Sequential frequentist (*the default*)
3. Bayesian

Each method has advantages and tradeoffs, which we'll discuss below, but we chose to make sequential analysis the default because it allows you the most flexibility about how long to run experiments and when to make decisions, while relying on fewer assumptions that might not hold in common experimentation scenarios. Fixed-sample analysis may in some cases provide a better ability to detect effects, but it does so at the cost of significant restrictions on how you can run your experiments and is particularly brittle to any of the pre-experiment assumptions being incorrect. Bayesian analysis may allow for a more intuitive way to make decisions, since it does not rely on "statistical significance", but requires making pre-experiment assumptions about what the lift is likely to be, which is hard to do in a consistent way for all experiments and for all companies.

In this section, we explain the strengths and weaknesses of each method to give you a sense of when they are most and least appropriate, given your experimentation constraints and goals. For the statistical details, including lots of Greek letters, see the [Statistical nitty-gritty](#statistical-nitty-gritty).


:::caution

All the above methods for estimating the lift rely on the [Central Limit Theorem](https://en.wikipedia.org/wiki/Central_limit_theorem) (CLT), which, for our purposes, states that, regardless of how a given metric is distributed among subjects, the *mean* of that metric has a [normal distribution](https://en.wikipedia.org/wiki/Normal_distribution) as the number of subjects gets large. The CLT only holds, however, when both control and treatment variants have enough subjects in them, so we do not display confidence intervals if either variant has less than 30 subjects.

:::

### Fixed-sample analysis

A fixed-sample analysis is the most basic way to summarize the results from an experiment. First, you determine the minimum lift you care about (the [minimum detectable effect](../planning-experiments/minimum_detectable_effects.md), or MDE) for each metric you're going to observe in the experiment. Then, based on those MDEs, you do a power analysis to understand how many samples you need to be able to reliably detect an effect (for example, using Eppo's [Sample Size Calculator](../planning-experiments/index.md)). Then, you start your experiment, wait until you have the predetermined sample size, and *only then* do your analysis (and make a decision).

The analysis itself consists of measuring the mean and variance of the lift you observed and then using those to conduct a [Null Hypothesis Significance Test](https://en.wikipedia.org/wiki/Statistical_hypothesis_testing#The_testing_process). In our case, the null hypothesis is that the treatment and control variants are identical, that is, that you are performing an A/A test; if it is unlikely[^3], if the null hypothesis *were* true, that we would observe a lift between the two variants that is as large as what was measured during the experiment, then we *reject* the hypothesis that both variants are identical and call the lift *statistically significant*.

[^3]: Specifically: if the probability of it happening is less than the significance level that you have specified (which defaults to 5%).

#### Pros of fixed-sample analysis

- **Maximizes power for a given sample size.** If you have small sample sizes and struggle to get enough power to detect treatment effects, a fixed-sample experiment will give you the best shot at detecting an effect.

#### Cons of fixed-sample analysis

- **You have to select your sample size ahead of time.** Eppo's [Sample Size Calculator](../planning-experiments/index.md) makes this significantly easier, but if the assumptions you put into it end up not holding (for example, if the variance in your metrics is higher than it historically has been), then you can still end up underpowered at the predetermined sample size.
- **You cannot decide to run the experiment to collect more sample**, even if you do end up with an underpowered experiment after reaching the predetermined sample size, or if, at that point, you decide you want to understand how the experiment affected different segments or subpopulations; doing so would increase your false positive rate above the specified significance level. Instead, you need to start a *new* experiment, and run it longer before making a decision.[^4]
- **You cannot make decisions before the sample size is achieved** without invalidating the statistical guarantees.[^5] (aka: No peeking! 🙈) If you see a big metric drop, for example, and decide to shut down the experiment early, there is no guarantee that the chance it was a false positive (that is, that the drop was due to pure chance) is less than the significance level you've set. If you do this repeatedly, needlessly shutting down experiments that actually had neutral or even positive results. Similarly, if you want to ship experiments early when metrics seem to go up a lot, you'll end up shipping a lot of treatments with null or negative results.
- **You cannot use only part of the data to make a decision.** If there's a data problem at a certain point in your experiment, so you cannot use the full sample size, you need to restart the experiment from scratch; trying to use the data you collected before the problem would cause the same issues as making a ship/shutdown decision before achieving the predetermined sample size. Similarly, if you find that the treatment effect is observed only for some segments of subjects, you cannot make a decision just on that subpopulation without obviating the significance level you've set.

[^4]: Even if you do restart the experiment, you may be unable to measure the intended treatment effect, as some portion of the new control group will have been in the old treatment group, and so don't represent a true control.
[^5]: Specifically, that the false positive rate will be less than the significance level you've set.

:::tip Stats jargon

*Statistical [**significance**](https://en.wikipedia.org/wiki/Statistical_significance)* indicates that your *false **positive** rate* is below a certain threshold (specifically, the significance level you've set). That is, it means you are unlikely to ship a treatment that doesn't actually do anything (and, under normal assumptions, even less likely to ship a treatment that has a negative effect).

*Statistical [**power**](https://en.wikipedia.org/wiki/Power_of_a_test)* is a measure of your *false **negative** rate*. That is, it indicates how likely you are to have a true lift of at least a certain size (the MDE) and *still* not achieve statistical significance. In other words, an underpowered experiment is unlikely to be able to identify a treatment variant as being better than control *even though it is*.

:::

### Sequential analysis *(the default)*

Sequential analysis, like fixed-sample analysis, compares the observed lift to what we would expect to see if the treatment and the control were identical, but it does so in a way that ensures that the statistical guarantees hold *for any sample size*. That is, our sequential methods mean you can make a decision *at any time* without causing the false positive rate to exceed the significance level you've set. To do this, we give up some power compared to the fixed-sample method; however, the loss in power is much smaller for larger sample sizes, which tend to be required to detect a typical treatment's effects, anyway. In exchange, you get much more flexibility in when and how you make decisions on what to ship and what to shut down.

#### Pros of sequential analysis

- **You don't have to predetermine your sample size.** Although it is still useful to use Eppo's [Sample Size Calculator](../planning-experiments/index.md) to understand, operationally, when you can expect to be able to detect an effect if it exists, unlike with fixed-sample analysis, sequential analysis does not *require* you to do a power analysis beforehand. More importantly, it also does not require you to restart the experiment if any of the parameters of that power analysis (such as the expected metric values and variances) end up being incorrect.
- **You can make any decision at any time, safely.** Go ahead, peek away 👀! If a metric is marked as statistically significant (so the confidence interval is entirely above or below zero), you don't have to worry about it being a false positive just because you haven't reached a predetermined sample size. Also, you can decide to keep running the experiment to collect more sample, and, unlike with fixed-sample analysis, doing so will not invalidate the statistical guarantees.
- **Any data you collect can be useful, even if something goes wrong.** If a data problem means that you can't use data past a certain date, you can at least use all the data you've collected up until then. This means no need to rerun an experiment just because a pipeline broke or there was a bug in logging.

#### Cons of sequential analysis

- **You might have less power.** Compared to a fixed-sample analysis, sequential analysis has less power, meaning it's less likely to detect a real effect. However, this loss in power is mostly concentrated in really small sample sizes, and it can be mitigated by using techniques like [CUPED](cuped.md). Furthermore, fixed-sample analysis only has more power if the power analysis used to set the predetermined sample size is actually correct: if the treatment group has a higher than expected variance for a given metric, for example, you'll end up being less powered than you anticipated—and the only thing you can do in that case is rerun the experiment from scratch. With sequential analysis, if you have less power than you'd like you can always choose to keep running the experiment to collect more sample, without affecting the statistical guarantees
- **You cannot pick and choose your results.** Although you can still make a decision using partial data when a problem invalidates data after a certain point in time, you still, as with fixed-sample analysis, cannot run an experiment on a whole population and then choose to ship it to a subpopulation—at least, not without increasing your false positive rate. For example, if you find that a treatment has a big effect with Canadian users but no effect with users overall or in other countries, you cannot ship that variant just to Canadian users without violating the statistical guarantees on the false positive rate.


### Bayesian analysis

Both fixed-sample and sequential methods described above use a [frequentist](https://en.wikipedia.org/wiki/Frequentist_inference) approach, where we test how likely it would be to see the observed data under the assumption that the treatment and the control were identical. In contrast, the [Bayesian](https://en.wikipedia.org/wiki/Bayesian_inference) approach takes the data as given and tries to construct a distribution for the *true* lift, given what we've observed. More formally, the Bayesian method starts with a *prior distribution* for the lift, which describes our beliefs about what the lift might be *before we run the experiment*. Then, we use the data gathered in the experiment to *update* that prior and produce a *posterior distribution* (so called because it comes *after* the data), which describes our *new* beliefs about what the lift might be, given both the prior we started with and the data we've observed.

The prior we use is described specifically in the [nitty-gritty](#statistical-nitty-gritty) section below, but in essence we set our pre-experiment belief to be that the lift on any given metric will be, on average, zero, that for 50% of experiments the lift will fall between -21% and +21%, and that for 95% of experiments the lift will fall between -62% and +62%; if your experiments tend to show bigger lifts in either direction, then our Bayesian confidence intervals[^6] might be too narrow (biasing toward showing an effect when there is none).

:::info Many ways to be Bayesian

Being "Bayesian" simply means that you start with a prior belief, update it with data, and make decisions using the resulting posterior—it doesn't dictate *how* to set your prior. You might use a prior on the distribution of a metric at the per-subject level, or you might set your prior on the distribution of the *mean* of the metric, across subjects. If you have a deep understanding of each metric and of the patterns in your data, you can establish a complex prior that captures all the dynamics of your product and user base; using a correct prior can allow you to make correct decisions with less data than with frequentist methods.

However, developing such a deep understanding of a complicated system requires a lot of research and specific knowledge, and using a complex prior also requires using computational methods that do not scale well. In general, there is a tradeoff between doing a very specific analysis that requires less data but more time and expertise; vs. doing an analysis that requires more data but less time and expertise, but is more generalizable to different metrics and different contexts.

We may not have a deep understanding of your product, but we do have a deep understanding of experiments and the lifts that are typical across many kinds of experiment. So, we establish our priors on the *lift itself*, rather than on the aggregation of each metric or the behavior of individual subjects, which allows us to take advantage of our prior knowledge and provide experiment results in a way that Bayesians can use to make nuanced decisions.

:::

[^6]: Technically, [*credible intervals*](https://en.wikipedia.org/wiki/Credible_interval).

#### Pros of Bayesian analysis

- **You don't have to be quite so careful with statistical terminology.** A frequentist confidence interval is much easier to *use* than it is to explain, in a precise way. But Bayesian *credible intervals* allow you to describe experiment results in a way that is often more natural, especially for non-technical stakeholders. So, you can freely say things like "There is an 85% chance the treatment is better than the control," which is a no-no for frequentist confidence intervals.[^7]
- **You can make a decision based on a nuanced understanding of the probabilities.** Frequentist methods for experimentation inevitably boil down to *statistically significant* vs. *not statistically significant*. With Bayesian results, you have the whole posterior *distribution*, not just a binary "yes" or "no". This means you can make decisions not only on whether the lift is different from zero or not, but also on how likely the treatment is to be better than the control, or what the expected downside would be *if you are wrong*. When an experiment can move metrics in different ways, and different movements in different metrics can have very different costs to the business, this level of nuance allows you to make the best decision for each particular situation.
- **You can make decisions even with little data.** In the context of small samples, it can often be very difficult to achieve statistical significance using frequentist methods. Since Bayesian methods produce a whole distribution for the treatment effect, you can still make a decision as long as you are willing to adjust your level of rigor to match the level of signal you can get from your data: if zero is within the 95% credible interval, then you can't be 95% sure that the treatment had a positive effect, but if you can say that there's a 70% chance that the lift is bigger than the MDE of 1%, perhaps that's good enough to make a ship decision given the limitations of the experiment.
- **You can make a decision at any time.** Bayesian analysis is [not immune to peeking](http://varianceexplained.org/r/bayesian-ab-testing/), but it does avoid the issue simply by making no promises about the false positive rate. The idea of there being a "true effect" or "no effect" doesn't really make sense in a Bayesian paradigm: the lift is not simply zero vs. non-zero, but rather has a continuous *distribution* of values; since there is no "positive result" or "negative result", there can't be a *false* positive or *false* negative.

#### Cons of Bayesian analysis

- **Stakeholders might not be used to the Bayesian way of thinking.** Although some Bayesian concepts are more intuitive than their frequentist counterparts, frequentism is still the more common paradigm people learn for doing statistical inference, so switching from "This metric had a statistically significant increase" to "The treatment is 95% likely to have increased this metric" might require educating stakeholders on how to use Bayesian results.
- **You have to decide *how* to make decisions.** The output of Bayesian inference is a statistical distribution, rather than a "yes"/"no" answer to the question "Was there a statistically significant effect?" This means that decision-makers need to align on how to translate that distribution into a decision on whether to ship a particular treatment. For example, do you care more about risk, or probability the treatment beats control? What probability that the lift exceeds the MDE is considered "good enough to ship"?
- **You have to trust the prior.** With enough data, having an incorrect prior won't significantly bias your results. But since one of the benefits of Bayesian approaches is that they are easier to make decisons with when sample sizes are small, and the prior plays a larger role in just these cases, the choice of prior can sometimes determine whether a variant gets shipped or not. Even if you establish that the prior reflects the historical patterns in your pre-experiment data, you still have to assume that the experiment you're running is similar to those you've run in the past—and particularly when your product is growing rapidly, this might not be true.

[^7]: Technically, and pedantically, a frequentist confidence interval allows you to say "If we ran this experiment many times, 95% of the confidence intervals would contain the true lift value," but *not* "The true lift is 95% likely to be in this interval" or even "If we ran this experiment many times, our *estimate* of the lift would fall within this interval 95% of the time."


## Statistical nitty-gritty

The fixed-sample, sequential, and Bayesian methods all start from the same place: estimating the mean ($\mu$) and variance ($\sigma^2$) of the lift; the former is an estimate of the [Average Treatment Effect](https://en.wikipedia.org/wiki/Average_treatment_effect) (ATE), and the latter is an indication of how reliable that estimate is for predicting what will happen if you ship the treatment.

Once we have an estimate of the observed lift (both its mean and variance), we can use that to construct a confidence interval that describes the plausible values for the true lift.

### Estimating lift

First, some notation:

* For a metric $X$, we observe $x_i$ for each subject $i$ in the control group of size $N_C$, and $x_j$ for each subject $j$ in the treatment group of size $N_T$.
* The *true* mean (which we don't know!) of $X$ among the control group is $\mu_C$, and among the treatment group it is $\mu_T$. Similarly, the *true* (unobserved) variance is $\sigma^2_C$ and $\sigma^2_T$
* $m_C$ and $m_T$ are the averages of $X$ across all subjects in the control group and treatment group, respectively
* $s^2_C$ and $s^2_T$ are the sample variances of $X$ for the control group and treatment group, respectively

Regardless of the *true* distribution of $X$, the [Central Limit Theorem (CLT)](https://en.wikipedia.org/wiki/Central_limit_theorem) says that the *mean* of $X$, $\bar{X}$, is normally distributed; that is, for the control group:

$$
\lim_{N_C \to \infty}\bar{X}_C \sim \mathcal{N}(\mu_C; \frac{\sigma^2_C}{N_C})
$$

And similarly for the treatment:

$$
\lim_{N_T \to \infty}\bar{X}_T \sim \mathcal{N}(\mu_T; \frac{\sigma^2_T}{N_T})
$$

We don't observe the true means and variances, but we *can* estimate them, using $m_C$ and $s_C$ and $m_T$ and $s_T$:

$$
\lim_{N_C \to \infty}\bar{X}_C \sim \mathcal{N}(m_C; \frac{s^2_C}{N_C});

\lim_{N_T \to \infty}\bar{X}_T \sim \mathcal{N}(m_T; \frac{s^2_T}{N_T})
$$

We want to calculate the lift:

$$
\hat{\mathcal{L}} = \frac{\bar{X}_T - \bar{X}_C}{\bar{X}_C} = \frac{\bar{X}_T}{\bar{X}_C} - 1
$$

Plugging in the above distributions, and using the [delta method](https://en.wikipedia.org/wiki/Delta_method) to get the correct variance of the quotient, we get:

$$
\begin{align}
P(\hat{\mathcal{L}}~|~X_C, X_T) \sim&~~ \mathcal{N}(\mu_{data}; ~\sigma^2_{data})

\\[10pt]

\mu_{data} =&~~ \frac{m_C}{m_T}-1

\\[10pt]

\sigma^2_{data} =&~~ \frac{1}{m_C^2}\left(\frac{s_T^2}{N_T} +\frac{m_T^2}{m_C^2}\frac{s^2_C}{N_C}\right)
\end{align}
$$

That is, the estimated lift, given data for $X$ from the control and treatment groups, is normally distributed around a mean of $\frac{m_C}{m_T} - 1$. For the frequentist methods (fixed-sample and sequential), that's where we end, in terms of estimating the lift (see below for turning that estimate into confidence intervals). For Bayesian, however, there's one more step.

:::info

If you are using CUPED, then the estimate of the lift will be a bit more complicated; see the [CUPED docs](cuped.md) for more information.

:::


#### Bayesian analysis: updating our prior

In a Bayesian framework, you start with a *prior distribution*, which describes what you believe before running the experiment. Then, you run the experiment and collect data, which you use to *update* your prior: in essence, you combine your pre-experiment beliefs about what the lift would be, with the evidence you've gotten from the experiment, into a *new* set of beliefs, called the *posterior* (because it comes *after* gathering data). The estimated average lift is then just the mean of this posterior distribution.

In our implementation of the Bayesian approach, we start the following prior on the lift:

$$
\begin{equation}
P(\mathcal{L}) \sim \mathcal{N}(\mu_{pre}=0; ~\sigma_{pre}^2 = 0.1)
\end{equation}
$$

In other words, our prior is that the lift, on average, will be zero, and that for each metric, about 50% of experiments will show a lift between -21% and +21%, and about 95% of experiments will show a lift between -62% and +62%; from our experience running experiments, this is a fairly conservative prior, as having lifts over ±50% is extremely rare.

The evidence from the experiment is construed as a normal distribution $\hat{\mathcal{L}}$ just as with the frequentist methods (see equation 1 above). However, for the Bayesian method we use this evidence to update the above prior, and the result is our posterior.

Specifically, our posterior is a normal distribution with mean $\mu_{post}$ and variance $\sigma_{post}^2$, where:

$$
\begin{align}
\mu_{post} =&~~ \frac{
  \frac{
    \mu_{prior}
  }{
    \sigma^2_{prior}
  } 
  + 
  \frac{
    \mu_{data}
  }{
    \sigma^2_{data}
  }
}{
  \frac{1}{\sigma^2_{prior}}
  +
  \frac{1}{\sigma^2_{data}}
}

\\[20pt]


=&~~ \frac{1}{\sigma^2_{prior} + \sigma^2_{data}} \left(
  \sigma^2_{prior}\mu_{data} + \sigma^2_{data}\mu_{prior}
\right)

&\text{\it\small{{(multiply top and bottom by $\sigma^2_{prior}\sigma^2_{data}$)}}}

\\[10pt]

\sigma^2_{post} =&~~ \frac{1}{\frac{1}{\sigma^2_{prior}} + \frac{1}{\sigma^2_{data}}}
\end{align}
$$

Following [Gelman](http://www.stat.columbia.edu/~gelman/book/BDA3.pdf) (p50) (with a slight tweak), we can rewrite the posterior mean $\mu_{post}$ as:

$$
\begin{equation}
\mu_{post} = \mu_{data} - \frac{\sigma^2_{data}}{\sigma^2_{data} + \sigma^2_{prior}}
(\mu_{data} - \mu_{prior})
\end{equation}
$$

If we note that:

- $\mu_{data}$ is the lift observed in the data (i.e. $E[\hat{\mathcal{L}}] = \frac{m_C}{m_T} - 1$)
- $\frac{\sigma^2_{data}}{\sigma^2_{data} + \sigma^2_{prior}}$ represents how spread out the data is compared to the prior; if the variance of our lift is very low (because for example we have a lot of data), then this quantity will tend toward $0$[^8]
- $(\mu_{data} - \mu_{prior})$ is the difference between what we've observed and what we expected to observe before we started the experiment

Then we can restate equation (8) as: the lift we observed in the experiment, *shrunk* toward the lift we *expected* to see (according to the prior) by an amount that is set by how precise our lift estimate is relative to the strength of our prior.

[^8]: And it will get to zero faster if our prior is *weaker*, that is, if it has a higher variance. If we have a *strong* belief, represented by a *low* value of $\sigma^2_{prior}$, then moving this term toward zero requires need *more* data (or, data that doesn't vary much).

#### Confidence Intervals

For fixed-sample and Bayesian analysis, constructing a normal distribution that describes the average lift (equation 1-3 in the case of fixed-sample, and the posterior from equations 5-6 in the case of Bayesian) is enough to construct confidence intervals: the lower and upper bounds for significance level $\alpha$ (e.g. 5%) are simply the $\frac{\alpha}{2}^{th}$ and $(1 - \frac{\alpha}{2})^{th}$ percentiles of that distribution.

In order to guarantee always-valid confidence intervals for sequential analysis, however, we need to do something fancier. Specifically, we use the method described in [Howard et al. (2021)](https://arxiv.org/abs/1810.08240) to construct a bound such that the probability that the mean will be outside that bounds at any point is less than or equal to a significance level $\alpha$. In particular, we define the *confidence sequence* (that is, a sequence of confidence intervals) around the mean using equation (14) from the reference (with some changes in notation):

$\hat \mu \pm \frac{\sigma}{t} \sqrt{ (t + \rho) \log \left( \frac{t+\rho}{\rho\alpha^2} \right)}$

where $\hat \mu$ is the estimate for expected lift, $\sigma$ is the standard error of the lift estimate, $t$ is the number of observations, $\alpha$ is the significance level, and $\rho$ is set using

$\rho = \frac{10000}{\log( \log ( e \alpha^{-2} ) )-2\log{ \alpha }}$.

We have run extensive simulations to validate that these confidence intervals satisfy the specified coverage guarantees.
