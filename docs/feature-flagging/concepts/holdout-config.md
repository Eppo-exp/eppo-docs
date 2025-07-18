# Holdouts

Eppo's holdouts allows you to validate the aggregate impact of Experimentation.

This functionality offers the ability to set a holdout audience in feature flags that keeps an audience isolated from all active experiments, and measures metric changes for the holdout audience versus an audience that only experiences winning experiments.

The feature can be used with Eppo's SDK for an end-to-end managed experiment or in an [**Analysis-Only mode**](/experiment-analysis/holdouts) where you use an external randomization library.

Eppo offers both Global and Selective Holdouts for Holdouts created using the Eppo SDK.

## Using Eppo SDKs

Begin by [configuring your Assignment Source](/data-management/definitions/assignment-sql/#optional-columns-for-advanced-use-cases) to annotate your holdout columns.

### Journey of a holdout subject

Define one or more holdout groups with a relevant key and the desired active date range. You can have multiple holdout 
groups running at once (e.g., one for each team that runs experiments).

The holdout is randomly split into two groups:
* Status Quo: Subjects in this group will always see the default experience for any experiments that take place during the 
holdout period (holdout variation key `status_quo`)
* Winning Variants: Subjects in this group will see the winning variant of each experiment after it has been concluded and 
rolled out (holdout variation key `all_shipped_variants`)

![Creating a Holdout](/img/experiments/holdouts/holdouts-create-object.png)

### Holdout types
Eppo offers both Global and Selective Holdouts.

* Global Holdouts - all experiments that fall within the holdout assignment window are automatically included in the Holdout
* Selective Holdouts - experiments that fall within the holdout assignment window need to be selected to be part of the holdout when the experiment is created

### Assignment period

1. Experiment assignments are added to flags
2. When subjects are assigned to eligible experiments (more details below) with an active holdout, they may be part of 
a holdout group. Held out subjects will have the default experience and the SDK will return the default variation.

#### Experiment eligibility

* New experiment assignments that start and end within the holdout window are eligible to have the holdout applied
  * Any experiment assignment that was created before the holdout was created will not have a holdout applied, regardless of dates for holdout assignment
  * Experiment assignments that start after the holdout window will not have the holdout applied
* Experiments assignments that start during the holdout window but do not end in that time, will continue to have the 
holdout applied until the experiment ends
  * To include these experiments in the holdout _analysis_, you can extend the analysis end date beyond the holdout window end date

#### Concluding experiments

Once an experiment is complete and a winning variation is selected, all non-holdout users (variations and control) will receive it.
Held out users will either be assigned the status quo variation or the winning variation depending on which split of the
holdout they are a part of.

### Holdout analysis period

You can analyze the holdout by creating a holdout analysis.

![Creating a Holdout Analysis](/img/experiments/holdouts/holdouts-create-experiment.png)

* Any experiments with rolled out variations during the holdout will be included
* Experiments that are in progress will be added to the analysis automatically when winning variations are rolled out
* The analysis will evaluate the impact to the selected metrics on the held out subjects who received the winning
variations compared to those who received the status quo variations

### SDK behavior

Application developers do not need to make any changes to the SDK usage other than ensuring holdout information passed
to the assignment logger is properly sent to the warehouse.

![Data Flow](/img/experiments/holdouts/holdouts-data-flow.png)

### Changes to assignment logging

Subjects who are in hold out groups will always be assigned the status quo variation for any qualifying experiments that
are in progress. Assignment logging will use a holdout-specific assignment (allocation) and experiment keys so that it
doesn't interfere with the experiment analysis for subjects not being held out. These keys--passed as the `allocation` 
and `experiment` properties of the assignment event, are composite keys that end with the key of the applied holdout
(e.g., `homepage-experiment-holdout-2025Q1`)

Once the experiment concludes, if a variation is rolled out, then half of held out subjects--those bucketed into the winning 
variation split of the holdout group--will start being assigned the rolled out variation.

To facilitate analysis of the holdout group across _all_ qualifying rollouts, there is additional information that is 
included in the assignment event that is passed to the assignment logger:
* The holdout key - unique identifier for the holdout group
* The holdout variation - whether the subject is in the status quo (`status_quo`) or winning variation (`all_shipped`) 
split of the holdout

For example, in Python:
```python
class MyAssignmentLogger(AssignmentLogger):
    def log_assignment(self, event):
        print("Send to warehouse", { 
            'timestamp': event['timestamp'],
            'experimentKey': event['experiment'],
            'holdoutKey':  event['holdoutKey'], 
            'holdoutVariation': event['holdoutVariation'],
            # other fields from event as desired
        })
```

> **Note:** Some SDK implementations may nest the holdout information within an `extraLogging` field. If you don't see `holdoutKey` and `holdoutVariation` at the top level of the event, check for them in `event.extraLogging.holdoutKey` and `event.extraLogging.holdoutVariation`.

