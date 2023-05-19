import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# LaunchDarkly

## Exporting data from LaunchDarkly

In order to perform its analyses, Eppo needs access to an assignment table in your data warehouse that lists each user that comes through the system and which variant they saw at which time.

| timestamp | user_id | experiment | variation |
| --------- | ------- | ---------- | --------- |
| 2021-06-22T17:35:12.000Z | 165740867980881574 | adding_BNPL_experiment | affirm |

By default, LaunchDarkly does not make accessible the data which allows Eppo to determine which users were assigned/exposed to any given feature/experiment.

To access this data, you have a couple of options:

- [Pay to export data from LaunchDarkly to PubSub Systems](https://docs.launchdarkly.com/home/getting-started)
  - If you go this route, you will subsequently then need to move the data from the pubsub system to the data warehouse.
- Log assignments manually with wrapper code (see below).


## Logging assignments manually with wrapper code

To manually log LaunchDarkly assignments, you'll need to find all places in your code where feature flags are being invoked and replace with a wrapper function. The example below is based on Javascript, see [LaunchDarkly SDK documentation](https://docs.launchdarkly.com/sdk) to find the syntax for your language of choice.

### Find all places where feature flags are being invoked

LaunchDarkly’s SDK exposes methods for retrieving whether or not a feature is enabled for the current user. 

<Tabs>
<TabItem value="js" label="JavaScript">

```js
const variation = client.variation("YOUR_EXPERIMENT_KEY", "control");
if (variation == "variant_abc") {
  // show the variant you are testing
} else if (variation == "control") {
  // show control
}
```

</TabItem>
<TabItem value="react" label="React">

```js
import { withLDConsumer } from 'launchdarkly-react-client-sdk';

const Home = ({ flags, ldClient /*, ...otherProps */ }) => {
  // if the devTestFlag is on, then show one kind of div; if not, show the other.
  return flags.devTestFlag ? <div>Flag on</div> : <div>Flag off</div>;
};

export default withLDConsumer()(Home);
```

</TabItem>
</Tabs>


### Log all feature flag invocations.

In order to capture assignment data, every time the feature flag is invoked, you need to log the user, timestamp, and which experiment and variant they're seeing

<Tabs>
<TabItem value="js" label="JavaScript">

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
</Tabs>

You need to ensure that all usages of feature flags (or at least those you wish to run an experiment on) are wrapped with this new function you created.

It is possible that an engineer on your team could call this new function before showing the new feature to the user. Be sure that the assignment event is only sent once the user experiences the feature you are experimenting on.
