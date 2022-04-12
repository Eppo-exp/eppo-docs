# Running successful experiments

Running a successful experiment isn't just about tracking metrics and looking at statistical significance. It's also about choosing the right metrics, the right duration, and any number of other small choices in experimental design and interpretation. While many of these decisions will be context-dependent, here are some best practices:

## Know what you want

You should go into the experiment with a clear understanding of what type of experiment you're running. This will inform what kinds of reults you're looking for, and how long the experiment should run. Some common scenarios are:

- Testing a new variation to decide whether this improves user experience
    - In this case, you are looking for a clear sign that the experience improves, and want to roll out quickly
- Testing a rollout (e.g. refactor of code), making sure that experience isn’t broken
    - In this case, you aren’t necessarily looking for an improvement in metrics, but rather want to make sure there aren’t any unforeseen negative consequences.
- Running an experiment to understand user behavior better
    - In this case, you want to run an experiment for a longer period of time so you get tighter confidence intervals: even if one variant is clearly better than another, there may be reason to continue to gather more data. 

## How long should you run an experiment?

In addition to the scenarios above, other factors can play a role in determining how long you should run an experiment:

- If you have many potential experiments that compete for “space”, you want to be more aggressive in stopping experiments early
- On the other hand, if there are no other experiments that are planned, feel free to run experiments longer so you gain a better understanding of the effects on your product.

## Traffic balances

Unless you have strong reason otherwise, aim for a balanced split (that is, 50/50 in terms of 2 variations, or 33/33/33 in case of 3 variations). The variation with the lowest traffic allocation will always be the bottleneck of reducing uncertainty.

A common motivation for running an imbalanced split (say 90/10) is that people are worried about a negative outcome, and want to minimize their users' exposure to this outcome. This is natural, but it’s good to realize that doing a 90/10 split might not help much: rather than 50% of the users having a short negative experience (and you quickly learning about this), you will give 10% of your users a long negative experience (because it will take much longer to pick up on the negative effect). That is, the total amount of “negative” is the same, it’s just spread out differently across your users.

## Avoid reassigning users to different variants mid-experiment

Re-assigning users during an experiment (user Alice first sees variant A, then in another session sees variant B), can result in statistically invalid metrics.

User re-assignment can be triggered by higher-level changes in the experiment like:

- Changing randomization while experiment is in flight
- Decreasing the overall traffic to an experiment
    - You can generally monotonically increase overall traffic to an experiment without having to reassign users, but decreasing overall traffic, or non-monotonically changing traffic (i.e. decreasing traffic, then increasing it again), can result in statistically invalid metrics becauser users will likely be reassigned.
    - You should always check with your feature flagging tool of choice to see how they handle traffic increases and decreases. Some tools like LaunchDarkly do [variation reassignment by default](https://docs.launchdarkly.com/home/experimentation/allocation#using-variation-reassignment) when you're increasing or decreasing traffic. This feature would have to be [disabled](https://docs.launchdarkly.com/home/experimentation/allocation#disabling-variation-reassignment).
- Turning off a variation
    - If you are sure you are no longer interested in a certain variation, you can turn it off, but you won’t get more signal on the other variants as the subjects in this variation will be tainted and data for these is discarded.


