---
sidebar_position: 1
---

# Flag allocations

Allocations govern how users get assigned to different variations of a feature flag in a flexible way.
An allocation is a logical grouping of [targeting rules](/feature-flagging/concepts/targeting) and variation weights associated with a flag.

Eppo supports two types of allocations: [Feature Gates](/feature-flagging/concepts/feature-gates/) and [Experiment assignment](/feature-flagging/concepts/experiment-assignment/) allocations.

In Eppo, allocations are stacked in a vertical waterfall as seen below:

![Allocation waterfall](/img/feature-flagging/waterfall.png)

Here, there are two allocations:

-   The first allocation is a feature gate that targets internal users, which are identified with by their email domain. If a user's email matches the criteria, they are show `Variant 1`. If not, they are moved along to the next allocation (i.e down the waterfall).
-   The second allocation is an experiment allocation that targets users in North America using an iPhone. 50% of users who match this criteria see `Variant 1` and the remaining 50% of users see `Variant 2`. If users do no match, they are moved along. Since there are no more allocations to evaluate, all remaining users see the default value, which in this example is `Variant 1`.

Note that it is possible to reduce an allocation's traffic exposure to less than 100%. In this case, the allocation's rules are evaluated and then subsequently traffic exposure check is computed. Subjects that pass the rules test but fall outside the traffic exposure continue down the waterfall to the next rule.

## Traffic exposure adjustments

When you adjust the traffic exposure of an allocation:

-   **Increasing traffic exposure**: When you increase traffic exposure, existing users who were already assigned to the allocation will maintain their variant assignments when they return (i.e. have sticky assignments). This means that users who have previously been bucketed for this allocation will continue to receive the same experience. Only new users (who are being evaluated for the first time) and users who were not previously bucketed for this allocation will be subject to the updated traffic rules.

-   **Decreasing traffic exposure**: When you decrease traffic exposure, existing users who were already assigned to a bucket will be re-evaluated. This means that users who have previously been bucketed for a specific variant will potentially receive a different experience.

-   **Experiment completion**: This is particularly useful for experiments with a measurement window. For example, if you've reached your sample size goals, you can set traffic exposure to 0% to stop new assignments while allowing already-assigned users to complete their measurement window.

## Overriding allocations with feature gates

The waterfall structure of allocations allows for powerful override capabilities:

-   **Error recovery**: If you discover an issue with an experiment, you can add a feature gate above it in the waterfall targeting 100% of users to a specific variant (e.g. control).

-   **Priority of allocations**: Since allocations are evaluated from top to bottom, a feature gate placed above experiment allocations will take precedence, overriding any experiment assignments for both new and returning users.

-   **Emergency toggles**: This structure provides a quick way to implement emergency toggles to revert all users to a safe experience when needed.
