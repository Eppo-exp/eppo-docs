# Controlled-experiment Using Pre-Existing Data (CUPED)
CUPED is a statistical tool that leverages pre-existing data to reduce the variance of an A/B experiment. If data is music, CUPED is a pair of noise canceling headphones, allowing you to notice a more pronounced pattern in the data despite a lower volume or strong external noise.

Eppo uses CUPED to get more accurate estimates of treatment effect, which should lead to narrower confidence intervals.

## Inner workings
If you're looking for specific details on the math involved [this paper goes into depth](http://robotics.stanford.edu/~ronnyk/2013-02CUPEDImprovingSensitivityOfControlledExperiments.pdf).

## Overview
When utilizing CUPED, Eppo automatically ingests event data of subjects in the 30 days prior to experiment start across specified metrics. CUPED works best for experiments with long-time users for whom many pre-experiment data points exist. It is less effective for newer users.

Eppo uses a ridge regression model to predict subject level outcomes across all metrics. Relationships between every metric are taken into account to make predictions for other metrics. This allows you to leverage variables with rich datasets to reduce variance for sparser data where pre-experiment datapoints might be lacking (for example, retention).

## Using CUPED on Eppo

The predictions of this model are used to get more accurate estimates of treatment effect, which should lead to narrower confidence intervals. You can switch between CUPED and non-CUPED results from the CUPED dropdown.

![Switch to non CUPED](../../static/img/measuring-experiments/cuped-switch-to-non-cuped.png)

![Switch to CUPED](../../static/img/measuring-experiments/cuped-switch-to-cuped.png)

CUPED can be turned on in the admin panel, and in the overview page of an experiment you can switch between CUPED and standard estimates. The models are updated once a day, but you can manually refresh upon changing the control variant or adding a new metric.

![Turn CUPED on](../../static/img/measuring-experiments/cuped-turn-on-cuped.png)

## Notes
  - Currently, we do not support ratio metrics.
  - We will continue improving CUPED models on Eppo as we gather more data
