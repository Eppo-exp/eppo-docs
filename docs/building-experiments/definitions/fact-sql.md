# Fact SQL

When you write Fact SQL's, you're pulling data from the data warehouse that correspond to specific events that serve as input to metrics. For example, signups, activations, net subscriptions, etc.

## Creating a Fact SQL

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
