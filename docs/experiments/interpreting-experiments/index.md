import GreenHighlight from '@site/src/components/GreenHighlight'
import RedHighlight from '@site/src/components/RedHighlight'
import Term from '@site/src/components/glossary/Term'

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

Clicking on the name of an experiment will take you to the
**experiment detail view**, which shows the effects of each treatment variant,
compared to control. Within each variant, for each metric that
[you have attached to the experiment](../building-experiments/experiments/adding-metrics-to-experiment.md),
we display the *average (per subject) value for the control variant*, as well as
the estimate of the <Term def={true}>relative lift</Term> (that is, the percentage change
from the control value) caused by that treatment variant.

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

In many cases (in particular, if [CUPED](./lift-estimates-and-confidence-intervals/cuped.md) is enabled), the *estimated
lift* is not simply the difference between treatment and control expressed as a
percentage of the control—meaning the lift calculated from the values displayed
in this popover will not match the lift displayed in the UI. See [TK] for more
information on how we estimate lift in different circumstances.

:::

To the right, we display the estimated lift graphically as a black vertical bar,
as well as a <Term def={true}>confidence interval</Term> that shows the values of the lift that we
consider *plausible* given the observed data from the experiment. The precise
definition of *plausible* is determined by, among other things,
the <Term def={true}>confidence level</Term>, which defaults to 95%: we set the lower and upper
bounds of the confidence interval such that the probability that the *true lift*
lies within that range is at least 95% (or whatever confidence level you've
selected). In addition, Eppo has several different
[methods for calculating the confidence intervals](./lift-estimates-and-confidence-intervals/analysis-methods.md),
which can be set at the company- or experiment-level.

:::tip Where does the uncertainty come from?

Randomly allocating users to each variant means that the lift we
observe in the experiment data should be a good estimate[^goodest] of the lift you would
observe if you shipped the treatment. However, any time you estimate something
for a whole population using measurements from just a *portion* of that population
(in this case, the treatment variant), there's a risk that the sample you chose
to observe behaves differently from the population as a whole.
This is the uncertainty represented by the confidence interval.[^uncertainty]

[^goodest]: In technical terms, it is *consistent*, meaning that it gets closer
    to the true lift as the number of subjects in the experiment increases.
[^uncertainty]: Note that there are other sources of uncertainty that are *not* included
    in how the confidence interval is calculated. For example, if you start your
    experiment in June, but don't ship it until December, the behavior of users
    after being exposed to the treatment in production may be very different from
    the behavior observed during the experiment: there may be seasonal differences
    in how users react to the treatment, perhaps; there may be external
    circumstances (like trends, or different economic conditions) that have changed
    and affect how users react to the treatment; or (especially if your product is
    growing and adding more and more users) the *users* that use the product in
    December might be different than those that were part of the experiment.

:::

If you hover over the confidence interval, you will see precise values for the
upper and lower bounds for this confidence interval:

[TK CI hover example]

In this case, based on our statistical analysis of the experiment data, our best
estimate of the lift caused by this treatment is [TK]%, and we are 95% confident
that the lift is between [TK]% and [TK]%.[^confident]

[^confident]: For a precise technical definition of what it means to be "95%
   confident" here, see [Lift Estimates and Confidence Intervals](./lift-estimates-and-confidence-intervals/index.md)

If the confidence interval is entirely above or below zero, it means that the
data is consistent with the treatment moving the metric up or down,
respectively. In this case, the confidence interval bar itself, as well as the
lift estimate, will be highlighted <GreenHighlight>green</GreenHighlight>
if the movement is *good* (in which case there will also be a
🎉 symbol in the lift estimate box), and <RedHighlight>red</RedHighlight>
if the movement is *bad*.

:::info

In general, a positive lift will be *good* (colored green) and a
negative lift will be *bad* (colored red). However, for metrics such as page
load time or app crashes, a higher number is *bad*. We call these
<Term def={true}>reversed metrics</Term>. If you've set the "Desired Change" field in the
[fact definition](../building-experiments/definitions/fact-sql.md)
to "Metric Decreasing", then positive lifts
will be in <RedHighlight>red</RedHighlight> and negative lifts
will be in <GreenHighlight>green</GreenHighlight>.

:::

