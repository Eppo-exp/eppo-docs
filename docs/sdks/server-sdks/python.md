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

This instance can then be called to assigning users to flags or experiments using the `get_string_assignment` function:

```python
…
variation = client.get_string_assignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>")
if variation = "fast_checkout":
    …
elif:
    …
```

* `<SUBJECT-KEY>` is the value if the, typically `user_id`
* `<FLAG-OR-EXPERIMENT-KEY>` is the key that you chose when creating a flag; you can find it on the [flag page](https://eppo.cloud/feature-flags).

That’s it: You can already start changing the feature flag on the page and see how it controls your code!

## 2. Running the SDK

How is this SDK actually working?

### A. Loading Configuration

At initialization, the SDK polls Eppo’s API to retrieve the most recent experiment configurations. The SDK stores these configurations in memory. This is why assignments are effectively instant.

:::note

Your users’ private information doesn’t leave your servers. Eppo only stores your flag and experiment configurations.

:::

### B. Automatical Updating the SDK

After initialization, the SDK continues polling Eppo’s API at 30-second intervals. This retrieves the most recent experiment configurations such as variation values and traffic allocation.

:::note

Changes made to experiments on Eppo’s web interface are almost instantly propagated through our CDN network. But because of the refresh rate, it may take up to 30 seconds for those to be reflected by the SDK assignments.

:::

## 3. Good practices 

### A. Define an Assignment Logger (Experiment Assignment Only)

If you are using the Eppo SDK for experiment assignment (i.e., randomization), we will need to know which entity, typically which user, passed through an Entry point and was exposed to the experiment. For that, we need to log that information. We recommend that you pass a **callback logging** function when initializing the SDK. Whenever a variation is assigned, the client instance will invoke that callback, capturing assignment data.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a `log_assignment` function.

:::note

More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.

:::


Here we define an implementation of the Eppo `IAssignmentLogger` interface containing a single function named `log_assignment`:

```python
from eppo_client.assignment_logger import AssignmentLogger
import analytics

# Connect to Segment (or your own event-tracking system)
analytics.write_key = "<SEGMENT_WRITE_KEY>"

client_config = Config(api_key="<YOUR_API_KEY>", assignment_logger=AssignmentLogger())

class SegmentAssignmentLogger(AssignmentLogger):
	def log_assignment(self, assignment):
		analytics.track(assignment["subject"], "Eppo Randomization Assignment", assignment)
```

The SDK will invoke the `log_assignment` function with an `assignment` object that contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |
### B. Handling `None`

To be safe, we recommend always handling the `None` case in your code. Here are some examples illustrating when the SDK might return `None`:

1. The **Traffic Exposure** setting on experiments/allocations determines the percentage of subjects the SDK will assign to that experiment/allocation. For example, if Traffic Exposure is 25%, the SDK will assign a variation for 25% of subjects and `None` for the remaining 75% (unless the subject is part of an allow list).

2. Assignments occur within the environments of feature flags. You must **enable the environment** corresponding to the feature flag’s allocation in the [flag control pannel](https://eppo.cloud/feature-flags/) before `getStringAssignment` returns variations. It will return `None` if the environment is not enabled.

![Toggle to enable environment](/static/img/feature-flagging/enable-environment.png)

3. If `get_string_assignment` is invoked **before the SDK has finished initializing**, the SDK may not have access to the most recent experiment configurations. In this case, the SDK will assign a variation based on any previously downloaded experiment configurations stored in local storage, or return `None` if no configurations have been downloaded.

:::info

By default the Eppo client initialization is asynchronous to ensure no critical code paths are blocked. For more information on handling non-blocking initialization, see our [documentation here](/feature-flagging/common-issues#3-not-handling-non-blocking-initialization).

:::


## 4. Advanced Configuration

### A. Assign Variations with Metadata

When assigning entities, you can pass metadata through a dictionary of properties:

```python
…

client = eppo_client.get_instance()
variation = client.get_string_assignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {
  # Optional map of subject metadata for targeting.
})
```

We introduced `get_string_assignment`’s two required inputs in the [Getting started](#getting-started) section. The function also takes an optional input to assign targetted variation:

- `subjectKey`: The Entity ID that is being experimented on, typically represented by a uuid.
- `flagOrExperimentKey`: This key is available on the detail page for both flags and experiments.
- `targetingAttributes`: An optional map of metadata about the subject used for targeting, for example:  
  `{country:"Andorra", loyalty: "Gold", browser_type:"Mozilla", device_type: "Macintosh",
     user_agent:"Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",}`  
  If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call. 

### B. Typed Assignment Calls

The SDK also offers assignment calls for other assignment types.

```
get_boolean_assignment(...)
get_numeric_assignment(...)
get_json_string_assignment(...)
get_parsed_json_assignment(...)
```

Those take the same input as `get_string_assignment`: `subjectKey`, `flagOrExperimentKey` and `targetingAttributes`.
