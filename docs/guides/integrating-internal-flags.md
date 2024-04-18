# Integrating with an Internal Randomization Service

## Introduction

This page outlines a template technical plan for integrating Eppo alongside an internal feature flagging or randomization service. While Eppo supports both experiment implementation (traffic splits) and experiment analysis, it is occasionally preferred to deploy Eppo’s analysis capabilities and continue to use the existing engineering process for deploying randomized experiments.

This document walks through two options for such an integration: 1) solely leveraging the data warehouse and 2) a direct API integration to automate the creation of experiment analysis.

## Warehouse Integration

An Assignment Source is one of the core elements of Eppo’s data model. This SQL definition consists of a SELECT statement in the warehouse with the following information: 

1. An experiment subject identifier (e.g., `user_id` )
2. The timestamp at which a subject was enrolled into an experiment (Eppo will handle de-duplication of events if multiple records are present for the same subject-experiment pair)
3. A unique identifier of the experiment the subject was enrolled into
4. The variant the subject was enrolled into
5. Optionally, any categorical data associated with the subject (e.g., the user’s current device, current region, etc.)

An example dataset might look like this:

```sql
select 
    user_id,
    experiment_name,
    variant_name,
    ts_assigned,
    browser
from analytics.prod.user_assignments
```

![Assignment Source](/img/guides/integrating-with-internal-flags/integrating_internal_flags_1.png)

Eppo runs a nightly job that scans this table and stores the unique values in the `experiment_name` column. When a user creates an experiment analysis this list appears in a dropdown:

![Flag Selection Dropdown](/img/guides/integrating-with-internal-flags/integrating_internal_flags_2.png)

This dropdown will contain all of the flags logged to the configured assignment source. Once a user has selected the appropriate flag key, they will be prompted to enter some metadata about the experiment:

### Experiment date range

This date range is used to both filter assignments and determine how long Eppo should continue to run the data pipeline to refresh results.

![Add Date Range](/img/guides/integrating-with-internal-flags/integrating_internal_flags_3.png)

### Variation names

In addition to pre-populating a list of flags in the internal system, Eppo will also pre-populate a list of experiment variations for the selected flag. The end user is responsible for mapping these variant values to a human-readable format to display in the Eppo UI: 

![Add Variation Names](/img/guides/integrating-with-internal-flags/integrating_internal_flags_4.png)

### Variation weights and traffic allocation:

Finally, Eppo needs to know the expected traffic split to check for Sample Ratio Mismatch and the traffic exposure (what percent of eligible traffic was assigned a variant) to calculate Global Lift.

![Add Variation Weights](/img/guides/integrating-with-internal-flags/integrating_internal_flags_5.png)

While filling out the fields above is usually trivial and can be accomplished by a non-technical stakeholder in a few minutes, some teams opt to fully automate this process. The next section discusses common patterns for teams that go this route.

## API Integration

To make the integration with in-house tools as seamless as possible, Eppo also provides a [REST API](https://eppo.cloud/api/docs#) and [webhooks](/reference/webhook) to automate the steps above. A typical integration looks like the following:

1. On experiment creation (or update) within the internal system, hit Eppo’s REST API to create (update) a corresponding experiment analysis
2. Subscribe to an Eppo webhook for changes to experiment status and update the internal system appropriately

### Experiment Analysis API

Eppo’s full API spec can be found [here](https://eppo.cloud/api/docs#). To use the API, you’ll need an API key which can be created on the Admin page within the Eppo web app.

A typical POST request to create an experiment analysis might look something like this:

```json
POST https://eppo.cloud/api/v1/experiments/

{
  "name": "My Experiment",
  "assignments_start_date": "2024-04-16T02:15:40.707Z",
  "entity_id": 0,
  "hypothesis": "string",
  "assignments_end_date": "2024-04-16T02:15:40.707Z",
  "assignment_source_id": 0,
  "experiment_key": "string",
  "traffic_allocation": 1,
  "variations": [
    {
      "name": "Control Variant",
      "variant_key": "control",
      "is_control": true,
      "weighted_expected_traffic": 0.5,
      "is_active": true
    },
    {
      "name": "Test Variant",
      "variant_key": "test",
      "is_control": false,
      "weighted_expected_traffic": 0.5,
      "is_active": true
    }
  ]
}
```

This request will create an analysis in the UI and automatically add [guardrail metrics](/data-management/metrics/guardrails). 

In the request above, you’ll need to provide two internal Eppo identifiers: `entity_id` and `assignment_source_id`. `entity_id` tells Eppo the unit on which this experiment is randomized (e.g., a B2B company may experiment at the user or the company grain). To get a list of entities within your workspace you can use the entities endpoint:

```json
GET /api/v1/definitions/entities
 
 [
  {
    "id": 1,
    "name": "user"
  },
  {
    "id": 2,
    "name": "company"
  },
]
```

You’ll also need an `assignment_source_id`. This identifier tells Eppo which assignment source (see above) was used to track this experiment. If all experiments on a given entity are tracked in a central table, this value will be one-to-one with `entity_id`.

You can find your `assignment_source_id` either in the URL on the definition page (e.g., `https://eppo.cloud/definitions/assignments/{assigment_source_id}`, or via the assignment definition endpoint:

```json
GET /api/v1/definitions/assignments

[
  {
    "id": 1,
    "name": "My Assignment Table",
    "sql": "select * from experiment_assignments",
    "experiment_key_column": "experiment_id",
    "timestamp_column": "assignment_timestamp",
    "entity_id": 1,
    "entity_join_column_name": "user_id"
  }
]
```

By using the endpoints above, you can automatically create experiment analysis in the Eppo UI each time an experiment is launched in the existing internal system. From here, users can add metrics, perform explorations, and write reports within Eppo. Once a decision has been made within the Eppo UI, you may want to automate the rollout of the winning variant. This can be accomplished by subscribing to the experiment update webhook described in the next section.

### Experiment Update Webhook

For a list of events captured by Eppo’s experiment webhook, see the [webhook page](https://docs.geteppo.com/reference/webhook) of our docs. Depending on your use case you may want to filter to a subset of webhook events. For instance, you may only care about when someone clicks “make decision” on the experiment overview page in Eppo. In that case, you can filter to the `experiment.status.updated` event:

```json
{
	"event": "experiment.status.updated",
	"data": {
		"experiment_id": <experiment_id>,
		"experiment_key": "<experiment_key>"
	},
	"signature": "<signature>"
}
```

Upon receiving this event, you can query the experiment endpoint to determine the winning variant:

```json
GET /api/v1/experiments/{id}

{
  "id": 0,
  "status": "Concluded",
  ...
  "winning_variant_key": "string",
  "outcome": "POSITIVE",
  ...
}
```

From here you can automatically submit a request to approve the rollout decision in your internal system.

This document outlined a basic integration between an existing internal randomization system and Eppo. This however is just a simple example. Given the flexibility of Eppo’s API and webhooks, more custom implementations can be created. If you’re interested in discussing more advanced integrations with Eppo’s engineering team, or if you would like to request new functionality to be added to either Eppo’s API or Webhooks, please reach out to support@geteppo.com.