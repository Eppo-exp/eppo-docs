---
sidebar_position: 2
---

# Experiment assignment

Flags can be used to assign users into experiment buckets (i.e randomization) for A/B testing. Teams that use Eppo for assignments run their entire experimentation workflow through the tool.

### Create an experiment allocation

The begin, create an experiment allocation in your Feature Flag. An experiment allocation has a randomized traffic split needed to run an A/B or multi-variant test. You must select this type of allocation to run an experiment.

![Randomization 0](/img/feature-flagging/randomization-0.png)

Your flag must be active to start the experiment assignment.

### Create an experiment

Click "Create Expeirment" on the experiment allocation to create an experiment. You can do this at any time, even after experiment assignment has begun.

![Randomization 1](/img/feature-flagging/randomization-1.png)

Once assignments have begun, they will need to be logged to your data warehouse to be analyzed by Eppo. All SDKs take in a callback function that is called with the assignment parameters (`subject_id`, `experiment_id`, `timestamp`, etc.) passed in when assignment are made. That function is completely managed by you - the only requirement is that the assignment data eventually makes it to your warehouse. 

Congratulations on setting up your first Eppo randomized experiment! Refer to our analysis set up guide to connect Eppo to your data warehouse and easily analyze the results.