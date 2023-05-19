# Unleash

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |

To track this data for Unleash assignments, you'll need to first find all places where Unleash flags are being invoked and replace with a wrapper function. The example below is based on Javascript, see the [Unleash SDK documentation](https://docs.getunleash.io/advanced/toggle_variants#client-sdk-support) to identify the syntax for your language of choice.

### Find all places in your code where your feature flags are being invoked.

Unleash supports [feature toggle variants](https://docs.getunleash.io/advanced/toggle_variants) and typically exposes a [`getVariant()`](https://docs.getunleash.io/advanced/toggle_variants#client-sdk-support) method for retrieving the variant the user is seeing. 

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

### Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing

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

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.