import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Android

Eppo's open source Android SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/android-sdk)
- [Maven package](https://search.maven.org/artifact/cloud.eppo/android-sdk)

## 1. Install the SDK

You can install the SDK using Gradle:

```groovy
implementation 'cloud.eppo:android-sdk:1.0.2'
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be created in the Eppo web interface:

```java
import cloud.eppo.android.EppoClient;

EppoClient eppoClient = EppoClient.init("YOUR_SDK_KEY");
```

During initialization, the SDK sends an API request to Eppo to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/overview) page. 

If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in an `AssignmentLogger` to the `init` function on SDK initialization. The SDK will invoke this `AssignmentLogger` to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `logAssignment` function which sends data into a table in your warehouse which Eppo has read access to. Here we create an instance of an `AssignmentLogger` and configure the `EppoClient` to use this logger with the `EppoClient.Builder` helper class:

```java
AssignmentLogger logger = new AssignmentLogger() {
    @Override
    public void logAssignment(Assignment assignment) {
        analytics.enqueue(TrackMessage.builder("Eppo Randomized Assignment")
                .userId(assignment.getSubject())
                .properties(ImmutableMap.builder()
                        .put("timestamp", assignment.getTimestamp())
                        .put("experiment", assignment.getExperiment())
                        .put("variation", assignment.getVariation())
                        .build()
                );
        );
    }
};

EppoClient eppoClient = new EppoClient.Builder()
    .apiKey("YOUR_SDK_KEY")
    .assignmentLogger(assignmentLogger)
    .application(application)
    .buildAndInit();
```

The SDK will invoke the `logAssignment` function with an `Assignment` object that contains the following fields:

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

```java
import cloud.eppo.android.EppoClient;

EppoClient eppoClient = EppoClient.getInstance(); // requires the SDK to already be initialized
String variation = eppoClient.getStringAssignment("<SUBJECT-KEY>", "<FLAG-KEY>");
```

The `getStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

Starting in version `v1.0.0` typed functions are available:

```
eppoClient.getBooleanAssignment(...)
eppoClient.getDoubleAssignment(...)
eppoClient.getJSONStringAssignment(...)
eppoClient.getParsedJSONAssignment(...)
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
