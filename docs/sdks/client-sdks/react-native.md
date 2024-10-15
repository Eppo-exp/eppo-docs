import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# React Native

Eppo's open source React Native SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/react-native-sdk)
- [NPM package](https://www.npmjs.com/package/@eppo/react-native-sdk)

:::note Prerequisites
Before using Eppo's SDKs, you'll need to [generate an SDK key](/sdks/sdk-keys) and [create a logging callback function](/sdks/event-logging).
:::

## 1. Install the SDK

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

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface:

```javascript
import { init } from "@eppo/react-native-sdk";

await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
});
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/architecture) page.

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).


### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `init` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function. Here we define an implementation of the Eppo `AssignmentLogger` interface containing a single function named `logAssignment`:

```javascript
import { IAssignmentLogger } from '@eppo/react-native-sdk';
import { createClient, AnalyticsProvider } from '@segment/analytics-react-native';
import { useAnalytics } from '@segment/analytics-react-native';

// Connect to Segment (or your own event-tracking system, it can be any system you like)
const segmentClient = createClient({
   writeKey: 'SEGMENT_API_KEY'
});

const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    const { track } = useAnalytics();

    track(
        'Eppo Randomized Assignment',
        {
            userId: assignment.subject,
            type: 'track',
            properties: { ...assignment }
        }
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

Assign users to flags or experiments using `get<Type>Assignment`, depending on the type of the flag.
For example, for a String-valued flag, use `getStringAssignment`:

```javascript
import * as EppoSdk from "@eppo/react-native-sdk";

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  <SUBJECT-ATTRIBUTES>, // Metadata used for targeting
  "<DEFAULT-VALUE>",
);
```

The `getStringAssignment` function takes three required and one optional input to assign a variation:

- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `subjectAttributes` - A map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call. If no attributes are needed, pass in an empty object.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `getStringAssignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get<Type>Assignment` call.


### Typed assignments

The following typed functions are available:

```javascript
getBooleanAssignment(...)
getNumericAssignment(...)
getIntegerAssignment(...)
getStringAssignment(...)
getJSONAssignment(...)
```

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::

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
