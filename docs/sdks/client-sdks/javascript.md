import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript

:::note
This documentation is for our client-side SDK intended for use by browser applications. For use in server applications, refer to our [Node JS SDK](/sdks/server-sdks/node).
:::

<br />

Eppo's open source JavaScript SDK can be used for both feature flagging and experiment assignment.

- [GitHub repository](https://github.com/Eppo-exp/js-client-sdk)
- [SDK Reference](https://eppo-exp.github.io/js-client-sdk/js-client-sdk.html)
- [NPM package](https://www.npmjs.com/package/@eppo/js-client-sdk)

## Getting Started

### Installation

You can install the SDK with Yarn, NPM, or via a script tag:

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

### Usage

Begin by initializing a singleton instance of Eppo's client with a key from the [Eppo interface](https://eppo.cloud/feature-flags/keys). Once initialized, the client can be used to make assignments anywhere in your app.

#### Initialize once

```javascript
import { init } from "@eppo/js-client-sdk";

await init({apiKey: "<SDK_KEY>"});
```

#### Assign anywhere

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
const user = getCurrentUser();

const variation = eppoClient.getBooleanAssignment('show-new-feature', user.id, { 
  'country': user.country,
  'device': user.device,
}, false);
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations (variation values, traffic allocation, etc.). The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

You can customize initialization and polling preferences by passing in additional [initialization options](#initialization-options).

### Connecting an event logger

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. This is done with a logging callback function defined at SDK initialization. 

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
});
```

This logger takes an [analytic event](#assignment-logger-schema) created by Eppo, `assignment`, and writes in to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift). You can read more on the [Event Logging](/sdks/event-logging) page.

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

#### Deduplicating assignment logs

Eppo's SDK uses an internal cache to ensure that duplicate assignment events are not logged to the data warehouse. While Eppo's analytic engine will automatically deduplicate assignment records, this internal cache prevents firing unnecessary events and can help minimize costs associated with event logging.

### Getting variations

Now that the SDK is initialized and connected to your event logger, you can check what variant a specific subject (typically user) should see by calling the `get<Type>Assignment` functions.

For example, for a string-valued flag, use `getStringAssignment`:

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getStringAssignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  <SUBJECT-ATTRIBUTES>, // Metadata used for targeting
  "<DEFAULT-VALUE>",
);
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

Each function has the same signature, but returns the type in the function name. For booleans use `getBooleanAssignment`, which has the following signature:

```javascript
getBooleanAssignment: (
  flagKey: string,
  subjectKey: string,
  subjectAttributes: Record<string, any>,
  defaultValue: string,
) => boolean
```

To read more about different flag types, see the [Flag Variations](/feature-flagging/concepts/flag-variations) page.

## Advanced Options

### Initialization Options

How the SDK fetches, serves, and caches experiment configurations is configurable via additional optional initialization options:

| Option                                            | Description                                                                                                                                                                                                                                                                                                                            | Default         |
|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------| 
| **`requestTimeoutMs`** (number)                   | Timeout in milliseconds for HTTPS requests for the experiment configurations.                                                                                                                                                                                                                                                          | `5000`          |
| **`numInitialRequestRetries`** (number)           | Number of _additional_ times the initial configurations request will be attempted if it fails. This is the request typically synchronously waited (via `await`) for completion. A small wait will be done between requests.                                                                                                            | `1`             |
| **`pollAfterSuccessfulInitialization`** (boolean) | Poll for new configurations (every 30 seconds) after successfully requesting the initial configurations.                                                                                                                                                                                                                               | `false`         |
| **`pollAfterFailedInitialization`** (boolean)     | Poll for new configurations even if the initial configurations request failed.                                                                                                                                                                                                                                                         | `false`         |
| **`throwOnFailedInitialization`** (boolean)       | Throw an error (reject the promise) if unable to fetch initial configurations during initialization.                                                                                                                                                                                                                                   | `true`          |
| **`numPollRequestRetries`** (number)              | If polling for updated configurations after initialization, the number of additional times a request will be attempted before giving up. Subsequent attempts are done using an exponential backoff.                                                                                                                                    | `7`             |
| **`skipInitialRequest`** (boolean)                | Skip the initial request for a new configuration during initialization (if polling is enabled, this will still take place later)                                                                                                                                                                                                       | `false`         |
| **`persistentStore`** (IAsyncStore)               | An asynchronous, persistent storage for caching fetched flag configurations for use in subsequent sessions                                                                                                                                                                                                                             | _Eppo provided_ |
| **`maxCacheAgeSeconds`** (number)                 | Maximum age, in seconds, that a previously cached configuration is considered valid and the wait-time before fetching a fresh configuration                                                                                                                                                                                            | `0`             |
| **`useExpiredCache`** (boolean)                   | Consider initialization successfully complete without fetching updates, even if the configuration loaded from the cache is expired                                                                                                                                                                                                     | `false`         |
| **`updateOnFetch`** (always\|expired\|empty)      | Sets how the configuration is updated after a successful fetch:<br/>• always - immediately start using the new configuration<br/>• expired - immediately start using the new configuration only if the current one has expired<br/>• empty - only use the new configuration if the current one is both expired and uninitialized/empty | `'always'`      |

#### Configuration cache
The SDK can cache previously loaded configurations for use in subsequent sessions, speeding up the time for the SDK to initialize.
By default, a Local Storage-based cache is used in a browser environment and a Chrome Storage-based cache is used in a Chrome extension environment.
A custom cache can be provided as the `persistentStore` initialization option.

Caches have a concept of being "expired", dictated by the `maxCacheAgeSeconds` initialization option, and also overridable by the implementation of `isExpired()` for a custom persistent store.
When the cached configuration is not expired, it is considered valid and no fetches will be made for updated configurations.

When fetches are made--either from initialization or regular polling--you can control when the changes take effect with the `updateOnFetch` initialization option.
The default of `'always'` will start serving values from the most up-to-date configuration immediately. `'expired'` will only update if the cached configuration--now being used to serve assignments--has expired. 
This is useful in combination with polling to prevent configurations in long-lived sessions from getting too stale. `'empty'` will only update if there is no pre-existing configuration (expired or not) and is 
useful in combination with `useExpiredCache` for quickly initializing using a cached configuration and maintaining consistent assignments throughout the session even when the configuration is old. 
It is essentially prefetching an updated configuration for the next session. 

#### Example configuration options

For example, if you want to optimize for always using the latest flag values, you would consider anything cached expired, leave the default of not using expired cached configurations, configuring the SDK to poll after successful and failed initializations, and leave the default of `'always'` updating after a fetch.
```ts
// Default settings left alone
maxCacheAgeSeconds: 0, // Always consider cached configurations expired
useExpiredCache: false, // Wait for an updated configuration to be fetched before initialization is considered successful
updateOnFetch: 'always', // Immediately start using the new configuration after it is fetched
requestTimeoutMs: 5000, // Don't time out the initial configuration request until five seconds has passed
numInitialRequestRetries: 1, // If the initial configuration request fails, try one more time  
// Settings set to non-default values
pollAfterSuccessfulInitialization: true, // Check for updated configurations every 30 seconds
pollAfterFailedInitialization: false, // Check for updated configurations even if initialization wasn't able to load one
```

However, if you want to optimize for the quickest time to initialization and serving assignments--even if those assignments are old, you would allow initializing with older configurations. You also could reduce the initial fetch timeout and retries to quickly fall back to default values.
```ts
// Default settings left alone
updateOnFetch: 'always', // Immediately start using the new configuration once it is fetched
// Settings set to non-default values
maxCacheAgeSeconds: 300, // Don't even bother fetching updated configurations unless the last one is more than five minutes old
useExpiredCache: true, // If the cached configuration is expired, use it to serve assignments until an updated one is fetched
requestTimeoutMs: 500, // Give up on fetching updated configurations after half a second and--if this is the first-ever initialization--just serve default values
numInitialRequestRetries: 0, // Don't retry a failed initialization fetch
```

Note that when new configurations are loaded, the same flag may start getting a different assignment for the same session. If you want to avoid this, and have consistent assignments until the next initialization, change `updateOnFetch` to `empty`.
You could consider caches always expired so that it non-blocking loads an updated configuration to be used in the next session.
```ts
// Default settings left alone
maxCacheAgeSeconds: 0, // Always consider cached configurations expired
// Settings set to non-default values
updateOnFetch: 'empty', // Immediately start using the new configuration once it is fetched
useExpiredCache: true, // Always used the previously cached assignments
requestTimeoutMs: 500, // Give up on fetching updated configurations after half a second and--if this is the first-ever initialization--just serve default values
numInitialRequestRetries: 0, // Don't retry a failed initialization fetch
```

### Offline initialization

Eppo's SDK supports offline initialization if you want to initialize the SDK with a configuration from your server SDK or other external process. In this mode the SDK will not attempt to fetch a configuration from Eppo's CDN, instead only using the provided values.

This function is synchronous and ready to handle assignments after it returns.

```javascript
import { offlineInit, Flag, ObfuscatedFlag } from "@eppo/js-client-sdk";

// configuration from your server SDK
const configurationJsonString: string = getConfigurationFromServer();

// The configuration will be not-obfuscated from your server SDK.
// If you have obfuscated flag values, you can use the `ObfuscatedFlag` type.
const flagsConfiguration: Record<string, Flag | ObfuscatedFlag> = JSON.parse(configurationJsonString);

offlineInit({ 
  flagsConfiguration,
  // If you have obfuscated flag values, you can use the `ObfuscatedFlag` type.
  isObfuscated: true,
 });
```

The `offlineInit` function accepts the following optional configuration arguments.

| Option | Type | Description | Default |
| ------ | ----- | ----- | ----- | 
| **`assignmentLogger`**  | [IAssignmentLogger](https://github.com/Eppo-exp/js-client-sdk-common/blob/75c2ea1d91101d579138d07d46fca4c6ea4aafaf/src/assignment-logger.ts#L55-L62) | A callback that sends each assignment to your data warehouse. Required only for experiment analysis. See [example](#assignment-logger) below. | `null` |
| **`flagsConfiguration`** | Record<string, Flag \| ObfuscatedFlag> | The flags configuration to use for the SDK. | `null` |
| **`isObfuscated`** | boolean | Whether the flag values are obfuscated. | `false` |
| **`throwOnFailedInitialization`** | boolean | Throw an error if an error occurs during initialization. | `true` |

## Assignment Logger Schema

The SDK will invoke the `logAssignment` function with an `assignment` object that contains the following fields:

| Field                              | Description                                                                                                              | Example                                                                          |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| `timestamp` (string)               | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                                                         |
| `featureFlag` (string)             | An Eppo feature flag key                                                                                                 | "recommendation-algo"                                                            |
| `allocation` (string)              | An Eppo allocation key                                                                                                   | "allocation-17"                                                                  |
| `experiment` (string)              | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"                                              |
| `subject` (string)                 | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                                                             |
| `subjectAttributes` (map)          | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`                                                            |
| `variation` (string)               | The experiment variation the subject was assigned to                                                                     | "control"                                                                        |
| `metaData` (Record<string,string>) | Metadata around the assignment, such as the version of the SDK                                                           | `{ "obfuscated: "true", "sdkLanguage": "javascript", "sdkLibVersion": "3.2.1" }` |

More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.

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

### Browser Support

The SDK is supported on all modern browsers. It relies on JavaScript promises, which may not be supported on older browsers including IE. If you need to run the SDK on a browser that does not support promises, it is possible to use a [polyfill library](https://www.npmjs.com/package/promise-polyfill).

### Local Storage

The SDK uses browser local storage to store experiment configurations downloaded from Eppo. This allows for quick lookup by the `getStringAssignment` function. The configuration data stored contains the experiment key, experiment variation values, traffic allocation, and any allow-list overrides.

### Debugging

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions [detailed here](/sdks/sdk-features/debugging-flag-assignment/) to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues. 
