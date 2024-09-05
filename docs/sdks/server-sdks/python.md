import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python

Eppo's Python SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/python-sdk)
- [PyPI package](https://pypi.org/project/eppo-server-sdk/)

## 1. Getting started

### A. Install the SDK

First, install the SDK with PIP:

```bash
pip install eppo-server-sdk
```

### B. Initialize the SDK

To initialize the SDK, you will need an SDK key. You can generate one [in the flag interface](https://eppo.cloud/feature-flags/keys).

```python
import eppo_client
from eppo_client.config import Config, AssignmentLogger

client_config = Config(api_key="<YOUR_API_KEY>",
                       assignment_logger=AssignmentLogger())
eppo_client.init(client_config)
client = eppo_client.get_instance()
…
```

This generates a singleton client instance that can be reused throughout the application lifecycle

### C. Assign variations

Assign users to flags or experiments using `get_<type>_assignment`, depending on the type of the flag.
For example, for a String-valued flag, use `get_string_assignment`:

```python
…
variation = client.get_string_assignment("<FLAG-KEY>", "<SUBJECT-KEY>", <SUBJECT-ATTRIBUTES>, "<DEFAULT-VALUE>")
if variation == "fast_checkout":
    …
else:
    …
```
* `<FLAG-KEY>` is the key that you chose when creating a flag; you can find it on the [flag page](https://eppo.cloud/feature-flags). For the rest of this presentation, we’ll use `"test-checkout"`. To follow along, we recommend that you create a test flag in your account, and split users between `"fast_checkout"` and `"standard_checkout"`.
* `<SUBJECT-KEY>` is the value that identifies each entity in your experiment, typically `user_id`.
* `<SUBJECT-ATTRIBUTES>` is a dictionary of metadata about the subject used for targeting. If you create targeting rules based on attributes, those attributes must be passed in on every assignment call. If no attributes are needed, pass in an empty dictionary.
* `<DEFAULT-VALUE>` is the value that will be returned if no allocation matches the subject, if the flag is not enabled, if `get_string_assignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration.

Here's how this configuration looks in the [flag page](https://eppo.cloud/feature-flags):

![Test checkout configuration](/img/feature-flagging/test-checkout-configuration.png)


That’s it: You can already start changing the feature flag on the page and see how it controls your code!

However, if you want to run experiments, there’s a little extra work to configure it properly.

## 2. Assignment Logging for Experiment 

If you are using the Eppo SDK for **experiment** assignment (i.e., randomization), we will need to know which entity, typically which user, passed through an entry point and was exposed to the experiment. For that, we need to log that information.

### A. Local Logging

To keep our example simple, let’s first use a local function to see what is logged. We’ll use the Python default `logging` package for now.

For the assignment event to send the relevant information, we have to expand the class `AssignmentLogger` by defining the method `log_assignment` with a function that stores the contents of `assignment`.

We have also stored out SDK Key into the environment variable `EPPO_API_KEY` as a common safety practice.

```python
import logging
import os
from uuid import uuid4
from time import sleep
import eppo_client
from eppo_client.config import Config, AssignmentLogger

logging.basicConfig(
    filename='eppo_assignments.csv',
    level=logging.INFO,
    format=f'%(message)s')


class LocalAssignmentLogger(AssignmentLogger):
    def log_assignment(self, assignment):
        logging.info(assignment)


client_config = Config(api_key=os.getenv("EPPO_API_KEY"),
                       assignment_logger=LocalAssignmentLogger())
eppo_client.init(client_config)
client = eppo_client.get_instance()

# Give the client some time to initialize.
# Note that the client may get stuck on this step if there are errors.
# Please refer to the logs.
while client.get_string_assignment("test-checkout", '0', {}, "standard_checkout") is None:
    print("Waiting for client to initialize. Check the logs if this message persists.")
    sleep(1)
# In a real-world scenario, other modules would load
# and the client would be initialized in the background.

for _ in range(10):
    # Randomly creating user ids. Note that they might not actually exist in your experiment.
    user_id = str(uuid4())
    variation = client.get_string_assignment("test-checkout", user_id, {}, "standard_checkout")
    if variation == "fast_checkout":
        print(f"{user_id}: Fast checkout")
    elif variation == "standard_checkout":
        print(f"{user_id}: Standard checkout")
    else:
        print(f"{user_id}: Check your configuration")

```

You can check that the local logging file `eppo_assignments.csv` contains all the assignment information.

| Field                     | Description                                                                                                              | Example                                  |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| `experiment` (string)     | An Eppo experiment key                                                                                                   | `"checkout_type-allocation-1234"`        |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | `"60a67ae2-c9d2-4f8a-9be0-3bb4fe0c96ff"` |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | `"fast_checkout"`                        |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | `2021-06-22T17:35:12.000Z`               |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{}`                                     |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | `"checkout_type"`                        |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | `"allocation-1234"`                      |

If you implemented it that way in production, you would need to upload that assignment file to your database. That’s not very convenient. Instead, we recommend you use your usual on-line logging service to do so.

### B. Define an Online Assignment Logger 

In the previous example, we used a local logging function to show what it logged. In practice, we recommend that you pass a **callback logging** function when initializing the SDK. Whenever a variation is assigned, the client instance will invoke that callback, capturing assignment data.

The code below illustrates an example implementation of a logging callback using **Segment**. You could also use your own logging system, the only requirement is that the SDK receives a `log_assignment` function.

:::note

More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.

:::


```python
from eppo_client.assignment_logger import AssignmentLogger
import analytics

# Connect to Segment (or your own event-tracking system)
analytics.write_key = "<SEGMENT_WRITE_KEY>"


class SegmentAssignmentLogger(AssignmentLogger):
    def log_assignment(self, assignment):
        analytics.track(assignment["subject"],
                        "Eppo Randomization Assignment", assignment)


client_config = Config(api_key="<YOUR_API_KEY>",
                       assignment_logger=SegmentAssignmentLogger())

…
```

The SDK will invoke the `log_assignment` function with an `assignment` object that contains the fields you've seen locally. Make sure the dictionary is parse properly by your tooling.


## 3. Running the SDK

How is this SDK, hosted on your servers, actually getting the relevant information from Eppo?

### A. Loading Configuration

At initialization, the SDK polls Eppo’s API to retrieve the most recent experiment configuration. The SDK stores that configuration in memory. This is why assignments are effectively instant, as you can see yourself by profiling the code above.

:::note

Your users’ private information doesn’t leave your servers. Eppo only stores your flag and experiment configurations.

:::

For more information on the performance of Eppo's SDKs, see the [latency](/sdks/faqs/latency) and [risk](/sdks/faqs/risk) pages.

### B. Automatically Updating the SDK Configuration

After initialization, the SDK continues polling Eppo’s API at 30-second intervals. This retrieves the most recent flag and experiment configurations such as variation values, targeting rules, and traffic allocation. This happens independently of assignment calls.

:::note

Changes made to experiments on Eppo’s web interface are almost instantly propagated through our Content-delivery network (CDN) Fastly. Because of the refresh rate, it may take up to 30 seconds (± 5 seconds fuzzing) for those to be reflected by the SDK assignments.

:::


:::info

By default, the Eppo client initialization is asynchronous to ensure no critical code paths are blocked. For more information on handling non-blocking initialization, see our [documentation here](/sdks/common-issues#3-not-handling-non-blocking-initialization).

:::

### C. Advanced Configuration Control

The default periodic polling setup is suitable for most cases but may not be efficient in short-lived serverless environments like Cloud Functions or Lambdas, where a new configuration is fetched on every function call.
Starting with v3.7.0, Python SDK exposes an advanced API to allow manual control over configuration.

To disable default polling behavior, set `poll_interval_seconds` to `None` when initializing the client.
```python
import eppo_client
from eppo_client import Config, ApplicationLogger

eppo_client.init(
    Config(api_key="<api-key>", application_logger=..., poll_interval_seconds=None)
)
```

`Configuration` class represents Eppo configuration that defines how the SDK evaluates feature flags.
It can be initialized from the CDN response bytes (`https://fscdn.eppo.cloud/api/flag-config/v1/config`).
As a user, you have full control over how this response is retrieved and stored.
```python
from eppo_client import Configuration

configuration = Configuration(flags_configuration=b"...bytes...")
```

:::warning

The response format is subject to change, so you should treat the response as opaque bytes—do not parse, inspect, or modify it in any way.

:::

Once you create the configuration object, configure the client like this:
```python
eppo_client.get_instance().set_configuration(configuration)
```

Upon setting the configuration, the client is initialized and will start serving assignments based on the provided configuration. You can update the configuration anytime.

You can also provide an initial configuration during client initialization:
```python
eppo_client.init(
    Config(
        api_key="<api-key>",
        application_logger=...,
        poll_interval_seconds=None,
        initial_configuration=configuration,
    )
)
```

## 4. Advanced Configuration with Metadata

We introduced `get_string_assignment`’s three required inputs in the [Getting started](#getting-started) section:

- `subject_key`: The Entity ID that is being experimented on, typically represented by a uuid.
- `flag_key`: This key is available on the detail page for both flags and experiments.
- `default_value`: The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `get_string_assignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration.

But that’s not all: the function also takes an optional input for entity properties.

### A. Optional Properties for Targeting 

Most entities on which we run feature flags have properties: sessions have browser types, users have loyalty status, corporate clients have a number of employees, videos have close-caption available or not, sport teams have a league, etc. If you want to decide how a feature flag behaves, or whether an experiment is run on a certain entity based on those, you need to send that information too. When assigning entities, you can pass that additional information through `subject_attributes`: an optional dictionary that details entity properties. 

For example, if the entity is a customer session ,`subject_attributes` might look like this:  
  `{country:"Andorra", loyalty:"Gold", browser_type:"Mozilla", device_type:"Macintosh",
     user_agent:"Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",}`

Those can be used by the feature flag or the experiment for targeting, through the **Allocations** setting on the configuration page.

:::warning

The `MATCHES`, `ONE_OF`, and `NOT_ONE_OF` operators are evaluated on string representations of the subject attributes. To be consistent with other SDKs, note that conversion of subject attributes from floats, booleans, and None is different from the standard Python conversion.

In particular, `True` and `False` are converted to the string values `"true"` and `"false`". Integer floats are converted to integers before converting to a string. That is, `10.0` becomes `"10"`, whereas `10.1` becomes `"10.1"`. Finally, `None` is converted to the string `null`.

:::

### B. Example Payment Configuration

Let’s say you are running a Django service with the User-Agent package. You want to use feature flags to offer a payment method that adapt to the browser (only Safari users should be offered to use Apple Pay), the country (Dutch users can use iDEAL), and loyalty status (members might use their points). You can use a feature flag to configure what is possible in which country, for which users, etc. 

To make the decision, you can put the relevant information (`country`, `loyalty_tier`, etc.) in a `session_attributes` dictionary:

```python
…
from ipware import get_client_ip
from django.contrib.gis.utils import GeoIP
g = GeoIP()

…

if request.method == 'POST':
    country = ""
    ip, is_routable = get_client_ip(request)
    if is_routable:
        country = g.city(ip)["country_code"]

    session_attributes = {
        'country': country,
        'loyalty_tier': request.session.loyalty_tier,
        'browser_type': request.user_agent.browser.family,
        'device_type': request.user_agent.device.family,
    }

    variation = client.get_string_assignment(
        "<FLAG-KEY>",
        "<SUBJECT-KEY>",
        session_attributes,
        "<DEFAULT-VALUE>",
    )
    
    if variation == 'checkout_apple_pay':
        …
    elif variation == 'checkout_ideal':
    …
    else:
    …
```

Our approach is highly flexible: it lets you configure properties that match the relevant entity for your feature flag or experiment. For example, if a user is usually on iOS but they are connecting from a PC browser this time, they probably should not be offered an Apple Pay option, in spite of being labelled an iOS user.

:::note

If you create rules based on attributes on a flag or an experiment, those attributes should be passed in on every assignment call. 

:::


## 5. Typed Assignment Calls

The following typed functions are available:

```
get_boolean_assignment(...)
get_integer_assignment(...)
get_numeric_assignment(...)
get_string_assignment(...)
get_json_assignment(...)
```

All take the same input: `subject_key`, `flag_key`, `default_value`, and (optionally) `subject_attributes`.

### A. Boolean Assignment

For example, if you configure a flag as a Boolean (`True` or `False`), you can simplify your code:

```python
if get_boolean_assignment("<SUBJECT-KEY>", "<FLAG-KEY>", False):
    …
else:
    …
```

That prevents having the option of a third output. However, `“True”` can be ambiguous when the allocation names are unclear, like `hide_vs_delete_spam` or `no_collapse_price_breakdown`. We would recommend sticking to strings that offer more explicit naming convention: `keep_and_hide_spam`, `delete_spam`, or `collapse_price_breakdown`, `expand_price_breakdown` and `delete_price_breakdown`.

### B. Numeric Assignment

If you want to modify a quantity, say, the number of columns of your layout, the number of product recommendations per page or the minimum spent for free delivery, you want to make sure the allocation value is a number. Using a numeric-valued flag and `get_numeric_assignment` guarantees that. (If you want to ensure that the value be specifically an integer, use an integer-valued flag and `get_integer_assignment`.) When someone edits the assignment, it will remain a number. This is useful if you are using that value in computation, say to process the amount of a promotion. It will capture obvious configuration issues before they are rolled out.

### C. JSON Assignment

A more interesting pattern is to assign a JSON object. This allows us to include structured information, say the text of a marketing copy for a promotional campaign and the address of a hero image. Thanks to this pattern, one developer can configure a very simple landing page; with that in place, whoever has access to the feature flag configuration can decide and change what copy to show to users throughout a promotional period, almost instantly and without them having to release new code.

```python
…
self.campaign_json = get_json_assignment("<SUBJECT-KEY>", "<FLAG-KEY>", <DEFAULT-JSON>)
if self.campaign_json is not None:
    campaign['hero'] = True
    campaign['hero_image'] = self.campaign_json.hero_image
    campaign['hero_title'] = self.campaign_json.hero_title or ""
    campaign['hero_description'] = self.campaign_json.hero_description or ""
…
```

Assuming your service can be configured with many input parameters, that assignment type enables very powerful configuration changes.

## 6. Contextual Bandits

To leverage Eppo's contextual bandits using the Python SDK, there are two additional steps over regular feature flags:
1. Add a bandit action logger to the assignment logger
2. Querying the bandit for an action

We have a simple end-to-end example in the [Python SDK repository](https://github.com/Eppo-exp/python-sdk/blob/main/example/03_bandit.py).

### A. Add a bandit action logger to the assignment logger

In order for the bandit to learn an optimized policy, we need to capture and log the bandit actions.
This requires adding a bandit action logging callback to the AssignmentLogger class
```python
class MyLogger(AssignmentLogger):
    def log_assignment(self, assignment):
        ...

    def log_bandit_action(self, bandit_action):
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
| `subjectNumericAttributes` (Dict[str, float])     | Metadata about numeric attributes of the subject. Dictionary of the name of attributes their numeric values            | `{"age": 30}`    |
| `subjectCategoricalAttributes` (Dict[str, str]) | Metadata about non-numeric attributes of the subject. Dictionary of the name of attributes their string values         | `{"loyalty_tier": "gold"}`     |
| `actionNumericAttributes` (Dict[str, float])      | Metadata about numeric attributes of the assigned action. Dictionary of the name of attributes their numeric values    | `{"discount": 0.1}`   |
| `actionCategoricalAttributes` (Dict[str, str])  | Metadata about non-numeric attributes of the assigned action. Map of the name of attributes their string values | `{"promoTextColor": "white"}` |
| `actionProbability` (Double)                         | The weight between 0 and 1 the bandit valued the assigned action                                                | 0.25                                |
| `modelVersion` (String)                              | Unique identifier for the version (iteration) of the bandit parameters used to determine the action probability | "v123"                       |

### B. Querying the bandit for an action

To query the bandit for an action, you can use the `get_bandit_action` function. This function takes the following parameters:
- `flag_key` (str): The key of the feature flag corresponding to the bandit
- `subject_key` (str): The key of the subject or user assigned to the experiment variation
- `subject_attributes` (Attributes): The context of the subject 
- `actions` (Dict[str, Attributes]): A dictionary that maps available actions to their attributes
- `default` (str): The default *variation* to return if the bandit cannot be queried

The following code queries the bandit for an action:
```python
import eppo_client.bandit

client = eppo_client.get_instance()
bandit_result = client.get_bandit_action(
    "shoe-bandit",
    name,
    eppo_client.bandit.Attributes(
        numeric_attributes={"age": age}, categorical_attributes={"country": country}
    ),
    {
        "nike": Attributes(
            numeric_attributes={"brand_affinity": 2.3},
            categorical_attributes={"image_aspect_ratio": "16:9"},
        ),
        "adidas": Attributes(
            numeric_attributes={"brand_affinity": 0.2},
            categorical_attributes={"image_aspect_ratio": "16:9"},
        ),
    },
    "control",
)
```

#### Subject Context

The subject context contains contextual information about the subject that is independent of bandit actions.
For example, the subject's age or country.

The subject context has type `Attributes` which has two fields:

- `numeric_attributes` (Dict[str, float]): A dictionary of numeric attributes (such as "age")
- `categorical_attributes` (Dict[str, str]): A dictionary of categorical attributes (such as "country")

:::note
The `categerical_attributes` are also used for targeting rules for the feature flag similar to how `subject_attributes` are used for that with regular feature flags. 
:::

#### Action Contexts

Next, supply a dictionary with actions and their attributes: `actions: Dict[str, Attributes]`.
If the user is assigned to the bandit, the bandit selects one of the actions supplied here,
and all actions supplied are considered to be valid; if an action should not be shown to a user, do not include it in this dictionary.


The action attributes are similar to the `subject_attributes` but hold action specific information.
Note that we can use `Attrubutes.empty()` to create an empty attribute context.

Note that action contexts can contain two kinds of information:
- Action specific context: e.g. the image aspect ratio of image corresponding to this action
- User-action interaction context: e.g. there could be a "brand-affinity" model that computes brand affinties of users to brands, and scores of this model can be added to the action context to provide additional context for the bandit.

#### Result

The `bandit_result` is an instance of `BanditResult`, which has two fields:

- `variation` (str): The variation that was assigned to the subject
- `action` (Optional[str]): The action that was assigned to the subject

The variation returns the feature flag variation, this can be the bandit itself, or the "status quo" variation if the user is not assigned to the bandit.
If we are unable to generate a variation, for example when the flag is turned off, then the `default` variation is returned. 
In both of those cases, the `action` is `None`, and you should use the status-quo algorithm to select an action.

When `action` is not `None`, the bandit has selected that action to be shown to the user.

#### Status quo algorithm

In order to accurately measure the performance of the bandit, we need to compare it to the status quo algorithm using an experiment.
This status quo algorithm could be a complicated algorithm to that selects an action according to a different model, or a simple baseline such as selecting a fixed or random action.
When you create an analysis allocation for the bandit and the `action` in `BanditResult` is `None`, implement the desired status quo algorithm based on the `variation` value.
