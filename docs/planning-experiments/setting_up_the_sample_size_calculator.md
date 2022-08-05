# Setting up the Sample Size Calculator

How long should you plan for a particular experiment to run? Eppo includes tools for estimating in advance when a metric’s Minimum Detectable Effect (MDE) is likely to be achieved. The Minimum Detectable Effect is the smallest lift that can be detected by an experiment a certain percent of the time.

In the past, you may have performed an MDE calculation by manually providing the mean and variance of each metric of interest to a sample-size calculator; Eppo differs from traditional tools with its concept of Entry Points, which computes many of the input values for you. After setting up one or more Entry Points, you can use Eppo’s Sample Size Calculator to quickly and accurately assess the tradeoff between experiment run-time and Minimum Detectable Effect.

## Creating Entry Points

To create your first **[Entry Point](./entry_points)**, first ensure that you have one or more Entities set up in Eppo. Visit the Definitions tab, and click the *Create Definition SQL* button. From the modal dialog, choose *Entry Point SQL*, and select the entity that you would like to run simulated experiments on.

Now you will see a page where you can enter SQL. Each row of your returned SQL should correspond to an "entry" or simulated assignment. The returned data needs to include a timestamp as well as an entity ID, which should be configured on the right-hand side of the page. It is not necessary to de-duplicate this entry data (for example, if the same user logs in twice); Eppo will perform the de-duplication for you, using the first event for each entity ID as the simulated assignment.

Once you have configured the SQL and named the Entry Point, click *Save & Close*. You now have an Entry Point, and will soon be able to use it to perform sample-size calculations.

You will only need to perform the above steps when adding a new Entry Point into the system. The rest of the time, you will be able to use the Sample Size Calculator without doing any manual work in advance.

## Refreshing simulated experiment data

Once your first Entry Point is configured, Eppo will use it to run simulated experiments approximately once a week. If you'd like to perform a sample-size calculation before the scheduled simulation is run, you will need to perform a manual refresh of the entry point data.

To do so, open up the Sample Size Calculator, which is accessible via a button in the top-right corner of the main Experiments list page. In the modal dialog, choose the entity that is associated with the Entry Point that you just created. The Sample Size Calculator interface will appear. On the left, choose your new Entry Point from the drop-down list labeled *Entry Point*. You should now see a message indicating that the Entry Point data needs to be calculated. Click *Refresh*. It may take a while for this calculation to be performed for the first time.

Once the first Refresh is complete, your Entry Point is ready to be used for your first sample-size calculation.