# Holdout Analysis

Holdout Analysis allows you to understand the aggregate impact of experiments grouped in a Holdout. 

Eppo enables you to bring your own holdouts and provides a full-featured analysis of that holdout on key metrics. Holdouts can also be used with Eppo's SDK for an end-to-end managed experiments. Please refer to [the Holdouts page for this functionality](/feature-flagging/concepts/holdout-config).

### Assignment setup

While Eppo is flexible to how you configure holdouts on your end, we recommend that you set up your holdouts in the following fashion:
* There should be two variants: `status_quo` and `all_shipped`
* Traffic should be evenly split between these variants within your withheld traffic group
* Users in `status_quo` should always see the control experience until the holdout is released
* Users in `all_shipped` should be exposed to the winning variant of each experiment after it has been concluded and rolled out

Ensure you are logging exposure to the holdout and each variant in an Assignment Source. Eppo requires the following information:
*  An `experiment key` which is the name of the holdout the user is enrolled in
*  The `variant` name that the user is enrolled in for the applicable holdout

With this setup, holdouts will be logged with experiments in AssignmentSQL that is set up in Eppo.

![Verify assignment source](/img/experiments/holdouts/standalone-assignment-sql.png)

### Configuring a holdouts analysis

Create a new holdout analysis over your desired date range by clicking on the "Create Analysis" button on the Analysis tab.

Name the analysis, select which entity is the subject of the analysis (e.g., User), and an assignment source.

Select a holdout key, which will be the key for the experiment.

Configure the analysis with the variation names in your holdout, such as `status_quo` and `all_shipped`.
This allows the Eppo generated SQL to correctly query the data in your warehouse.

![Configure variations](/img/experiments/holdouts/standalone-variations.png)

On the Overview tab, you are able to link experiments to your holdout to provide a comprehensive report of how each 
experiment impacted the primary Holdout metric and show the experience provided by the winning variants. To do so, go to
the Overview tab and add experiments that are part of the holdout. Note that these experiments must be configured in Eppo
to be linked.

![Create a stand-alone analysis](/img/experiments/holdouts/analysis-only-setup1.png)

## Holdout analysis

Regardless of whether you use Eppo's SDK or your own, the analysis will detail the impact of the winning variations over
the status quo.

![View Holdout Report](/img/experiments/holdouts/holdouts-report.png)

