import GreenHighlight from '@site/src/components/GreenHighlight'
import RedHighlight from '@site/src/components/RedHighlight'
import Term from '@site/src/components/glossary/Term'
import Figure from '@site/src/components/Figure'
import Icon from '@site/src/components/Icon'

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

<Figure alt="Experiment list view" src="/img/interpreting-experiments/experiments-list-view.png">
   The experiment list view, showing a list of experiments that can be filtered and searched.
</Figure>

<!-- TODO: Discuss the experiment table view? -->

## Overview of an experiment's results

Clicking on the name of an experiment will take you to the
**experiment detail view**, which shows the effects of each treatment variation,
compared to control. Within each variation, for each metric that
[you have added to the experiment](../building-experiments/experiments/adding-metrics-to-experiment.md),
we display the (per subject) **average value for the control variation**, as well as
the estimate of the <Term def={true}>relative lift</Term> (that is, the percentage change
from the control value) caused by that treatment variation.

<Figure alt="Experiment details - overview" src="/img/interpreting-experiments/experiment-details-view.png">
   In this example, the control value of <code>Total Purchase Value</code> is
   &#8203;<b>15.63</b> (per subject), and variation B is estimated to increase that by <b>4.68%</b>.
   For <code>Add-to-Cart Conversion</code>, the control value is <b>55%</b>, because it has been set to
   display as a percentage, and the lift is <b>8%</b>: this means that the add-to-cart
   conversion rate that would be expected from shipping the treatment
   is <em>108% times the control rate of 55%</em>, that is, 59.4%.
</Figure>

If you hover over the lift, you can see the metric values for both control and
treatment variations, as well as the sum of the underlying fact(s) and the number
of subjects assigned to each variation.

<Figure caption="Experiment details - hovering over metric" src="/img/interpreting-experiments/experiment-details-view-hover.png" >
   In this example, the total purchase value <em>per assigned subject</em> is
   &#8203;<b>15.63</b> for control and <b>16.36</b> for treatment, and the total purchase
   value <em>acrosss all assigned subjects</em> is <b>812,884.95</b> for control
   and <b>851,526.71</b> for treatment.
   There are <b>52,004</b> subjects assigned to control, and <b>52,039</b> assigned to treatment.
</Figure>

:::caution

