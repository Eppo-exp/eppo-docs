# Holdouts

## Journey of a Holdout user

1. Define one or more holdout groups. At a minimum give each a name and a percent. You can have multiple holdout groups running at once (e.g one for each team that runs experiments).

![Creating a Holdout](/img/experiments/holdouts/holdouts-docs-setup1.png)

2. Create experiments on your own schedule.
3. When subjects are assigned to experiments whose dates overlap with an active Holdout, 
they may be assigned to a `holdout` group. The assignments `control` and `holdout` should lead to the same end user experience.
For this cohort the SDK will return the `control` variation.
4. Once an experiment is complete and a winning variation is selected, all non-holdout users (variations and control) will receive it. Users will now either get assigned the winning variant or `holdout`.
5. Run as many experiments as you want by repeating steps 2-4.

### Evaluation period

You may begin an analysis anytime by creating a Holdout Experiment.

![Creating a Holdout Experiment](/img/experiments/holdouts/holdouts-create-an-experiment.png)

1. While the evaluation is ongoing, newly shipped winning variations will be added to it automatically.
7. For that holdout group, after the evaluation period finishes, end the holdout group and dismantle the experiments in the group. 
8. A report can now be generated reflecting data from the evaluation period showing how the holdout group did against users who saw all experiment winners.

![View Holdout Report](/img/experiments/holdouts/holdouts-view-report.png)

## SDK Behavior

Application developers should expect no changes to the SDKs.

For the correctness of Holdout Analysis to take place, the experience of
subjects assigned to a Holdout should match those in the `control` of each 
experiment during the enrollment phase.

When invocating the `get*Assignment` methods with a subject and flag keys,
subjects assigned to a Holdout will have the `control` variation returned.
This makes it foolproof to design your User Experience without worrying
about handling a special third case.

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
with the only divergency being that subjects logged with a `holdout` key 
being omitted.

## Holdout Analysis

Lift on the primary metric will be computed across the winning variants comparing the holdout subjects against everyone else.
