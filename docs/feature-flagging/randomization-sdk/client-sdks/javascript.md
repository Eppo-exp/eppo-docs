import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript

:::note
This documentation is for our client-side SDK intended for use by browser applications. For use in server applications, refer to our [Node JS SDK](../server-sdks/node.md).
:::

### 1. Install the SDK
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
</Tabs>

### 2. Define an Assignment Logger

The SDK requires an assignment logger to be passed on initialization. The SDK invokes the logger to capture assignment data whenever a variation is assigned. The below code example shows how to integrate the SDK with [Segment](https://segment.com/docs/) for logging events. You could also use your own logging system; the only requirement is that the SDK receives a `logAssignment` function.

Define an implementation of the Eppo `AssignmentLogger` interface. This interface has one function: `logAssignment`.

```javascript
import { IAssignmentLogger } from '@eppo/js-client-sdk';
import { AnalyticsBrowser } from '@segment/analytics-next'

// Connect to Segment (or your own event-tracking system)
const analytics = AnalyticsBrowser.load({ writeKey: '<SEGMENT_WRITE_KEY>' })

const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: 'Eppo Randomized Assignment',
      type: 'track',
      properties: { ...assignment }
    });
  },
};
```

The SDK will invoke the `logAssignment` function with an `assignment` object that contains the following fields:

| Field | Description | Example |
| --------- | ------- | ---------- |
| `experiment` (string) | An Eppo experiment key | "recommendation_algo" |
| `subject` (string) | An identifier of the subject or user assigned to the experiment variation | UUID |
| `variation` (string) | The experiment variation the subject was assigned to | "control" |
| `timestamp` (string) | The time when the subject was assigned to the variation | 2021-06-22T17:35:12.000Z |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }` |

### 3. Initialize the SDK

Initialize the SDK with the event logger from the previous section and your API key.:

```javascript
import { init } from '@eppo/js-client-sdk';

await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});
```

The `init` method downloads your Eppo experiment configurations once per browser session.

:::note
API Keys used with Client SDKs should have only ‘Randomization READ’ permissions
:::

### 4. Assign Experiment Variations 
The SDK returns an assignment based on the experiments you configure in Eppo. It may take up to 10 minutes for changes to Eppo experiments to be reflected by the SDK assignments.

The SDK requires two inputs to assign a variation:
- `experimentKey` - this should be the same as the “Experiment Key” field of an Eppo experiment
- `subjectKey` - the entity ID that is being experimented on, typically represented by a uuid.

The below code example shows how to assign a subject to an experiment variation:

```javascript
import * as EppoSdk from '@eppo/js-client-sdk';

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment("<SUBJECT-ID>", "<EXPERIMENT-KEY>");
```

The experiment **Traffic Allocation** setting determines the percentage of subjects the SDK will assign to experiment variations. For example, if the traffic allocation is 25%, the assignment function will return a variation for 25% of subjects and `null` for the remaining 75%. If the **Traffic Allocation** is zero but subjects have been added to a variation **Allow List**, the SDK will return the variation for the allow-listed subjects.

If `getAssignment` is invoked before the SDK has initialized, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return null if no configurations have been downloaded. The `getAssignment` function returns the same variation for the duration of the browser session; if experiment settings are updated, they will only take effect when a new browser session is started.

### Usage in React

For usage in React, we recommend initializing the SDK in a [useEffect hook](https://reactjs.org/docs/hooks-effect.html) at the root of your component tree:

```tsx
import { IAssignmentLogger, init } from '@eppo/js-client-sdk';

function RootComponent(): JSX.Element {
  useEffect(() => {
    const assignmentLogger: IAssignmentLogger = {
      logAssignment(assignment) {
        // logging implementation
      },
    }
    init({ apiKey: '<API-KEY>', assignmentLogger });
  }, []);

  // your react code
}
```

After the SDK is initialized, you may assign variations from any component in your React application. We recommend wrapping the SDK code in a [useMemo hook](https://reactjs.org/docs/hooks-reference.html#usememo) to avoid invoking the assignment logic on every render:

```tsx
function MyComponent({ subjectKey, experimentKey }): JSX.Element {
  const assignedVariation = useMemo(() => {
    const eppoClient = getInstance();
    return eppoClient.getAssignment(subjectKey, experimentKey);
  }, [subjectKey, experimentKey])

  return (
    <div>
      { assignedVariation === 'control' && <p>Assigned control</p>}
      { assignedVariation === 'treatment' && <p>Assigned treatment</p>}
    </div>
  );
}
```

### Browser Support

The SDK is supported on all modern browsers. It relies on JavaScript promises, which may not be supported on older browsers including IE. If you need to run the SDK on a browser that does not support promises, it is possible to use a [polyfill library](https://www.npmjs.com/package/promise-polyfill).

### Local Storage

The SDK uses browser local storage to store experiment configurations downloaded from Eppo. This allows for quick lookup by the `getAssignment` function. The configuration data stored contains the experiment key, experiment variation values, traffic allocation, and any allow-list overrides.

### Links
- [GitHub repository](https://github.com/Eppo-exp/js-client-sdk)
- [API Reference](https://eppo-exp.github.io/js-client-sdk/js-client-sdk.html)
- [NPM package](https://www.npmjs.com/package/@eppo/js-client-sdk)
