---
slug: /feature-flag-quickstart
sidebar_position: 3
---

# Running your first experiment

This 10 minute guide will walk through running your first experiment with Eppo. In the example we'll imagine that we are testing a new checkout page.

While Eppo feature flags can be used for feature gates, kill switches, and targeted rollouts, this guide will focus on using Eppo flags for running randomized experiments.

Note that if you are using Eppo alongside an existing randomization tool, you can skip right to the [next quick start](/experiment-quickstart).

### 1. Generate an SDK key

From the Configuration section, navigate to the SDK keys tab. Here you can generate keys for both production and testing.

![Setup Eppo SDK key](/img/feature-flagging/environments/sdk-keys.png)

For now, create a Test environment SDK key by using the "New SDK Key" button. Give the key a name and select "Test" for the Environment.

![Generate a SDK key](/img/feature-flagging/sdk-key-modal.png)

Store the SDK key securely; it is not possible to view it after closing the modal. However, generating a new key is easy in case you do lose it.

### 2. Create a flag

Start by creating a flag for the new page:

![Feature gate 0](/img/feature-flagging/feature-flag-qs-0.png)

Give the flag a descriptive human readable name and create variations for each version of the checkout page. In this example we only have two states: enabled and disabled. If your flag is more involved, you can change the flag type to be string, numeric, or JSON-valued. Read more about flag types [here](/feature-flagging/flag-variations).

![Feature gate 1](/img/feature-flagging/feature-flag-qs-1.png)

### 3. Create an experiment allocation

After creating the flag, switch into the Test environment:

![Feature gate 2](/img/feature-flagging/feature-flag-qs-2.png)

Now that you're in the Test environment, add an Experiment allocation to your flag. If you want to force certain segments or users into one variant, you can also add a Feature Gate allocation. You can read more about using Eppo for Feature Gates [here](/feature-flagging/feature-gates).

![Feature gate 3](/img/feature-flagging/feature-flag-qs-3.png)

For this example, we will assign all users to the experiment. If you want to target specific users, you can add targeting rules to the allocation. You can read more about targeting [here](/feature-flagging/targeting).

![Feature gate 4](/img/feature-flagging/feature-flag-qs-4.png)

### 4. Connect a logging function to the Eppo SDK

Eppo leverages your existing event logging infrastructure to track experiment assignment. Whether you are using a third party system to log events to the data warehouse or have an internally built solution, you'll simply pass in a logging function when initializing the SDK.

For instance, if you are using Segment, the logging function might look something like this:

```jsx
import { IAssignmentLogger } from '@eppo/js-client-sdk';
import { AnalyticsBrowser } from '@segment/analytics-next'

// Connect to Segment (or your own event-tracking system)
const analytics = AnalyticsBrowser.load({ writeKey: '<SEGMENT_WRITE_KEY>' })

const assignmentLogger: IAssignmentLogger = {
  logAssignment(assignment) {
    analytics.track({
      userId: assignment.subject,
      event: 'Eppo Experiment Assignment',
      type: 'track',
      properties: { ...assignment }
    });
  },
};
```

The [event logging](/sdks/event-logging/) page has more information on how to set up logging using different logging tools

### 5. Initialize the SDK

Choose the Eppo SDK that fits in your stack. You'll need to initialize the SDK in your app and create an Eppo client. Here is an example in Javascript:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: '<SDK_KEY>',
  assignmentLogger,
});
```
Note, here is where you use the SDK key generated in step 1.

If you are using React, we have some [React specific recommendations](/sdks/client-sdks/javascript#usage-in-react).

### 6. Embed the flag in your code

Once the SDK is initialized, use `getBoolAssignment` to check whether a user should see the new page:

```jsx
// Wherever you render the checkout page...

import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();

const variation = eppoClient.getBoolAssignment(
  user.id, // subject key
  "use-new-checkout-page", // flag key
  false, // default value
  // if using Eppo to target users, pass in user properties as optional fourth argument
  // userProperties
);

return variation ? <NewCheckoutPage /> : <OldCheckoutPage />
```

Note that the `get<Type>Assignment` methods in Eppo are deterministic, meaning that they will always return the same variant for a given subject (e.g., user) throughout the experiment.

### 7. Turn on the flag to start splitting traffic

To start randomly assigning traffic, flip the flag on in the Test environment.

![Feature gate 5](/img/feature-flagging/feature-flag-qs-5.png)

You should now see assignments coming through the Eppo SDK!

To deploy to production, create a new SDK key for the production environment, create a production experiment allocation, and enable the flag.
