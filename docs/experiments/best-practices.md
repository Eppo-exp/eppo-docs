# Best practices

Running a successful experiment involves more than just tracking metrics and analyzing statistical significance. It requires careful consideration of metrics selection, experiment duration, and various design and interpretation choices. While specific decisions may depend on the context, the following best practices can guide you:

## Define your goals

Before starting an experiment, clearly understand the type of experiment you are conducting. This knowledge will determine the desired outcomes and the appropriate duration for the experiment. Consider common scenarios, such as:

- Testing a new variation to assess improvements in user experience: Look for clear indications of improvement to expedite implementation.
- Testing a rollout (e.g., code refactor) to ensure the experience remains intact: Focus on identifying unforeseen negative consequences rather than expecting metric improvements.
- Conducting an experiment to gain insights into user behavior: Run the experiment for a longer duration to achieve tighter confidence intervals. Even if one variant appears superior, extended data collection may be useful.

## How long should you run an experiment?

Apart from scenario-based considerations, other factors influence the ideal experiment duration:

- Competition for experiment "real estate": If multiple experiments vie for attention, consider ending experiments earlier to prioritize resources.
- Lack of planned experiments: When no other experiments are scheduled, feel free to run experiments for longer durations to gain a comprehensive understanding of their impact on your product.

## Traffic balances

Unless specific reasons dictate otherwise, aim for a balanced split of traffic allocation. For example, consider a 50/50 split for two variations or a 33/33/33 split for three variations. The variation with the lowest traffic allocation becomes the bottleneck for reducing uncertainty.

An imbalanced split (e.g., 90/10) is sometimes used to minimize users' exposure to a potentially negative outcome. However, it's important to recognize that a 90/10 split may not offer significant benefits. Instead of 50% of users experiencing a short negative experience (facilitating quick learning), 10% of users would endure a longer negative experience, as it takes more time to detect the negative effect. The total negative impact remains the same, only distributed differently among users.

## Avoid reassigning users to different variants mid-experiment

Re-assigning users during an experiment (user Alice first sees variant A, then in another session sees variant B), can result in statistically invalid metrics.

User re-assignment can be triggered by higher-level changes in the experiment like:

- Changing randomization while experiment is in flight
- Decreasing the overall traffic to an experiment
  - You can generally monotonically increase overall traffic to an experiment without having to reassign users, but decreasing overall traffic, or non-monotonically changing traffic (i.e. decreasing traffic, then increasing it again), can result in statistically invalid metrics becauser users will likely be reassigned.
  - You should always check with your feature flagging tool of choice to see how they handle traffic increases and decreases. Some tools like LaunchDarkly do [variation reassignment by default](https://docs.launchdarkly.com/home/experimentation/allocation#using-variation-reassignment) when you're increasing or decreasing traffic. This feature would have to be [disabled](https://docs.launchdarkly.com/home/experimentation/allocation#disabling-variation-reassignment).
- Turning off a variation
  - If you are sure you are no longer interested in a certain variation, you can turn it off, but you won’t get more signal on the other variants as the subjects in this variation will be tainted and data for these is discarded.
