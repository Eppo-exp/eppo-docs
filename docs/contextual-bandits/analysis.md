---
sidebar_position: 3
---
# Measuring Performance

Eppo makes analyzing the performance of the contextual bandit easy by deploying bandits directly from feature flags. This also allows for gradual rollouts of bandits.

:::info 
The contextual bandit analysis is focused on comparing the performance of the bandit to a control group,
rather than comparing the performance of specific actions to one another.
Because the bandit personalizes actions, the distribution of subjects that each action sees is different. 
This makes a comparison between actions less meaningful.
:::

## Analysis allocation

To create a bandit analysis, first create a Bandit Analysis Allocation.
In this allocation, we divert some traffic, similar to a holdout group, and split subjects between two groups:
- The control group sees the status quo experience that you control. This could be as simple as a fixed action, or as complicated as an in-house recommender system.
- The bandit group does see actions taken by the bandit, but the data from these subjects is not used in bandit training. This ensures independence between subjects in this group and therefore statistical validity.

![bandit experiment allocation](/img/contextual-bandits/bandit-experiment-allocation.png)

## Creating an experiment

Creating experiment based on this bandit analysis is identical to creating a [regular experiment from a feature flag](/feature-flagging/concepts/experiment-assignment).
Once the experiment is created, the held-out bandit and control groups are compared in an A/B experiment.

![Bandit experiment analysis](/img/contextual-bandits/bandit-analysis.png)

