---
sidebar_position: 4
---

# Experiment assignment

Flags can be used to assign users into experiment buckets (i.e., randomization) for A/B testing. Teams that use Eppo for assignments run their entire experimentation workflow through the tool.

## Create an experiment allocation

To begin, create an experiment allocation in your Feature Flag. An experiment allocation splits traffic randomly as expected for an A/B or a multi-variant test. To run an experiment, you have to select this type of allocation.

![Randomization 0](/img/feature-flagging/randomization-0.png)

Your flag must be active to start the experiment assignment.

## Create an experiment

Click "Create Experiment" on the experiment allocation to create an experiment. You can do this at any time, even after the experiment assignment has begun.

![Randomization 1](/img/feature-flagging/randomization-1.png)


### Run multiple experiments (optional)

You can add multiple experiment allocations that target different segments of traffic. To accomplish this, you can create multiple experiment allocations with mutually exclusive targeting rules. Subjects for whom the first targeting rule does not apply pass on to the following allocation on the flag.

You may want to do this if you want to test different variants for mutually exclusive groups, such as variants that apply to subjects in different countries.

![Multiple allocations](/img/feature-flagging/multiple_allocations.png)

Once assignments have begun, they must be logged into your data warehouse to be analyzed by Eppo. All SDKs take in a callback function that is called with the assignment parameters (`subject_id`, `experiment_id`, `timestamp`, etc.) passed in when assignments are made. You manage that function completely; Eppo's only requirement is that the assignment data eventually reaches your warehouse. 

Congratulations on setting up your first Eppo randomized experiment! Refer to our [analysis setup guide](/experiment-quickstart) to connect Eppo to your data warehouse and easily analyze the results.


