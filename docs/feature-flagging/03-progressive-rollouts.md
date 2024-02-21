---
sidebar_position: 4
---

# Progressive rollouts

Flags can be used to progressively roll out features to larger and larger audiences to ensure that the new code doesn't contain bugs or have unintended consequences on your system.

### Allow list rollout

In the B2B case it's common to rollout new features by account. This can be done by adding account IDs to an ever growing allow list in a single allocation for a flag:

![Company allow list](/img/feature-flagging/company-allow-list.png)

### Percentage rollout

For consumer facing companies it's common to rollout new features by population percent. This can be done by starting the `Traffic Exposure` setting on an allocation to a small number, monitoring the feature, then slowly increasing
that percentage over time:

![Percentage rollout 1](/img/feature-flagging/percentage-rollout-1.png)

![Percentage rollout 2](/img/feature-flagging/percentage-rollout-2.png)

In this example, the flag is rolled out to 20% of all users, a number that can be increased gradually. Note that as the percentage grows, no users will ever be reassigned.
