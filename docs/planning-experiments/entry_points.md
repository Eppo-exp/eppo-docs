# Entry Points

Entry Points are Eppo’s way of determining how much traffic a potential experiment will receive, and are configured by your organization’s data practitioner. [See here how to create a new Entry Point](./setting_up_the_sample_size_calculator#creating-entry-points).

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

**See Also**

 - [Creating Entry Points](./setting_up_the_sample_size_calculator#creating-entry-points)