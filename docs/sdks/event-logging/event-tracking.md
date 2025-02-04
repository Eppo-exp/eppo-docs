# Event tracking

Eppo's Track API allow you to record any actions your users perform, like "Signed Up", "Made a Purchase" or "Clicked a Button",
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
eppoClient.track("added_to_cart", {
  productId: "abc-987",
  userId: "123",
  price: 24.99
});
```

## Data Organization
When configuring Eppo for experimentation, you provide Eppo with a dataset/schema to use for writing intermediate tables for experiment analysis. We use this same dataset for writing events logged by our SDKs. This ensures maximum performance when using metrics based on these events in experiment analysis.

### Events table
By default, each event `type` will be stored in a single table called `eppo_events`. This table contains the following fields:
| Column Name | Type | Description |
|-------------|------|-------------|
| `timestamp` | `TIMESTAMP` | When the event was created/tracked (populated automatically) |
| `type` | `VARCHAR` | Type of the event |
| `payload` | `VARCHAR` | Payload of the event in JSON format |
| `uuid` | `VARCHAR` | UUID of the event (populated automatically) |
| `api_key_prefix` | `VARCHAR` | Prefix of the SDK key used to log the event (populated automatically) |
| `client_ip_fingerprint` | `VARCHAR` | Fingerprint of the IP address of the client that logged the event (populated automatically) |
| `environment` | `VARCHAR` | Environment of the event (populated automatically based on the SDK key used) |


### Custom tables
You can also configure a certain event `type` to be stored in its own table, with a specific schema. Rather than having a single column that contains the `payload` sent to the SDK, custom tables can have specific events which are extracted from events in the `payload`.

For example, consider the following event:

```
{
  "type": "item_added_to_cart",
  "payload": {
    "user_id": "user_123",
    "item_id": "item_456",
    "item_name": "Some Widget",
    "price": 10.00,
    "currency": "USD"
  }
}
```

This event can be configured to be stored in a custom table, with each field in the payload represented as a column in the table. The resulting table will have the following structure (with underlying types depending on your warehouse):
| Column Name | Type | Description |
|-------------|------|-------------|
| user_id | `VARCHAR` | ID of the user who added the item to the cart |
| item_id | `VARCHAR` | ID of the item added to the cart |
| item_name | `VARCHAR` | Name of the item added to the cart |
| price | `DECIMAL` | Price of the item added to the cart |
| currency | `VARCHAR` | Currency of the item added to the cart |
| timestamp | `TIMESTAMP` | When the event was created/tracked (populated automatically) |
| uuid | `VARCHAR` | UUID of the event (populated automatically) |
| api_key_prefix | `VARCHAR` | Prefix of the SDK key used to log the event (populated automatically) |
| client_ip_fingerprint | `VARCHAR` | Fingerprint of the IP address of the client that logged the event (populated automatically) |
| environment | `VARCHAR` | Environment of the event (populated automatically based on the SDK key used) |

Once a table is configured, the schema can only be modified in a backward-compatible manner. This means that you cannot remove or change columns, but you can add new columns.


## System latency
Events tracked with our SDKs are buffered to local storage on the user's device (or server, depending on the SDK) before being sent in batches to Eppo's servers. We then do additional batching before writing the results into your warehouse.

The frequency of updates/latency depends on the load/availability of compute resources in your warehouse. You are able to configure how often, and optionally during what times of day events are loaded into your warehouse. The maximum frequency which you are able to configure events to be loaded into your warehouse is 10 minutes.


## SDK Configuration
In order to use the Track API in the Eppo SDKs, you need to use an SDK key which was created after November 15, 2024. SDK keys created prior to this date can still be used for feature flag/experiments, but not event tracking.

Other than using a compatible SDK key, there is no additional configuration required. Simply initialize the SDK with your SDK key, and start tracking events.

In order to override the default behavior of certain aspects of event handling, you can modify the following properties (see language-specific pages for examples):

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `deliveryIntervalMs` | `number` | Time to wait between each batch delivery, in milliseconds. | 10,000 (10 seconds) |
| `retryIntervalMs` | `number` | Minimum time to wait before retrying a failed delivery, in milliseconds. | 5,000 (5 seconds) |
| `maxRetryDelayMs` | `number` | Maximum time to wait before retrying a failed delivery, in milliseconds. | 30,000 (30 seconds) |
| `maxRetries` | `number` | Maximum number of retry attempts before giving up on a batch delivery. | 3 |
| `batchSize` | `number` | Maximum number of events to send per batch/network request. | 1,000 |
| `maxQueueSize` | `number` | Maximum number of events to queue in memory before starting to drop events. | 10,000 |
