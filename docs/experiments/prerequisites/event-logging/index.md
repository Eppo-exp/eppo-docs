# Event logging

The second prerequisite to running experiments on Eppo is logging application events to your warehouse. It is best practice to centralize application logging as much as possible, and Eppo's SDKs work seamlessly with most logging tools, meaning you can keep using your favorite logger. The last step would be configuring your logging tool, e.g. Segment, to push your data into your data warehouse.

Eppo's SDKs include either an assignment logger base class or an interface, in which you can define a method according to your logging requirements. Examples are shown below in Eppo's Node SDK for logging with some common event loggers: 

* [Segment](#segment)
* [Rudderstack](#rudderstack)
* [mParticle](#mparticle)
* [Snowplow](#snowplow)

Similar patterns can be adopted for Eppo's SDKs in other languages, e.g. Java, Python, and etc.


## Segment

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from '@eppo/node-server-sdk';

// Connect to Segment
const Analytics = require('analytics-node');
const analytics = new Analytics('<SEGMENT_WRITE_KEY>');

// Define logAssignment so that it logs events to Segment
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: 'Eppo Randomization Event',
      properties: assignment,
    });
  },
};

// Initialize the client
await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Segment
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {});
```

## Rudderstack

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from '@eppo/node-server-sdk';

// Connect to Rudderstack
const Analytics = require('@rudderstack/rudder-sdk-node');
const analytics = new Analytics('<RUDDERSTACK_WRITE_KEY>', {
  dataPlaneUrl: DATA_PLANE_URL,
});

// Define logAssignment so that it logs events to Rudderstack
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: 'Eppo Randomization Event',
      properties: assignment,
    });
  },
};

// Initialize the client
await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Rudderstack
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {});
```

## mParticle

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from '@eppo/node-server-sdk';

// Initialize mParticle
var mParticle = require('mparticle');
var api = new mParticle.EventsApi(new mParticle.Configuration(
    '<MPARTICLE_API_KEY>', 
    '<MPARTICLE_API_SECRET>'
));

// Define logAssignment so that it logs events to mParticle
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    var batch = new mParticle.Batch(mParticle.Batch.Environment.development);
    batch.user_identities = new mParticle.UserIdentities();
    batch.user_identities.customerid = assignment.subject
    var event = new mParticle.AppEvent(
      mParticle.AppEvent.CustomEventType.navigation, 
      'Eppo Randomization Event'
    );
    event.custom_attributes = assignment;
    batch.addEvent(event);
    api.uploadEvents([batch]);
  },
};

// Initialize the client
await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to mParticle
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {});
```

## Snowplow

This examples shows the setup for Snowplow's Node.js Tracker v3 SDK.

```javascript
// Import Eppo's assignment logger interface and client initializer
import { IAssignmentLogger, init } from '@eppo/node-server-sdk';

// Initialize Snowplow
import { tracker, gotEmitter, buildSelfDescribingEvent } from '@snowplow/node-tracker';
const emit = gotEmitter(
  'collector.mydomain.net', // Collector endpoint
  snowplow.HttpProtocol.HTTPS,
  8080,
  snowplow.HttpMethod.POST,
  1
);
const track = tracker(
  [emit], 
  'Eppo Randomization Events', 
  '<SNOWPLOW_APP_ID>', 
  false
);

// Define logAssignment so that it logs events to Snowplow
const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    track.track(buildSelfDescribingEvent({
      event: {
        schema: "iglu:com.example_company/eppo-event/jsonschema/1-0-2",
        data: {
          userId: assignment.subject,
          properties: assignment,
        }
      }
    }));
  },
};

// Initialize the client
await init({
  apiKey: '<API_KEY>',
  assignmentLogger,
});

// Then every call to getAssignment will also log the event to Snowplow
const eppoClient = EppoSdk.getInstance();
const variation = eppoClient.getAssignment("<SUBJECT-KEY>", "<FLAG-OR-EXPERIMENT-KEY>", {});
```