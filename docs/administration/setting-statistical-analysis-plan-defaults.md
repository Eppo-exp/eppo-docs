# Setting Statistical Analysis Plan Defaults for Experiments

## What is the Statistical Analysis Plan?

The Statistical Analysis Plan determines the statistical methods used to analyze your experiments.
In particular, you can set company-wide defaults for the following settings:

- **Confidence Interval Method**: Sequential, Fixed Sample, Bayesian
- **Confidence Level**: The percent of time the confidence interval contains the true lift
- **Desired Power (for the progress bar)**: The percent of the time the minimum effect size will be detected, assuming it exists.
- **Multiple testing correction**: When enabled, Eppo will apply a preferential Bonferroni correction to adjust the confidence intervals for multiple metrics and variations. This results in wider intervals and reduces the likelihood of false positives at the cost of increased false negatives.

Each of these can be overridden for individual experiments, if need be. For more
on what each setting is and how to choose the right settings, see
[Analysis Plans](../experiments/analysis-plans.md).

### Experiment Progress Settings

#### Setting a minimum threshold for experiments

When enabled, this setting cannot be overriden on individual experiments. When enabled, experiments must meet both a minimum duration (days run) and sample size requirement before the experiment’s progress will be displayed.

This is to help prevent premature stopping and decisions on experiments.
![Minimum Threshold](/img/administration/min-threshold-admin-setting.png)

## How to Change the Defaults

You can define the defaults for the statistical methods used for experiments
across Eppo by going to **Admin > Settings > Statistical Analyis Plan**.

The settings defined at the Admin level will be the company-wide defaults for
any “draft”, “running”, and “wrap up” experiments that have not opted out of
using the defaults. Individual experiments can choose to opt out of the
company-wide defaults and use different settings. See how to set the
[statistical analysis plan at the experiment level](../experiments/creating-experiments.md#analysis-plan-settings).

![Minimum Threshold](/img/administration/company-analysis-plan.gif)
