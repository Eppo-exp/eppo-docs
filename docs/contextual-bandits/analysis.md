# Contextual Bandit Analysis

We want to make sure that analyzing the performance of the contextual bandit is as easy and powerful as creating a regular experiment from a feature flag.
Therefore, we deploy the bandit directly from a feature flag, which also allows for a gradual rollout.

:::info 
The contextual bandit analysis is focused on comparing the performance of the bandit to a control group,
rather than comparing the performance of specific actions to each other.
Because the bandit personalizes actions, the distribution of subjects that each action sees is different. 
This makes a comparison between actions less meaningful.
:::

## Analysis allocation

To create a bandit analysis, first we create a Bandit Analysis Allocation.
In this allocation, we divert some traffic, similar to a holdout group, and split subjects between two groups:
- The control group sees the status quo experience that you control. This could be as simple as a fixed action, or as complicated as an in-house recommender system.
- The bandit group does see actions taken by the bandit, but the data from these subjects is not used in bandit training. This ensures independence between subjects in this group and therefore statistical validity.

![bandit experiment allocation](/img/contextual-bandits/bandit-experiment-allocation.png)

## Creating an experiment

Create experiment based on this bandit analysis is identical to creating a [regular experiment from a feature flag](/feature-flagging/experiment-assignment).

