---
sidebar_position: 1
---

# Setup

How long should you plan for a particular experiment to run? The Sample Size Calculator helps you estimate in advance when a metric’s Minimum Detectable Effect (MDE) is likely to be achieved. The Minimum Detectable Effect is the smallest lift that can be reliably detected by an experiment with a given sample size.

You may have previously performed an MDE calculation by manually providing the mean and variance of each metric to an off-the-shelf sample size calculator or power analysis tool. Eppo differs from traditional tools with its concept of Entry Points: we compute these input values for you, and do so in a way that is tailored to the precise conditions under which your experiment is triggered.

After setting up one or more Entry Points, you can use Eppo’s Sample Size Calculator to quickly and accurately assess the tradeoff between experiment runtime and Minimum Detectable Effect, and how experiment setup and analysis settings affect this tradeoff.

## Entry Points

### What is an Entry Point?

Entry Points are Eppo’s way of determining which subjects will enter (or “trigger”) a potential experiment.

An Entry Point is a simulated experiment assignment; in other words, it is an event that normally triggers assignment into one or more experiments. Examples of Entry Points include:

- User logs into website
- User enters checkout flow
- User starts playback
- Company creates account

Every Entry Point event must include two key pieces of data:

- An [Entity](/data-management/entities) identifier (such as User ID or Visitor Cookie)
- A timestamp

### How the Sample Size Calculator uses an Entry Point

Eppo uses these Entry Point events in order to **simulate** experiments using historical data in your company’s data warehouse. These simulated experiments span 1 to 10 weeks of historical data. For each time range, Eppo calculates the number of unique entities (that is, total number of subjects “enrolled” in the simulated experiment) and the mean and variance of each metric of interest.

A common issue with traditional sample size calculators is that the mean and variance of metrics changes depending on experiment duration. Entry Points solve this problem by calculating these values over multiple time periods, so that the inputs to the sample size calculation dynamically adjust to the experiment runtime. Eppo performs these calculations automatically using the most recent data available. (The simulated one-week experiment will use the most recent week of data, the simulated two-week experiment will use the most recent two weeks of data, etc.)

A second issue with traditional sample size calculators is that the mean and variance of metrics depend on _which_ subjects enter an experiment. The traditional approach is to compute mean and variance for all subjects, then scale down the sample size using the fraction of subjects that will enter the experiment. This approach does not account for selection: subjects who trigger the experiment are typically unrepresentative of the entire population. For example, users who reach the checkout flow have purchase amounts with higher mean and higher variance than those who don't. (If you don't enter the checkout flow, purchase amount is exactly 0!) Entry Points solve this problem by calculating mean and variance over precisely the population that's relevant to the experiment.

### Defining an Entry Point

To create your first Entry Point, first ensure that you have the appropriate [Entity](/data-management/entities) set up in Eppo. The Entity defines the subject over which you will be running your experiment.

Next, visit the Definitions tab, and click the _Create Definition SQL_ button.

![Select create definition](/img/planning-experiments/select-create-definition.png)

From the modal dialog, choose _Entry Point SQL_, and select the Entity that you would like to run simulated experiments on.

![Select Entry Point](/img/planning-experiments/select-entry-point.png)

Now you will see a page where you can enter SQL. Each row of your returned SQL should correspond to an “entry” or simulated assignment. The returned data needs to include a timestamp as well as an Entity ID, which should be configured on the right-hand side of the page. 

:::note
It is not necessary to deduplicate this entry data (for example, if the same user logs in twice). Eppo will perform the deduplication for you, using the first event for each Entity ID as the simulated assignment.
:::

Once you have configured the SQL and named the Entry Point, click _Save & Close_. You now have an Entry Point, and will soon be able to use it to perform sample size calculations.

You will only need to perform the above steps when adding a new Entry Point into the system. The rest of the time, you will be able to use the Sample Size Calculator without doing any manual work in advance.

## Next step

Once your Entry Point is configured, you are ready to [use it to run a Sample Size Calculation](/sample-size-calculator/setup).
