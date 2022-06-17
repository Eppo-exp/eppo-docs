import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create assignment table from Eppo Randomization SDK

_Note:_ this guide assumes that you have are using the [Eppo Randomization SDK](../../feature-flagging/randomization-sdk) to feature flag your code.

1. Find all places in your code where your feature flags are being invoked.


<Tabs>
<TabItem value="js" label="JavaScript">

```js
// Fetch enabled state for the "product_sort" flag.
// Then use flag variations to expose different sorting methods and pagination. 

// Define flag variable defaults (if the flag is disabled, you fall back to these values)
let colorOfButton = 'red';
 
// Is the flag enabled for the user?
var user = optimizely.createUserContext(userId);
var decision = user.decide('button_color_experiment');
var enabled = decision.enabled;

                                                        
//In the online Optimizely app, go define flag variations using
// colorOfButton variables. 
  
if (enabled) {
  // get flag variable values depending on the variation the user bucketed into
  colorOfButton = decision.variables['color'];
}

// Fetch products using the flag variables, using something like this pseudocode:
let products = productProvider.get(colorOfButton);
```

</TabItem>
</Tabs>

2. Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing.

In JavaScript, the code to log may look something like this:

<Tabs>
<TabItem value='js' label='Javascript'>

```js
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

</TabItem>

<TabItem value='segment' label='Segment'>

```js

function checkFeatureEnabled(experimentKey, defaultValue) {
  // determine whether or not this feature is enabled for the current user
  const variation = client.variation(experimentKey, defaultValue);

  // If you use Segment you're likely using their [`track`](<https://segment.com/docs/ connections/spec/track/) function to track this event.

  analytics.track('ExperimentAssignmentEvent', {
    timestamp: new Date().toISOString(),
    user_id: ID_OF_THE_CURRENT_USER,
    experiment: experimentKey,
    variation: variation,
    device_id: DEVICE_ID;,
  })

  // return the variation
  return variation;
}
```

</TabItem>

</Tabs>

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.

