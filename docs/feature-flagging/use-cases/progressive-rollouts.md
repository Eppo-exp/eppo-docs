---
sidebar_position: 5
---

# Progressive rollouts

Flags, both feature gates and experiments, can be used to progressively roll out features to larger and larger audiences to ensure that the new code doesn't contain bugs or have unintended consequences on your system.

## Feature gates

### Allow list rollout

In the B2B case it's common to rollout new features by account. This can be done by adding account IDs to an ever growing allow list in a single allocation for a flag:

![Company allow list](/img/feature-flagging/company-allow-list.png)

### Percentage rollout

For consumer facing companies it's common to rollout new features by population percent. This can be done by starting the `Traffic Exposure` setting on an allocation to a small number, monitoring the feature, then slowly increasing
that percentage over time:

![Percentage rollout 1](/img/feature-flagging/percentage-rollout-1.png)

![Percentage rollout 2](/img/feature-flagging/percentage-rollout-2.png)

In this example, the flag is rolled out to 20% of all users, a number that can be increased gradually. Note that as the percentage grows, no users will ever be reassigned.

## Experiments

The same pattern works for experiments

### Allow list for internal testers

When writing the code for an experiment, many product teams prefer to test the feature first themselves, or on their colleagues, to make sure there’s no bugs that passed code review and the staging environment. A common pattern is to have a feature gate for some or all employees before the experiment allocation.

![Employee allocation](/img/feature-flagging/employee-allocation.png)

### Percentage exposure rollout

When rolling-out an experiment, a common pattern is to only allocate 5% of the traffic to Treatment first, to minimize risk. That would imply to have 95% of the traffic to Control. If you want to increase the exposure to treatment to 20 or 50%, you will have to reallocate users from Control to Treatment. That would create mixed exposures and inconsistent allocations. Alternatively, you can also exclude the initial weeks of your experiment, loosing some insights. This is why Eppo considers this an anti-pattern.

Instead we recommend that you have a fair split between Control and Treatment, so 5% and 5% in that case, and that you consider the remaining 90%, **excluded from the allocation** and not part of the experiment for now. When you increase the exposure from 10% to 40% or 100%, you won’t have to exclude your initial test data, and the same test can continue as it is.

![Percentage rollout_experiment_1](/img/feature-flagging/percentage-rollout-experiment-1.png)

![Percentage rollout_experiment_2](/img/feature-flagging/percentage-rollout-experiment-2.png)

![Percentage rollout_experiment_3](/img/feature-flagging/percentage-rollout-experiment-3.png)

 As the percentage grows, no users will be reassigned.
