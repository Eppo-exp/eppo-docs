import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ruby

Eppo's Ruby SDK can be used for feature flagging, randomized experiment assignment, and contextual multi armed bandits:

- [GitHub repository](https://github.com/Eppo-exp/eppo-multiplatform)
- [RubyGems gem](https://rubygems.org/gems/eppo-server-sdk/)

## Getting Started

### Installation

Install the SDK with gem:

```bash
gem install eppo-server-sdk
```

or add to you `Gemfile`:

```
gem 'eppo-server-sdk', '~> 3.2.7'
```

### Usage

Begin by initializing a singleton instance of Eppo's client with an SDK key from the [Eppo interface](https://eppo.cloud/feature-flags/keys). Once initialized, the client can be used to make assignments anywhere in your app. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

#### Initialize once

```ruby
require 'eppo_client'

config = EppoClient::Config.new('<YOUR_API_KEY>')
EppoClient::init(config)
```

#### Assign anywhere

```ruby
require 'eppo_client'

client = EppoClient::Client.instance
variation = client.get_string_assignment(
  '<FLAG-KEY>',
  '<SUBJECT-KEY>',
  {
    # Mapping of any subject metadata for targeting.
  },
  '<DEFAULT-VALUE>'
)
```

After initialization, the SDK begins polling Eppo’s CDN every 30 seconds to retrieve the most recent experiment configurations (variation values, traffic allocation, etc.). Note that polling happens independently of assignment calls and is non blocking.

The SDK stores these configurations in memory so that assignments thereafter are effectively instant. For more information, see the [architecture overview](/sdks/architecture/overview) page.

:::info
By default, the Eppo client initialization is asynchronous to ensure no critical code paths are blocked. For more information on handling non-blocking initialization, see our [documentation here](/sdks/faqs/common-issues#consider-how-to-best-handle-non-blocking-initialization).
:::

### Connecting an event logger

Eppo is architected so that raw user data never leaves your system. As part of that, instead of pushing subject-level exposure events to Eppo's servers, Eppo's SDKs integrate with your existing logging system. This is done with a logging callback function defined at SDK initialization. 

```ruby
config = EppoClient::Config.new(
  '<YOUR_API_KEY>',
  assignment_logger: CustomAssignmentLogger.new
)
EppoClient::init(config)
```

This logger takes an analytic event created by Eppo, `assignment`, and writes in to a table in the data warehouse (Snowflake, Databricks, BigQuery, or Redshift). You can read more on the [Event Logging](/sdks/event-logging) page.

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
EppoClient::init(config)
```

See [below](#assignment-event-schema) for details on the schema of the `assignment` analytic event.

### Getting variations

Now that the SDK is initialized and connected to your event logger, you can check what variant a specific subject (typically user) should see by calling the `get_<Type>_Assignment` functions. Each time this function is called, the SDK will invoke the provided logging function to record the assignment.

For example, for a string-valued flag, use `get_string_assignment`:

```ruby
require 'eppo_client'

client = EppoClient::Client.instance
variation = client.get_string_assignment(
  '<FLAG-KEY>',
  '<SUBJECT-KEY>',
  {
    # Mapping of any subject metadata for targeting.
  },
  '<DEFAULT-VALUE>'
)
```

Note that Eppo uses a unified API for feature gates, experiments, and mutually exclusive layers. This makes it easy to turn a flag into an experiment or vice versa without having to do a code release.

The `get_string_assignment` function takes four inputs to assign a variation:

- `flag_key` - The key for the flag you are evaluating. This key is available on the feature flag detail page (see below).
- `subject_key` - A unique identifier for the subject being experimented on (e.g., user), typically represented by a UUID. This key is used to deterministically assign subjects to variants.
- `subject_attributes` - A map of metadata about the subject used for [targeting](/feature-flagging/concepts/targeting/). If targeting is not needed, pass in an empty object.
- `default_value` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `get_string_assignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get_<Type>_assignment` call.

![Example flag key](/img/feature-flagging/flag-key.png)

### Typed assignments

Every Eppo flag has a return type that is set on creation in the dashboard. Once a flag is created, assignments in code should be made using the corresponding typed function: 

```ruby
get_boolean_assignment(...)
get_numeric_assignment(...)
get_integer_assignment(...)
get_string_assignment(...)
get_json_assignment(...)
```

Each function has the same signature, but returns the type in the function name. The only exception is `default_value`, which should be the same type as the flag. To read more about when to use which flag type, see the [flag types](/sdks/sdk-features/flag-types) page.

## Contextual Bandits

To leverage Eppo's contextual bandits using the Ruby SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the assignment logger
2. Querying the bandit for an action

### Logging bandit actions

In order for the bandit to learn an optimized policy, we need to capture and log the bandit actions.
This requires adding a bandit action logging callback to the AssignmentLogger class
```ruby
class MyLogger < EppoClient::AssignmentLogger
    def log_assignment(assignment):
        ...

    def log_bandit_action(bandit_action):
        # implement me
```

We automatically log the following data:

| Field                                                | Description                                                                                                     | Example                             |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------|
| `timestamp` (Date)                                   | The time when the action is taken in UTC  | 2024-03-22T14:26:55.000Z            |
| `flagKey` (String)                                | The key of the feature flag corresponding to the bandit                                                                                           | "bandit-test-allocation-4"          |
| `banditKey` (String)                                       | The key (unique identifier) of the bandit                                                                       | "ad-bandit-1"                       |
| `subject` (String)                                   | An identifier of the subject or user assigned to the experiment variation                                       | "ed6f85019080"                      |
| `action` (String)                                    | The action assigned by the bandit                                                                               | "promo-20%-off"                     |
| `subjectNumericAttributes` (Hash{String => Float})     | Metadata about numeric attributes of the subject. Hash of the name of attributes their numeric values            | `{"age": 30}`    |
| `subjectCategoricalAttributes` (Hash{String => String}) | Metadata about non-numeric attributes of the subject. Hash of the name of attributes their string values         | `{"loyalty_tier": "gold"}`     |
| `actionNumericAttributes` (Hash{String => Float})      | Metadata about numeric attributes of the assigned action. Hash of the name of attributes their numeric values    | `{"discount": 0.1}`   |
| `actionCategoricalAttributes` (Hash{String => String})  | Metadata about non-numeric attributes of the assigned action. Hash of the name of attributes their string values | `{"promoTextColor": "white"}` |
| `actionProbability` (Float)                         | The weight between 0 and 1 the bandit valued the assigned action                                                | 0.25                                |
| `modelVersion` (String)                              | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability | "v123"                       |

### Querying the bandit for an action

To query the bandit for an action, you can use the `get_bandit_action` function. This function takes the following parameters:
- `flag_key` (String): The key of the feature flag corresponding to the bandit
- `subject_key` (String): The key of the subject or user assigned to the experiment variation
- `subject_attributes` (Attributes): The context of the subject 
- `actions` (Hash{String => Attributes}): A hash that maps available actions to their attributes
- `default` (String): The default *variation* to return if the bandit cannot be queried

The following code queries the bandit for an action:

```ruby
require 'eppo_client'

client = EppoClient::Client.instance
bandit_result = client.get_bandit_action(
  "shoe-bandit",
  name,
  EppoClient::Attributes.new(
    numeric_attributes: { "age" => age }, categorical_attributes: { "country" => country }
  ),
  {
    "nike" => EppoClient::Attributes.new(
      numeric_attributes: { "brand_affinity" => 2.3 },
      categorical_attributes: { "image_aspect_ratio" => "16:9" }
    ),
    "adidas" => EppoClient::Attributes.new(
      numeric_attributes: { "brand_affinity" => 0.2 },
      categorical_attributes: { "image_aspect_ratio" => "16:9" }
    )
  },
  "control"
)
```

#### Subject Context

The subject context contains contextual information about the subject that is independent of bandit actions.
For example, the subject's age or country.

The subject context has type `Attributes` which has two fields:

- `numeric_attributes` (Hash{String => Float}): A hash of numeric attributes (such as "age")
- `categorical_attributes` (Hash{String => String}): A hash of categorical attributes (such as "country")

:::note
The `categerical_attributes` are also used for targeting rules for the feature flag similar to how `subject_attributes` are used for that with regular feature flags. 
:::

#### Action Contexts

Next, supply a hash with actions and their attributes: `actions: Hash{String => Attributes}`.
If the user is assigned to the bandit, the bandit selects one of the actions supplied here,
and all actions supplied are considered to be valid; if an action should not be shown to a user, do not include it in this hash.

The action attributes are similar to the `subject_attributes` but hold action-specific information.
Note that we can use `Attributes.empty` to create an empty attribute context.

Note that action contexts can contain two kinds of information:
- Action-specific context: e.g., the image aspect ratio of the image corresponding to this action
- User-action interaction context: e.g., there could be a "brand-affinity" model that computes brand affinities of users to brands, and scores of this model can be added to the action context to provide additional context for the bandit.

#### Result

The `bandit_result` is an instance of `BanditResult`, which has two fields:

- `variation` (String): The variation that was assigned to the subject
- `action` (Optional[String]): The action that was assigned to the subject

The variation returns the feature flag variation; this can be the bandit itself, or the "status quo" variation if the user is not assigned to the bandit.
If we are unable to generate a variation, for example when the flag is turned off, then the `default` variation is returned. 
In both of those cases, the `action` is `nil`, and you should use the status-quo algorithm to select an action.

When `action` is not `nil`, the bandit has selected that action to be shown to the user.

#### Status quo algorithm

In order to accurately measure the performance of the bandit, we need to compare it to the status quo algorithm using an experiment.
This status quo algorithm could be a complicated algorithm that selects an action according to a different model, or a simple baseline such as selecting a fixed or random action.
When you create an analysis allocation for the bandit and the `action` in `BanditResult` is `nil`, implement the desired status quo algorithm based on the `variation` value.

## Appendix

### Debugging

You may encounter a situation where a flag assignment produces a value that you did not expect. There are functions [detailed here](/sdks/sdk-features/debugging-flag-assignment/) to help you understand how flags are assigned, which will allow you to take corrective action on potential configuration issues. 

### Assignment event schema

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
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::
