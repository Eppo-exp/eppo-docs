# Event tracking

Eppo's Tracking APIs allow you to record any actions your users perform, like "Signed Up", "Made a Purchase" or "Clicked a Button",
along with any properties that describe the action. Once you send these events, Eppo will ingest them, batch, process and load into your data warehouse. You can then use those events in your warehouse to run experiments, construct data pipelines, or power custom tools/dashboards.

## Benefits of using the Track API

* **Deeper Insights**: You can better understand how people use your product. That helps you figure out where users might get stuck, what features they love, and what drives them to come back.
* **Personalized Experiences**: Once you know what actions users are taking, you can customize their experience—like sending personalized messages or recommending features they’d find useful.
* **Consistent Data Flow**: By centralizing your event tracking with an API call, you keep everything neat and standard across all your different tools (analytics, CRM, marketing platforms, etc.).

## When to Use It

Use the Track API any time you want to record a user’s action. This could be:

* User signs up or completes onboarding;
* User views specific screens or pages;
* User interacts with certain in-app features (clicking a button, changing a setting, etc.);
* Transactions, such as making a purchase or completing a subscription upgrade;


## Example usage
Events are composed of a `type` string, and a `payload`. The `payload` can contain any properties you'd like to associate with the event. The maximum length of the stringified JSON `payload` is 4096.

Here's an example of how you might use the Track API in a Browser application:

```typescript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
eppoClient.track({
  type: "added_to_cart",
  payload: {
    productId: "abc-987",
    userId: "123",
    price: 24.99
  }
});
```

## Data Organization
When configuring Eppo for experimentation, you provide Eppo with a dataset/schema to use for writing intermediate tables for experiment analysis. We use this same dataset for writing events logged by our SDKs. This enables maximum performance when using events in experiment analysis.


## System latency
Events tracked with our SDKs are buffered to local storage on the user's device (or server, depending on the SDK) before being sent in batches to Eppo's servers. We then do additional batching before writing the results into your warehouse.

The frequency of updates/latency depends on the load/availability of compute resources in your warehouse. You are able to configure how often, and optionally during what times of day events are loaded into your warehouse. The maximum frequency which you are able to configure events to be loaded into your warehouse is 10 minutes.


## SDK Configuration
In order to use the event tracking APIs in the Eppo SDKs, you need to use an SDK key which was created after November 15, 2024. SDK keys created prior to this date can still be used for feature flag/experiments, but not event tracking.

Other than using a compatible SDK key, there is no additional configuration required - simply initialize the SDK with your SDK key, and start tracking events.

In order to override the default behavior of aspects of event uploading, you can modify the following properties (see language-specific pages for examples):

| Property | Description |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |

```typescript
import { init } from "@eppo/js-client-sdk";
await init({ apiKey: "YOUR_SDK_KEY" });
```


```typescript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: "YOUR_SDK_KEY",
  // ...other config options
  // Track API configuration below - all fields are optional
  eventIngestionConfig: {
    /** Number of milliseconds to wait between each batch delivery. Defaults to 10 seconds. */
    deliveryIntervalMs: 10_000,
    /** Minimum amount of milliseconds to wait before retrying a failed delivery. Defaults to 5 seconds */
    retryIntervalMs: 5_000,
    /** Maximum amount of milliseconds to wait before retrying a failed delivery. Defaults to 30 seconds. */
    maxRetryDelayMs: 30_000,
    /** Maximum number of retry attempts before giving up on a batch delivery. Defaults to 3 retries. */
    maxRetries: 3,
    /** Maximum number of events to send per delivery request. Defaults to 1000 events. */
    batchSize: 1_000,
    /**
     * Maximum number of events to queue in memory before starting to drop events.
     * Note: This is only used if localStorage is not available.
     * Defaults to 10000 events.
     */
    maxQueueSize: 10_000,
  }
})
```

## Warehouse Configuration

Events are by default sent to a table named `eppo_events`.
Note: There is a special case handling for *assignment logging events* (which are all events with the type `eppo_assignment`).
These events are treated differently and are, instead, sent to a special table named `eppo_assignments`.
Events are synchronized to the configured data warehouse every 10 minutes by default.

TODOS:
* Warehouse table schema
