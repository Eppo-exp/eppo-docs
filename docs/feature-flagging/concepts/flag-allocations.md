---
sidebar_position: 1
---

# Flag allocations

Allocations govern how users get assigned to different variations of a feature flag in a flexible way.
An allocation is a logical grouping of [targeting rules](/feature-flagging/concepts/targeting) and variation weights associated with a flag.

Eppo supports two types of allocations: Feature Gates and Experiment allocations.

In Eppo, allocations are stacked in a vertical waterfall as seen below:

![Allocation waterfall](/img/feature-flagging/waterfall.png)

Here, there are two allocations:

- The first allocation is a feature gate that targets internal users, which are identified with by their email domain. If a user's email matches the criteria, they are show `Variant 1`. If not, they are moved along to the next allocation (i.e down the waterfall).
- The second allocation is an experiment allocation that targets users in North America using an iPhone. 50% of users who match this criteria see `Variant 1` and the remaining 50% of users see `Variant 2`. If users do no match, they are moved along. Since there are no more allocations to evaluate, all remaining users see the default value, which in this example is `Variant 1`.

Note that it is possible to reduce an allocation's traffic exposure to less than 100%. In this case, the allocation's rules are evaluated and then subsequently traffic exposure check is computed. Subjects that pass the rules test but fall outside the traffic exposure continue down the waterfall to the next rule.
