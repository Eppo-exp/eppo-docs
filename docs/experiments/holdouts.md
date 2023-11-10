# Holdouts

**This is a beta feature.**

Eppo's Holdouts allows you to validate the aggregate impact of Experimentation.

This functionality offers the ability to set a holdout audience in feature flags that keeps an audience isolated from all active experiments, and measures metric changes for the holdout audience versus an audience that only experiences winning experiments.

The feature can be used with Eppo's SDK for an end-to-end managed experiment or in an [**Analysis-Only mode**](#analysis-only-holdouts) where you use an external randomization library.

## Using Eppo SDKs

Begin by [configuring your Assignment Source](/data-management/definitions/assignment-sql) to annotate your holdout columns.

### Journey of a Holdout user

Define one or more holdout groups with a relevant key and the desired active date range. You can have multiple holdout groups running at once (e.g one for each team that runs experiments).

The holdout is split into two groups: `status quo` who always see the control experience, and `winning variants` who see the treatment from experiments that are rolled out.

![Creating a Holdout](/img/experiments/holdouts/holdouts-create-object.png)

### Assignment period

1. Create experiments on your own schedule.
2. When subjects are assigned to eligible experiments (more details below) with an active Holdout, 
Eppo's SDK may assign them to a `holdout` group. The assignments `control` and `holdout` should lead to the same end user experience.
For this cohort the SDK will return the `control` variation.

*Eligible experiments*

* Any experiment allocation that starts after the start date will have a holdout applied.
* Any experiment allocations that starts after the end date will not have a holdout applied
* Experiments allocation that start during the assignment window but do not end in that time, will have the holdout applied but not included in the analysis. In this case some traffic is wasted.

3. Once an experiment is complete and a winning variation is selected, all non-holdout users (variations and control) will receive it. Users will now either get assigned the winning variant or `holdout`.
4. Run as many experiments as you want by repeating these steps.

### Evaluation period

You may begin an analysis at the conclusion of your desired assignment period by creating a Holdout Experiment.

![Creating a Holdout Experiment](/img/experiments/holdouts/holdouts-create-experiment.png)

1. The evaluation is ongoing and newly shipped winning variations will be added to it automatically.
2. For that holdout group, after the evaluation period finishes, end the holdout group. 
3. A report can now be generated reflecting data from the evaluation period showing how the holdout group did against users who saw all experiment winners.

### SDK Behavior

Application developers should expect no changes to the SDKs.

For the correctness of Holdout Analysis to take place, the experience of
subjects assigned to a Holdout should match those in the `control` of each 
experiment during the enrollment phase.

When invoking the `get*Assignment` methods with a subject and flag keys,
subjects assigned to a Holdout will have the `control` variation returned.
This makes it foolproof to design your User Experience without worrying
about handling a special case.

![Data Flow](/img/experiments/holdouts/holdouts-data-flow.png)

### Changes to assignment logging

The callback function is augmented with a `holdout` value if the `subject`
was assigned to one. This should be transmitted to your Data Warehouse
to faciliate filtering and computation of lifts.

An example in GoLang:

```go
import (
  "gopkg.in/segmentio/analytics-go.v3"
)

...

type ExampleAssignmentLogger struct {}

func (al *ExampleAssignmentLogger) LogAssignment(event eppoclient.AssignmentEvent) {
    client.Enqueue(analytics.Track{
        UserId: event.Subject,
        Event:  "Eppo Randomization Event",
        HoldoutKey: event.Holdout
    })
}
```

## Analysis-Only Holdouts

If your Holdouts are deployed by an external randomization library and you are not using Eppo's feature flags, please refer to this section.

Eppo enables you to bring your own Holdouts and provides a full-featured analysis of that Holdout on key metrics.

### Assignment setup

While Eppo is flexible to how you configure Holdouts on your end, we recommend you setup your Holdouts in the following fashion:
* There should be two variants: `status_quo` and `winning_variants`
* Traffic should be evenly split between these variants within your withheld traffic group
* Users in `status_quo` should always see the control experience until the holdout is released
* Users in `winning_variants` should be exposed to the winning variant of each experiment after it has been concluded and rolled out

Ensure you are logging exposure to the holdout and each variant in an Assignment Source. Eppo requires the following information:
*  An `experiment key` which is the name of the Holdout the user is enrolled in
*  The `variant` name that the user is enrolled in for the applicable Holdout

With this setup, Holdouts will be logged with Experiments in AssignmentSQL that is setup in Eppo.

![Verify assignment source](/img/experiments/holdouts/standalone-assignment-sql.png)

### Configuring a Holdouts Analysis

Create a new Holdout experiment over your desired date range by clicking on the "+Experiment" button on the Experiments tab.

Configure the analysis with the variation names in your holdout, such as `status_quo` and `winning_variants`.  This allows the Eppo generated SQL to correctly query the data in your warehouse.

![Configure variations](/img/experiments/holdouts/standalone-variations.png)

You are able to link experiments to your holdout to provide a comprehensive report of how each experiment impacted the primary Holdout metric and show the experience provided by the winning variants. To do so, go to the Overview tab and add Experiments that are part of the Holdout. Note that these experiments must be configured in Eppo to be linked.

![Create a stand-alone analysis](/img/experiments/holdouts/analysis-only-setup1.png)

## Holdout Analysis

Regardless of whether you use Eppo's SDK or your own, the artifact will be a report detailing impact of the holdout variation over the control,
with annotations display the shipped experiments.

Lift on the primary metric will be computed across the winning variants comparing the holdout subjects against everyone else.

![View Holdout Report](/img/experiments/holdouts/holdouts-report.png)

