import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python

Eppo's Python SDK is open source:
- [GitHub repository](https://github.com/Eppo-exp/python-sdk)
- [PyPI package](https://pypi.org/project/eppo-server-sdk/)

### 1. Install the SDK

Install the SDK with PIP:

```bash
pip install eppo-server-sdk
```

### 2. Define an Assignment Logger

The SDK requires an assignment logger to be passed on initialization. The SDK invokes the logger to capture assignment data whenever a variation is assigned. The below code example shows how to integrate the SDK with [Segment](https://segment.com/docs/) for logging events. You could also use your own logging system; the only requirement is that the SDK receives a `log_assignment` function.

Define an implementation of the Eppo `AssignmentLogger` interface. This interface has one function: `log_assignment`.

```python
from eppo_client.assignment_logger import AssignmentLogger
import analytics

# Connect to Segment (or your own event-tracking system) 
analytics.write_key = "<SEGMENT_WRITE_KEY>"

class SegmentAssignmentLogger(AssignmentLogger):
	def log_assignment(self, assignment):
		analytics.track(assignment["subject"], "Eppo Randomization Assignment", assignment)
```

The SDK will invoke the `log_assignment` function with an `assignment` object that contains the following fields:

| Field | Description | Example |
| --------- | ------- | ---------- |
| `experiment` (string) | An Eppo experiment key | "recommendation_algo" |
| `subject` (string) | An identifier of the subject or user assigned to the experiment variation | UUID |
| `variation` (string) | The experiment variation the subject was assigned to | "control" |
| `timestamp` (string) | The time when the subject was assigned to the variation | 2021-06-22T17:35:12.000Z |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }` |

### 3. Initialize the SDK

Initialize the SDK once when your application starts up to generate a singleton client instance. During initialization, the SDK does a network request to fetch experiment configurations, which it stores in memory. It's only necessary to initialize the SDK once per application lifecycle.

The below code example shows how to initialize the SDK with the event logger from the previous section and your API key:

```python
import eppo_client
from eppo_client.config import Config

client_config = Config(api_key="<YOUR_API_KEY>", assignment_logger=AssignmentLogger())
eppo_client.init(client_config)
```

After initialization, the SDK will begin polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory for fast lookup by the assignment logic.

### 4. Assign Experiment Variations

Before using the SDK to assign a variation, make sure your experiment is setup as follows:
1. The experiment must be configured to use Eppo's randomization:
![use-eppo-randomization](../../../../../static/img/connecting-data/UseEpposRandomization.png)
2. The experiment must be started **OR** the `subject_key` passed to the SDK must be added to one of its variation allow lists
![start-experiment](../../../../../static/img/connecting-data/StartExperiment.png)

If the above conditions are not met, the SDK will return `None` as the assignment.

:::note
It may take up to 5 minutes for changes to Eppo experiments to be reflected by the SDK assignments.
:::

The experiment **Traffic Allocation** setting determines the percentage of subjects the SDK will assign to experiment variations. For example, if the traffic allocation is 25%, the assignment function will return a variation for 25% of subjects and `None` for the remaining 75%. If the **Traffic Allocation** is zero but subjects have been added to a variation **Allow List**, the SDK will return the variation for the allow-listed subjects.

The SDK requires two inputs to assign a variation:
- `experiment_key` - this should be the same as the “Experiment Key” field of an Eppo experiment
- `subject_key` - the entity ID that is being experimented on, typically represented by a uuid.

The below code example shows how to assign a subject to an experiment variation:

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_assignment("<SUBJECT-KEY>", "<EXPERIMENT-KEY>")
```
