# Sticky assignments

:::note
Sticky assignments are currently in closed Beta
:::

Eppo offers sticky assignments in use cases when you want to keep experiment experiences consistent over a long period of time. This is particularly useful for retention focused experiments.

Experiments with sticky assignments have two periods: enrollment and evaluation. During the enrollment phase, all eligible users are assigned into the experiment. After enrollment ends, new users will no longer be assigned to the experiment. In this evaluation period, any previously enrolled users will remain assigned to their respective variations to keep the experience consistent for these users.

## How it works

Assignment behavior is determined by two attributes of the Experiment Allocation:
1. Enrollment - enrollment is determined by the status of the Experiment Allocation. If the Experiment Allocation is active, enrollment is active. If the Experiment Allocation is archived, enrollment is disabled.
2. Sticky status - sticky status is determined by the "sticky assignments" toggle on the Experiment Allocation. When the toggle is enabled, stickiness is enabled. When the toggle is disabled, stickiness is disabled.

Eppo will evaluate the state of the Experiment Allocation according to these attributes as follows:

| Enrolling? | Sticky? | Behavior |
|---|---|---|
| On | On | 1. Check onPreAssignment, if no record, evaluate hash randomization 2. Call onPostAssignment |
| On | Off | 1. Skip onPreAssignment 2. Evaluate hash randomization 3. Skip onPostAssignment |
| Off | On | 1. Call onPreAssignment, if no record for this user, continue to remaining allocation waterfall |
| Off | Off | 1. Pass through to remaining allocation waterfall |

By defining stickiness at the allocation level, you can continue to do up-stream overrides (e.g., adding new internal test users). In this case, the override would take priority over sticky assignments.

## Implementing a Sticky Experiment
To launch an experiment, toggle "sticky assignments" to enabled and save the Experiment Allocation. If you want to abort the test before reaching the enrollment target, disable the "sticky assignments" toggle and archive the allocation.

Once the enrollment goal has been reached, archive the Experiment Allocation. This will stop further enrollments and start the evaluation phase.

There are three scenarios in which you can roll out the experiment:
1. The test is a win >> roll out to all users - Add a rollout allocation above the sticky assignment allocation, disable "sticky assignments", and archive the Experiment Allocation
2. The test is a loss >> turn off for all users - disable "sticky assignments" and archive the Experiment Allocation
3. The test is probably a winner, but you want to keep observing metrics - add a rollout allocation below the Experiment Allocation.

