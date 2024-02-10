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

To initialize the SDK, you will need a SDK key. You can generate one [in the flag interface](https://eppo.cloud/feature-flags/keys).

```python
import eppo_client
from eppo_client.config import Config

client_config = Config(api_key="<YOUR_API_KEY>")
eppo_client.init(client_config)
client = eppo_client.get_instance()
…
```

This generates a singleton client instance, that can be reused throughout the application lifecycle

### C. Assign variations

This instance can then be called to assign users to flags or experiments using the `get_string_assignment` function:

```python
…
variation = client.get_string_assignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>")
if variation == "fast_checkout":
    …
else:
    …
```
* `<SUBJECT-KEY>` is the value if the, typically `user_id`
* `<FLAG-OR-EXPERIMENT-KEY>` is the key that you chose when creating a flag; you can find it on the [flag page](https://eppo.cloud/feature-flags). For the rest of this presentation, we’ll use `"test_checkout"`. We recommend that you create a test flag in your account to follow along and split users between `"fast_checkout"` and `"standard_checkout"`.

That’s it: You can already start changing the feature flag on the page and see how it controls your code!

However, if you wan to run experiments, there’s a little extra work to configure it properly.

## 2. Assignment Logging for Experiment 

If you are using the Eppo SDK for **experiment** assignment (i.e., randomization), we will need to know which entity, typically which user, passed through an entry point and was exposed to the experiment. For that, we need to log that information.

### A. Local Logging

To keep our example simple, let’s first use a local function to see what is logged. We’ll use the Python default `logging` package for now.

For the assignment event to send the relevant information, we have to expand the class `AssignmentLogger` by defining the method `log_assignment` with a function that stores the contents of `assignment`.

```python
import eppo_client
from eppo_client.config import Config
from uuid import UUID
import logging
from time import sleep

logging.basicConfig(filename='eppo_assignement_log.csv')

class LocalAssignmentLogger(AssignmentLogger):
	def log_assignment(self, assignment):
		logging.info(assignment)

client_config = Config(api_key="<YOUR_API_KEY>",
	assignment_logger=LocalAssignmentLogger())
eppo_client.init(client_config)
client = eppo_client.get_instance()

sleep(1)
for _ in range (10):
	user_id = UUID()
	variation = client.get_string_assignment(user_id, "test_checkout")
	if variation == "fast_checkout":
	    print(f"{user_id}: Fast checkout")
	else:
	    print(f"{user_id}: Standard checkout")

```

You can check that the local logging file `eppo_assignement_log.csv` contains all the assignment information.

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | `"new_faster_checkout"` |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | `"60a67ae2-c9d2-4f8a-9be0-3bb4fe0c96ff"`|
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | `"treatment"`                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | `2021-06-22T17:35:12.000Z`            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{}`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | `"checkout_type"`              |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | `"fast_checkout"`                     |

If you implemented it that way in production, you would need to upload that assignment file to your database. That’s not very convenient. Instead, we recommend you use your usual on-line logging service to do so.

### B. Define an Online Assignment Logger 

In the previous example, we used a local logging function to show what it logged. In practice, we recommend that you pass a **callback logging** function when initializing the SDK. Whenever a variation is assigned, the client instance will invoke that callback, capturing assignment data.

The code below illustrates an example implementation of a logging callback using **Segment**. You could also use your own logging system, the only requirement is that the SDK receives a `log_assignment` function.

:::note

More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.

:::

Here we define an implementation of the Eppo `AssignmentLogger` interface containing a single function named `log_assignment`:

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

The SDK will invoke the `log_assignment` function with an `assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | `"recommendation-algo-allocation-17"` |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | `"60a67ae2-c9d2-4f8a-9be0-3bb4fe0c96ff"` |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | `"control"`                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | `2021-06-22T17:35:12.000Z`            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | `"recommendation-algo"`               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | `"allocation-17"`                     |


## 3. Running the SDK

How is this SDK, hosted on your servers, actually getting the relevant information from Eppo?

### A. Loading Configuration

At initialization, the SDK polls Eppo’s API to retrieve the most recent experiment configurations. The SDK stores these configurations in memory. This is why assignments are effectively instant.

:::note

Your users’ private information doesn’t leave your servers. Eppo only stores your flag and experiment configurations.

:::

### B. Automatical Updating the SDK Configuration

After initialization, the SDK continues polling Eppo’s API at 30-second intervals. This retrieves the most recent flag and experiment configurations such as variation values, targeting rules, and traffic allocation. This happens independently of assignment calls.

:::note

Changes made to experiments on Eppo’s web interface are almost instantly propagated through our Content-delivery network (CDN). Because of the refresh rate, it may take up to 30 seconds for those to be reflected by the SDK assignments.

:::

### C. Handling `None`

To be safe, we recommend always handling the `None` case in your code. Here are some examples illustrating when the SDK might return `None`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `None` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must **enable the environment** corresponding to the feature flag’s allocation in the [flag control pannel](https://eppo.cloud/feature-flags/) before `getStringAssignment` returns variations. It will return `None` if the environment is not enabled.

![Toggle to enable environment](/static/img/feature-flagging/enable-environment.png)

3. If `get_string_assignment` is invoked **before the SDK has finished initializing**, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `None` if no configurations have been downloaded.

:::info

By default the Eppo client initialization is asynchronous to ensure no critical code paths are blocked. For more information on handling non-blocking initialization, see our [documentation here](/feature-flagging/common-issues#3-not-handling-non-blocking-initialization).

:::


## 4. Advanced Configuration with Metadata

We introduced `get_string_assignment`’s two required inputs in the [Getting started](#getting-started) section:

- `subject_key`: The Entity ID that is being experimented on, typically represented by a uuid.
- `flag_key`: This key is available on the detail page for both flags and experiments.

But that’s not all: the function also takes an optional input for entity properties.

### A. Optional Properties for Targetting 

Most entities on which we run feature flags have properties: sessions have browser types, users have loyalty status, corporate clients have a number of employees, videos have close-caption available or not, sport teams have a league, etc. If you want to decide how a feature flag behaves, or whether an experiment is ran on a certain entity based on those, you need to send that information too. When assigning entities, you can pass that additional information through:

- `subject_attributes`: An optional dictionnary that details entity properties; for example, if the entity is a customer session:  
  `{country:"Andorra", loyalty:"Gold", browser_type:"Mozilla", device_type:"Macintosh",
     user_agent:"Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",}`

Those can be used by the feature flag or the experiement for targeting, through the **Allocations** setting on the configuration page.

### B. Example Payment Configuration

Let’s say you are running a Django service with the User-Agent package. You want to use feature flags to offer payment method that adapt to the browser (only Safari users should be offered to user ApplePay) and the country (so that Dutch users can use iDEAL) and members of your loyalty program might use their points. You can use a feature flag to configure what is possible in which country, for which users, etc. 

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
        "<SUBJECT-KEY>",
        "<FLAG-OR-EXPERIMENT-KEY>",
        session_attributes,
    )
    
    if variation == 'checkout_apple_pay':
        …
    elif variation == 'checkout_ideal':
		…
    else:
		…
```

Our approach is more flexible: it lets you configure properties that match the relevant entity for your feature flag or your experiments. For example, if a user is usually on iOS but they are connecting from a PC browser this time, they probably should not be offered an ApplePay option, in spite of being labelled an iOS user.

:::note

If you create rules based on attributes on a flag or an experiment, those attributes should be passed in on every assignment call. 

:::


## 5. Typed Assignment Calls

The SDK also offers assignment calls for other assignment types.

```
get_boolean_assignment(...)
get_numeric_assignment(...)
get_json_string_assignment(...)
get_parsed_json_assignment(...)
```

Those take the same input as `get_string_assignment`: `subject_key`, `flag_key` and `subject_attributes`.

### A. Boolean Assignment

For example, if you configure a flag as a Boolean (`True` or `False`), you can simplify your code:

```python
if get_boolean_assignment("<SUBJECT-KEY>", "<FLAG-KEY>"):
    …
else:
    …
```

That prevents having the option of a third output. However, “True” can be ambiguous when the allocation names are unclear, like `hide_vs_delete_spam` or `no_collapse_price_breakdown`. We would recommend sticking to string that offer more explicit naming convention: `keep_and_hide_spam`, `delete_spam`, or `collapse_price_breakdown`, `expand_price_breakdown` and `delete_price_breakdown`.

### B. Numeric Assignment

If you want to modify a quantity, say, the number of columns of your layout, the number of product recommendations per page or the minimum spent for free delivery, you want to make sure the allocation value is a number. Using a numeric assignement and the call `get_numeric_assignment` guarantees that. When someone edit the assignment, it will remain a number. This is useful if you are using that value in computation, say to process the amount of a promotion. It will not validate obvious configuration issues before they are rolled-out.

### C. Parsed JSon Assignment

A more interesting pattern is to assign a JSon object. This allows to include structured information, say the text of a marketing copy for a promotional campaign, and the address of a hero image. Thanks to this pattern, one developer can configure a very simple landing page; with that in place, whoever has access to the Feature flag configuration can decide and change what copy to show to users throughout a promotional period, without them having to release new code.

```python
…
self.campaign_json = get_parsed_json_assignment("<SUBJECT-KEY>", "<FLAG-KEY>")
if self.campaign_json is not None:
    campaign['hero'] = True
    campaign['hero_image'] = self.campaign_json.hero_image
    campaign['hero_title'] = self.campaign_json.hero_title or ""
    campaign['hero_description'] = self.campaign_json.hero_description or ""
…
```

Assuming your service can be configured with many input parameters, that assignment type enables very powerful configuration changes. It does come with more risk of using the wrong key or value, so you probably want to explore ways to type check your variations.

### D. String JSon Assignment

`get_json_string_assignment` is similar, but the output is a string. This adds the responsability of unpacking the JSon from that string.
