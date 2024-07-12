import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Node

Eppo's open source Node SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/node-server-sdk)
- [SDK Reference](https://eppo-exp.github.io/node-server-sdk/node-server-sdk.html)
- [NPM package](https://www.npmjs.com/package/@eppo/node-server-sdk)

## Getting Started

### Install the SDK

You can install the SDK with Yarn or NPM:

<Tabs>
<TabItem value="yarn" label="Yarn">

```bash
yarn add @eppo/node-server-sdk
```

</TabItem>

<TabItem value="npm" label="NPM">

```bash
npm install @eppo/node-server-sdk
```

</TabItem>
</Tabs>

### Define an assignment logger

Eppo encourages centralizing application logging as much as possible. Accordingly, instead of implementing a new logging framework, Eppo's SDK integrates with your existing logging system via a logging callback function defined at SDK initialization. This logger takes an [analytic event](/sdks/server-sdks/node/#assignment-logger-schema) created by Eppo, `assignment`, and writes in to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift).

The code below illustrates an example implementation of a logging callback to the console and other event platforms. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `logAssignment`:

<Tabs>
<TabItem value="console" label="Console">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Define logAssignment so that it logs events
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
	console.log(assignment);
  }
};
```
:::note
This example writes to your local machine and is useful for development in your local environment. In production, these logs will need to get written to a table in your data warehouse.
:::

</TabItem>

<TabItem value="segment" label="Segment">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Connect to Segment
const { Analytics } = require('@segment/analytics-node');
const analytics = new Analytics({ writeKey: '<SEGMENT_WRITE_KEY>'});

// Define logAssignment so that it logs events to Segment
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomization Event",
      properties: assignment,
    });
  }
};
```

</TabItem>
<TabItem value="rudderstack" label="Rudderstack">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Connect to Rudderstack
const Analytics = require("@rudderstack/rudder-sdk-node");
const analytics = new Analytics("<RUDDERSTACK_WRITE_KEY>", {
  dataPlaneUrl: DATA_PLANE_URL
});

// Define logAssignment so that it logs events to Rudderstack
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomization Event",
      properties: assignment
    });
  },
};
```

</TabItem>
<TabItem value="mparticle" label="mParticle">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Initialize mParticle
const mParticle = require("mparticle");
const api = new mParticle.EventsApi(
  new mParticle.Configuration("<MPARTICLE_API_KEY>", "<MPARTICLE_API_SECRET>")
);

// Define logAssignment so that it logs events to mParticle
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    const batch = new mParticle.Batch(mParticle.Batch.Environment.development);
    batch.user_identities = new mParticle.UserIdentities();
    batch.user_identities.customerid = assignment.subject;
    const event = new mParticle.AppEvent(
      mParticle.AppEvent.CustomEventType.navigation,
      "Eppo Randomization Event"
    );
    event.custom_attributes = assignment;
    batch.addEvent(event);
    api.uploadEvents([batch]);
  },
};
```

</TabItem>
<TabItem value="snowplow" label="Snowplow">

This example shows the setup for Snowplow's Node.js Tracker v3 SDK.

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Initialize Snowplow
import {
  tracker,
  gotEmitter,
  buildSelfDescribingEvent,
} from "@snowplow/node-tracker";
const emit = gotEmitter(
  "collector.mydomain.net", // Collector endpoint
  snowplow.HttpProtocol.HTTPS,
  8080,
  snowplow.HttpMethod.POST,
  1
);
const track = tracker(
  [emit],
  "Eppo Randomization Events",
  "<SNOWPLOW_APP_ID>",
  false
);

// Define logAssignment so that it logs events to Snowplow
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    track.track(
      buildSelfDescribingEvent({
        event: {
          schema: "iglu:com.example_company/eppo-event/jsonschema/1-0-2",
          data: {
            userId: assignment.subject,
            properties: assignment
          }
        }
      })
    );
  }
};

```

</TabItem>

<TabItem value="amplitude" label="Amplitude">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Initialize Amplitude
import { track } from '@amplitude/analytics-node';


// Define logAssignment so that it logs events to Amplitude
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    track('Experiment Viewed', assignment, {
	  user_id: assignment.subject
    });
  },
};

```

</TabItem>

</Tabs>



#### Deduplicating assignment logs

