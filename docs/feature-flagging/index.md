# Feature flags

Feature flags enable you to easily toggle features on and off, conduct A/B testing, gradually roll out new functionality, and personalize user experiences — all without the need for extensive code deployments.
With feature flags, you can empower your team to make dynamic changes, iterate quickly, and deliver enhanced user experiences with ease.

A flag is simply a fork somewhere in your code. Where originally there was a single code path, the presence of a flag creates a gate that splits that path into two or more code paths. In its most basic form a flag object can represented by a human readable name, a key, and a status (on/off). Here's a quick example:

```python
# Before, price is $10 for everyone.

price_of_shoes = 10
```

The presence of a feature flag unlocks multiple paths:

```python
# After, show different prices to different users based on a flag.

group = get_string_assignment('pricing_gate', user_id, user_attributes, 'do_not_round_down')

if (group == "round_down_to_cents"):
    price_of_shoes = 9.99
else:
    price_of_shoes = 10
```

## Concepts

The following are the central feature flagging concepts in Eppo:
- [Variations](/feature-flagging/concepts/flag-variations)
- [Allocations](/feature-flagging/concepts/flag-allocations)
- [Environments](/feature-flagging/concepts/environments)
- [Targeting rules](/feature-flagging/concepts/targeting)
- [Audiences](/feature-flagging/concepts/audiences)
- [Mutual exclusion](/feature-flagging/concepts/mutual_exclusion)

## Use cases

Feature flags are applicable for a number of use cases:
- [Feature gates](/feature-flagging/concepts/feature-gates)
- [Experiment assignment](/feature-flagging/concepts/experiment-assignment)
- [Progressive rollouts](/feature-flagging/use-cases/progressive-rollouts)
- [Kill switches](/feature-flagging/use-cases/kill-switches)
- [Dynamic configuration](/feature-flagging/use-cases/dynamic-config)