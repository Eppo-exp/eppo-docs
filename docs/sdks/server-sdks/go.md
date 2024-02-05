import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Go

Eppo's open source Go SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/golang-sdk)
- [Package](https://pkg.go.dev/github.com/Eppo-exp/golang-sdk)

## 1. Install the SDK

In your `go.mod`, add the SDK package as a dependency:

```
require (
	github.com/Eppo-exp/golang-sdk/v2
)
```

Or you can install the SDK from the command line with:

```
go get github.com/Eppo-exp/golang-sdk/v2
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```go

import (
	"github.com/Eppo-exp/golang-sdk/v2/eppoclient"
)

var eppoClient = &eppoclient.EppoClient{}

func main() {
	assignmentLogger := NewExampleAssignmentLogger()

	eppoClient = eppoclient.InitClient(eppoclient.Config{
		ApiKey:           "<your_api_key>",
		AssignmentLogger: assignmentLogger,
	})
}
```

After initialization, the SDK begins polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `InitClient` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `LogAssignment` function. Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `LogAssignment`:

```go
import (
	"github.com/Eppo-exp/golang-sdk/v2/eppoclient"
  "gopkg.in/segmentio/analytics-go.v3"
)

func main() {
  // Connect to Segment (or your own event-tracking system)
  client := analytics.New("YOUR_WRITE_KEY")
  defer client.Close()

  type ExampleAssignmentLogger struct {
  }

  func NewExampleAssignmentLogger() *ExampleAssignmentLogger {
    return &ExampleAssignmentLogger{}
  }

  func (al *ExampleAssignmentLogger) LogAssignment(event eppoclient.AssignmentEvent) {
    client.Enqueue(analytics.Track{
      UserId: event.Subject,
      Event:  "Eppo Randomization Event",
      Properties: event
    })
  }
}
```

The SDK will invoke the `LogAssignment` function with an `event` object that contains the following fields:

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
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/guides/event-logging/) page.
:::

## 3. Assign variations

Assigning users to flags or experiments with a single `GetStringAssignment` function:

```go
import (
	"github.com/Eppo-exp/golang-sdk/v2/eppoclient"
)

var eppoClient = &eppoclient.EppoClient{} // in global scope
variation := eppoClient.GetStringAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", <TARGETING_ATTRIBUTES>);
```

The `GetStringAssignment` function takes two required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey` - This key is available on the detail page for both flags and experiments.
- `targetingAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

### Typed assignments

Additional functions are available:

```
GetBoolAssignment(...)
GetNumericAssignment(...)
GetJSONStringAssignment(...)
```

### Handling the empty assignment

We recommend always handling the empty assignment case, when the SDK returns `""`. Here are some examples illustrating when the SDK returns `""`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `""` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `""` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3.  If `getStringAssignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `""` if no configurations have been downloaded.

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
