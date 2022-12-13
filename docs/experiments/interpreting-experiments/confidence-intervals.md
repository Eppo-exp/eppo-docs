# Confidence Intervals
By navigating to the detail view of any experiment, you can view the effect that any of the treatments have had on each of the selected metrics for that experiment. You can get to the detail view of any experiment by clicking the **Experiments** tab on the left panel and then clicking on the experiment you're interested in from the list. The effect on each metric comes with an accompanying confidence interval. This confidence interval tells you the upper and lower bound of the effect on the metric in addition to the point estimate of the effect. We show confidence intervals for the ratio between treatment and control, rather than their absolute difference.

If the change is positive and a positive change has been marked as good, the interval shows up in green (red if positive is bad). The opposite is true if the change is negative. The interval will be gray if the confidence range includes 0, possibly indicating that the effect of the variation on that metric was not significant.

![Confidence intervals](../../../static/img/measuring-experiments/confidence.png)

### How we calculate the confidence intervals
The conventional way of calculating confidence intervals are based on the Z-test (assuming that there is sufficient data for CLT). That is, a confidence interval for unknown mean $\mu$ based on estimator based on estimator $\hat\mu_n = \bar X$ is found by $(\hat\mu_n - z_{\alpha/2} \hat{\text{SE}},  \hat\mu_n + z_{\alpha/2} \hat{\text{SE}})$, where for $\alpha = 0.05$, $z_{\alpha / 2} = 1.96$. Under the usual assumptions of classical statistical theory, we then have a guarantee that the random interval computed above contains $\mu$ with probability $1-\alpha$.

However, this approach assumes that the sample size is fixed up front, and if this assumption is violated the guarantees for the confidence intervals become invalid.

#### Sequential Analysis
Eppo uses [sequential analysis](https://arxiv.org/abs/1810.08240) which allows us to compute confidence intervals that are valid across time. More precisely, the probability that the random confidence interval does not contain the unknown mean at any point in time is bounded by $\alpha$. We use the bound in equation (14) of the [reference](https://arxiv.org/abs/1810.08240), and generate confidence intervals by computing

$\hat \mu \pm \frac{\sigma}{t} \sqrt{ (t + \rho) \log \left( \frac{t+\rho}{\rho\alpha^2} \right)}$

where $\hat \mu$ is the estimate for the relevant parameter we are interesting in estimating, $t$ is the number of observations, $\alpha$ is the significance level, and $\rho$ is set using

$\rho = \frac{10000}{\log( \log ( e \alpha^{-2} ) )-2\log{ \alpha }}$.

**Note:** The theoretical guarantees for this method require sub-Gaussian data; which means we have to rely on the central limit theorem and confidence intervals are not accurate in very small sample sizes. We run extensive simulations to validate that this method of generating confidence intervals satisfies the coverage guarantees.

As improvements to the state of the art methods are developed, we will incorporate them into the Eppo platform.


#### Confidence intervals for the relative lift
The null hypothesis test, for statistical significance for the ratio between treatment and control, has the form:

$H_0: \frac{\hat{\mu}_T}{\hat{\mu}_C} - 1 = 0$

The sampling distributions for estimates of the means for control and treatment both asymptotically have a Gaussian distribution following the Central Limit Theorem. We then apply the [Delta method](https://en.wikipedia.org/wiki/Delta_method) to find that the sampling distribution of the ratio statistic is asymptotically normal with variance
$V = \left(\frac{\mu_T}{\mu_C}\right)^2\left(\frac{\sigma_T^2}{\mu_T^2} + \frac{\sigma_C^2}{\mu_C^2} \right)$, where we replace parameters with their sample estimates.


### Ratio metrics

Default metrics have the form $\frac{\sum_{i=1}^n X_i}{n}$ where $X_i$ are observations on a metric for each subject in the experiment and want to estimate its mean.
However, Eppo also supports ratio metrics, where instead of estimating the mean of a metric, we are interested in understanding the ratio two means.
That is, our estimator has the form $\frac{\sum_{i=1}^n X_i}{\sum_{i=1}^n Y_i}$.
To find the (asymptotic) sampling distribution of this estimator, we again rely on the Delta method, but since numerator and denominator are not independent in this case, there is an extra term for the covariance:
$V = \left(\frac{\mu_X}{\mu_Y}\right)^2\left(\frac{\sigma_X^2}{\mu_X^2} + \frac{\sigma_Y^2}{\mu_Y^2} - \frac{2\sigma_{XY}}{n \mu_X \mu_Y}\right)$, where again we replace parameters with their sample estimates. $\sigma_{XY}$ denotes the covariance between $X_i$ and $Y_i$ and we divide by $n$ because we need the covariance between sample averages.



