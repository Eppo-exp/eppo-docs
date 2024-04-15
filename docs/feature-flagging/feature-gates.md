---
sidebar_position: 3
---

# Feature gates

Flags can be used to gate new or unfinished features. This is sometimes referred to as "dark launching" code. Eppo's flexible targeting rules allow you to launch a feature to any subset of your population, including specific user IDs, instead of all at once.

### Create a feature gate

Here we create a flag for a hypothetical new feature on our site, a new checkout page:

![Feature gate 1](/img/feature-flagging/feature-gate-1.png)

### Create allocations to describe your target audience

After creating the flag, we create two feature gate allocations that describe our target audience: internal users and half of all North American web users:

![Feature gate 2](/img/feature-flagging/feature-gate-2.png)

In this case, we didn't have to create an explicit variation `off`. If the
assigned variation is not `on`, then we can assume the variation was off.

### Use the feature gate in your code

In your code, you now can check if the user should be exposed to the new flag:

```python
user_attributes = {
    email: user.email,
    country: user.country,
    device: user.device
}

if (eppoClient.getStringAssignment(user.id, 'new-checkout-page', 'off', user_attributes) == 'on'):
    # Show new checkout page.
else:
    # Show old checkout page.
```

The last step is turning on the flag, which can be done using the toggle on the flag's detail view.
