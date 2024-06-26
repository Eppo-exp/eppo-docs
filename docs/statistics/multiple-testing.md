# Multiple testing correction

By default, the confidence intervals for metric individually control their error rates; a 95% confidence interval fails to cover to true underlying parameter 5% of the time.
Thus for an experiment with 20 confidence intervals (one variant with 20 metrics, or 2 variants with 10 metrics each), we can expect one of these to fail its coverage.

We can avoid this by making our confidence intervals more conservative (wider) in order to control the [Family-wise error rate](https://en.wikipedia.org/wiki/Family-wise_error_rate) (FWER), that is, the probability that any single confidence interval does not cover its underlying true parameter. Naturally, the more confidence intervals we look at, the more stringent this approach is.

:::tip
Eppo's approach corrects for multiple testing across both **metrics _and_ variants**. If your experiment includes unused variants, disable them by unchecking "Include in this experiment" in the experiment configuration page. This way, the unused variants will not affect the multiple testing correction.
:::

We allow for control of FWER using the **preferential Bonferroni** method. This is similar to the well-known [Bonferroni correction](https://en.wikipedia.org/wiki/Bonferroni_correction) except that it gives additional weight to the primary metric:

![Multiple testing settings](/img/planning-experiments/multiple-testing-settings.png)

To be precise, if $\gamma$ indicates the weighted alpha spending, and assume we have $k$ treatment variants and $m$ metrics, then the preferential Bonferroni method gives us $\gamma \frac{\alpha}{k}$-confidence intervals for the primary metrics ands $(1-\gamma)\frac{\alpha}{k (m-1)}$-confidence intervals for all other metrics.
The benefit of this approach over the classical Bonferroni correction is that the power to detect changes in the primary metric does not depend on how many other metrics are added to the experiment.

:::note
This setting is unavailable for [Bayesian analysis](/statistics/confidence-intervals/analysis-methods/#bayesian-analysis). As long as the prior is specified appropriately, Bayesian approaches do not suffer from the multiple testing problem: see [Gelman et al, _Why we (usually) don't have to worry about multiple comparisons_](https://arxiv.org/abs/0907.2478).
:::
