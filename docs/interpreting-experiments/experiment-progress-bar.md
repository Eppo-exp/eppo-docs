# Experiment Progress Bar

#### Minimum Detectable Effect
The progress of an experiment is measured with respect to the minimum detectable effect (MDE). This is the minimum effect the experimenter is interested in being able to detect and can be set at the metric level.

**Note:** A small MDE requires the experiment to run much longer to collect sufficient data.

### Progress Bar
Each experiment has an associated progress bar at the top. The goal of the progress bar is to measure whether we have gathered sufficient data to detect a lift of the primary metric by the MDE with high probability.

To view the progress bar, you must first navigate to the **Experiments** tab from the left panel. The progress bar can be seen in the list item card for each experiment in the experiment list. It can also be seen in the right panel if you click the card. Hovering over the progress bar shows you more details like the % lift that can be detected with the assignments seen so far.

![Completed progress bar](../../../../static/img/measuring-experiments/completed-progress-bar.png)

You can also see the progress bar on the details page for each experiment.

![Running progress bar](../../../../static/img/measuring-experiments/running-progress-bar.png)

**Note:** We compute the days remaining using a linear interpolation. This interpolation does not take into account that gathering data usually slows down during an experiment, and so the estimate may be optimistic, especially in the early days of an experiment.

#### How we calculate the progress
Because we use sequential analysis to produce confidence intervals, this is not straightforward and we resort to the following heuristic: the current detectable effect (CDE) is computed by multiplying the confidence bound by $\frac{z_{1-\alpha/2} + z_{\text{power}}}{z_{1-\alpha/2}}$, where $z_x = \Phi^{-1}(x)$ corresponds to the inverse CDF evaluated at $x$, where we use 80% power by default. This bound is exact when running a Z-test with 80% power [reference](http://www.stat.columbia.edu/~gelman/stuff_for_blog/chap20.pdf).

We then define progress as $\text{Progress} = \left(\frac{\text{MDE}}{\text{CDE}}\right)^2$. The square comes from the fact that if we want to detect an effect twice as small, we need roughly 4 times more data.