Eppo's SDK uses an internal cache to ensure that duplicate assignment events are not logged to the data warehouse. While Eppo's analytic engine will automatically deduplicate assignment records, this internal cache prevents firing unnecessary events and can help minimize costs associated with event logging. 

### Initialize the SDK

Initialize the SDK with an SDK key, which can be generated [in the Eppo interface](https://eppo.cloud/feature-flags/keys). Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```javascript
import { init } from "@eppo/node-server-sdk";

await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger
});
```

After initialization, the SDK begins polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.




### Assign variations

Assign users to flags or experiments using `get<Type>Assignment`, depending on the type of the flag.
For example, for a string-valued flag, use `getStringAssignment`:

```javascript
import * as EppoSdk from "@eppo/node-server-sdk";

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  {<SUBJECT-ATTRIBUTES>}, // Metadata used for targeting
  "<DEFAULT-VALUE>"
);
```
The `getStringAssignment` function takes four inputs to assign a variation:

- `flagKey` - The key for the flag you are evaluating. This key is available on the feature flag detail page (see below).
- `subjectKey` - The entity ID that is being experimented on, typically represented by a UUID. This key is used to deterministically assign subjects to variants.
- `subjectAttributes` - A map of metadata about the subject used for [targeting](/feature-flagging/concepts/targeting/). If targeting is not needed, pass in an empty object.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `getStringAssignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get<Type>Assignment` call.

![Example flag key](/img/feature-flagging/flag-key.png)

### Example

See an end-to-end example below of setting up the Eppo Node client and logging events to the console.

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Define logAssignment so that it logs events
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
	console.log(assignment);
  }
};

// Initialize the client
await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger
});

// Then every call to getStringAssignment will also log the event
const user = {
  userid: '1234567890',
  attributes: { country: 'united states', subscription_status: 'gold' }
}

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "new-user-onboarding",
  user.userid,
  user.attributes,
  "control"
);
```
```javascript showLineNumbers
// Output
{
  allocation: 'allocation-2468',
  experiment: 'new-user-onboarding-allocation-2468',
  featureFlag: 'new-user-onboarding',
  variation: 'treatment',
  timestamp: '2024-03-21T18:58:23.176Z',
  subject: '1234567890',
  holdout: 'q1-holdout',
  holdoutVariation: null,
  subjectAttributes: { country: 'united states', subscription_status: 'gold' }
}
```

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::

## Typed assignments

The following typed functions are available:

```
getBooleanAssignment(...)
getNumericAssignment(...)
getIntegerAssignment(...)
getStringAssignment(...)
getJSONAssignment(...)
```
To read more about different flag types, see the page on [Flag Variations](/feature-flagging/concepts/flag-variations).
## Initialization options

How the SDK fetches experiment configurations is configurable via additional optional initialization options:

| Option                                        | Description                                                                                                                                                                                                                 | Default |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------| 
| **`requestTimeoutMs`** (number)               | Timeout in milliseconds for HTTPS requests for the experiment configurations.                                                                                                                                               | `5000`  |
| **`numInitialRequestRetries`** (number)       | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests. | `1`     |
| **`pollAfterFailedInitialization`** (boolean) | Poll for new configurations even if the initial configurations request failed.                                                                                                                                              | `false` |
| **`throwOnFailedInitialization`** (boolean)   | Throw an error (reject the promise) if unable to fetch initial configurations during initialization.                                                                                                                        | `true`  |
| **`numPollRequestRetries`** (number)          | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff.                         | `7`     |

## Assignment Logger schema

The SDK will invoke the `logAssignment` function with an `assignment` object that contains the following fields:

