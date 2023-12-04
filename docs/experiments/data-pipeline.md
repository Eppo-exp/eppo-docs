---
sidebar_position: 14
---

# Data pipeline

At a high level, the Eppo experiment data pipeline has four main branches along with an assignment summarization that is a predecessor for each of those branches.

1. Assignment summarization
2. Core pipeline
3. CUPED pipeline
4. Metric dimensions/properties pipeline
5. Funnel metrics pipeline

![Pipeline visualization][/img/experiments/data-pipeline/experiment_pipeline_visualization.png]

## Assignment summarization

1. **Incremental daily assignments**: As part of the incremental process, we first delete the last two days worth of data. We then select all assignments from the past two days for this experiment and insert them into a daily table, recording the first variant, assigned timestamp, and whether or not a subject was exposed to more than one variant for each day.
2. **Assignments summary**: We recompute the assignment summary from scratch each run. There's one record for every subject, including the observed variant, timestamp of assignment, and whether or not they were exposed to multiple variants. This table is used downstream by all four pipeline branches.

## Core Pipeline

The core pipeline starts with the assignments, incrementally joins event data from your metrics/facts, aggregates the data, and computes winsorized aggregates.

1. **Incremental daily data frame**: Eppo joins your experiment assignments to your fact sources
2. **Cumulative data frame**:
3. **Winsorized data frame**:
4. **Dimensionalized summaries**:
5. **Dimensionalized summaries reduced**:

## CUPED pipeline

1. **CUPED lookback**:
2. **CUPED dataframe**:
3. **CUPED estimate means**:

## Metric dimensions/properties pipeline

1. **Metric dimensions daily**:
2. **Metric dimensions cumulative**:

## Funnel metrics pipeline

1. **Incremental funnel metric events**:
2. **Funnel metrics data frame**:
3. **Funnel metrics summaries**: