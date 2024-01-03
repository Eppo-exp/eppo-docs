---
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

import NoBreak from '@site/src/components/NoBreak'
import Term from '@site/src/components/glossary/Term'

# Statistical nitty-gritty

The fixed-sample, sequential, and Bayesian methods all start from the same
place: estimating the <NoBreak>**mean** ($\mu$)</NoBreak>
and <NoBreak>**variance** ($\sigma^2$)</NoBreak> of the lift;
the former is an estimate of the size of the treatment effect (as a percentage
of the baseline metric value), and the latter is an indication of how reliable
that estimate is for predicting what will happen if you ship the treatment.

Once we have an estimate of the observed lift (both its mean and variance), we
can use that to construct a confidence interval that describes the plausible
values for the true lift.

## Estimating lift

First, some notation:

- For a given metric, we observe $y_i$ for each subject $i$ in the control group
  of size $n_C$, and $y_j$ for each subject $j$ in the treatment group of size
  $n_T$. The set of all observations in the control group is $\bold{Y}_C$, and
  for the treatment group it is $\bold{Y}_T$.

- The _true_ population mean (which we don't know!) of the metric among the control group
  is $\mu_C$, and among the treatment group it is $\mu_T$. Similarly, the _true_
  (unobserved) population variance is $\sigma^2_C$ and $\sigma^2_T$

- $m_C$ and $m_T$ are the averages of $\bold{Y}_C$ and $\bold{Y}_T$ across all
  subjects in the control group and treatment group, respectively:

  $$
  \begin{equation}
  \begin{split}
  m_C &= \frac{\sum_{i=1}^{n_C}{y_i}}{n_C}
  \\[1.2em]
  m_T &= \frac{\sum_{j=1}^{n_T}{y_j}}{n_T}
  \end{split}
  \end{equation}
  $$

- $s^2_C$ and $s^2_T$ are the _sample_ variances of $\bold{Y}_C$ and $\bold{Y}_T$
  for the control group and treatment group, respectively:

  $$
  \begin{equation}
  \begin{split}
  s^2_C &= \frac{n_C}{n_C - 1}\left(\frac{\sum_{i=1}^{n_C}{y_i^2}}{n_C} - m_C^2\right)
  \\[1.2em]
  s^2_T &= \frac{n_T}{n_T - 1}\left(\frac{\sum_{j=1}^{n_T}{y_j^2}}{n_T} - m_T^2\right)
  \end{split}
  \end{equation}
  $$

Regardless of the distribution of $\bold{Y}_C$ and $\bold{Y}_T$, the
[Central Limit Theorem (CLT)](https://en.wikipedia.org/wiki/Central_limit_theorem)
says that, when $n_C$ and $n_T$ are sufficiently large, the _mean_ of
$\bold{Y}_C$ and $\bold{Y}_T$ are each normally distributed;
that is:

$$
\begin{equation}
\begin{align*}
\lim_{n_C \to \infty}m_C \sim&~~ \mathcal{N}\left(\mu_C; \frac{\sigma^2_C}{n_C}\right)
\\[1em]
\lim_{n_T \to \infty}m_T \sim&~~ \mathcal{N}\left(\mu_T; \frac{\sigma^2_T}{n_T}\right)
\end{align*}
\end{equation}
$$

:::info Ratio metrics

Eppo also supports <Term def={true}>ratio metrics</Term>, where instead of
estimating the mean of a single metric, we are interested in understanding the
ratio of two means (or, equivalently, the ratio of two sums),
such as average order value or time per session. In this
case (leaving out the $\small{C}$ / $\small{T}$ subscript for brevity),
we observe from a sample of size $n$ the numerator metric $y_i$ and
the denominator metric $z_i$ for each subject (with the set of
all subject observations being $\bold{Y}$ and $\bold{Z}$ respectively)
and are trying to estimate:

$$
\mu_{ratio} = \frac{\mu_{\tiny{Y}}}{\mu_{\tiny{Z}}} = \frac{\sum_{i=1}^{n}{y_i}}{\sum_{i=1}^n{z_i}}
$$

As above, $\mu_{\tiny{Y}}$ and $\mu_{\tiny{Z}}$ can be estimated by their sample means $m_{\tiny{Y}}$
and $m_{\tiny{Z}}$, which are normally distributed around the true values with
variances $\frac{\sigma^2_{\tiny{Y}}}{n}$ and $\frac{\sigma^2_{\tiny{Z}}}{n}$, which
in turn can be estimated by the sample variances $s_{\tiny{Y}}$ and $s_{\tiny{Z}}$.

Estimating the ratio $\mu$ then becomes a matter of dividing the distributions
for each component of the ratio; under some reasonable assumptions[^normality],
the resulting quotient is also approximately normally distributed:

$$
\frac{\sum_i{\bold{Y}}}{\sum_i{\bold{Z}}} \xrightarrow{D}
\mathcal{N}\big(\mu_{ratio},~\sigma^2_{ratio}\big)
$$

The variance term can be calculated
using the [delta method](https://en.wikipedia.org/wiki/Delta_method)
(with $\sigma_{\!\tiny{\textit{YZ}}}$ representing the covariance between $\bold{Y}$ and $\bold{Z}$)
as:

$$
\sigma^2_{ratio} = \left(
  \frac{\mu_{\tiny{Y}}}{\mu_{\tiny{Z}}}
\right)^2
\left(
  \frac{\sigma_{\tiny{Y}}^2}{n\mu_{\tiny{Y}}^2} + \frac{\sigma_{\tiny{Z}}^2}{n\mu_{\tiny{Z}}^2} - \frac{2\sigma_{\!\tiny{\textit{YZ}}}}{n \mu_{\tiny{Y}} \mu_{\tiny{Z}}}
\right)
$$

Note that the extra $n$ in the denominator of the last term is because we need the covariance
between the sample averages.

For each variation, then, we can plug in the sample moments of the numerator and
denominator metrics to calculate the values for the ratio:

$$

\begin{align}
m_{ratio} &= \frac{m_{\tiny{Y}}}{m_{\tiny{Z}}}
\\
s^2_{ratio} &= \left(
  \frac{m_{\tiny{Y}}}{m_{\tiny{Z}}}
\right)^2
\left(
  \frac{s_{\tiny{Y}}^2}{n m_{\tiny{Y}}^2} + \frac{s_{\tiny{Z}}^2}{n m_{\tiny{Z}}^2} - \frac{2s_{\!\tiny{\textit{YZ}}}}{n m_{\tiny{Y}} m_{\tiny{Z}}}
\right)
\end{align}
$$

The below analysis then simply uses these values for ratio metrics instead of
the simple sample means and variances for each variation.

:::

### Frequentist analysis

We want to calculate the lift, which we'll call $\Delta$:

$$
\Delta = \frac{\mu_T - \mu_C}{\mu_C} = \frac{\mu_T}{\mu_C} - 1
$$

But, since we don't know the true values $\mu_T$ and <NoBreak>$\mu_C$</NoBreak>,
we'll need to instead _estimate_ the lift. We know from the CLT, as shown in
equation 3 above, that $m_T$ and $m_C$ are approximately normally
distributed (for sufficiently large $n_C$ and $n_T$); furthermore, since $m_T$
and $m_C$ are independent, under reasonable assumptions the ratio
$\frac{m_T}{m_C}$ is approximately normal.[^normality2] This allows us to model
$\hat{\Delta}$ as a normal distribution:

$$
\begin{align}
\hat{\Delta} \sim&~~ \mathcal{N}(\hat{\mu}_{\tiny{\Delta}}, \hat{\sigma}^2_{\tiny{\Delta}})
\\[1em]
\hat{\mu}_{\tiny{\Delta}} =&~~ \frac{m_T}{m_C} - 1
\\[1em]
\hat{\sigma}^2_{\tiny{\Delta}} =&~~ \frac{m_T^2}{m_C^2}\left(
  \frac{s^2_C}{n m_C^2} + \frac{s^2_T}{n m_T^2}
\right)
\end{align}
$$

Note that the calculation of the variance $\hat{\sigma}^2_{\tiny{\Delta}}$ relies on the
[delta method](https://en.wikipedia.org/wiki/Delta_method).

Thus, we have estimated the lift as being normally distributed with a mean of
$\hat{\mu}_{\tiny{\Delta}}$ and a variance of $\hat{\sigma}^2_{\tiny{\Delta}}$. For the frequentist
methods (fixed-sample and sequential), that's where we end, in terms of
estimating the lift (see below for turning that estimate into confidence
intervals). For Bayesian, however, there's one more step.

[^normality]:
    Under reasonable assumptions, we can approximate the ratio of two
    normal distributions as a normal distribution centered on the ratio of the
    means. In essence, the approximation requires that the denominator be
    unlikely to be negative. Since all metrics are positive, the requirement
    boils down to whether the distribution of the denominator is sufficiently
    narrow (that is, has sufficiently low variance, relative to the mean). There
    is a short treatment of this approximation
    [here](https://en.wikipedia.org/wiki/Ratio_distribution#Uncorrelated_noncentral_normal_ratio),
    and a longer treatment in
    [Díaz-Francés and Rubio (2004), "On the Existence of a Normal Approximation to the Distribution of the Ratio of Two Independent Normal Random Variables."](https://www.researchgate.net/profile/F-Rubio/publication/257406150_On_the_existence_of_a_normal_approximation_to_the_distribution_of_the_ratio_of_two_independent_normal_random_variables/links/53d7a18a0cf2e38c632ddabc/On-the-existence-of-a-normal-approximation-to-the-distribution-of-the-ratio-of-two-independent-normal-random-variables.pdf)

[^normality2]:
    For more on requirements for this approximation, see note
    [above](#fn-normality). In this case, the denominator (which must be
    unlikely to be negative for the approximation to hold) is the distribution
    of the treatment metric.

:::info

If you are using <Term>CUPED</Term>, then the estimate of the lift will be a bit more
complicated; we still model the lift as a normal distribution, but the mean and
variance are computed after using a ridge regression to account for random (that
is, _not correlated with the treatment assignment_) pre-experiment differences
between the groups. See the [CUPED docs](/statistics/cuped) for more information.

:::

### Bayesian analysis

In a Bayesian framework, you start with a _prior distribution_, which describes
what you believe before running the experiment. Then, you run the experiment and
collect data, which you use to _update_ your prior: in essence, you combine your
pre-experiment beliefs about what the lift would be, with the evidence you've
gotten from the experiment, into a _new_ set of beliefs, called the _posterior_
(because it comes _after_ gathering data). The estimated average lift is then
just the mean of this posterior distribution.

#### Setting the prior

In our implementation of the Bayesian approach, we use a normal
distribution[^conjugate] as our prior for the lift:

$$
\begin{equation}
\hat{\Delta}_{prior} \sim \mathcal{N}(\mu_{prior}=0; ~\sigma_{prior}^2 = 0.05^2)
\end{equation}
$$

In other words, our prior is that the lift, on average, will be zero, with a standard
deviation of $0.05$. You can adjust the prior standard deviation in the [Statistical Analysis Plan admin settings](https://eppo.cloud/admin/statistical-analysis-plan) to reflect your prior knowledge of how common or rare large lifts are. This setting is shared across all experiments using Bayesian analysis. (To change the prior standard deviation when Bayesian is not the company default, temporarily make Bayesian the default, change the prior standard deviation, and save; then revert to the previous analysis method.)

[^conjugate]:
    We use a normal distribution because it is a convenient [conjugate
    prior](https://en.wikipedia.org/wiki/Conjugate_prior), meaning that we can
    update it with our (normally distributed) lift estimate and produce another
    normal distribution. In this case, we are assuming that the variance of the
    lift is known, that is, that $\hat{\sigma}^2_{\tiny{\Delta}}$ is accurate. 

#### Updating the prior

The evidence from the experiment is construed as a normal distribution
$\hat{\Delta}$ just as with the frequentist methods (see equations 2–4 above).
However, for the Bayesian method we use this evidence to update the above prior,
and the result is our posterior.

Specifically, our posterior is a normal distribution with mean $\mu_{post}$ and
variance $\sigma_{post}^2$, where:[^derivation]

$$
\begin{align}

\hat{\mu}_{post} =&~~ \frac{
  \frac{
    1
  }{
    \sigma^2_{prior}
  }
    \mu_{prior}
  +
  \frac{
    1
  }{
    \hat{\sigma}^2_{\tiny{\Delta}}
  }
    \hat{\mu}_{\tiny{\Delta}}
}{
  \frac{1}{\sigma^2_{prior}}
  +
  \frac{1}{\hat{\sigma}^2_{\tiny{\Delta}}}
}

\\[2em]

\hat{\sigma}^2_{post} =&~~ \frac{1}{\frac{1}{\sigma^2_{prior}} + \frac{1}{\hat{\sigma}^2_{\tiny{\Delta}}}}
\end{align}
$$

In other words, our posterior mean is the weighted average of the prior and the
observed data, where for each term the weight is the precision (that is, the
_inverse_ of the variance). The variance, meanwhile, is related to the harmonic
mean of the variances of the prior and the observed data.

:::tip Intuition for the posterior

We can also rewrite[^gelman] the posterior mean $\mu_{post}$
(equation 6) as:

$$
\begin{equation}
\hat{\mu}_{post} = \hat{\mu}_{\tiny{\Delta}} -
  \frac{
    \hat{\sigma}^2_{\tiny{\Delta}}
  }{
    \hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}
  }
  (\hat{\mu}_{\tiny{\Delta}} - \mu_{prior})
\end{equation}
$$

Note that
$\tfrac{\hat{\sigma}^2_{\tiny{\Delta}}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}$
reflects how spread out the data are, relative to the prior,[^weakprior] and
$(\hat{\mu}_{\tiny{\Delta}} - \mu_{prior})$ is the distance between what we've observed
and our prior expectation; thus, we can interpret equation 8 as showing that our posterior
lift is the lift we observed in the experiment _shrunk toward the prior_ (that is, toward 0),
and that the shrinkage will be larger if our data is noisy
(such as happens when we have few observations) and/or our prior is very strong
(that is, $\sigma^2_{prior}$ is low).

[^gelman]:
    This section follows
    [Gelman et al., “Bayesian Data Analysis Third Edition” (2020)](http://www.stat.columbia.edu/~gelman/book/BDA3.pdf),
    p. 40, with some slight tweaks to notation and ordering.

[^weakprior]:
    In particular, if the sample variance of the data goes to zero (as
    would happen if our sample size gets very large), so will this quotient,
    meaning that the prior will have less and less of an effect on the
    posterior. Furthermore, it will get to zero _faster_, as we add samples, if
    our prior is _weaker_—that is, if it has a higher variance. On the other
    hand, if we have a _strong_ prior belief, represented by a _low_ value of
    $\sigma^2_{prior}$, then moving this term toward zero requires _more_ data
    (or, data that doesn't vary much).

:::

<!--
\hat{\mu}_{post} =&~~ \frac{
  \hat{\sigma}^2_{\tiny{\Delta}} \mu_{prior}
  +
  \sigma^2_{prior} \hat{\mu}_{\tiny{\Delta}}
}{
  \hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}
}
\\

$$
\begin{equation}
\begin{split}
\mu_{post} &= \rho ~ \mu_{prior} + (1 - \rho)\hat{\mu}_{\tiny{\Delta}}
\\
\rho &= \frac{\hat{\sigma}^2_{\tiny{\Delta}}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}
\end{split}
\end{equation}
$$

$$
\begin{align}
\mu_{post} &= \left(\frac{\hat{\sigma}^2_{\tiny{\Delta}}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}\right)\mu_{prior}
+ \left(1 - \frac{\hat{\sigma}^2_{\tiny{\Delta}}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}\right)\hat{\mu}_{\tiny{\Delta}}
\\[1.5em]
&= \left(1 - \frac{\sigma^2_{prior}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}\right)\mu_{prior}
+ \left(\frac{\sigma^2_{prior}}{\hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}}\right)\hat{\mu}_{\tiny{\Delta}}
\end{align}
$$

-->

#### Arriving at the posterior

Since our prior is that the lift is zero (that is, $\mu_{prior}=0$), we can
simplify the statement of our posterior (equations 7 and 8) to:

$$
\begin{align}
\hat\Delta_{post} \sim&~~ \mathcal{N}(\mu_{post}, \sigma_{post}^2)
\\[1.5em]
\hat{\mu}_{post} =&~~ \hat{\mu}_{\tiny{\Delta}}\left(
  1 - \frac{
    \hat{\sigma}^2_{\tiny{\Delta}}
  }{
    \hat{\sigma}^2_{\tiny{\Delta}} + \sigma^2_{prior}
  }
\right)
\\[1.5em]
\hat{\sigma}^2_{post} =&~~ \frac{
  1
}{
  \frac{1}{\sigma^2_{prior}} +
  \frac{1}{\hat{\sigma}^2_{\tiny{\Delta}}}
}
\end{align}
$$

[^derivation]:
    For a derivation, see
    [Gelman et al., “Bayesian Data Analysis Third Edition” (2020)](http://www.stat.columbia.edu/~gelman/book/BDA3.pdf),
    §2.5. An alternative derivation is provided in
    [Murphy, “Conjugate Bayesian Analysis of the Gaussian Distribution” (2007)](https://www.cs.ubc.ca/~murphyk/Papers/bayesGauss.pdf).

## Confidence intervals

Now that we have (normal) distributions describing our estimate of the lift,
that is, an estimate for the mean and variance of the lift, we can construct
confidence intervals. The width of those intervals will depend on the <Term
def={false}>confidence level</Term>, $c \in (0, 1)$, which represents the
desired likelihood of the interval including the true lift.

### Frequentist analysis

For frequentist methods, we want to ensure that our confidence interval contains
the true lift $\Delta$ with some minimum probability $c$
(our _confidence level_).[^freqfalsepos] Specifically, after $t$ observations
(where $t = n_C + n_T$ and can be thought of as a function of _time_), we
want to set the lower and upper bounds of our confidence interval $(L_t, U_t)$
such that:[^tvaries]

$$
\begin{equation}
P(L_t^c \le \Delta_t \le U_t^c) \ge c
\end{equation}
$$

[^freqfalsepos]:
    This is equivalent to saying that we want to limit the _false
    positive rate_ to be no more than $1-c$, which is how this constraint is
    typically framed in the context of
    [null hypothsesis significance testing](https://en.wikipedia.org/wiki/Statistical_significance).

[^tvaries]:
    Note that we do not assume, as is typical, that $\Delta$ is constant
    across all sample sizes $t$. See
    [Howard et al., “Time-Uniform, Nonparametric, Nonasymptotic Confidence Sequences”](https://arxiv.org/pdf/1810.08240.pdf),
    p. 19 for a discussion of the implications of assuming that lift is
    invariant over sample sizes.

#### Fixed-sample

Fixed-sample analysis assumes that the results are only looked at once, and
therefore only a single interval need be constructed—so we can ignore the $t$
subscripts in the above constraint (eq. 15). Given that we have
constructed a normal distribution that describes the lift estimate, we can
therefore simply use that distribution's
[quantile function](https://en.wikipedia.org/wiki/Normal_distribution#Quantile_function)
$F_{\tiny{\Delta}}^{-1}(p) = \hat{\mu}_{\tiny{\Delta}} - \hat{\sigma}_{\tiny{\Delta}} \mathop{\Phi^{-1}}(p)$, where
$\mathop{\Phi^{-1}}$ is the quantile function for the standard normal distribution and
$p \in (0, 1)$ is the desired quantile. Specifically, this gives us lower and
upper bounds for a given confidence level $c$ (e.g., $c = 0.95$
for a 95% confidence interval):

$$
\begin{equation}
\begin{split}
L^c &= \hat{\mu}_{\tiny{\Delta}} - \hat{\sigma}_{\tiny{\Delta}}~z_c
\\
U^c &= \hat{\mu}_{\tiny{\Delta}} + \hat{\sigma}_{\tiny{\Delta}}~z_c
\\
z_c &= \mathop{\Phi^{-1}}(\tfrac{1-c}{2})
\end{split}
\end{equation}
$$

#### Sequential

For the sequential analysis method, we need to ensure that the constraint in
equation 15 holds _for all $t$ at once_. That is:

$$
P(L_t^c \le \Delta_t \le U_t^c~,~ \forall t \ge 1) \ge c
$$

This means that we do not have a single _confidence interval_, but rather a
_confidence sequence_: an infinite sequence of confidence intervals such that,
not only is each individual interval valid for controlling the rate of false
positives, but the aggregation of all intervals is valid as well. In other
words, a confidence sequence provides statistical guarantees while allowing
you to peek at the results as many times as you want (including after every
single observation) and to stop the experiment at any time.

<!-- TK: confidence sequence as pair of boundaries -->

The method we use for constructing the bounds $L_t^c$ and $U_t^c$ comes from
[Howard et al., “Time-Uniform, Nonparametric, Nonasymptotic Confidence Sequences”](https://arxiv.org/pdf/1810.08240.pdf)
and has the following useful properties:

1. The statistical guarantees are valid even for very broad assumptions about
   the underlying distribution of $\Delta$.
2. You do not need to predeterimine the sample size.
3. You can peek at results any number of times, and can decide, based on what
   you see, to shut down the experiment or keep it running to collect more data.
4. You can use any stopping rule you like, meaning, for example, you can change
   the confidence level in the middle of the experiment.
5. As you collect more data, the width of the intervals will tend to get smaller
   and smaller, and eventually will approach zero.
6. Although the confidence intervals are wider than for fixed-sample analysis,
   the penalty incurred for the additional flexibility and generality is smaller
   than that from a host of previous methods.

We use a slightly modified version of equation 14 from the reference, with some
changes in notation, to construct our bounds.[^modifications] Specifically, using
the estimated lift $\hat{\mu}_{\tiny{\Delta}}$ from equation 7, the
estimated standard error of the lift $\hat{\sigma}_{\tiny{\Delta}}$ from equation 8,
the confidence level $c \in (0, 1)$, and the total sample size $t = n_C + n_T$
:

$$
\begin{equation}
\begin{split}
L_t^c &= \hat{\mu}_{\tiny{\Delta}} - \hat{\sigma}_{\tiny{\Delta}}~B
\\
U_t^c &= \hat{\mu}_{\tiny{\Delta}} + \hat{\sigma}_{\tiny{\Delta}}~B
\\
B &= \frac{1}{t} \sqrt{ (t + \rho) \log\Bigl(\tfrac{t+\rho}{\rho(1 - c)^2}\Bigr)}
\\[1.2em]
\rho &= \frac{N_{tune}}{\log\Bigl( \log \bigl( \tfrac{e}{(1-c)^{2}} \bigr) \Bigr)-2\log{(1-c)}}
\end{split}
\end{equation}
$$

<!-- TK: should B start with frac{1}{sqrt{t}}? -->

where $N_{tune}$ is a tuning parameter that is used to determine where the ratio
between the sequential confidence interval width and the fixed-sample confidence
interval width is minimized; we set $N_{tune}=10{,}000$ to try to minimize the
cost (in terms of additional sample needed) of the sequential method around
typical A/B test sample sizes.

We have run extensive simulations to validate that these confidence intervals
satisfy the specified coverage guarantees.

[^modifications]:
    In particular, Howard et al. assume unit variance while our
    lift estimate has variance $\hat{\sigma}^2_{\tiny{\Delta}}$, and we set our bounds around
    the mean estimated lift, rather than the sum.

### Bayesian

For simplicity, when referring to the lower and upper bounds around a lift
estimate, we generally use the phrase "confidence interval" regardless of which
analysis method you might be using; in a Bayesian context, however, the term is
a misnomer, as Bayesian methods approach the problem of inference differently
than frequentist methods do. Bayesians therefore use
[credible intervals](https://en.wikipedia.org/wiki/Credible_interval#Contrasts_with_confidence_interval)
instead.

Although the epistemological underpinnings for constructing a Bayesian credible
interval may share little with the process for constructing a fixed-sample
confidence interval, the statistical procedure is nearly identical. That is,
given our posterior distribution $\hat{\Delta}_{post}$ from equation 9, we
simply look at the quantile function for that distribution to set our bounds:

$$
\begin{equation}
\begin{split}
L^c &= \hat{\mu}_{post} - \hat{\sigma}_{post}~z_c
\\
U^c &= \hat{\mu}_{post} + \hat{\sigma}_{post}~z_c
\\
z_c &= \mathop{\Phi^{-1}}(\tfrac{1-c}{2})
\end{split}
\end{equation}
$$

It is important to note that the constraint in equation 12 (ensuring that the
probability that the true lift falls within the bounds $(L^c, U^c)$ is at least
as high as our confidence level) does _not_ hold in the Bayesian case, simply
because such a constraint is nonsensical in a Bayesian context. Instead, the
above bounds in equation 15 (which constitute a _credible interval_) describe
our beliefs about what the lift might plausibly be given our prior and the
observed data. In particular, we can say that we expect $\Delta \in (L^c, U^c)$
with probability $c$, given our prior and the observed data.
