---
sidebar_position: 3
---

# Global Lift

It's common for experiments to only impact a subset of the total audience (user base). In this case, a relevant question is "how will this localized experiment impact global metric values?". Eppo helps answer this question with its Global Impact calculator.

This page describes how experiment converage and Global Lift are calculated. For more information on using Global Lift, see [this page in the experimental analysis](/experiment-analysis/reading-results/global-lift) documentation.


## Computing global lift

### A few definitions

First, let's define TM as the total metric value across all events during the experiment, not just those assigned to the experiment. Further, let's define TEM as the total metric value for only those subjects assigned to the experiment.

### Coverage

The first number displayed in the Global Impact report is the coverage of the experiment. This is simply the percentage of the total metric that came from subjects in the experiment:

<div style={{textAlign: 'center'}}>
<i>Coverage = TEM / TM</i>
</div>

<br></br>

Note that this is not simply the percentage of users enrolled in the experiment, but rather a weighted percentage based on those users' behavior. For instance, your experiment could enroll 20% of users, but if those users are mostly power users, they could contribute to far more than 20% of your organization-wide metric value.

This definition of coverage has an issue however: it already includes the metric uplift. If an experiment moves a metric by a large amount, this is going to be an overestimate of the experiment audience's previous contribution to the global metric.

For this reason, in what follows we will not use coverage directly but rather estimate two counterfactuals: one where the control had been rolled out to the full audience, and one where the treatment had been rolled out.

### Rollout metric values

First, we estimate what would have happened if the control treatment was given to the full experiment population. We call this the **Control Rollout Value (CRV)** and define it as:

<div style={{textAlign: 'center'}}>
<i>Control Rollout Value (CRV) = Metric Aggregate in Control / Share of Users in Control</i>
</div>

<br></br>

where

<div style={{textAlign: 'center'}}>
<i>Share of Users in Control = Control Assignment Count / Total Experiment Assignment Count</i>
</div>

<br></br>

For the treatment cell, we simply multiply CRV by the treatment lift to get the **Treatment Rollout Value (TRV)**:

<div style={{textAlign: 'center'}}>
<i>Treatment Rollout Value (TRV) = CRV * (1+Treatment Lift)</i>
</div>

### Treatment and control adjustments

We can now estimate how the experiment population's total metric value would have changed had the full sample received treatment or control:

<div style={{textAlign: 'center'}}>
<i>Control Adjustment = CRV - TEM</i>
</div>

<div style={{textAlign: 'center'}}>
<i>Treatment Adjustment = TRV - TEM</i>
</div>

<br></br>

### Adjusting for eligible traffic exposure

In some scenarios not all eligible users will be enrolled into an experiment. Imagine you are running an experiment on iOS and you only enroll 20% of iOS users into the experiment as either test or control. This situation might arise if you are minimizing risk for a long-run experiment, or if you are running [Mutually Exclusive](/feature-flagging/concepts/mutual_exclusion/) experiments.

To account for this, we simply divide CRV and TRV by the traffic exposure. In the example above, if 20% of eligible users are part of the experiment, we multiply these adjustments by 5 to estimate what would have happened had the entire eligible population (iOS users) received either variant. Note that since exposure to the experiment is also randomized, the users exposed to the experiment will always be a representative sample of the larger eligible population. 


We can now calculate our two counterfactuals as follows:

<div style={{textAlign: 'center'}}>
<i>Full Control Rollout Value (FCRV) = TM + Control Adjustment / Traffic Exposure</i>
</div>

<div style={{textAlign: 'center'}}>
<i>Full Treatment Rollout Value (FTRV) = TM + Treatment Adjustment / Traffic Exposure</i>
</div>

<br></br>


For experiments randomized outside of Eppo, the Traffic Fraction needs to be input manually to Eppo. This is done during [experiment analysis configuration](/experiment-analysis/configuration/#configuring-the-experiment-analysis). 

### Global lift

Finally, global lift is simply the ratio between the two counterfactuals:

<div style={{textAlign: 'center'}}>
<i>Global Lift = FTRV / FCRV - 1</i>
</div>

<br></br>

This number represents how the global metric value, TM, is expected to move if the relevant treatment is rolled out to all eligible users.

