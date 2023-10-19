# Holdouts

**This is a beta feature.**

Eppo's Holdout Analysis allows your company to validate the impact of Experimentation.

This functionality offers the ability to set a holdout audience in feature flags that keeps an audience isolated from all active experiments, 
and measures metric changes for the holdout audience versus an audience that only experiences winning experiments.

## Journey of a Holdout user

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

![View Holdout Report](/img/experiments/holdouts/holdouts-report.png)

## SDK Behavior

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

## Experiment Analysis

Experiments during the enrollment period will proceed like normal on Eppo, 
with the only divergency being that subjects logged with a `holdout` key  being omitted.

## Holdout Analysis

Lift on the primary metric will be computed across the winning variants comparing the holdout subjects against everyone else.
