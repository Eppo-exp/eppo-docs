# Interpreting experiments

Once you have started to collect data on some experiments, you'll want to start
reviewing the results! Eppo allows you to see experiment results across multiple
experiments, zoom in on a specific experiment, estimate global impact, and then
slice and dice those results by looking at different segments and metric cuts.

## Viewing multiple experiments

When you click on the **Experiments** tab, you will see the **experiment list
view**, which shows all of your experiments. You can filter this list by
experiment name, status, entity, or owner, or just show experiments you have
**starred**.

[Screenshot TK]

## Overview of an experiment's results

Clicking on the name of an experiment will take you to the **experiment detail
view**, which shows the effects of each treatment variant, compared to control.
Within each variant, for each metric that [you have attached to the
experiment](../building-experiments/experiments/adding-metrics-to-experiment.md),
we display the _average (per subject) value for the control variant_, as well as
the estimate of the **relative lift** (that is, the percentage change from the
control value) caused by that treatment variant.

![Experiment overview](../../../static/img/building-experiments/experiment-overview.png)

In the example above, we see that the control value of [TK METRIC] is [TK], and
variant B is estimated to increase that by [TK]%. For [TK RATE METRIC], the
control value is [TK]%, because it has been set to display as a percentage, and
the lift is [TK]%: this means that the [TK] rate is *[TK]% higher than [TK]%*,
that is, [TK]%. If you hover over the lift, you can see the metric values for
both control and treatment variants, as well as the sum of the underlying
fact(s) and the number of subjects assigned to each variant.

![Metric hover](../../../static/img/building-experiments/metric-hover.gif)

:::info

In many cases (in particular, if [CUPED](./cuped) is enabled), the *estimated
lift* is not simply the difference between treatment and control expressed as a
percentage of the control—meaning the lift calculated from the values displayed
in this popover will not match the lift displayed in the UI. See [TK] for more
information on how we estimate lift in different circumstances.

:::

To the right, we display the estimated lift graphically as a black vertical bar,
as well as a **confidence interval** that shows the values of the lift that we
consider *plausible* given the observed data from the experiment. The precise
definition of *plausible* is determined by the **confidence level**, which
defaults to 95%: we set the lower and upper bounds of the confidence interval
such that the probability that the *true lift* lies within that range is at
least 95% (or whatever confidence level you've selected). In addition, Eppo has
several different
[methods for calculating the confidence intervals](confidence-intervals.md),
which can be set at the company- or experiment-level.

If you hover over the confidence interval, you will see the upper and lower
bounds for this confidence interval:

[TK CI hover example]

In this case, based on our statistical analysis of the experiment data, our best estimate of the lift
caused by this treatment is [TK]%, and we are 95% confident that the lift is between [TK]% and
[TK]%.[^1]

[^1]: For a precise technical definition of what it means to be "95% confident" here, see
[Lift Estimates and Confidence Intervals](./confidence-intervals.md)

If the confidence interval is entirely above or below zero, it means that the
data is consistent with the treatment moving the metric up or down,
respectively. In this case, the confidence interval bar itself, as well as the
lift estimate, will be highlighted <span class="positive-change-green-bg">green</span>
if the movement is *good* (in which case there will also be a
🎉 symbol in the lift estimate box), and <span class="negative-change-red-bg">red</span>
if the movement is *bad*.

:::info

In general, a positive lift will be *good* (colored green) and a
negative lift will be *bad* (colored red). However, for metrics such as page
load time or app crashes, a higher number is *bad*. If you've set the "Desired
Change" field in the fact definition to "Metric Decreasing", then positive lifts
will be in <span class="negative-change-red-bg">red</span> and negative lifts
will be in <span class="positive-change-green-bg">green</span>.

:::

The confidence level is set as part of the [analysis plan](analysis-plans.md),
and you can change the company-wide default on the
[**Admin** tab](../../administration/setting-statistical-analysis-plan-defaults.md)
or set an experiment-specific confidence level on the
[**Set Up** tab](../building-experiments/experiments/creating-experiments.md).
The confidence level being used for any experiment is displayed on the experiment
detail page below the table of metric results:

[TK text showing confidence level]

### Impact accounting

The main **Confidence intervals** tab displays the experiment results observed
*for subjects in the experiment*, but you may want to understand the treatment
effect *globally*; a large lift in an experiment that targets a tiny portion of
your users might have a negligible business impact.

You can click on the [**Impact accounting**](global-lift.md) icon [TK ICON] (to
the right of the **Decision Metrics** header) to show, for each metric, the
**coverage** (the share of all events that are part of the experiment) and
**global lift** (that is, the expected increase in the metric if the treatment
variant were rolled out to 100%, as a percentage of the global total metric
value).

![Toggle global lift](../../../static/img/building-experiments/toggle-global-lift.gif)

### Statistical details

In general, the confidence intervals will provide the information you need to
make a ship/no-ship decision. However, if you want to see additional statistical
details, you click on the **Statistical details** icon [TK ICON] to display
them. The actual values being shown will differ based on which [confidence
interval method] is being used.

[TK Statistical details]

## Segments and filters

You are able to filter experiment results to specific subgroups by selecting the filter menu at the top right corner. We provide two distinct options to filter results

### Segments

Segments are pre-specified subsets of users based on multiple attributes. For example, you might have a "North America mobile users", created by filtering for Country = 'Canada', 'USA', or 'Mexico', and Device = 'Mobile'. You can then attach such a segment to any experiment and Eppo pre-computes experiment results for such a subgroup.

Note that when you first add a segment to an experiment, you have to manually refresh the results to compute the results for the segment.

### Single dimension filter

For quick investigations, we also provide the single dimension filter: here you can select a single dimension (e.g. Country) and single value (e.g. 'USA'). These results are available immediately -- no need to manually refresh the results.

## Explores

You can also further investigate the performance of an individual metric by clicking on navigator icon the next to the metric name. This will take you to the [Metric explore](./exploring-metrics.md) page where you can further slice the experiment results by different dimensions that have been configured, for example user persona, or browser, etc.

![Dimension explore](../../../static/img/building-experiments/dimension-explore.gif)



