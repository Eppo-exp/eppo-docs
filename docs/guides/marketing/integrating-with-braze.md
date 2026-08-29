# Integrating with Braze

## Set up A/B test in Braze and analyze in Eppo

Braze’s built in A/B testing for campaigns combined with Eppo’s data warehouse native integrations allow for teams to measure downstream metrics such as revenue or retention. This combination of tools gives teams richer insights into their CRM and Lifecycle Marketing campaigns.

In this section, we will walk through how to set up your analysis in Eppo if you use Braze for experimentation. This can be especially helpful to users who want to leverage Braze’s UI to easily setup a test without additional code and compare test results using data warehouse metrics that cannot be shared with Braze. More specifically, this guide will provide instructions on how to:

- Integrate your Braze data to your warehouse
- Set up your experiment in a Braze Campaign or Canvas
- Set up Eppo to measure Braze experiments

## Braze Setup

### **Integrate Braze campaign data to warehouse.**

Since Eppo can analyze experiments directly in your warehouse, all that is needed is the Braze campaign data in the warehouse that you have connected to Eppo. Braze allows you to export campaign data using [Currents](https://www.braze.com/docs/user_guide/data/braze_currents?redirected=1#access-currents). Additionally, Braze data can be made available in your Snowflake instance through [Braze Data Sharing](https://www.braze.com/docs/partners/data_and_infrastructure_agility/data_warehouses/snowflake/#integration).

### **Creating experiments in Braze**

Braze has two main paths for creating an experiment that will have different downstream data schemas associated with them:
1. **Canvas** -- Multi-step campaign builder that allows users to test different steps throughout a user's journey. See [Setting up a Variant in a Canvas](https://www.braze.com/docs/user_guide/engagement_tools/canvas/create_a_canvas/create_a_canvas#adding-a-variant) in Braze's documentation.
2. **Campaign** -- Send one off messages through a variety of channels available through Braze. See [Creating multivariate and A/B tests in a Campaign](https://www.braze.com/docs/user_guide/engagement_tools/testing/multivariant_testing/create_multivariate_campaign/#step-1-create-your-campaign)

### **Create a Canvas in Braze**

Follow Braze's [documenation](https://www.braze.com/docs/user_guide/engagement_tools/canvas/create_a_canvas/create_a_canvas/#step-3-build-your-canvas) for setting up an experiment within Braze. This will include:
- Adding a [variant](https://www.braze.com/docs/user_guide/engagement_tools/canvas/create_a_canvas/create_a_canvas/#adding-a-variant) within your Canvas.
- Determining the steps that should be included in each variant.
- Who is eligible for this Canvas.
- Scheduling when this Canvas should run.

### **Create a Campaign in Braze**

Follow Braze’s [documentation](https://www.braze.com/docs/user_guide/engagement_tools/testing/multivariant_testing/create_multivariate_campaign/#step-1-create-your-campaign) for setting up your experiment within a Campaign. This will include:

- Selecting the message type (e.g., Push, Email, In-App Message, etc.).
- Defining the target audience for your A/B test.
- Configuring the variations.
- Scheduling the campaign.

Once your experiment is set up, launch the test in Braze.

## Eppo Experiment setup

The first step to setting up your experiment in Braze is to create an [Assignment table](/data-management/definitions/assignment-sql) in Eppo based on user-level Braze campaign data in your warehouse. We recommend setting up separate Assignments table for Canvas experiments and Campaign experiments since each will use different metadata in the Braze event payload.

Use [Braze’s docs](https://www.braze.com/docs/user_guide/data/braze_currents/event_glossary/message_engagement_events?tab=cloud%20storage) to determine which event schema you should use as experiment assignments in Eppo. More context about the specific event types to use are provided below.

### **Canvas Assignment Table Setup**

For Canvas experiments, there are two ways to create experiments:
1. At the Canvas level that corresponds to the `users.canvas.Entry` event
2. Within the Canvas that corresponds to the  `users.canvas.experimentstep.SplitEntry` event 

For experiments on the Canvas entry, `canvas_name` is used as the `Experiment` name, and the `canvas_variation_name` as the `Variation` name in the Assignments table.

For experiments witin a Canvas, `experiment_step_id` is uesed as the `Experiemnt` name and `experiment_split_id` is used as the `Variation` name in the Assignment table.

Additionally `time` as the `Timestamp` for both of these experiment types on the Eppo Assignments table. 

These events in Braze represents when a user enters an Experiment step or a Canvas and the timestamp will be the most accurate representation of when a user was exposed to the experiment. 

Your Braze Canvas Assignments table will look like this:
| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`assignment_timestamp`** | Timestamp | **`time`** |
| **`user_id`** | Experiment subject ID | **`user_id`** This should be an ID that maps to the metrics used in a experiment, this will most likely be an internal User ID |
| **`experiment`** | Experiment key | **`canvas_name`** and **`experiment_step_id`** |
| **`variant`** | Variant | **`canvas_variation_name`** and **`experiment_split_id`** |

See below for a visual overview of what Braze Canvas steps map to as Braze data.
![Braze Canvas steps aligned to Braze data](/img/guides/integrating-with-braze/braze-canvas-overview.png)


### **Campaign Assignment Table Setup**

For Campaign experiments, you will identify the channels your team uses. Typically we recommend using `Send` events to represent when a user was entered into an experiment. The following `Send` events all have a `campaign_name` to represent the `Experiment` name, `message_variation_name` to represent the `Variation` name, and `time` to represent the timestamp in an Eppo Assignment table:
- `users.messages.contentcard.Send`
- `users.messages.email.Send`
- `users.messages.pushnotification.Send`
- `users.messages.sms.CarrierSend`
- `users.messages.sms.Send`
- `users.messages.whatsapp.Send`

Your Braze Campaign Assignments table will look like this:
| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`assignment_timestamp`** | Timestamp | **`time`** |
| **`user_id`** | Experiment subject ID | **`user_id`** This should be an ID that maps to the metrics used in a experiment, this will most likely be an internal User ID |
| **`experiment`** | Experiment key | **`campaign_name`** |
| **`variant`** | Variant | **`message_variation_name`** |


### **Including Campaign and Canvas Specific Metrics with a Secondary Entity**

When analyzing channel outreach experiments, it's common to measure both overall user-level metrics (engagement, revenue, retention, etc.) and campaign-specific metrics (click through rate, unsubscribes, etc.). 

A [Secondary Entity](/data-management/definitions/assignment-sql/#optional-columns-for-advanced-use-cases) on the Assignments table will ensure any message-specific metric such as Clicks, Bounces, or Opens are specific to the Campaign or Canvas experiment.

To include Campaign or Canvas specific metrics:
1. [Create a new Entity](/data-management/definitions/entities/#creating-an-entity) called **Combined ID**.
2. On the Braze Campaign or Canvas Assignments table, concatenate the User ID and Campaign or Canvas Name and adding it as a Secondary Entity called `combined_id` For example, a Campaign called **Email_14_day_nurture**, would be concatenated to `12345-Email_14_day_nurture` as the `combined_id`.
3. Include this `combined_id` on the Assignments table as a Secondary Entity.
Your Assignments table should look like this:

| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`assignment_timestamp`** | Timestamp | **`time`** |
| **`user_id`** | Experiment subject ID | **`user_id`** Internally defined User ID |
| **`experiment`** | Experiment key | **`campaign_name`**, **`canvas_name`**, **`experiment_step_id`** |
| **`variant`** | Variant | **`message_variation_id`**, **`canvas_variation_name`**, and **`experiment_split_id`** |
| **`combined_id`** | **Combined ID** Entity as the Secondary ID | Concatentated **`campaign_name`**, **`canvas_name`**, or **`experiment_step_id`** with **`user_id`** |

4. Concatenate the Campaign or Canvas Name with the User ID on your Braze Facts table and use that as the Entity for the Fact. Your Fact table should look like this:

| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`timestamp`** | Timestamp | **`time`** |
| **`user_id`** | No column specified | **`user_id`** Internally defined User ID |
| **`experiment`** | No column specified| **`campaign_name`**, **`canvas_name`**, **`experiment_step_id`**  |
| **`combined_id`** | **Combined ID** as the Entity ID | Concatentated **`campaign_name`**, **`canvas_name`**, or **`experiment_step_id`** with **`user_id`** |

4. Create [Metrics](/data-management/metrics/) from your newly created Braze Fact tables.
5. When setting up an experiment for analysis, make sure you select the **Combined ID** as the Secondary ID used for Analysis. Consider setting up a [Protocol](/experiment-analysis/configuration/protocols/) for Braze experiments to automate this experiment setup for subsequent experiments.

## Use Eppo Flags to bucket users for Braze campaigns

In addition to analyzing Braze experiments in Eppo, you can also use Eppo's feature flagging to determine user cohorts and send those assignments to Braze for targeted messaging. This approach allows you to leverage Eppo's advanced targeting and assignment logic while using Braze's powerful campaign delivery capabilities. 

Additionally, this integration enables powerful use cases like coordinated product and marketing experiments, dynamic campaign targeting based on product behavior, and consistent user experiences across all touchpoints. Eppo's deterministic bucketing will make sure that users with the same ID will receive the same assignment regardless of if the flag is run for Braze or within your product.


### Setting up Eppo Flags for Braze targeting

This integration allows you to:
- Use Eppo's sophisticated audience targeting to determine which users should receive specific campaigns
- Send user assignments as [custom attributes](https://www.braze.com/docs/developer_guide/analytics/setting_user_attributes/?sdktab=web) to Braze
- Create targeted campaigns in Braze based on Eppo flag assignments
- Maintain consistent user experiences across your product and marketing channels

### Implementation example

Here's a simple example of how to integrate Eppo flag assignments with Braze:

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";
import { initialize } from "@braze/web-sdk";

// Initialize Eppo
const eppoClient = EppoSdk.getInstance();

// Initialize Braze
initialize("YOUR_BRAZE_API_KEY");

// Function to sync Eppo assignments to Braze
function syncEppoToBraze(userId) {
  // Get assignment from Eppo flag
  const campaignVariant = eppoClient.getAssignment(
    'email_campaign_targeting', 
    userId,
    { 
      subscription_tier: 'premium',
      signup_date: '2024-01-15'
    }
    'default'
  );
  
  // Send assignment to Braze as custom attribute
  if (campaignVariant) {
    braze.getUser().setCustomUserAttribute(
      'eppo_email_campaign_targeting', 
      campaignVariant
    );
    
    // Optionally track the assignment event
    braze.logCustomEvent('eppo_assignment', {
      flag_key: 'email_campaign_targeting',
      variation: campaignVariant,
      timestamp: new Date().toISOString()
    });
  }
}

// Call when user logs in or at key moments
syncEppoToBraze('user_12345');
```

### Optional - Using assignments in Braze campaigns

Once Eppo assignments are sent to Braze as custom attributes, you can use them to target campaigns:

1. **Create audience segments** in Braze based on the custom attributes (e.g., `eppo_email_campaign_targeting = 'treatment'`)

2. **Target campaigns** to specific segments based on Eppo flag assignments

3. **Personalize content** using the assignment values in your campaign messaging


### Example implementation

For a complete working example of this integration, see the [eppo-braze-flags repository](https://github.com/heathermhargreaves/eppo-braze-flags). This Node.js server demonstrates how to integrate Eppo feature flags with Braze Webhook Campaigns to enable A/B testing of different message variants. This example can be extended for any channel supported in Braze.

The example includes:
- **Feature Flag Evaluation**: Uses Eppo SDK to evaluate feature flags for users
- **Braze Integration**: Sends different message variants based on flag assignments  
- **Event Tracking**: Tracks user events with experiment metadata in Braze
- **Interactive Demo**: Built-in web interface to test the integration