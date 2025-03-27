---
sidebar_position: 3
---

# Flag scheduling and rollouts

In Eppo, you can create a rollout schedule for feature gates and experiment assignments on flags. This is helpful in cases where you want to perform a slow rollout to monitor performance metrics and reduce risk.

To add a rollout schedule:
1. In a flag, create a Feature Gate or Experiment Assignment
2. Under "Traffic Exposure & Weights" choose "Schedule automated rollouts in phases". As a default the flag will rollout to the selected traffic exposure when the flag is enabled.
![ROllout options under Traffic Exposure](/img/feature-flagging/rollouts/rollout-percentage.png)
3. Set the phases of the rollout. Each phase is a set date, time, and traffic percentage. The rollout will be at 0% until Phase 1's scheduled datetime.
![Setting the phases of a rollout](/img/feature-flagging/rollouts/rollout-phases.png)

When set, the schedule will be displayed on the Flag detail page along with any action that should be taken. For example, if the flag is disabled, we message that the flag should be enabled prior to rollout.
![Flag with a rollout scheduled](/img/feature-flagging/rollouts/rollout-flag-details.png)

Hovering over the schedule also provides the details of the schedule at a glance.
![Phases of the rollout shown on hover](/img/feature-flagging/rollouts/rollout-phases-hover.png)


Schedules can be edited or removed. To do so, edit the flag and change settings as you like.