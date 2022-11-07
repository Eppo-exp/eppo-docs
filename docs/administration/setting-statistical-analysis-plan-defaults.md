# Setting Statical Analysis Plan Defaults for Experiments

## What is the Statistical Analysis Plan?
The Statistical Analysis Plan determines the statistical methods used to analyze your experiments.
* **Confidence Interval Method**: Sequential, Fixed Sample, Bayesian
* **Confidence Level**: The percent of time the confidence interval contains the true lift
* **Desired Power (for the progress bar)**: The percent of the time the minimum effect size will be detected, assuming it exists.


## How to Change the Defaults
You can define the defaults for the statistical methods used for experiments across Eppo by going to **Admin > Settings > Statistical Analyis Plan**. 

The settings defined at the Admin level will be the company-wide defaults for any “draft”, “running”,  and “wrap up” experiments that have not opted out of using the defaults. Individual experiments can choose to opt out of the company-wide defaults and use different settings. See how to set the [statistical analysis plan at the experiment level](https://docs.geteppo.com/building-experiments/experiments/creating-experiments/#10-optional-the-statistical-analysis-plan).

![Company Analysis Plan](https://user-images.githubusercontent.com/90637953/200430663-1272805d-b494-44aa-bc48-cfd2e9fc3439.gif)
