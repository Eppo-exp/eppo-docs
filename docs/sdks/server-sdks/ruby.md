import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ruby

Eppo's Ruby SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/ruby-sdk)
- [RubyGems gem](https://rubygems.org/gems/eppo-server-sdk/)

## 1. Getting started

### A. Install the SDK

Install the SDK with gem:

```bash
gem install eppo-server-sdk
```

or add to you `Gemfile`:

```
gem 'eppo-server-sdk', '~> 3.0.0'
```

### B. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the [flags configuration interface](https://eppo.cloud/feature-flags/keys).

```ruby
require 'eppo_client'

config = EppoClient::Config.new('<YOUR_API_KEY>')
EppoClient::init(config)
client = EppoClient::Client.instance
```

This generates a singleton client instance that can be reused throughout the application lifecycle.

After initialization, the SDK begins polling Eppo's API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory so that assignments are effectively instant. For more information, see the [architecture overview](/sdks/overview) page.

### C. Assign variations

Assign users to flags or experiments using `get_<type>_assignment`, depending on the type of the flag.
For example, for a String-valued flag, use `get_string_assignment`:

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

The `get_string_assignment` function takes four required inputs to assign a variation:

* `<FLAG-KEY>` is the key that you chose when creating a flag; you can find it on the [flag page](https://eppo.cloud/feature-flags). For the rest of this presentation, we'll use `"test-checkout"`. To follow along, we recommend that you create a test flag in your account, and split users between `"fast_checkout"` and `"standard_checkout"`.
* `<SUBJECT-KEY>` is the value that identifies each entity in your experiment, typically `user_id`.
* `<SUBJECT-ATTRIBUTES>` is a hash of metadata about the subject used for targeting. If you create targeting rules based on attributes, those attributes must be passed in on every assignment call. If no attributes are needed, pass in an empty hash.
* `<DEFAULT-VALUE>` is the value that will be returned if no allocation matches the subject, if the flag is not enabled, if `get_string_assignment` is invoked before the SDK has finished initializing, or the SDK encountered an error determining the assignment.

### Typed assignments

Additional functions are available:

```
get_boolean_assignment(...)
get_numeric_assignment(...)
get_json_string_assignment(...)
get_parsed_json_assignment(...)
```

Here's how this configuration looks in the [flag page](https://eppo.cloud/feature-flags):

![Test checkout configuration](/img/feature-flagging/test-checkout-configuration.png)

That's it: You can already start changing the feature flag on the page and see how it controls your code!

However, if you want to run experiments, there's a little extra work to configure it properly.

## 2. Assignment Logging for Experiment 

If you are using the Eppo SDK for **experiment** assignment (i.e., randomization), we will need to know which entity, typically which user, passed through an entry point and was exposed to the experiment. For that, we need to log that information.

Include a logger instance in the config that is passed to the `init` function on SDK initialization. The SDK invokes the `log_assignment` method in the instance to capture assignment data whenever a variation is assigned.

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

# Allow the configuration to be loaded from the CDN.
sleep(1)

variation = EppoClient::Client.instance.get_string_assignment(
    flag_key,
    subject_key,
    {},
    'default'
)
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
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## 3. Running the SDK

How is this SDK, hosted on your servers, actually getting the relevant information from Eppo?

### A. Loading Configuration

At initialization, the SDK polls Eppo's CDN to retrieve the most recent experiment configuration. The SDK stores that configuration in memory. This is why assignments are effectively instant, as you can see yourself by profiling the code above.

:::note

Your users' private information doesn't leave your servers. Eppo only stores your flag and experiment configurations.

:::

For more information on the performance of Eppo's SDKs, see the [latency](/sdks/faqs/latency) and [risk](/sdks/faqs/risk) pages.

### B. Automatically Updating the SDK Configuration

After initialization, the SDK continues polling Eppo's API at 30-second intervals. This retrieves the most recent flag and experiment configurations such as variation values, targeting rules, and traffic allocation. This happens independently of assignment calls.

:::note

Changes made to experiments on Eppo's web interface are almost instantly propagated through our Content-delivery network (CDN) Fastly. Because of the refresh rate, it may take up to 30 seconds (± 5 seconds jitter) for those to be reflected by the SDK assignments.

:::


:::info

By default, the Eppo client initialization is asynchronous to ensure no critical code paths are blocked. For more information on handling non-blocking initialization, see our [documentation here](/sdks/common-issues#3-not-handling-non-blocking-initialization).

:::

## 4. Contextual Bandits

To leverage Eppo's contextual bandits using the Ruby SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the assignment logger
2. Querying the bandit for an action

### A. Add a bandit action logger to the assignment logger

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

### B. Querying the bandit for an action

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

