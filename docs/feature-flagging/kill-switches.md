---
sidebar_position: 6
---

# Kill switches

Flags can be used to instantly turn off features or services that are on by default, often as a contingency plan.

SaaS outages are a great example. If a Saas provider's functionality is gated with a killswitch in your code and the provider suffers an outage, you can immediately turn on the killswitch and gracefully degrade your experience instead of hard erroring.

### Create a kill switch

Give the killswitch a descriptive name and key. The switch only needs one variation to determine if it's on. Below we've named that variation `on`:

![Killswitch 1](/img/feature-flagging/killswitch-1.png)

After creation, the switch can be embedded in your code as is, with the default status being off. Since the switch is all
or nothing, no allocation is required:

![Killswitch 2](/img/feature-flagging/killswitch-2.png)

### Use the kill switch in your code

Here's how you would use the switch in your code:

```python
# The argument user_id is required but doesn't affect assignment in this case.

if (eppoClient.getStringAssignment(user_id, 'twilio-killswitch', 'off') == 'on'):
    # Code to gracefully handle a Twilio outage.
else:
    # Normal Twilio code.
```
