import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ruby

Eppo's Ruby SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/ruby-sdk)
- [RubyGems gem](https://rubygems.org/gems/eppo-server-sdk/)

## 1. Install the SDK

Install the SDK with gem:

```bash
gem install eppo-server-sdk
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization the SDK when your application starts up to generate a singleton client instance, once per application lifecycle:

```ruby
require 'eppo_client'

config = EppoClient::Config.new('<YOUR_API_KEY>')
client = EppoClient::init(config)
```

After initialization, the SDK begins polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. If you are using the SDK for experiment assignments, make sure to pass in an assignment logging callback (see [section](#define-an-assignment-logger-experiment-assignment-only) below).

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), include a logger instance in the config that is passed to the `init` function on SDK initialization. The SDK invokes the `log_assignment` method in the instance to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of logging with Segment, but you could also use other event-tracking systems. The only requirement is that the SDK can call a `log_assignment` method. Here we override Eppo's `AssignmentLogger` class with a function named `log_assignment`, then instantiate a config using an instance of the custom logger class, and finally instantiate the client:

```ruby
require 'segment/analytics'

# Connect to Segment (or your own event-tracking system)
Analytics = Segment::Analytics.new({ write_key: 'SEGMENT_WRITE_KEY' })

class CustomAssignmentLogger < EppoClient::AssignmentLogger
  def log_assignment(assignment)
    Analytics.track(assignment["subject"], "Eppo Assignment", assignment)
  end
end

config = EppoClient::Config.new(
  '<YOUR_API_KEY>',
  assignment_logger: CustomAssignmentLogger.new
)
client = EppoClient::init(config)
```

The SDK will invoke the `log_assignment` function with an `assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A Hash of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/guides/event-logging/) page.
:::

## 3. Assign variations

Assigning users to flags or experiments with a single `get_string_assignment` function:

```ruby
require 'eppo_client'

client = EppoClient::Client.instance
variation = client.get_string_assignment(
  '<SUBJECT-KEY>',
  '<FLAG-OR-EXPERIMENT-KEY>',
  {
    # Optional map of subject metadata for targeting.
  }
)
```

The `get_string_assignment` function takes two required and one optional input to assign a variation:

- `subject_key` - The entity ID that is being experimented on, typically represented by a uuid.
- `flag_or_experiment_key` - This key is available on the detail page for both flags and experiments.
- `subject_attributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.

### Typed assignments

Additional functions are available:

```
get_boolean_assignment(...)
get_numeric_assignment(...)
get_json_string_assignment(...)
get_parsed_json_assignment(...)
```

### Handling `nil`

We recommend always handling the `nil` case in your code. Here are some examples of when the SDK returns `nil`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `nil` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must enable the environment corresponding to the feature flag's allocation in the user interface before `getStringAssignment` returns variations. It will return `nil` if the environment is not enabled.

![Toggle to enable environment](/img/feature-flagging/enable-environment.png)

3. If `get_string_assignment` is invoked before the SDK has finished initializing, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `nil` if no configurations have been downloaded.

### Debugging `nil`

If you need more visibility into why `get_string_assignment` is returning `nil`, you can change the logging level to `Logger::DEBUG` to see more details in the standard output.

```ruby
require 'eppo_client'
require 'logger'

client = EppoClient::Client.instance
variation = client.get_string_assignment(
  '<SUBJECT-KEY>',
  '<FLAG-OR-EXPERIMENT-KEY>',
  {},
  Logger::DEBUG
)
```

<br />

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
