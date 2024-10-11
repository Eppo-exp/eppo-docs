import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# React Native

Eppo's open source React Native SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/react-native-sdk)
- [NPM package](https://www.npmjs.com/package/@eppo/react-native-sdk)

## Getting Started

### Installation

You can install the SDK with Yarn or NPM:

<Tabs>
<TabItem value="yarn" label="Yarn">

```bash
yarn add @eppo/react-native-sdk
```

</TabItem>

<TabItem value="npm" label="NPM">

```bash
npm install @eppo/react-native-sdk
```

</TabItem>

</Tabs>

### Usage

Begin by initializing a singleton instance of Eppo's client with an SDK key from the [Eppo dashboard](https://eppo.cloud/feature-flags/keys). Once initialized, the client can be used to make assignments anywhere in your app.

#### Initialize once

```javascript
import { init } from "@eppo/react-native-sdk";

await init({ apiKey: "<SDK-KEY>" });
```


#### Assign anywhere

```javascript
import * as EppoSdk from "@eppo/react-native-sdk";

const eppoClient = EppoSdk.getInstance();
const user = getCurrentUser();

const variation = eppoClient.getBooleanAssignment('show-new-feature', user.id, { 
  'country': user.country,
  'device': user.device,
}, false);
```

After initialization, the SDK begins polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations (variation values, traffic allocation, etc.). You can customize initialization and polling preferences by passing in additional [initialization options](#initialization-options).

The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/architecture) page.

### Connecting an event logger

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. This is done with a logging callback function defined at SDK initialization. 

```javascript
await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
});
```

This logger takes an [analytic event](#assignment-logger-schema) created by Eppo, `assignment`, and writes in to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift). You can read more on the [Event Logging](/sdks/event-logging) page.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo ``IAssignmentLogger` interface containing a single function named `logAssignment`:

```javascript
import { IAssignmentLogger } from "@eppo/react-native-sdk";
import { AnalyticsBrowser } from "@segment/analytics-next";

// Connect to Segment (or your own event-tracking system)
const analytics = AnalyticsBrowser.load({ writeKey: "<SEGMENT_WRITE_KEY>" });

const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomized Assignment",
      type: "track",
      properties: { ...assignment },
    });
  },
};
```

#### Deduplicating assignment logs

Eppo's SDK uses an internal cache to ensure that duplicate assignment events are not logged to the data warehouse. While Eppo's analytic engine will automatically deduplicate assignment records, this internal cache prevents firing unnecessary events and can help minimize costs associated with event logging. 

### Getting variations

Now that the SDK is initialized and connected to your event logger, you can check what variant a specific subject (typically user) should see by calling the `get<Type>Assignment` functions.

For example, for a string-valued flag, use `getStringAssignment`:

```javascript
import * as EppoSdk from "@eppo/react-native-sdk";

const eppoClient = EppoSdk.getInstance();

// replace this with your own user object
const user = getCurrentUser();

const variation = eppoClient.getStringAssignment(
  'show-new-feature', // flagKey
  user.id, // subjectKey
  {'country': user.country, 'device': user.device}, // subjectAttributes
  'default-value' // defaultValue
)
```

Note that Eppo uses a unified API for feature gates, experiments, and mutually exclusive layers. This makes it easy to turn a flag into an experiment or vice versa without having to do a code release.

The `getStringAssignment` function takes four inputs to assign a variation:

- `flagKey` - The key for the flag you are evaluating. This key is available on the feature flag detail page (see below).
- `subjectKey` - A unique identifier for the subject being experimented on (e.g., user), typically represented by a UUID. This key is used to deterministically assign subjects to variants.
- `subjectAttributes` - A map of metadata about the subject used for [targeting](/feature-flagging/concepts/targeting/). If targeting is not needed, pass in an empty object.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `getStringAssignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get<Type>Assignment` call.

![Example flag key](/img/feature-flagging/flag-key.png)

### Typed assignments

Every Eppo flag has a return type that is set once on creation in the dashboard. Once a flag is created, assignments in code should be made using the corresponding typed function: 

```javascript
getBooleanAssignment(...)
getNumericAssignment(...)
getIntegerAssignment(...)
getStringAssignment(...)
getJSONAssignment(...)
```

Each function has the same signature, but returns the type in the function name. The only exception is `defaultValue`, which should be the same type as the flag. For boolean flags for instance, you should use `getBooleanAssignment`, which has the following signature:

```javascript
getBooleanAssignment: (
  flagKey: string,
  subjectKey: string,
  subjectAttributes: Record<string, any>,
  defaultValue: boolean,
) => boolean
```

To read more about different flag types, see the [Flag Variations](/feature-flagging/concepts/flag-variations) page.


## Advanced Options

### Initialization options

The `init` function accepts the following optional configuration arguments.

| Option | Type | Description | Default |
| ------ | ----- | ----- | ----- | 
| **`assignmentLogger`**  | [IAssignmentLogger](https://github.com/Eppo-exp/js-client-sdk-common/blob/main/src/assignment-logger.ts#L15) | A callback that sends each assignment to your data warehouse. Required only for experiment analysis. See [example](#assignment-logger) below. | `null` |
| **`requestTimeoutMs`** | number | Timeout in milliseconds for HTTPS requests for the experiment configurations. | `5000` |
| **`numInitialRequestRetries`** | number | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests. | `1` |
| **`pollAfterSuccessfulInitialization`** | boolean | Poll for new configurations (every 30 seconds) after successfully requesting the initial configurations. | `false` |
| **`pollAfterFailedInitialization`** | boolean | Poll for new configurations even if the initial configurations request failed. | `false` |
| **`throwOnFailedInitialization`** | boolean | Throw an error (reject the promise) if unable to fetch initial configurations during initialization. | `true` |
| **`numPollRequestRetries`** | number | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff. | `7` |


## Appendix

### Usage in React

For usage in React, we recommend using the below `EppoRandomizationProvider` at the root of your component tree. By default, this component waits for initialization of the SDK before rendering its children. If `waitForInitialization` is set to false, the SDK `getStringAssignment` function will return `null` assignments while initializing and will only start assigning subjects when a new browser session is started.

```tsx
import { useEffect, useState } from "react";

import { init } from "@eppo/react-native-sdk";

interface IEppoRandomizationProvider {
  waitForInitialization?: boolean;
  children: JSX.Element;
  loadingComponent?: JSX.Element;
}

export default function EppoRandomizationProvider({
  waitForInitialization = true,
  children,
  loadingComponent = <div>Loading...</div>,
}: IEppoRandomizationProvider): JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    init({
      apiKey: "<YOUR-SDK-KEY>",
      assignmentLogger: {
        logAssignment(assignment) {
          // logging implementation
        },
      },
    }).then(() => {
      return setIsInitialized(true);
    });
  }, []);

  if (!waitForInitialization || isInitialized) {
    return children;
  }
  return loadingComponent;
}
```

After the SDK is initialized, you may assign variations from any child component of `EppoRandomizationProvider`. We recommend wrapping the SDK code in a [useMemo hook](https://reactjs.org/docs/hooks-reference.html#usememo) to avoid invoking the assignment logic on every render:

```tsx
<EppoRandomizationProvider>
  <MyComponent />
</EppoRandomizationProvider>
```

```tsx
function MyComponent(): JSX.Element {
  const assignedVariation = useMemo(() => {
    const eppoClient = getInstance();
    return eppoClient.getStringAssignment("<FLAG-KEY>", "<SUBJECT-KEY>", <SUBJECT-ATTRIBUTES>, "<DEFAULT-VALUE>");
  }, []);

  return (
    <div>
      {assignedVariation === "<VARIATION-KEY>" && <p>Assigned control</p>}
    </div>
  );
}
```

### Local Storage

The SDK uses `@react-native-async-storage` to store experiment configurations downloaded from Eppo. This makes lookup by the `get<Type>Assignment` functions very fast. The configuration data stored contains the experiment key, experiment variation values, and allocations.

### Debugging

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions [detailed here](/sdks/sdk-features/debugging-flag-assignment/) to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues. 


### Assignment Logger Schema

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
