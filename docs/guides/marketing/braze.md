# Integrating With Braze

## Set up A/B test in Braze and analyze in Eppo

Braze’s built in A/B testing for campaigns combined with Eppo’s data warehouse native integrations allow for teams to measure downstream metrics such as revenue or retention. This combination of tools gives teams richer insights into their CRM and Lifecycle Marketing campaigns.

In this section, we will walk through how to set up your analysis in Eppo if you use Braze for experimentation. This can be especially helpful to users who want to leverage Braze’s UI to easily setup a test without additional code and compare test results using data warehouse metrics that cannot be shared with Braze. More specifically, this guide will provide instructions on how to:

- Integrate your Braze data to your warehouse
- Set up your campaign in Braze
- Set up Eppo to measure Braze experiments

### **Integrate Braze campaign data to warehouse.**

Since Eppo can analyze experiments directly in your warehouse, all that is needed is the Braze campaign data in the warehouse that you have connected to Eppo. Braze allows you to export campaign data using [Currents](https://www.braze.com/docs/user_guide/data/braze_currents?redirected=1#access-currents). Additionally, Braze data can be made available in your Snowflake instance through [Braze Data Sharing](https://www.braze.com/docs/partners/data_and_infrastructure_agility/data_warehouses/snowflake/#integration).

### **Create campaign in Braze**

Follow Braze’s [documentation](https://www.braze.com/docs/user_guide/engagement_tools/testing/multivariant_testing/create_multivariate_campaign/#step-1-create-your-campaign) for setting up your experiment. This may include:

- Selecting the message type (e.g., Push, Email, In-App Message, etc.).
- Defining the target audience for your A/B test.
- Configuring the variations.
- Scheduling the campaign.

Once your experiment is set up, launch the test in Braze.

### **Eppo Experiment setup**

The first step to setting up your experiment in Braze is to create an [Assignment table](/data-management/definitions/assignment-sql) in Eppo for the user level Braze campaign data in your warehouse. Use [Braze’s docs](https://www.braze.com/docs/user_guide/data/braze_currents/event_glossary/message_engagement_events?tab=cloud%20storage) to determine which event schema you should use and align with the data requirements with your Eppo Assignments table. 

When analyzing channel outreach experiments, it's common to measure both overall user level metrics (engagement, revenue, retention, etc.) and campaign-specific metrics (click through rate, unsubscribes, etc.). Depending on the entities that your metrics use, you may want to include a [Secondary Entity](/data-management/definitions/assignment-sql/#optional-columns-for-advanced-use-cases) to include metrics that use a different user id than what is used in Braze.

| Column | Type in Eppo | Data from Braze |
| --- | --- | --- |
| **`assignment_timestamp`** | Timestamp | **`time`** |
| **`user_id`** | Experiment subject ID | **`user_id`** Braze defined user id, this may also be **`external_user_id`** if you are managing user ids in Braze |
| **`experiment`** | Experiment key | **`campaign_id`** |
| **`variant`** | Variant | **`message_variation_id`** Might be slightly different based on the Braze event schema that you use. |
| **`email_send_id` (optional, use if needed)** | Secondary ID (opt to use a Secondary Entity if you want to include additional metrics that are bridged to a different ID not utilized in your Braze Schema) | Universal internal id from bridged from an internal table: **`internal_user_id`**  |

Experiment analyses that use this assignment source can measure both user-level metrics and campaign specific metrics.

After the Braze Assignment table is set up, set up any additional [Facts](/data-management/definitions/fact-sql/) and [Metrics](/data-management/metrics/) that should be included with Braze experiments analyzed in Eppo including clicks or responses. 

Lastly, set up an [experiment for analysis](/experiment-quickstart/#2-create-an-experiment-analysis) using the Braze Assignment table and metrics you would like to measure in the experiment. Consider setting up a [Protocol](/experiment-analysis/configuration/protocols/) for Braze experiments to automate this experiment setup for subsequent experiments.