---
sidebar_position: 1
---

# Experiment Protocols

Eppo's mission is to help everyone run more experiments, but creating new experiments comes with a number of friction points that slows down the process. Experiment Protocols automate key elements on the experimentation process such that running experiments involves making less decisions and experimentation overall takes less time.

Specifically, Protocols allow admins to create re-usable rules for all the different types of experiments teams run. Individual teams can then adopt these Protocols when creating experiments, resulting in experiments that adhere to the governance rules proscribed.

## Creating a Protocol

Protocols can be created by Admins by navigating to Admin > Protocols and clicking the `Create Protocol Button`.

![Protocol configuration screen](/img/experiments/protocols/protocol-config.png)

After filling out the required sections, you can publish the Protocol to make it available. Each Protocol can be made available globally or for specific teams that you specify under `Who can use this Protocol?`

### Analysis settings

Analysis setting determine the entity tested, the logging table to reference, the stats regime to use, and experiment run time.

For more information on the right statistical analysis plan to use please refer to the [documentation on analysis plans.](/experiment-analysis/configuration/analysis-plans)

![Protocol analysis setting screen](/img/experiments/protocols/protocol-analysis-settings.png)

When a default run time is set, the experiment analysis end date will automatically be set to run for the defined number of days. This does not impact the assignment, which must be managed in the configuration section (or an external randomization system). The end user can also override this end date.

### Decision criteria

The decision criteria sets the key metrics to be measured in the experiment and aligns the team around a ship decision based on the measurement of those metrics.

![Protocol select metrics screen](/img/experiments/protocols/protocol-select-metrics.png)

Specifying a Primary Metric is required. This is the metric that your experiment hypothesis is testing. The Primary Metric will be used to determine the status of the experiment and, ultimately, it's outcome. 

You are also able to specify optional [guardrail metrics](/data-management/organizing-metrics/guardrails). Guardrail metrics provide a level of governance and are primarily useful to track metrics that an experiment is not supposed to positively impact, but you want to ensure that there is no negative effect either. Guardrail metrics can use any cutoff bounds previously set or can have custom cutoffs set for the Protocol.

After the metrics are set, you can then specify the recommended decision based on metric outcomes. This recommendation will appear on the experiment when the experiment end date is reached or if the primary or guardrail metrics have achieved an outcome that is statisically significant.

![Protocol decision criteria screen](/img/experiments/protocols/protocol-decision-criteria.png)

Recommended decisions include:
* Roll out winning variant - Ship the variant that performed the best compared to the control
* Extend run time - Continue running the experiment to reach more precision
* Discuss with stakeholders - Discuss the results with stakeholders to determine the best course of action
* Do not roll out - Roll back to the control and turn off the treatment variant(s)

### Metrics

The metrics section allows you to set a maximum number of metrics allowed to be added to an experiment. You can also specify any additional monitoring metrics to include in the experiment that are not the Primary or Guardrail metrics.

![Protocol metric settings screen](/img/experiments/protocols/protocol-metric-settings.png)


## Adding Protocols to Experiments

Create a new experiment by navigating to the **Analysis** page, click **Create**, and select **Experiment Analysis**.

Once a title and team are selected, you will be promoted to select a Protocol. This will automatically determine the entity and AssignmentSQL for the experiment. Note that there is an option to not use a Protocol.

![An experiment with a Protocol applied during creation](/img/experiments/protocols/protocol-create-experiment.png)

After you click `Next`, the experiment is created with all the Protocol's settings. The metrics set will automatically be attached to the experiment, the stats regime will be set, and the end date will be determined by the default run time.

Additional information for the experiment's Hypothesis, Key Takeaways, and Links to relevant artifacts can be added now.

![A draft experiment created by a Protocol](/img/experiments/protocols/protocol-draft-experiment.png)


## Recommend decisions

Based on the Protocol's decision criteria, there will be a recommendation displayed on the experiment.

![An experiment with a ship recommendation](/img/experiments/protocols/protocol-recommendation.png)

A recommendation will display when:
* The experiment end date is reach
* The Primary metric is statistically significant positive or negative
* The Guardrail metrics are statistically significant positive or negative, or the guardrail cutoff threshold is breached

The decision made can be recorded by clicking the `Make Decision` button. Note that the recommended decision does not have to followed, but we suggest adding notes as to why the team decided to deviate from the Protocol.