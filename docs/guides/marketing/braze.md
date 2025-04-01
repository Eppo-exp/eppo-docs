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

For Canvas experiments, you will use the `users.canvas.experimentstep.SplitEntry` event where you will use the `canvas_name` as the `Experiment` name, the `canvas_variation_name` as the `Variation` name, and the `time` as the `Timestamp` for your Eppo Assignments table. This event in Braze represents when a user enters the Experiment Split step in a Canvas and the timestamp will be the most accurate representation of when a user was exposed to the experiment. 

Your Braze Canvas Assignments table will look like this:
| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`assignment_timestamp`** | Timestamp | **`time`** |
| **`user_id`** | Experiment subject ID | **`user_id`** This should be an ID that maps to the metrics used in a experiment, this will most likely be an internal User ID |
| **`experiment`** | Experiment key | **`canvas_name`** |
| **`variant`** | Variant | **`canvas_variation_name`** |

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
| **`experiment`** | Experiment key | **`campaign_name`** or **`canvas_name`**|
| **`variant`** | Variant | **`message_variation_id`** or **`canvas_variation_name`** |
| **`combined_id`** | **Combined ID** Entity as the Secondary ID | Concatentated **`campaign_name`** or **`canvas_name`** with **`user_id`** |

4. Concatenate the Campaign or Canvas Name with the User ID on your Braze Facts table and use that as the Entity for the Fact. Your Fact table should look like this:

| Column | Type in Eppo | Data from Braze Table |
| --- | --- | --- |
| **`timestamp`** | Timestamp | **`time`** |
| **`user_id`** | No column specified | **`user_id`** Internally defined User ID |
| **`experiment`** | No column specified| **`campaign_name`** or **`canvas_name`** |
| **`combined_id`** | **Combined ID** as the Entity ID | Concatentated **`campaign_name`** or **`canvas_name`** with **`user_id`** |

4. Create [Metrics](/data-management/metrics/) from your newly created Braze Fact tables.
5. When setting up an experiment for analysis, make sure you select the **Combined ID** as the Secondary ID used for Analysis. Consider setting up a [Protocol](/experiment-analysis/configuration/protocols/) for Braze experiments to automate this experiment setup for subsequent experiments.