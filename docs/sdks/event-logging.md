---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Event logging

In order to run experiments on Eppo you'll need to provide a logging callback function to write assignment events to your warehouse. It is best practice to centralize application logging as much as possible, and Eppo's SDKs work seamlessly with most logging tools, meaning you can keep using your favorite logger.

Eppo's SDKs include either an assignment logger base class or an interface, in which you can define a method according to your logging requirements. Examples are [shown below](/sdks/event-logging#examples-for-common-logging-systems) in Eppo's Node SDK for logging with some common event loggers.

The object passed into the assignment logger function contains the following fields:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | 6141                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |

Eppo expects that the logger function will take this object and write data back to your warehouse in a format that roughly matched the table below. The specific column names do not matter, but these columns are needed to later [define assignments](/data-management/definitions/assignment-sql.md) in your warehouse.

| experiment                          | subject | variation | timestamp                  | subject_attributes    |
| :---------------------------------- | :------ | :-------- | :------------------------- | :-------------------- |
| `recommendation-algo-allocation-17` | `6141`  | `control` | `2021-06-22T17:35:12.000Z` | `{ "country": "US" }` |

It's ok for this table to contain duplicate rows for the same subject. If a subject is assigned to multiple variants, Eppo will automatically remove them from the analysis.

The `experiment` key is simply a concatenation of the `featureFlag` an `allocation` fields. By appending a unique identifier of the allocation to the flag key, we can separate traffic that saw a variant due to a rule set (Feature Gate allocation) or as part of randomized assignment (Experiment allocation). The `featureFlag` and `allocation` fields are not required for analysis but are provided for convenience.

### Examples for common logging systems

The examples below are written in JavaScript, but similar patterns can be adapted for all of Eppo's SDKs.

<Tabs>
<TabItem value="segment" label="Segment">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Connect to Segment
const { Analytics } = require('@segment/analytics-node');
const analytics = new Analytics({ writeKey: '<SEGMENT_WRITE_KEY>'});

// Define logAssignment so that it logs events to Segment
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomization Event",
      properties: assignment,
    });
  },
};

// Initialize the client
await init({
  apiKey: "<API_KEY>",
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Segment
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-OR-EXPERIMENT-KEY>",
  {}
);
```

</TabItem>
<TabItem value="rudderstack" label="Rudderstack">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Connect to Rudderstack
const Analytics = require("@rudderstack/rudder-sdk-node");
const analytics = new Analytics("<RUDDERSTACK_WRITE_KEY>", {
  dataPlaneUrl: DATA_PLANE_URL,
});

// Define logAssignment so that it logs events to Rudderstack
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: "Eppo Randomization Event",
      properties: assignment,
    });
  },
};

// Initialize the client
await init({
  apiKey: "<API_KEY>",
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Rudderstack
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-OR-EXPERIMENT-KEY>",
  {}
);
```

</TabItem>
<TabItem value="mparticle" label="mParticle">

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Initialize mParticle
const mParticle = require("mparticle");
const api = new mParticle.EventsApi(
  new mParticle.Configuration("<MPARTICLE_API_KEY>", "<MPARTICLE_API_SECRET>")
);

// Define logAssignment so that it logs events to mParticle
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    const batch = new mParticle.Batch(mParticle.Batch.Environment.development);
    batch.user_identities = new mParticle.UserIdentities();
    batch.user_identities.customerid = assignment.subject;
    const event = new mParticle.AppEvent(
      mParticle.AppEvent.CustomEventType.navigation,
      "Eppo Randomization Event"
    );
    event.custom_attributes = assignment;
    batch.addEvent(event);
    api.uploadEvents([batch]);
  },
};

// Initialize the client
await init({
  apiKey: "<API_KEY>",
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to mParticle
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-OR-EXPERIMENT-KEY>",
  {}
);
```

</TabItem>
<TabItem value="snowplow" label="Snowplow">

This examples shows the setup for Snowplow's Node.js Tracker v3 SDK.

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from "@eppo/node-server-sdk";

// Initialize Snowplow
import {
  tracker,
  gotEmitter,
  buildSelfDescribingEvent,
} from "@snowplow/node-tracker";
const emit = gotEmitter(
  "collector.mydomain.net", // Collector endpoint
  snowplow.HttpProtocol.HTTPS,
  8080,
  snowplow.HttpMethod.POST,
  1
);
const track = tracker(
  [emit],
  "Eppo Randomization Events",
  "<SNOWPLOW_APP_ID>",
  false
);

// Define logAssignment so that it logs events to Snowplow
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    track.track(
      buildSelfDescribingEvent({
        event: {
          schema: "iglu:com.example_company/eppo-event/jsonschema/1-0-2",
          data: {
            userId: assignment.subject,
            properties: assignment,
          },
        },
      })
    );
  },
};

// Initialize the client
await init({
  apiKey: "<API_KEY>",
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Snowplow
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment(
  "<SUBJECT-KEY>",
  "<FLAG-OR-EXPERIMENT-KEY>",
  {}
);
```

</TabItem>
</Tabs>
