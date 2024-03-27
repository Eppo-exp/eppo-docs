import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Node

Eppo's open source Node SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/node-server-sdk)
- [API Reference](https://eppo-exp.github.io/node-server-sdk/node-server-sdk.html)
- [NPM package](https://www.npmjs.com/package/@eppo/node-server-sdk)

## 1. Install the SDK

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

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```javascript
import { init } from "@eppo/node-server-sdk";

await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
});
```

After initialization, the SDK begins polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Initialization options

How the SDK fetches experiment configurations is configurable via additional optional initialization options:

| Option | Description | Default |
| ------ | ----------- | ------- | 
| **`requestTimeoutMs`** (number) | Timeout in milliseconds for HTTPS requests for the experiment configurations. | `5000` |
| **`numInitialRequestRetries`** (number) | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests. | `1` |
| **`pollAfterFailedInitialization`** (boolean) | Poll for new configurations even if the initial configurations request failed. | `false` |
| **`throwOnFailedInitialization`** (boolean) | Throw an error (reject the promise) if unable to fetch initial configurations during initialization. | `true` |
| **`numPollRequestRetries`** (number) | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff. | `7` |

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `init` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `logAssignment`:

```javascript
import { IAssignmentLogger } from "@eppo/node-server-sdk";

// Connect to Segment (or your own event-tracking system)
const { Analytics } = require('@segment/analytics-node');
const analytics = new Analytics({ writeKey: '<SEGMENT_WRITE_KEY>'});

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

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

#### Avoiding duplicated assignment logs

Eppo's SDK uses an internal cache to ensure that duplicate assignment events are not logged to the data warehouse. While Eppo's analytic engine will automatically deduplicate assignment records, this internal cache prevents firing unnecessary events and can help minimize costs associated with event logging. 


## 3. Assign variations

Assigning users to flags or experiments with a single `getStringAssignment` function:

```javascript
import * as EppoSdk from "@eppo/node-server-sdk";

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-KEY>",
  {
    // Optional map of subject metadata for targeting.
  }
);
```

The `getStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey` - This key is available on the detail page for both flags and experiments.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

### Typed assignments

Additional functions are available:

```
getBoolAssignment(...)
getNumericAssignment(...)
getJSONStringAssignment(...)
getParsedJSONAssignment(...)
```

### Handling `null`

We recommend always handling the `null` case in your code. Here are some examples illustrating when the SDK returns `null`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `null` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `null` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3. If `getStringAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `null` if no configurations have been downloaded.

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
