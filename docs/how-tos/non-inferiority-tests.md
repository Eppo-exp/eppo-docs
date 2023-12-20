# Running Non-inferiority Tests

This How To guide walks you through how to run non-inferioirty tests in Eppo. This evaluation allows you to measure that a new treatment is not significantly worse than an existing or standard treatment in terms of effectiveness or safety.

## Analysis

For this guide, we assume that the way you run the non-inferiority analysis is by running a one-sided hypothesis test on whether the impact is at worst $-c$%, where $c>0$ is your inferiority tolerance. The closer $c$ it is to $0$, the stricter your test is; basically you need stronger evidence of before you call a test non-harmful.

The **left endpoint of the confidence interval in Eppo** has the same information as the non-inferiority test at **half the confidence level ($\alpha$)**.
- To perform the test in Eppo, visually check that the left side of the confidence interval is higher than your non-inferiority tolerance. If it's higher than the tolerance, then you can call the experiment non-harmful. If it's lower than the tolerance, then you don't have enough data to call it non-harmful.
  - If the right endpoint is lower than $0$, then you can say the test is harmful. Note that with a permissive tolerance and high statistical power, both of these may happen at the same time!
  - For metrics where lower is better, flip everything above. You'll compare the right endpoint to a threshold above 0.
- If want to run your non-inferiority test with $\alpha=0.025$, then Eppo's confidence interval with the default of $\alpha=0.05$ will be what you want. If you are using a one-sided test with $\alpha=0.05$, then you would have to set the $\alpha=0.1% in Eppo to get the same results.

## Example

![Example experiment.png](/img/how-tos/Example-experiment.png)

In this example experiment, you might want to do a non-inferiority test on "Total revenue". Let's say you're willing to move forward as long as the impact is no worse than %c=-5%%. You see that the left side of the confidence interval is %-4.40%%, so you can reject the null hypothesis, aka declare that the test caused no harm. If instead you had a stricter threshold of $c=-3%%, you wouldn't have enough evidence (at that sample size) to make the call that the treatment caused no harm.
