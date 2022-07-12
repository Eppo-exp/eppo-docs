import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python

### 1. Install the SDK

Install the SDK with PIP:

```bash
pip install eppo-server-sdk
```

### 2. Define an Event Logger

The SDK requires an assignment logging function to be passed on initialization. The SDK uses the logging function to capture assignment data whenever a variation is assigned. The below code examples shows how to integrate the SDK with [Segment](https://segment.com/docs/) for logging events, but you could also use any other logging system.

Define an implementation of the Eppo `AssignmentLogger` interface:

```python
from eppo_client.assignment_logger import AssignmentLogger
import analytics

# Connect to Segment (or your own event-tracking system) 
analytics.write_key = "<SEGMENT_WRITE_KEY>"

class SegmentAssignmentLogger(AssignmentLogger):
		def log_assignment(self, assignment):
			analytics.track(assignment["subject"], "Eppo Randomization Assignment", assignment)
```

The SDK will invoke the `log_assignment` function from the above example every time a variation is assigned. The below table shows the information contained in the `assignment` object passed to this function:

| Field | Description | Example |
| --------- | ------- | ---------- |
| `experiment` (string) | An Eppo experiment key | "recommendation_algo" |
| `subject` (string) | An identifier of the subject or user assigned to the experiment variation | UUID |
| `variation` (string) | The experiment variation the subject was assigned to | "control" |
| `timestamp` (string) | The time when the subject was assigned to the variation | 2021-06-22T17:35:12.000Z |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }` |

### 3. Initialize the SDK

Initialize the SDK once when your application starts up to generate a singleton client instance. The initialize method should be called once per application lifecycle; do not initialize the SDK on every request.

The below code example shows how to initialize the SDK with the event logger from the previous section and your API key:

```python
import eppo_client
from eppo_client.config import Config

client_config = Config(api_key="<YOUR_API_KEY>", assignment_logger=AssignmentLogger())
eppo_client.init(client_config)
```

After initialization, the SDK will begin polling Eppo’s API at regular intervals to retrieve the most recent experiment configurations such as variation values and traffic allocation. The SDK stores these configurations in memory for fast lookup by the assignment logic.

### 4. Assign Experiment Variations

The SDK returns an assignment based on the experiments you configure in Eppo. It may take up to 10 minutes for changes to Eppo experiments to be reflected by the SDK assignments.

The SDK requires two inputs to assign a variation:
- `experiment_key` - this should be the same as the “Experiment Key” field of an Eppo experiment
- `subject_key` - the entity ID that is being experimented on, typically represented by a uuid.

The below code example shows how to assign a subject to an experiment variation:

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_assignment("<SUBJECT-KEY>", "<EXPERIMENT-KEY>")
```

The experiment **Traffic Allocation** setting determines the percentage of subjects the SDK will assign to experiment variations. For example, if the traffic allocation is 25%, the assignment function will return a variation for 25% of subjects and `null` for the remaining 75%. If the **Traffic Allocation** is zero but subjects have been added to a variation **Allow List**, the SDK will return the variation for the allow-listed subjects.

### Links

- [GitHub repository](https://github.com/Eppo-exp/python-sdk)
- [Published python package](https://pypi.org/project/eppo-server-sdk/)