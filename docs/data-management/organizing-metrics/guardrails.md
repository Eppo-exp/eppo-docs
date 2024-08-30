---
sidebar_position: 6
---

# Guardrail cutoffs

A guardrail cutoff refers to a downside threshold that can be set on a metric. When the results for the metric breach this threshold, the metric will display a yellow warning state.

Use a guardrail cutoff where a neutral result is okay but a downside risk should be avoided. They also enable non-inferiority testing when a metric with a guardrail is set as primary.

## Create Guardrail metrics

![Create guardrail metric](/img/data-management/metrics/guardrail-metric-setup.png)

1. Navigate to **Metrics**
2. Click to edit a metric
3. In `Advanced Settings` enable `Add a guardrail cutoff`
4. Select the the threshold you would like to set for the cutoff

## Guardrail metrics in experiments

![Guardrail metrics in an experiment](/img/data-management/metrics/guardrail-experiment.png)

A metric with a guardrail cutoff will appear with a `Guardrail label` and a grey boundary indicating the cutoff zone.

When a metric does not breach the cutoff threshold and is not statistically significant positive or negative, it will appear as grey with a check that the cutoff was not breached.

When a metric breaches the cutoff threshold and is not statistically significant negative, it will appear as yellow with a warning that the cutoff was breached. In this case, you should consider not rolling out the variant given that the Guardrail metric was not above the pre-determined threshold.

When a metric breaches the cutoff threshold and not statistically significant negative, it will appear as red just as any other statistically significant negative metric would.