| Field                            | Description                                                                                                              | Example                                         |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `experiment` (string)            | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"             |
| `subject` (string)               | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                            |
| `variation` (string)             | The experiment variation the subject was assigned to                                                                     | "control"                                       |
| `timestamp` (string)             | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                        |
| `subjectAttributes` (Attributes) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`                           |
| `featureFlag` (string)           | An Eppo feature flag key                                                                                                 | "recommendation-algo"                           |
| `allocation` (string)            | An Eppo allocation key                                                                                                   | "allocation-17"                                 |
| `holdout` (string)               | An Eppo holdout group key                                                                                                | "q1-holdout"                                    |
| `holdoutVariation` (string)      | An Eppo holdout variation if experiment is eligible for analysis key                                                     | "status_quo", "all_shipped_variations", or null |

:::note
The `Attributes` type represents a mapping of an attribute name to its value, which could be a string, number or boolean (`Record<string, string | number | boolean>`).
:::

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, Snowplow, Amplitude) can be found in the [event logging](/sdks/event-logging/) page.
:::

## Usage with Contextual Multi-Armed Bandits

Eppo also supports contextual multi-armed bandits. You can read more about them in the [high-level documentation](../../../contextual-bandits).
Bandit flag configuration--including setting up the flag key, status quo variation, bandit variation, and targeting rules--are configured within
the Eppo application. However, available actions are supplied to the SDK in the code when querying the bandit.

To leverage Eppo's contextual multi-armed bandits using the Node SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the SDK client instance
2. Query the bandit for an action

### Define a bandit assignment logger

In order for the bandit to learn an optimized policy, we need to capture and log the bandit's actions.
This requires defining a bandit logger in addition to an assignment logger.
```ts
// Import Eppo's logger interfaces and client initializer
import { IAssignmentLogger, IBanditLogger, init } from "@eppo/node-server-sdk";

// Define an assignment logger for recording variation assignments
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment: IAssignmentEvent) {
    console.log("TODO: save assignment information to data warehouse", assignment);
  }
};

// Define a bandit logger for recording bandit action assignments
const banditLogger: IBanditLogger = {
  logBanditAction (banditEvent: IBanditEvent) {
    console.log("TODO: save bandit action information to the data warehouse, ensuring the column names are as expected", banditEvent);
  }
};

// Initialize the SDK with both loggers provided
await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
  banditLogger
});
```

The SDK will invoke the `logBanditAction()` function with an `IBanditEvent` object that contains the following fields:

| Field                                       | Description                                                                                                       | Example                        |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------|--------------------------------|
| `timestamp` (string)                        | The time when the action is taken in UTC as an ISO string                                                         | "2024-03-22T14:26:55.000Z"     |
| `featureFlag` (string)                      | The key of the feature flag corresponding to the bandit                                                           | "bandit-test-allocation-4"     |
| `bandit` (string)                           | The key (unique identifier) of the bandit                                                                         | "ad-bandit-1"                  |
| `subject` (string)                          | An identifier of the subject or user assigned to the experiment variation                                         | "ed6f85019080"                 |
| `subjectNumericAttributes` (Attributes)     | Metadata about numeric attributes of the subject. Map of the name of attributes their provided values             | `{"age": 30}`                  |
| `subjectCategoricalAttributes` (Attributes) | Metadata about non-numeric attributes of the subject. Map of the name of attributes their provided values         | `{"loyalty_tier": "gold"}`     |
| `action` (string)                           | The action assigned by the bandit                                                                                 | "promo-20%-off"                |
| `actionNumericAttributes` (Attributes)      | Metadata about numeric attributes of the assigned action. Map of the name of attributes their provided values     | `{"discount": 0.1}`            |
| `actionCategoricalAttributes` (Attributes)  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their provided values | `{"promoTextColor": "white"}`  |
| `actionProbability` (number)                | The weight between 0 and 1 the bandit valued the assigned action                                                  | 0.25                           |
| `optimalityGap` (number)                    | The difference between the score of the selected action and the highest-scored action                             | 456                            | 
| `modelVersion` (string)                     | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability   | "v123"                         |
| `metaData` Record<string, unknown>          | Any additional freeform meta data, such as the version of the SDK                                                 | `{ "sdkLibVersion": "3.5.1" }` |

### Querying the bandit for an action

To query the bandit for an action, you can use the `getBanditAction()` function. This function takes the following parameters:
- `flagKey` (string): The key of the feature flag corresponding to the bandit
- `subjectKey` (string): The key of the subject or user assigned to the experiment variation
- `subjectAttributes` (Attributes | ContextAttributes): The context of the subject
- `actions` (string[] | Record<string, Attributes | ContextAttributes>): Available actions, optionally mapped to their respective contexts
- `defaultValue` (string): The default *variation* to return if the flag is not successfully evaluated

:::note
The `ContextAttributes` type represents attributes which have already been explicitly bucketed into categorical and numeric attributes (`{ numericAttributes: Attributes,
categoricalAttributes: Attributes }`). There is more detail on this in the Subject Context section.
:::

The following code queries the bandit for an action:
```ts
import { getInstance as getEppoSdkInstance } from "@eppo/node-server-sdk";
import { Attributes, BanditActions } from "@eppo/js-client-sdk-common";

