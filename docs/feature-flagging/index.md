# Feature flags

Feature flags enable you to easily toggle features on and off, conduct A/B testing, gradually roll out new functionality, and personalize user experiences—all without the need for extensive code deployments.
With feature flags, you can empower your team to make dynamic changes, iterate quickly, and deliver enhanced user experiences with ease.
Here, we explain how Eppo's feature flags can improve your development and deployment processes.

## Concepts

Before diving into the details, let's first go over the central feature flagging concepts in Eppo:

- Flags
- Variations
- Allocations
- Environments

### Flags

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

See the feature flag [use cases](/feature-flagging/use-cases) to explore more interesting ways to use feature flags.

### Variations

Variations are the distinct paths that can be taken from a single flag. In the simplest case a flag will have two variations, but there is no limit.

As a simple example, consider a feature flag that controls the button color of the "Buy Now" button on the checkout page.
In this case, the feature flag may be called `checkout_page_buy_now_button_color` and the variations could be `red`, `green` and `yellow`.

### Allocations

Allocations govern how users get assigned to different variations of a feature flag in a flexible way.
An allocation is a logical grouping of [targeting rules](/feature-flagging/targeting) and variation weights associated with a flag.

Eppo supports two types of allocations: Feature Gates and Experiment allocations.

In Eppo, allocations are stacked in a vertical waterfall as seen below:

![Allocation waterfall](/img/feature-flagging/waterfall.png)

Here, there are two allocations:

- The first allocation is a feature gate that targets internal users, which are identified with by their email domain. If a user's email matches the criteria, they are show `Variant 1`. If not, they are moved along to the next allocation (i.e down the waterfall).
- The second allocation is an experiment allocation that targets users in North America using an iPhone. 50% of users who match this criteria see `Variant 1` and the remaining 50% of users see `Variant 2`. If users do no match, they are moved along. Since there are no more allocations to evaluate, all remaining users see the default value, which in this example is `Variant 1`.

Note that it is possible to reduce an allocation's traffic exposure to less than 100%. In this case, the allocation's rules are evaluated and then subsequently traffic exposure check is computed. Subjects that pass the rules test but fall outside the traffic exposure check are always served `NULL`. They do not continue down the waterfall.

### Environments

Every Eppo instance comes with two out-of-the-box environments: **Test** and **Production**.  Use the **Test** environment to check feature flag behavior before releasing them in **Production**.

Additional environments can be added with no limit to match the ways you develop and ship code. For example, you can create environments for every developer's local environment or if you have multiple lower environments. Use _Configuration > Environments_ to create new environments.

![Environment setup](/img/feature-flagging/environments/environment-setup.png)

SDK keys for environments can be created on the _Configuration > SDK Keys_ section of the interface:

![SDK key setup](/img/feature-flagging/environments/sdk-keys.png)

There is no limit to the number of SDK keys per environment. Once keys are generated, they can be used to initialize the SDK in the given environment.

Flags can be toggled on an off independently per environment on the flag list and flag detail views. You can also define different targeting rules per environment:

![Feature flag list page](/img/feature-flagging/environments/ff-list-page.png)
![Feature flag detail page](/img/feature-flagging/environments/ff-detail-page.png)
