---
slug: /experiment-quickstart
sidebar_position: 4
---

# Your first experiment analysis

:::info
In order to analyze an experiment, you must have completed the [initial setup quickstart](/setup-quickstart) and [created your first metric](/metric-quickstart).
:::

This guide will walk you through creating your first experiment readout. We will create a new experiment, set up basic configurations, add metrics, run the analysis, and visualize results.

### 1. Create an experiment

From the **Experiments** tab, click **+Experiment**, add a name for the experiment, select or enter the Feature Flag Key, select an Entity, pick the Assignment Logging table, and enter a name and hypothesis for the experiment.

**Logging & Feature Flag Key**. This section tells Eppo who was eligible for this experiment. Select the Assignment SQL definition you created in the [Initial Setup Quickstart](/setup-quickstart/) and select the Feature Flag Key that corresponds to this experiment. Eppo will pre-populate a list of known experiment keys in a scheduled batch job, but if you do not yet see your experiment key in the dropdown you can enter it manually.

![Create Experiment](/../static/img/building-experiments/quick-start-1.png)

### 2. Configure the experiment

Once you have created an experiment, you will land on the experiment setup page. Click **Configure the Experiment** to be taken to the experiment configuration page.

![Configure Experiment](/../static/img/building-experiments/quick-start-2.png)

The setup flow will walk you through several sections:

1. **Assignment & Analysis Date Range**. Use this section to tell Eppo what date range of assignments to use. You can also set a different date range for the metric events you want to include the experiment. See [here](/experiments/creating-experiments#experiments-with-custom-event-dates) for more information.
2. **Variations**. Use this section to tell Eppo the different variants that were a part of the experiment and the expected traffic allocation across groups. Eppo uses these allocation ratios to perform [sample ratio mismatch checks](/statistics/sample-ratio-mismatch). 
3. **Allocation**. If your experiment has a custom traffic split or was only rolled out to a subset of eligble users (with the remainder not tracked in your assignment table), you can specify that in this section. The traffic expoure powers the [Global Lift](/experiments/global-lift) calculator. In most use cases it is appropriate to keep this expoure at 100% and the traffic split even.
4. **Experiment Analysis Plan (optional)**. Default analysis options are set to make it easy to start using Eppo without diving deep into the details of our statistics engine. For the majority of our customers, the default settings are appropriate. If you want to dive deeper into what these settings do, please see the [Analysis Plan section of our docs](experiments/analysis-plans).  

Once you have configured your experiment, click **Save Changes** and continue on to adding metrics.

### 3. Add metrics

Now that the experiment is configured, navigate back to the overview panel and click **+Add** or **+Decision Metrics**. From here, you'll be able to see all of the metrics you created during the metric quickstart. Select any that are relevant to this experiment.

![Add Metrics](/../static/img/building-experiments/quick-start-3.png)

### 4. Run the analysis and visualize results

By default, results will update in a nightly incremental batch job. If you want to get results immediately you can manually trigger an update by clicking **update now** (see screenshot).

![Update results](/../static/img/building-experiments/quick-start-4.png)

Depending on the size of your data and the warehouse resources that were provisioned for the Eppo service account, this update can take anywhere from a couple of minutes to about half an hour. The first run is typically the longest as subsequent nightly refreshed only process new data.

Once the job completes, you'll see a scorecard with each metric, measured lift, and confidence intervals.

![Read results](/../static/img/building-experiments/quick-start-5.png)

Congratulations, you have now created your first experiment analysis! If you want to analyze additional experiments, simply repeat this process but substitute in a different experiment key.

This is just the surface of Eppo's functionality. To learn more about analyzing experiments, see the [Experiments](/experiments/) section of our documentation.
