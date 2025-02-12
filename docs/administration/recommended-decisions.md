# Recommended Decision Defaults

The decision criteria aligns the team around a ship decision based on the measurement of the primary and [guardrail](/data-management/organizing-metrics/guardrails) metrics set in experiments. This recommendation will appear on the experiment when the experiment end date is reached or if the primary or guardrail metrics have achieved an outcome that is statistically significant.

The default decisions for Standard and Non-Inferiority tests can be set it the Admin menu by clicking on the `Recommended Decisions` tile in Admin.

![The Recommended Decision tile in Admin](/img/administration/recommended-decision-tile.png)

:::note
The recommended decision defaults can be overwritten based on the Experiment Protocol selected or edited with individual experiments.
:::

## Recommended Decision options

Recommended decisions include:
* Roll out winning variant - Ship the variant that performed the best compared to the control
* Extend run time - Continue running the experiment to reach more precision
* Discuss with stakeholders - Discuss the results with stakeholders to determine the best course of action
* Do not roll out - Roll back to the control and turn off the treatment variant(s)

## Standard Experiment Default Recommended Decisions

In this first step, you can define the recommended decisions for all possible experiment outcomes when using a Sequential confidence interval method.

If the confidence interval method for an experiment is set to Fixed Sample or Sequential Hybrid, any default recommendation set to ‘Extend Run Time’ will automatically change to ‘Discuss with Stakeholders.’ This is because these methods require a fixed run time to be determined before the experiment begins.

![The Standard Experiment Recommended Decision page](/img/administration/standard-default-decision.png)

## Non-Inferiority Experiment Default Recommended Decisions

A non-inferiority test is used to determine whether a new treatment is not significantly worse than an existing one, within a predefined acceptable cutoff. In this context, the primary and guardrail metrics should remain within the acceptable risk threshold defined by this cutoff.

For Non-Inferiority tests, define the recommended decisions for all possible experiment outcomes when using a Sequential confidence interval method defined in the Statistical Analysis Plan.

If the confidence interval method for an experiment is set to Fixed Sample or Sequential Hybrid, any default recommendation set to ‘Extend Run Time’ will automatically change to ‘Discuss with Stakeholders.’ This is because these methods require a fixed run time to be determined before the experiment begins.

![The Non-Inferiority Experiment Recommended Decision page](/img/administration/non-inferiority-default-decision.png)





