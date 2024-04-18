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
# The second argument is the subject key, which doesn't affect assignment in this case.
# The third argument is the user attributes, which are likewise not needed here.
# The fourth argument is the default value, which is 'off' in this case.

if (eppoClient.getStringAssignment('twilio-killswitch', user_id, {}, 'off') == 'on'):
    # Code to gracefully handle a Twilio outage.
else:
    # Normal Twilio code.
```