const flagKey = "shoe-bandit";
const subjectKey = "user123";
const subjectAttributes: Attributes = { age: 25, country: "GB" };
const defaultValue = "default";
const actions: BanditActions = {
  nike: { 
    numericAttributes: { brandAffinity: 2.3 }, 
    categoricalAttributes: { imageAspectRatio: "16:9" } 
  },
  adidas: {
    numericAttributes: { brandAffinity: 0.2 },
    categoricalAttributes: { imageAspectRatio: "16:9" }
  }
};
const { variation, action } = getEppoSdkInstance().getBanditAction(
  flagKey,
  subjectKey,
  subjectAttributes,
  actions,
  defaultValue
);

if (action) {
  renderShoeAd(action);
} else {
  renderDefaultShoeAd();
}
```

#### Subject context

The subject context contains contextual information about the subject that is independent of bandit actions.
For example, the subject's age or country.

The subject context can be provided as `Attributes`, which will then assume anything that is number is a numeric
attribute, and everything else is a categorical attribute.

You can also explicitly bucket the attribute types by providing the context as `ContextAttributes`. For example, you may have an attribute named `priority`, with 
possible values `0`, `1`, and `2` that you want to be treated categorically rather than numeric. `ContextAttributes` have two nested sets of attributes:
- `numericAttributes` (Attributes): A mapping of attribute names to their numeric values (e.g., `age: 30`)
- `categoricalAttributes` (Attributes): A mapping of attribute names to their categorical values (e.g., `country`)

Any non-numeric values explicitly passed in as values for numeric attributes will be ignored.

Attribute names and values are case-sensitive.

:::note
The subject context, passed in as the `subjectAttributes` parameter, is also still used for targeting rules for the feature flag,
just like with non-bandit assignment methods.
:::

#### Action contexts

The action context contains contextual information about each action. They can be provided as a mapping of attribute names 
to their contexts. 

Similar to subject context, action contexts can be provided as `Attributes`--which will then assume anything that is number is a numeric
attribute, and everything else is a categorical attribute--or as `ContextAttributes`, which have explicit bucketing into `numericAttributes`
and `categoricalAttributes`.

Note that action contexts can contain two kinds of information:
- Action-specific context (e.g., the image aspect ratio of image corresponding to this action)
- Subject-action interaction context (e.g., there could be a "brand-affinity" model that computes brand affinities of users to brands,   
  and scores of that model can be added to the action context to provide additional context for the bandit)

If there is no action context, an array of strings comprising only the actions names can also be passed in.

If the subject is assigned to the variation associated with the bandit, the bandit selects one of the supplied actions.
All actions supplied are considered to be valid. If an action should not be available to a subject, do not include it for that call.

Like attributes, actions are case-sensitive.

#### Result

`getBanditAction()` returns two fields:
- `variation` (string): The variation that was assigned to the subject
- `action` (string | null): The action that was assigned to the subject by the bandit, or `null` if the bandit was not assigned

The variation returns the feature flag variation. This can be the bandit itself, or the "status quo" variation if the subject is not assigned to the bandit.

If we are unable to generate a variation, for example when the flag is turned off, then the provided `default` variation is returned.
In both of those cases, the returned `action` will be `null`, and you should use the status-quo algorithm to select an action (more on this below).

When `action` is not `null`, the bandit has selected an action for the subject.

:::note
If no actions are provided and the flag still has an active bandit, no assignments will be made and the default value will be returned.
:::

:::note
If the flag no longer has any allocations with bandits, this function will behave the same as `getStringAssignment()`, with
the provided actions being ignored and the assigned variation being returned along with a `null` action.
:::

#### Status quo algorithm

In order to accurately measure the performance of the bandit, we need to compare it to the status quo algorithm using an experiment.
This status quo algorithm could be a complicated algorithm to that selects an action according to a different model, or a simple baseline such as selecting a fixed or random action.
When you create an analysis allocation for the bandit and the returned `action` is `null`, implement the desired status quo algorithm based on the `variation` value.

## Debugging

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions [detailed here](/sdks/sdk-features/debugging-flag-assignment/) to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues. 
