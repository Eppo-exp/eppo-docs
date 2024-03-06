---
sidebar_position: 4
---

# Experiment assignment

Flags can be used to assign users into experiment buckets (i.e randomization) for A/B testing. Teams that use Eppo for assignments run their entire experimentation workflow through the tool.

## Create an experiment allocation

The begin, create an experiment allocation in your Feature Flag. An experiment allocation has a randomized traffic split needed to run an A/B or multi-variant test. You must select this type of allocation to run an experiment.

![Randomization 0](/img/feature-flagging/randomization-0.png)

Your flag must be active to start the experiment assignment.

## Create an experiment

Click "Create Experiment" on the experiment allocation to create an experiment. You can do this at any time, even after experiment assignment has begun.

![Randomization 1](/img/feature-flagging/randomization-1.png)

Once assignments have begun, they will need to be logged to your data warehouse to be analyzed by Eppo. All SDKs take in a callback function that is called with the assignment parameters (`subject_id`, `experiment_id`, `timestamp`, etc.) passed in when assignments are made. That function is completely managed by you - the only requirement is that the assignment data eventually makes it to your warehouse. 

Congratulations on setting up your first Eppo randomized experiment! Refer to our [analysis setup guide](/experiment-quickstart) to connect Eppo to your data warehouse and easily analyze the results.

## Creating multiple experiments on the same flag

For this example let’s use the following feature flag in Eppo. Right now there are 2 allocations:
- one is a feature gate that prioritizes sending any internal users to the treatment variation
- the second is an experiment allocation that evaluates whether the remaining users meet the audience criteria; if they do split them evenly between the control and treatment variations on 50% of the total traffic.

![Initial Allocation set up with one feature gate and one experiment](/img/feature-flagging/experiment-assignment/initial-experiment-allocation.png)

Before creating another experiment allocation on this flag, create a new variation by editing your feature flag and clicking ‘Add Variation’.

![Adding a variation to a feature flag](/img/feature-flagging/experiment-assignment/add-variation.png)

Once the new variation is added, go back to the feature flag overview page and create a new experiment allocation by clicking ‘Add Allocation’ and selecting ‘Experiment'.

After adding an additional Experiment Allocation, the allocation shows up on your Feature Flag overview page.

![Allocation setup with additional experiment](/img/feature-flagging/experiment-assignment/additional-experiment-allocation.png)

Right now this allocation logic splits the remaining users 50/50 into the second and third variations if those users do not qualify for the first 2 allocations. The priority of allocations can be reprioritized by clicking the gray side bar on the right hand side of the allocation and dragged and dropped into the new order. If one of the other experiments has been complete, the allocation can be archived by selecting the ‘bin’ icon on the right hand side of the allocation.

:::warning
Only reprioritize experiment or feature allocations when they are not running. Doing so while they are running may affect and invalidate experiment results.
:::

From a code perspective, all that is required to run multiple experiment allocations on the same flag is the initial Flag Key set when the feature flag was created—no code changes necessary. Continuing this example, this is the code required for this flag regardless of how many experiment allocations or feature gates are created:

```jsx
import * as EppoSdk from '@eppo/node-server-sdk';

const client = EppoSdk.getInstance();
const variation = client.getAssignment("<SUBJECT-KEY>", "winter-promo", attributes)
```


