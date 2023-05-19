# Optimizely

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |

By default, Optimizely does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment. To access this data, you have a couple of options:

- [Pay to Export data from Optimizely to Snowflake](https://docs.developers.optimizely.com/optimizely-data/docs/snowflake-integration)
- Log assignments manually with wrapper code (see below)

## Logging assignments manually with wrapper code

To manually log Optimizely assignments, you'll need to find all places in your code where Optimizely is being invoked and replace with a wrapper function. The example below is based on Javascript, see [Optimizely SDK documentation](https://docs.developers.optimizely.com/full-stack/v4.0/docs/create-flag-variations#implement-flag-variations) to find the syntax for your language of choice.

### Find all places in your code where your feature flags are being invoked.


Optimizely's SDK supports [flag variations](https://docs.developers.optimizely.com/full-stack/v4.0/docs/create-flag-variations). You need to first define the variations in the Optimizely app, and then use the `decision.variables` method to retrieve which variation is enabled for the current user. 

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

### Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing

In Javascript, it may look like this:

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

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.