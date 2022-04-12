# Running a successful experiment

Running a successful experiment isn't just about tracking metrics and looking at statistical significance. It's also about choosing the right metrics to track for the right duration, and any number of other small choices in experimental design.

Here are some best practices for running a successful experiment:

## Know what you want

- Test a new variation to decide whether this improves user experience
    - In this case, you are looking for a clear sign that the experience improves, and want to roll out quickly
- Testing a rollout (e.g. refactor of code), making sure that experience isn’t broken
    - In this case, you aren’t necessarily looking for an improvement in metrics, but rather want to make sure there aren’t any unforeseen negative consequences
- Running an experiment to understand user behavior better
    - In this case, you want to run an experiment for a longer period of time so you get tighter confidence intervals: even if one variant is clearly better than another, there may be reason to continue to gather more data

## Traffic balances

Unless you have strong reasons otherwise, aim for a balanced split (that is, 50/50 in terms of 2 variations, or 33/33/33 in case of 3 variations). The variation with the lowest traffic allocation will always be the bottleneck of reducing uncertainty.

A common motivation for running an imbalanced split (say 90/10) is that people are worried about a negative outcome. This is natural, but it’s good to realize that doing a 90/10 split might not help much: rather than 50% of the users having a short negative experience (and you quickly learning about this), you will give 10% of your users a long negative experience (because it will take much longer to pick up on the negative effect). That is, the total amount of “negative” is the same, it’s just spread out differently across your users.

## How long should you run an experiment?

First, you need to know what you want: depending on your goals, you may want to look to end the experiment early or not. But other factors play a role:

- If you have many potential experiments that compete for “space”, you want to be more aggressive in stopping experiments early
- On the other hand, if there are no other experiments that are planned, feel free to run experiments longer so you gain a better understanding of the effects on your product.


## Common pitfalls

- Changing randomization while experiment is in flight
    - Adjusting the probabilities for variations
    - Decreasing the overall traffic to an experiment
        - Advanced feature flagging tools should be capable of handling increasing the overall traffic to an experiment, but make sure that people who are in the experiment already don’t change variation.
- Turning off a variation
    - If you are sure you are no longer interested in this variation, you could turn it off, but you won’t get more signal on the other variants as the subjects in this variation will be tainted and data for these is discarded.


