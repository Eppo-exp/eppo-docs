import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript

:::note
This documentation is for our client-side SDK intended for use by browser applications. For use in server applications, refer to our [Node JS SDK](feature-flags/sdksserver-feature-flags/sdksnode).
:::

<br />

Eppo's open source JavaScript SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/js-client-sdk)
- [API Reference](https://eppo-exp.github.io/js-client-sdk/js-client-sdk.html)
- [NPM package](https://www.npmjs.com/package/@eppo/js-client-sdk)

## 1. Install the SDK

You can install the SDK with Yarn or NPM:

<Tabs>
<TabItem value="yarn" label="Yarn">

```bash
yarn add @eppo/js-client-sdk
```

</TabItem>

<TabItem value="npm" label="NPM">

```bash
npm install @eppo/js-client-sdk
```

</TabItem>

<TabItem value="script" label="Script">

```html
<script src="https://cdn.jsdelivr.net/npm/@eppo/js-client-sdk@latest/dist/eppo-sdk.min.js"></script>
```

If you install via a `<script>` tag, include a version in the URL to install a specific version of the SDK (or use `latest` as the version to install the latest SDK version):

```html
<script src="https://cdn.jsdelivr.net/npm/@eppo/js-client-sdk@{version}/dist/eppo-sdk.min.js"></script>
```

</TabItem>
</Tabs>

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: "<API_KEY>",
  assignmentLogger,
});
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

<br />

:::note
API Keys used with Client SDKs should have only 'Feature Flagging READ' permissions on, with all other permissions set to 'No Access'.
:::

<br />

### Initialization options

How the SDK fetches experiment configurations is configurable via additional optional initialization options:

| Option | Description | Default |
| ------ | ----------- | ------- | 
| **`requestTimeoutMs`** (number) | Timeout in milliseconds for HTTPS requests for the experiment configurations. | `5000` |
| **`numInitialRequestRetries`** (number) | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests. | `1` |
| **`pollAfterSuccessfulInitialization`** (boolean) | Poll for new configurations (every 30 seconds) after successfully requesting the initial configurations. | `false` |
| **`pollAfterFailedInitialization`** (boolean) | Poll for new configurations even if the initial configurations request failed. | `false` |
| **`throwOnFailedInitialization`** (boolean) | Throw an error (reject the promise) if unable to fetch initial configurations during initialization. | `true` |
| **`numPollRequestRetries`** (number) | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff. | `7` |

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `init` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo `AssignmentLogger` interface containing a single function named `logAssignment`:

```javascript
import { IAssignmentLogger } from "@eppo/js-client-sdk";
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

## 3. Assign variations

Assigning users to flags or experiments with a single `getStringAssignment` function:

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-OR-EXPERIMENT-KEY>",
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

## Appendix

### Usage in React

For usage in React, we recommend using the below `EppoRandomizationProvider` at the root of your component tree. By default, this component waits for initialization of the SDK before rendering its children. If `waitForInitialization` is set to false, the SDK `getStringAssignment` function will return `null` assignments while initializing and will only start assigning subjects when a new browser session is started.

```tsx
import { useEffect, useState } from "react";

import { init } from "@eppo/js-client-sdk";

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
      apiKey: "<YOUR-API-KEY>",
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
    return eppoClient.getStringAssignment("<SUBJECT-KEY>", "<EXPERIMENT-KEY>");
  }, []);

  return (
    <div>
      {assignedVariation === "<VARIATION-KEY>" && <p>Assigned control</p>}
    </div>
  );
}
```

### Browser Support

The SDK is supported on all modern browsers. It relies on JavaScript promises, which may not be supported on older browsers including IE. If you need to run the SDK on a browser that does not support promises, it is possible to use a [polyfill library](https://www.npmjs.com/package/promise-polyfill).

### Local Storage

The SDK uses browser local storage to store experiment configurations downloaded from Eppo. This allows for quick lookup by the `getStringAssignment` function. The configuration data stored contains the experiment key, experiment variation values, traffic allocation, and any allow-list overrides.
