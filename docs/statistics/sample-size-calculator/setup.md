---
sidebar_position: 1
---

# Setup

How long should you plan for a particular experiment to run? Eppo includes tools for estimating in advance when a metric’s Minimum Detectable Effect (MDE) is likely to be achieved. The Minimum Detectable Effect is the smallest lift that can be detected by an experiment a certain percent of the time.

In the past, you may have performed an MDE calculation by manually providing the mean and variance of each metric of interest to a sample-size calculator; Eppo differs from traditional tools with its concept of Entry Points, which computes many of the input values for you. After setting up one or more Entry Points, you can use Eppo’s Sample Size Calculator to quickly and accurately assess the tradeoff between experiment run-time and Minimum Detectable Effect.

## Creating Entry Points

### What is an Entry Point?

Entry Points are Eppo’s way of determining how much traffic a potential experiment will receive.

An Entry Point is a simulated experiment assignment; in other words, it is an event that normally triggers assignment into one or more experiments. Examples of Entry Points might include:

- User logs into website
- Users enters checkout flow
- User starts playback
- Company creates account

Every Entry Point event must include two key pieces of data:

- An entity identifier (such as User ID or Visitor Cookie)
- A timestamp

Eppo uses these Entry Point events in order to simulate experiments using historical data in your company’s data warehouse. These simulated experiments use 1-10 weeks of historical data; for each time period, Eppo calculates:

- The number of unique entities IDs (that is, total number of subjects "enrolled" in the simulated experiment)
- For each metric associated with the Entry Point's entity, the mean and variance of that metric

A common issue with traditional sample-size calculators is that the mean and variance of metrics can change over time. Entry Points solve this problem by calculating these values over multiple time periods, so that the inputs to the sample size calculation dynamically adjust to the experiment run-time. Eppo performs these calculations in the background, approximately once a week, using the most recent data available. (A simulated one-week experiment will use the most recent week of data, a simulated two-week experiment will use the most recent two weeks of data, etc.)

### Defining an Entry Point

To create your first Entry Point, first ensure that you have one or more Entities set up in Eppo. Visit the Definitions tab, and click the _Create Definition SQL_ button.

![Select create definition](/img/planning-experiments/select-create-definition.png)

From the modal dialog, choose _Entry Point SQL_, and select the entity that you would like to run simulated experiments on.

![Select entry point](/img/planning-experiments/select-entry-point.png)

Now you will see a page where you can enter SQL. Each row of your returned SQL should correspond to an "entry" or simulated assignment. The returned data needs to include a timestamp as well as an entity ID, which should be configured on the right-hand side of the page. It is not necessary to de-duplicate this entry data (for example, if the same user logs in twice); Eppo will perform the de-duplication for you, using the first event for each entity ID as the simulated assignment.

Once you have configured the SQL and named the Entry Point, click _Save & Close_. You now have an Entry Point, and will soon be able to use it to perform sample-size calculations.

You will only need to perform the above steps when adding a new Entry Point into the system. The rest of the time, you will be able to use the Sample Size Calculator without doing any manual work in advance.

## Refreshing Entry Point data

Once your first Entry Point is configured, Eppo will use it to run simulated experiments approximately once a week. If you'd like to perform a sample-size calculation before the scheduled simulation is run, you will need to perform a manual refresh of the entry point data.

To do so, open up the Sample Size Calculator, which is accessible via a button in the top-right corner of the main Experiments list page. In the modal dialog, choose the entity that is associated with the Entry Point that you just created. The Sample Size Calculator interface will appear. On the left, choose your new Entry Point from the drop-down list labeled _Entry Point_. You should now see a message indicating that the Entry Point data needs to be calculated. Click _Refresh_. It may take a while for this calculation to be performed for the first time.

Once the first Refresh is complete, your Entry Point is ready to be used for your first sample-size calculation.
