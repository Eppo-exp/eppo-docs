import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Android

Eppo's open source Android SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/android-sdk)
- [Maven package](https://search.maven.org/artifact/cloud.eppo/android-sdk)

## 1. Install the SDK

You can install the SDK using Gradle by adding to your `build.gradle` file:

```groovy
implementation 'cloud.eppo:android-sdk:3.2.0'
```

## 2. Initialize the SDK

Initialize the SDK with an SDK key, which can be created in the Eppo web interface:

```java
import cloud.eppo.android.EppoClient;

EppoClient eppoClient = EppoClient.init("YOUR_SDK_KEY");
```

During initialization, the SDK sends an API request to a CDN to retrieve the most recent experiment configurations from Eppo, 
such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. 
For more information, see the [architecture overview](/sdks/overview) page. 

This SDK also leverages cached configurations from previous fetches. During initialization, if a previously-cached configuration 
is successfully loaded, it will complete initialization with that configuration. Updates will take effect once the fetch from CDN completes.
When initialization completes from either source, it will call the optionally-provided `InitializationCallback`.

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

CountDownLatch lock = new CountDownLatch(1);

InitializationCallback initializationCallback = new InitializationCallback() {
    @Override
    public void onCompleted() {
        Log.w(TAG, "Eppo client successfully initialized");
        lock.countDown();
    }

    @Override
    public void onError(String errorMessage) {
        Log.w(TAG, "Eppo client encountered an error initializing: " + errorMessage);
        Log.w(TAG, "Eppo client will serve default values for assignments");
        lock.countDown();
    }
};

EppoClient eppoClient = new EppoClient.Builder()
    .application(application)
    .apiKey("YOUR_SDK_KEY")
    .assignmentLogger(assignmentLogger)
    .callback(initializationCallback)
    .buildAndInit();
    
lock.await(5000, TimeUnit.MILLISECONDS);
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