The confidence level is set as part of the [analysis plan](../planning-experiments/analysis-plans.md),
and you can change the company-wide default on the
[**Admin** tab](../../administration/setting-statistical-analysis-plan-defaults.md)
or set an experiment-specific confidence level on the
[**Set Up** tab](../building-experiments/experiments/creating-experiments.md#10-optional-the-statistical-analysis-plan).
The confidence level being used for any experiment is displayed on the experiment
detail page below the table of metric results:

[TK text showing confidence level]

### Impact accounting

The main **Confidence intervals** tab [TK ICON] displays the experiment results observed
*for subjects in the experiment*, but you may want to understand the treatment
effect *globally*; a large lift in an experiment that targets a tiny portion of
your users might have a negligible business impact.

You can click on the [**Impact accounting**](./lift-estimates-and-confidence-intervals/global-lift.md) icon [TK ICON] (to
the right of the **Decision Metrics** header) to show, for each metric, the
<Term def={true}>coverage</Term> (the share of all events that are part of the
experiment) and <Term def={true}>global lift</Term> (that is, the expected
increase in the metric if the treatment variant were rolled out to 100%, as a
percentage of the global total metric value).

![Toggle global lift](../../../static/img/building-experiments/toggle-global-lift.gif)

### Statistical details

In general, the confidence intervals will provide the information you need to
make a ship/no-ship decision. However, if you want to see additional statistical
details, you can click on the **Statistical details** icon [TK ICON] to display
them. The actual values being shown will differ based on which 
[analysis method](./lift-estimates-and-confidence-intervals/analysis-methods.md)
is being used:
sequential and fixed-sample methods will show the frequentist statistics, while
Bayesian statistics will differ to reflect the different decision making
processes compatible with that method.

### Frequentist statistics

Frequentist analysis methods (that is, sequential and fixed-sample) will show
the following three statistics:

<!-- TK: Something is going on with Term when it's the beginning of a line -->

1. <Term def={true}>Standard error</Term>: The [standard
   error](https://en.wikipedia.org/wiki/Standard_error) of the lift, expressed
   in percentage points.

2. <Term def={true}>p-value</Term>: The [p-value](https://en.wikipedia.org/wiki/P-value) represents
   the likelihood that an A/A test (that is, an experiment where the treatment
   is identical to the control) would produce a lift of a magnitude (that is,
   ignoring the sign) at least as large as the one observed in the data. The
   p-value directly corresponds to the bounds of the confidence interval: if
   your confidence level is 95%, for example, a p-value less than 0.05 (that is,
   $1 - \frac{95}{100}$) means that the confidence interval around the lift will
   *just* exclude zero. 

3. <Term def={true}>Z-score</Term>: Also called the [standard
   score](https://en.wikipedia.org/wiki/Standard_score), the Z-score represents
   how far away the observed lift is from zero, measured as a number of
   [standard deviations](https://en.wikipedia.org/wiki/Standard_deviation). The
   Z-score is simply a transformation of the p-value: it provides no additional
   information, but it is sometimes easier to use, particularly when the p-value
   is very small.

### Bayesian statistics

1. <Term def={true}>Probability Beats Control</Term>: The probability that the treatment variant is
   superior to the control variant; in other words, the chance that the lift is good
   (positive for most metrics, but negative for [reversed metrics])

2. <Term def={true}>Probability Better Than MDE</Term>: Bayesian analyses comparing two
   distributions (in our case the average metric values in the treatment variant
   compared to the average metric values in the control variant) sometimes refer to the
   [<Term>Region of Practical Equivalence (ROPE)</Term>](LINK TK), which is the amount of
   difference between the distributions that is, practically speaking, trivial.
   In other words, we might care not just about whether the treatment is
   strictly better than control, but whether it is better *enough* that the
   difference is meaningful (in business terms). Since the MDE represents the
   smallest lift that the business cares about, it is also a useful boundary for
   the ROPE.

   For example, if the MDE for a metric was a 5% lift, this statistic would
   calculate the portion of the posterior lift distribution that is *above* 5%
   (assuming positive lift is good).

3. <Term def={true}>Risk</Term>: The *expected metric loss* (measured in lift
   terms, that is, as a percentage of the control value) **if** the lift were in
   fact negative (or, for reversed metrics, positive). In other words, even if
   the bulk of the distribution indicates that the treatment is better than
   control, some portion is going to be on the other side: there's some chance
   that in fact *control* is better than *treatment*. The risk measures, in that
   case, what the expected value (that is, the average of all lifts weighted by
   their likelihood under the posterior distribution) of the lift would be.

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



