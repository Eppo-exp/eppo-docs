# Concepts

This page explores **flags**, **variations**, and **allocations**, and **environments**, the central feature flagging concepts on Eppo.

## Flags

A flag is simply a fork somewhere in your code. Where originally there was a single code path, the presence of a flag creates a gate that splits that path into two or more code paths. In its most basic form a flag object can represented by a human readable name, a key, and a status (on/off). Here's a quick example:

```python
# Before, price is $10 for everyone.

price_of_shoes = 10
```

The presence of a feature flag unlocks multiple paths:

```python
# After, show different prices to different users based on a flag.

group = get_assignment(user_id, 'pricing_gate')

if (group == "round_down_to_cents"):
    price_of_shoes = 9.99
else:
    price_of_shoes = 10
```

Explore interesting flag uses cases [here](./use-cases).

## Variations

Variations are the distinct paths that can be taken from a single flag. In the simplest case a flag will have two variations, but there is no limit.

## Allocations

An allocation is a logical grouping of targeting rules and variation weights associated with a flag. In Eppo, allocations are stacked in a vertical waterfall as seen below:

![Allocation waterfall](/img/feature-flagging/waterfall.png)

In the picture above there are two allocations:

- The first allocation targets internal users, which are identified with by their email domain. If a user's email matches the criteria, they are show `Variant 1`. If not, they are moved along to the next allocation (i.e down the waterfall).
- The second allocation targets users in North America using an iPhone. 50% of users who match this criteria see `Variant 1` and the remaining 50% of users see `Variant 2`. If users do no match, they are moved along. Since there are no more allocations to evaluate, all remaining users see the default value, which in this example is `Variant 1`.

Allocations can be turned on/off in the waterfall using the `Enable Allocation` checkbox. If an allocation is off, it is simply skipped when evaluating the waterfall logic.

Note that it is possible to reduce an allocation's traffic exposure to less than 100%. In this case, the allocation's rules are evaluated and then subsequently traffic exposure check is computed. Subjects that pass the rules test but fall outside the traffic exposure check are always served `NULL`. They do not continue down the waterfall.

## Environments

Every Eppo instance comes with two out-of-the-box environments: **Test** and **Production**. These represent two independent silos for flags and experiments, mirroring the way you test and ship code. Use the **Test** environment to check feature flag behavior before releasing them in **Production**. Note: unlike flags, all experiments (under the _Experiments_ tab) currently live in the **Production** environment.

API keys for both environments can be created on the _Admin > API Keys_ section of the interface:

![API key setup](/img/feature-flagging/environments/api-keys.png)

There is no limit to the number of API keys per environment. Once keys are generated, they can be used to initialize the SDK in the given environment. From there, flags can be toggled on an off independently per environment on the flag list and flag detail views. You can also define different targeting rules per environment:

![Feature flag list page](/img/feature-flagging/environments/ff-list-page.png)
![Feature flag detail page](/img/feature-flagging/environments/ff-detail-page.png)
