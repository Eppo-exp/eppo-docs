import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create assignment table from Optimizely

_Note:_ this guide assumes that you have already integrated Optimizely feature flags into your code.

1. Find all places in your code where your feature flags are being invoked.

**Find the SDK that you're using in the [Optimizely SDK documentation](https://docs.developers.optimizely.com/full-stack/v4.0/docs/create-flag-variations#implement-flag-variations) and identify the syntax you're searching for.** 

Optimizely's SDK supports [flag variations](https://docs.developers.optimizely.com/full-stack/v4.0/docs/create-flag-variations). You need to first define the variations in the Optimizely app, and then use the `decision.variables` method to retrieve which variation is enabled for the current user. 

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
<TabItem value="py" label="Python">

```py
# Is the flag enabled for the user?
user = optimizely.create_user_context("user123")
decision = user.decide("button_color_experiment")
enabled = decision.enabled

"""
    In the online Optimizely app, go define flag variations
"""

if enabled:
    # get flag variable values depending on the variation the user bucketed into
    color_of_button = decision.variables["color"]
```

</TabItem>
</Tabs>

2. Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing

In Javascript, it may look like this:

<Tabs>
<TabItem value='js' label='Javascript'>

```javascript
function checkFeatureEnabled(experimentKey, defaultValue) {
    // determine whether or not this feature is enabled for the current user
    var user = optimizely.createUserContext(userId);
    var decision = user.decide('button_color_experiment');
    var enabled = decision.enabled;

    // default color
    let colorOfButton = "red";

    if (enabled) {
        // get flag variable values depending on the variation the user bucketed into
        colorOfButton = decision.variables['color'];
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
        variation: colorOfButton,
        device_id: DEVICE_ID,
    },
    });

    // return the variation
    return colorOfButton;
}
```
</TabItem>
</Tabs>

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.