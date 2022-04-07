# Make a wrapper around feature flag calls in your own codebase

LaunchDarkly’s SDK exposes methods for retrieving whether or not a feature is enabled for the current user. For example, in Javascript:

```javascript
const variation = client.variation("YOUR_EXPERIMENT_KEY", "control");
if (variation == "variant_abc") {
  // show the variant you are testing
} else if (variation == "control") {
  // show control
}
```

In order to capture assignment data, you need to wrap your usage of the method to check whether or not a feature is enabled, and log the result of that method call to your event logging system. In Javascript, it may look like this:

```javascript
function checkFeatureEnabled(experimentKey, defaultValue) {
  // determine whether or not this feature is enabled for the current user
  const variation = client.variation(experimentKey, defaultValue);

  // eventService here is the system you use for logging arbitrary events
  // which ultimately end up in your data warehouse. The format/structure
  // of sending these events will vary based on the interface of that system.
  eventService.logEvent({
    event_name: "ExperimentAssignmentEvent",
    event_params: {
      timestamp: new Date().toISOString(),
      user_id: ID_OF_THE_CURRENT_USER,
      experiment: experimentKey,
      variation: variation,
      device_id: DEVICE_ID,
    },
  });

  // return the variation
  return variation;
}
```

You would then need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.
