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
		console.log(assignment)
  },
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
  },
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
  dataPlaneUrl: DATA_PLANE_URL,
});

// Define logAssignment so that it logs events to Rudderstack
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomization Event",
      properties: assignment,
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
            properties: assignment,
          },
        },
      })
    );
  },
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
		  user_id: assignment.subject,
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
  assignmentLogger,
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
  <SUBJECT-ATTRIBUTES>, // Metadata used for targeting
  "<DEFAULT-VALUE>",
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
		console.log(assignment)
  },
};

// Initialize the client
await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
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
  user.attributes
  "control",
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

| Option | Description | Default |
| ------ | ----------- | ------- | 
| **`requestTimeoutMs`** (number) | Timeout in milliseconds for HTTPS requests for the experiment configurations. | `5000` |
| **`numInitialRequestRetries`** (number) | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests. | `1` |
| **`pollAfterFailedInitialization`** (boolean) | Poll for new configurations even if the initial configurations request failed. | `false` |
| **`throwOnFailedInitialization`** (boolean) | Throw an error (reject the promise) if unable to fetch initial configurations during initialization. | `true` |
| **`numPollRequestRetries`** (number) | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff. | `7` |

## Assignment Logger schema

The SDK will invoke the `logAssignment` function with an `assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |
| `holdout` (string)    | An Eppo holdout group key                                                                                                 | "q1-holdout"               |
| `holdoutVariation` (string)     | An Eppo holdout variation if experiment is eligible for analysis key                                                                                                   | "status_quo", "all_shipped_variations", or null                    |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, Snowplow, Amplitude) can be found in the [event logging](/sdks/event-logging/) page.
:::

## Debugging

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions [detailed here](/sdks/sdk-feature/debugging-flag-assignment/) to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues. 
