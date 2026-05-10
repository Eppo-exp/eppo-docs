---
sidebar_position: 5
---

# Subjects included in winsorization thresholds

Winsorization clips unusually large or small metric values to percentile thresholds. The **Subjects included** setting controls which assigned subjects are used to calculate those percentile thresholds. It does not remove subjects from the final experiment analysis.

## Example data

Suppose 2,000 assigned subjects have this entity-level revenue after Eppo aggregates the selected Fact to the subject level:

| Group | Subjects | Entity-level revenue |
|---|---:|---:|
| No matching Fact | 300 | No matching Fact |
| NULL Fact | 400 | NULL |
| Zero revenue | 800 | 0 |
| Positive revenue | 500 | 1, 2, 3, ..., 500 |

If the upper winsorization threshold is the 95th percentile, each option uses a different set of values to find that threshold. The examples below use the nearest-rank percentile method for illustration; the important point is which subjects are included.

## All assigned subjects

Use every assigned subject, including subjects without a matching Fact. In this example, the subjects with no observed revenue contribute zeros to the threshold calculation.

Values used for the threshold:

```text
1,500 zeros, then 1, 2, 3, ..., 500
```

The 1,500 zeros come from subjects with no matching Fact, subjects with NULL Facts, and subjects with zero revenue:

```text
300 + 400 + 800 = 1,500
```

Illustrative 95th percentile threshold: **400**

Use this option when "no activity" is part of the distribution you want the threshold to reflect.

## Subjects with non-null Facts

Use subjects whose aggregated Fact value is non-null. Subjects without a matching Fact, or with only NULL Facts, are excluded from the threshold calculation.

Values used for the threshold:

```text
800 zeros, then 1, 2, 3, ..., 500
```

The 800 zeros come only from subjects whose observed revenue is actually zero. The 300 subjects with no matching Fact and the 400 subjects with NULL Facts are excluded:

```text
800
```

Illustrative 95th percentile threshold: **435**

Use this option when the threshold should be based only on subjects with observed metric data, while still keeping legitimate zero values.

## Subjects with positive total

Use only subjects whose aggregated metric value is greater than 0. Subjects with missing, NULL, or zero values are excluded from the threshold calculation.

Values used for the threshold:

```text
1, 2, 3, ..., 500
```

Illustrative 95th percentile threshold: **475**

Use this option when zero represents non-participation and you want the outlier threshold to be based only on subjects with positive activity.

## How the setting affects results

The setting changes the percentile threshold used for clipping. After Eppo finds the threshold, the metric still follows its normal null and missing-Fact handling in the experiment results.

For example, if the chosen threshold is 400, subjects with values above 400 are clipped to 400. Subjects excluded from the threshold calculation are not automatically removed from the experiment analysis.
