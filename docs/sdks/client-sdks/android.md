import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Android

Eppo's open source Android SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/android-sdk)
- [Maven package](https://search.maven.org/artifact/cloud.eppo/android-sdk)

## 1. Install the SDK

You can install the SDK using Gradle by adding to your `build.gradle` file:

```groovy
implementation 'cloud.eppo:android-sdk:4.1.0'
```

## 2. Initialize the SDK

Initialize the SDK with the Android Application and an SDK key, which can be created in the Eppo web interface:

```java
import cloud.eppo.android.EppoClient;

EppoClient eppoClient = new EppoClient.Builder("YOUR_SDK_KEY", getApplication())
    .buildAndInit();
```

There are **blocking** and **non-blocking** initialization methods:

```java
CompletableFuture<EppoClient> eppoClientFuture = new EppoClient.Builder("YOUR_SDK_KEY", getApplication())
    .buildAndInitAsync();
``` 

During initialization, the SDK sends an API request to a CDN to retrieve the most recent experiment configurations from Eppo, 
such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. 
For more information, see the [architecture overview](/sdks/architecture) page. 

This SDK also leverages cached configurations from previous fetches. During initialization, if a previously-cached configuration 
is successfully loaded, it will complete initialization with that configuration. Updates will take effect once the fetch from CDN completes.

The initialization methods, `buildAndInit` and `buildAndInitAsync` return or resolve to an `EppoClient` instance with a loaded configuration.

### Initial Configuration

You can pass an initial configuration payload (of type `byte[]`) to the `EppoClient.Builder` class. This prevents the `EppoClient` from loading its initial configuration from a cached source, but **does not prevent an initial fetch**. You must use `offlineMode` to prevent fetching upon initialization.

```java
    // Example app configuration payload
    interface MyAppConfig {
        String getEppoConfig();
    }

    // Initialize the Eppo Client with the async result of the initial client configuration.

    // 1. Fetch your apps initial configuration
    CompletableFuture<MyAppConfig> initialconfigFuture = ...;

    // 2. Transoform the result into just the Eppo Configuration string (byte array).
    CompletableFuture<byte[]> eppoConfigBytes = initialconfigFuture.thenApply(
        ic-> ic.getEppoConfig().getBytes());

    // 3. Build the client with the asycn initial config
    CompletableFuture<EppoClient> clientFuture = new EppoClient.Builder(API_KEY, getApplication())
        .initialConfiguration(eppoConfigBytes)
        .buildAndInitAsync();

    // 4. Start assigning when the client is ready
    EppoClient eppoClient = clientFuture.get();
    String variation = eppoClient.getStringAssignment(...);
```

### Offline Mode
Using `offlineMode` mode prevents the `EppoClient` from sending an API request upon initialization. When set to `true`, the `EppoClient` will attempt to load configuration from a cache on the device, or an `initialConfiguration`, if provided. The latest configuration can be pulled from the API server at any time using the `EppoClient.loadConfiguration` and `EppoClient.loadConfigurationAsync` methods.

```java
    EppoClient eppoClient = new EppoClient.Builder("YOUR_SDK_KEY", getApplication())
        .initialConfiguration(initialConfigurationPayload)
        .offlineMode(true)
        .buildAndInit();

    // Get assignments using initial/cached configuration
    String variation = eppoClient.getStringAssignment(...);

    // Load the latest (also saves this to the local cache).
    eppoClient.loadConfiguration();

    // Get assignments using the latest
    String variation = eppoClient.getStringAssignment(...);
```

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e., randomization), pass in an `AssignmentLogger` to the `init` function on SDK initialization. The SDK will invoke this `AssignmentLogger` to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function which sends data into a table in your warehouse which Eppo has read access to. Here we create an instance of an `AssignmentLogger` and configure the `EppoClient` to use this logger with the `EppoClient.Builder` helper class:

```java
AssignmentLogger assignmentLogger = new AssignmentLogger() {
    @Override
    public void logAssignment(Assignment assignment) {
        analytics.enqueue(TrackMessage.builder("Eppo Randomized Assignment")
                .userId(assignment.getSubject())
                .properties(ImmutableMap.builder()
                        .put("timestamp", assignment.getTimestamp())
                        .put("experiment", assignment.getExperiment())
                        .put("subject", assignment.getSubject())
                        .put("variation", assignment.getVariation())
                        .build()
                )
        );
    }
};


CompletableFuture<EppoClient> eppoClientFuture = new EppoClient.Builder("YOUR_SDK_KEY", getApplication())
    .assignmentLogger(assignmentLogger)
    .buildAndInitAsync();

EppoClient eppoClient;
try {
    eppoClient = eppoClientFuture.get(5000, TimeUnit.MILLISECONDS);
} catch (ExecutionException | TimeoutException | InterruptedException e) {
    // Eppo Client failed to initialize within 5 seconds.
    throw new RuntimeException(e);
}
```

The SDK will invoke the `logAssignment` function with an `Assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                                 |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z                |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"                   |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                         |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17"     |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                    |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`                   |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                               |
| `extraLogging` (map)      | A map of string logging fields to string values of any extra information to be logged by the assignment                  | `{ "allocationvalue_type": "rollout" }` |
| `metaData` (map)          | A map of string meta data fields to string values of any meta data associated with the assignment                        | `{ "sdkLibVersion": "3.0.0" }`          |


:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## 3. Assign variations

Assign users to flags or experiments using the assignment function that corresponds with the value type of the flag's variations 
as set up in the Eppo web application.

```java
import cloud.eppo.android.EppoClient;

EppoClient eppoClient = EppoClient.getInstance(); // requires the SDK to have already been initialized
String variation = eppoClient.getStringAssignment("<FLAG KEY>", "<SUBJECT KEY>", "<DEFAULT VALUE>");
```

The assignment functions take three required and one optional parameter to assign a variation:
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectKey` - The entity ID that is being experimented on, such as a user identifier, typically represented by an uuid.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.
- `defaultValue` - The value to return if no variation is assigned, or an error is encountered making an assignment. Often this is the same as the control variation.

The following typed functions are available:

```java
eppoClient.getBooleanAssignment(...)
eppoClient.getIntegerAssignment(...)
eppoClient.getDoubleAssignment(...)
eppoClient.getStringAssignment(...)
eppoClient.getJSONAssignment(...)
```

:::note
Changes in the Eppo web application may take up to 30 seconds to propagate to the CDN, where the SDK fetches updated
assignments upon initialization.
:::
