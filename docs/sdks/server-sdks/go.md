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
	github.com/Eppo-exp/golang-sdk/v6
)
```

Or you can install the SDK from the command line with:

```
go get github.com/Eppo-exp/golang-sdk/v6
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```go

import (
  "github.com/Eppo-exp/golang-sdk/v6/eppoclient"
)

var eppoClient = &eppoclient.EppoClient{}

func main() {
  eppoClient, err = eppoclient.InitClient(eppoclient.Config{
    SdkKey: "<your_sdk_key>",
  })

  select {
    case <-client.Initialized():
    case <-time.After(2 * time.Second):
      log.Warn("Timed out waiting for Eppo SDK to initialize")
  }
}
```

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/architecture/overview) page.

### Waiting for initialization

Depending on your server application's lifecycle, you may need to wait for the SDK to initialize before making assignments

Starting with the `6.1.0` tag, the `Initialized` channel is provided to facilitate this and can optionally be used with a timeout to allow you application to continue.

Before this tag, the SDK was initialized asynchronously and assignments could be made immediately but will not be guaranteed to have the most recent experiment configurations, returning the `DEFAULT-VALUE` if the SDK was not initialized in time. If this is not desired in your application, a suggested approach on older versions is to introduce a brief delay after startup to allow the SDK to initialize before making assignments.

```go
import (
  "time"
)

func main() {
  eppoClient, err = eppoclient.InitClient(eppoclient.Config{
    SdkKey: "<your_sdk_key>",
  })

  time.Sleep(2 * time.Second)

  variation, err := eppoClient.GetStringAssignment("<FLAG-KEY>", "<SUBJECT-KEY>", <TARGETING-ATTRIBUTES>, <DEFAULT-VALUE>);
}
```

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `InitClient` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `LogAssignment` function. 

Here we define an implementation of the Eppo `IAssignmentLogger` interface:

```go
type IAssignmentLogger interface {
  LogAssignment(event eppoclient.AssignmentEvent)
}
```

Example implementation:

```go
import (
  "github.com/Eppo-exp/golang-sdk/v6/eppoclient"
  "gopkg.in/segmentio/analytics-go.v3"
)

var eppoClient = &eppoclient.EppoClient{}

type ExampleAssignmentLogger struct {
  client analytics.Client
}

func (eal *ExampleAssignmentLogger) LogAssignment(event eppoclient.AssignmentEvent) {
  eal.client.Enqueue(analytics.Track{
    UserId:     event.Subject,
    Event:      "Eppo Randomization Event",
    Properties: analytics.Properties(event),
  })
}

func main() {
  // Connect to Segment (or your own event-tracking system)
  client := analytics.New("YOUR_WRITE_KEY")
  defer client.Close()

  eppoClient, _ = eppoclient.InitClient(eppoclient.Config{
    SdkKey:           "<your_sdk_key>",
    AssignmentLogger: &ExampleAssignmentLogger{
      client: client,
    },
  })
}
```

The SDK will invoke the `LogAssignment` function with an `event` object that contains the following fields:

| Field                     | Type                        | Description                                                                                                                          | Example                             |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment`              | string                      | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject`                 | string                      | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation`               | string                      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp`               | string                      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes`       | map                         | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag`             | string                      | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation`              | string                      | An Eppo allocation key                                                                                                   | "allocation-17"                     |
| `metaData`                | map                         | Metadata around the assignment, such as the version of the SDK                                                           | `{ "obfuscated": "true", "sdkLanguage": "javascript", "sdkLibVersion": "3.2.1" }` |
| `extraLogging`            | map                         | Metadata about the allocation.                 | `{ "owner": "sam@company.ai" }` |


:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## 3. Assign variations

Assigning users to flags or experiments with a single `GetStringAssignment` function:

```go
import (
	"github.com/Eppo-exp/golang-sdk/v6/eppoclient"
)

var eppoClient = &eppoclient.EppoClient{} // in global scope
variation, err := eppoClient.GetStringAssignment("<FLAG-KEY>", "<SUBJECT-KEY>", <TARGETING-ATTRIBUTES>, <DEFAULT-VALUE>);
```

The `GetStringAssignment` function takes 4 required inputs to assign a variation:

- `FLAG-KEY` - This key is available on the detail page for flags.
- `SUBJECT-KEY` - The ID of the entity that is being experimented on, typically represented by a uuid.
- `TARGETING-ATTRIBUTES` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag, those attributes should be passed in on every assignment call.
- `DEFAULT-VALUE` - The default value to return if the SDK does not receive an assignment.

### Typed assignments

Additional functions are available:

```
GetBooleanAssignment(...) (bool, error)
GetNumericAssignment(...) (float64, error)
GetIntegerAssignment(...) (int, error)
GetStringAssignment(...) (string, error)
GetJSONAssignment(...) (interface{}, error)
GetJSONBytesAssignment(...) ([]byte, error)
```

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
