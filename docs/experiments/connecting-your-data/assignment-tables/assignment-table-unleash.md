import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Creating assignment table from Unleash

_Note:_ this guide assumes that you have already integrated Unleash feature flags into your code.

1. Find all places in your code where your feature flags are being invoked.

**Find the SDK that you're using in the [Unleash SDK documentation](https://docs.getunleash.io/advanced/toggle_variants#client-sdk-support) and identify the syntax you're searching for.**

Unleash supports [feature toggle variants](https://docs.getunleash.io/advanced/toggle_variants) and typically exposes a [`getVariant()`](https://docs.getunleash.io/advanced/toggle_variants#client-sdk-support) method for retrieving the variant the user is seeing. 

<Tabs>
<TabItem value="node" label="JavaScript">

```javascript
const { initialize } = require('unleash-client');
const unleash = initialize({
  url: 'http://unleash.herokuapp.com/api/',
  appName: 'my-app-name',
  instanceId: 'my-unique-instance-id',
  customHeaders: {
    Authorization: 'API token',
  },
});

unleash.on('synchronized', () => {
  // Unleash is ready to serve updated feature toggles.

  // Check the variant
  const variant = unleash.getVariant('button-color-experiment');

  if (variant.name === "blue") {
      // show blue button
  } else if (variant.name === "red") {
      // show red button
  } else {
      // show default
  }
});
```
</TabItem>

<TabItem value='py' label="Python">

```py
from UnleashClient import UnleashClient

client = UnleashClient(
    url="https://unleash.herokuapp.com",
    app_name="my-python-app",
    custom_headers={'Authorization': '<API token>'})

client.initialize_client()

# Evaluate a feature flag and variable
my_toggle_enabled = client.is_enabled("button-color-experiment")

context = {'userId': '2'}  # Context must have userId, sessionId, or remoteAddr.  If none are present, distribution will be random.

variant = client.get_variant("button-color-experiment", context)

if variant['name'] == "red":
    # show red button
elif variant['name'] == "blue":
    # show blue button
else:
    # show control
```
</TabItem>
</Tabs>

2. Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing

<Tabs>
<TabItem value="js" label="Javascript">

```javascript
function checkFeatureEnabled(experimentKey, defaultValue) {
  // determine whether or not this feature is enabled for the current user
  const isEnabled = unleash.isEnabled('button-color-experiment');


  // determine the variant enabled for this current user
  const variant = unleash.getVariant('button-color-experiment');

  /// here you show the different variations
  if (variant.name === "blue") {
      // show blue button
  } else if (variant.name === "red") {
      // show red button
  } else {
      // show default
  }

  // eventService here is the system you use for logging arbitrary events
  // which ultimately end up in your data warehouse. The format/structure
  // of sending these events will vary based on the interface of that system.
  eventService.logEvent({
    event_name: "ExperimentAssignmentEvent",
    event_params: {
      timestamp: new Date().toISOString(),
      user_id: ID_OF_THE_CURRENT_USER,
      experiment: experimentKey,
      variation: variant.name,
      device_id: DEVICE_ID,
    },
  });

  // return the variant
  return variant;
}
```
</TabItem>
</Tabs>

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.