Depending on the metric settings, we may
[remove outliers](../building-experiments/metrics/creating-metrics.md#outlier-handling)
from the raw data in order to improve the quality of our lift estimates,
and so the average and total values displayed in this popover
might differ from those displayed in other tools.

In addition, in many cases (in particular, if
[CUPED](./lift-estimates-and-confidence-intervals/cuped.md) is enabled),
we perform additional processing on the data before estimating the lift
(such as correcting for imbalances across variations along different
dimensions). For this reason, the lift displayed on the details page
may not match the lift calculated directly from the numbers in this popover.

See [Basics of estimating
lift](./lift-estimates-and-confidence-intervals/index.md#estimating-lift)
for more information on how we estimate lift in different circumstances.

:::

To the right of the details page, we display the estimated lift graphically as a black vertical bar,
as well as a <Term def={true}>confidence interval</Term> that shows the values of the lift that we
consider plausible given the observed data from the experiment. The precise
definition of *plausible* is determined by, among other things,
the <Term def={true}>confidence level</Term>, which defaults to 95%: we set the lower and upper
bounds of the confidence interval such that it will contain the true lift
at least 95% (or whatever confidence level you've
selected) of the time.[^confident] In addition, Eppo has several different
[methods for calculating the confidence intervals](./lift-estimates-and-confidence-intervals/analysis-methods.md),
which can be set at the company or experiment level.

[^confident]: For more on how we define confidence intervals, how to interpret
  them, and a precise technical definition of what it means to be "X%
  confident", see
  [Lift estimates and confidence intervals](./lift-estimates-and-confidence-intervals/index.md).

:::tip Where does the uncertainty come from?

Randomly allocating users to each variation means that the lift we observe in
the experiment data should be a good estimate[^goodest] of the lift you would
observe if you shipped the treatment. However, any time you estimate something
for a whole population using measurements from just a *portion* of that
population (in this case, the subjects in the  treatment variation), there's a
risk that the sample you chose to observe behaves differently from the
population as a whole. Specifically, there's always a chance that a bunch of
really active subjects, instead of being evenly split across variations,
happened to end up concentrated in the control variation or the treatment
variation; that would mean that the lift you observed in the experiment would be
lower or higher, respectively, than what you'd observe if you shipped the
treatment. This is the uncertainty represented by the confidence
interval.[^uncertainty] (This is why 
[CUPED](./lift-estimates-and-confidence-intervals/cuped.md), which corrects some
of this imbalance, can often greatly reduce the width of the confidence intervals.)

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
    December might be different than those that were part of the experiment in June.

:::

If you hover over the confidence interval, you will see precise values for the
upper and lower bounds for this confidence interval:

<Figure alt="Hovering over confidence interval shows upper and lower bounds"
   src="/img/interpreting-experiments/experiment-details-confidence-interval-hover-highlight.png">
   <p>
      In this case, based on our statistical analysis of the experiment data, our best
      estimate of the lift caused by this treatment is <b>4.68%</b>, and we are 95% confident
      that the lift is between <b>1.76%</b> and <b>7.61%</b>. Since a lift of 0% does not fall within
      that range, the confidence interval is highlighted in <GreenHighlight>green</GreenHighlight>.
   </p><p>
   </p>
</Figure>

If the confidence interval is entirely above or below zero, it means that the
data is consistent with the treatment moving the metric up or down,
respectively. In this case, the confidence interval bar itself, as well as the
lift estimate, will be highlighted <GreenHighlight>green</GreenHighlight>
if the movement is *good* (in which case there will also be a
🎉 symbol in the lift estimate box), and <RedHighlight>red</RedHighlight>
if the movement is *bad*.

:::info Green/red means *good*/*bad* not *up*/*down*

In general, a positive lift will be *good* (colored <GreenHighlight>green</GreenHighlight>) and a
negative lift will be *bad* (colored <RedHighlight>red</RedHighlight>). However, for metrics such as page
load time or app crashes, a higher number is *bad*. We call
these <Term def={true}>reversed metrics</Term>. If you've set the "Desired Change" field in the
[fact definition](../building-experiments/definitions/fact-sql.md)
to "Metric Decreasing", then positive lifts
will be in <RedHighlight>red</RedHighlight> and negative lifts
will be in <GreenHighlight>green</GreenHighlight>.

:::

The confidence level is set as part of the [analysis plan](../planning-experiments/analysis-plans.md),
and you can change the company-wide default on the
[Admin tab](../../administration/setting-statistical-analysis-plan-defaults.md)
or set an experiment-specific confidence level on the
[experiment Set Up page](../building-experiments/experiments/creating-experiments.md#10-optional-the-statistical-analysis-plan).
The confidence level being used for any experiment is displayed on the experiment
detail page below the table of metric results:

<Figure
   alt="The confidence level is displayed at the bottom of the metric results table"
   src="/img/interpreting-experiments/experiment-details-confidence-level-highlight.png"
>
   The confidence level is displayed at the bottom of the metric results table.
</Figure>

### Impact accounting

The main **Confidence intervals** tab (<Icon src="/img/interpreting-experiments/confidence-intervals-icon.svg" />)
displays the experiment results observed *for subjects in the experiment*,
but you may want to understand the treatment effect *globally*; a large
lift in an experiment that targets a tiny portion of your users might have a
negligible business impact.

You can click on the [**Impact accounting**](./lift-estimates-and-confidence-intervals/global-lift.md) 
icon (<Icon src="/img/interpreting-experiments/global-lift-icon.svg" />)
to show, for each metric,
the <Term def={true}>coverage</Term> (the share of all events that are part of the
experiment) and <Term def={true}>global lift</Term> (the expected
increase in the metric if the treatment variation were rolled out to 100%, as a
percentage of the global total metric value).

<Figure
   alt="Switching to impact accounting view"
   src="/img/interpreting-experiments/experiment-details-global-impact.gif"
>
   In this example, the impact accounting view shows that, since the experiment has been
   active, only <b>81.8%</b> of <code>Total Upgrades to Paid Plan</code> events were done by subjects
   that had been assigned to any varaition in the experiment. This means that, while
   the lift <em>among subjects in the experiment</em> is <b>6.06%</b>, since 18.2% of
   events are done by subjects who would not have been affected by the treatment,
   the topline number of upgrades is only expected to go up by <b>4.93%</b>.
</Figure>

### Statistical details

In general, the confidence intervals will provide the information you need to
make a ship/no-ship decision. However, if you want to see additional statistical
details, you can click on the **Statistical details**
icon (<Icon src="/img/interpreting-experiments/statistical-details-icon.svg" />) to display
them. The actual values being shown will differ based on which 
[analysis method](./lift-estimates-and-confidence-intervals/analysis-methods.md)
is being used:
sequential and fixed-sample methods will show the frequentist statistics, while
Bayesian statistics will differ to reflect the different decision-making
processes compatible with that method.

<Figure alt="Switching to impact accounting view" src="/img/interpreting-experiments/experiment-details-statistical-details.gif">
   This example shows frequentist statistics, described in detail below.
</Figure>

#### Frequentist statistics

Frequentist analysis methods (that is, sequential and fixed-sample) will show
the following three statistics:

<!--
NB: We insert zero-width spaces &#8203; before each Term to fix a parsing issue with Docusaurus/MDX
See: https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability
-->

1. &#8203;<Term def={true}>Standard error</Term>: The [standard
   error](https://en.wikipedia.org/wiki/Standard_error) of the lift, expressed
   in percentage points.

2. &#8203;<Term def={true}>p-value</Term>: The [p-value](https://en.wikipedia.org/wiki/P-value) represents
   the likelihood that an A/A test (that is, an experiment where the treatment
   is identical to the control) would produce a lift of a magnitude (that is,
   ignoring the sign) at least as large as the one observed in the data. The
   p-value directly corresponds to the bounds of the confidence interval: if
   your confidence level is 95%, for example, a p-value less than 0.05 (that is,
   $1 - \frac{95}{100}$) means that the confidence interval around the lift will
   *just* exclude zero. 

3. &#8203;<Term def={true}>Z-score</Term>: Also called the [standard
   score](https://en.wikipedia.org/wiki/Standard_score), the Z-score represents
   how far away the observed lift is from zero, measured as a number of
   [standard deviations](https://en.wikipedia.org/wiki/Standard_deviation). The
   Z-score is simply a transformation of the p-value: it provides no additional
   information, but it is sometimes easier to use, particularly when the p-value
   is very small.

#### Bayesian statistics

[Bayesian methods](./lift-estimates-and-confidence-intervals/analysis-methods.md#bayesian-analysis)
rely on a different way of thinking about probabilities, and thus use different
statistics to summarize the results of an experiment. 

1. &#8203;<Term def={true}>Probability Beats Control</Term>: The probability that the treatment variation is
   superior to the control variation; in other words, the chance that the lift is good
   (positive for most metrics, but negative for <Term>reversed metrics</Term> (e.g. latency: lower latency is better)

2. &#8203;<Term def={true}>Probability Better Than MDE</Term>: Bayesian analyses comparing two
   distributions (in our case the average metric values in the treatment variation
   compared to the average metric values in the control variation) sometimes refer to the
   [<Term>Region of Practical Equivalence (ROPE)</Term>](https://journals.sagepub.com/doi/10.1177/2515245918771304), which is the amount of
   difference between the distributions that is, practically speaking, trivial.
   In other words, we might care not just about whether the treatment is
   strictly better than control, but whether it is better *enough* that the
   difference is meaningful (in business terms). Since the MDE represents the
   smallest lift that the business cares about, it is also a useful boundary for
   the ROPE.

   For example, if the MDE for a metric was a 5% lift, this statistic would
   calculate the portion of the posterior lift distribution that is *above* 5%
   (assuming positive lift is good).

3. &#8203;<Term def={true}>Risk</Term>: The *expected metric loss* (measured in lift
   terms, that is, as a percentage of the control value) *if* the lift were in
   fact negative (or, for reversed metrics, positive). In other words, even if
   the bulk of the distribution indicates that the treatment is better than
   control, some portion is going to be on the other side: there's some chance
   that in fact *control* is better than *treatment*. The risk measures, in that
   case, what the expected value (that is, the average of all lifts weighted by
   their likelihood under the posterior distribution) of the lift would be.
   
4. &#8203;<Term def={true}>Risk Control</Term>: The *expected metric loss* (measured in lift
   terms, that is, as a percentage of the control value) *if* the lift were in
   fact positive (or, for reversed metrics, negative) and we decide to choose the control variation.

## Segments and filters

You are able to filter experiment results to specific subgroups by selecting the
filter menu at the top right corner. We provide two distinct options to filter
results.

### Segments

Segments are pre-specified subsets of users based on multiple attributes. For
example, you might have a "North America mobile users", created by filtering for
Country = 'Canada', 'USA', or 'Mexico', and Device = 'Mobile'. You can then
attach such a segment to any experiment and Eppo pre-computes experiment results
for such a subgroup.

Note that when you first add a segment to an experiment, you have to manually
refresh the results to compute the results for the segment.

### Single dimension filter

For quick investigations, we also provide the single dimension filter: here you
can select a single dimension (e.g. Country) and single value (e.g. 'USA').
These results are available immediately -- no need to manually refresh the
results.

## Explores

You can also further investigate the performance of an individual metric by
clicking on navigator icon the next to the metric name. This will take you to
the [Metric explore](./exploring-metrics.md) page where you can further slice
the experiment results by different dimensions that have been configured, for
example user persona, or browser, etc.

<Figure alt="Dimension explore" src="/img/building-experiments/dimension-explore.gif" />



