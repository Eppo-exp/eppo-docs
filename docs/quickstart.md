---
sidebar_position: 2
---

# Quickstart

Follow this quickstart to get your first experiment setup on Eppo in under 10 minutes

## Prep your warehouse

## Set up feature flagging

## Create Eppo account

## Connect data warehouse

- [Connect to Snowflake]()
- [Connect to BigQuery]()

## Create an Assignment SQL

1. Navigate to **Definitions**

2. Click **Create Definition SQL**

3. Click **Assignment SQL**

4. Select the subject of the Assignment SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

4. Name your Assignment SQL

5. Write SQL in the SQL editor to pull assignments from data warehouse

6. Click run

7. Annotate the columns that you've selected from the data warehouse

Eppo needs to know which columns correspond to experiment subject, timestamp of assignment, feature flag, and variant.

8. Adding optional dimensions

9. Save & Close

## Create a Fact SQL

1. Navigate to **Definitions**

2. Click **Create Definition SQL**

3. Click **Assignment SQL**

4. Select the subject of the Fact SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

5. Name your Assignment SQL

6. Write SQL in the SQL editor to pull events data from the data warehouse

7. Annotate the columns that you've selected from the data warehouse

In the example above, Eppo has already automatically determined that the `timestamp of creation` column is `ts` and the relenvant `entity id` column is `USER_ID`.

8. Add Facts

You'll want to add facts, one fact per column.

In the example above, we would like to measure the effect of the experiment on the number of upgrades.

In the data warehouse, every time someone upgrades, that event is logged as a row in the data warehouse.

This event is translated into an integer value, `1`, that can then be used as an Eppo fact and tracked in an experiment.

10. Save & Close

## Create metrics

1. Navigate to **Metrics**

2. Click **+Metric**

3. Select the subject of the User SQL

This should one of the entities you created.

In this case we are assigning users into different groups, so we choose **Users**

4. Select a fact

5. Select an aggregation

The aggregation will aggregate over the fact on a per-entity basis. So for example, if you select the `Revenue` fact and the `SUM` aggregation, the metric will be the total revenue for each user; contrastingly, if you select the `Upgrades` fact and the `SUM` aggregation, the metric will be the total number of upgrades for each user, which should only be 1 across the board.

Eppo supports the following aggregations:

- SUM
- COUNT DISTINCT
- COUNT
- RETENTION
- CONVERSION

6. (Optional) Select a Filter

You can select any of the dimensions that you created in the dimensions definitions. In the example above, we just want to focus on upgrades from Canada.

7. Select a minimum detectable effect

The minimum detectable effect refers to the smallest effect you want to reliably detect in experiments. The higher the minimum detectable effect you set, the longer the experiment will take to reach conclusive results.

## Create an experiment

### Configure the experiment

1. Navigate to **Experiments**

2. Click **+Experiment**

3. Fill out the **Create Experiment** Form

Give your experiment a name, start and end date.

4. Click on the **Set Up** tab

5. Click the **Configure the Experiment** button

6. Select an assignment SQL from the definitions you created

7. Input a feature flag name

You may need to refer back to your **Definitions** for the relevant feature flag name:

a) Navigate to **Definitions** and **Assignments**

b) Click on the three dots next to the Assignment SQL you want and then click **Edit Details**

c) Click **Run**

d) Look at the value of the column that you annotated as **feature flag**

e) The feature flag name you will want to input in experiments setup is one of these values.

8. Input what percentage of traffic you want randomized into the experiment.

Traffic refers to the experiment subjects, so if you input 100%, 100% of the relevant entities will be included in the experiment.

9. Select the traffic allocation you would like

10. Add the variants

Again, you may need to refer back to your **Definitions** for you relevant variant names.

a) Navigate to **Definitions** and **Assignments**

b) Click on the three dots next to the Assignment SQL you want and then click **Edit Details**

c) Click **Run**

d) Look at the value of the column that you annotated as **VARIANT**

e) The variant names you will want to add to experiments setup is one of these values.

11. Determine whether you want to split traffic evenly among variants

12. Click **Save Changes**

### Add metrics to experiment

1. Navigate to **Experiments**

2. Click **+Experiment**

3. Click the **Overview** tab

You should have already configured your feature flag, if you haven't, go do that first.

Under **Decision metrics**, you will see that guardmail metrics have already been included automatically.

4. Click **+Add metric** button

On the left hand of the modal, you will see a list of metrics that have been created that are attached to this set of experiment subjects.

You can select one of them to add to the experiment

5. Click **Save**
