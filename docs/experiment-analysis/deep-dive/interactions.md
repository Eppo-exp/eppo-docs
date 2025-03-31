# Interaction Effect Detection

Eppo makes it easy to check for interactions between experiments. While empirical studies have shown that interaction effects are rare in practice, there are situations where it can be useful to understand how two experiments interact.

Eppo's general advice is to run overlapping experiments where one user can be in dozens or hundreds of tests at once. This aligns with recommendations from the industry, for instance as mentioned in [this article from Microsoft](https://www.microsoft.com/en-us/research/articles/a-b-interactions-a-call-to-relax/).

## When to check for interactions

When experiments do have interactions, it's normally due to pretty obvious UI collisions. As an example, imagine we're running two experiments: one where we are adding a star next to our purchase button, and another where we are introducing a promotional banner at the top of the page. If we run these experiments at the same time with independent assignments, users will have one of four possible experiences:

1. They see the star and the banner
2. They see the star and no banner
3. They see no star and the banner
4. They see no star and no banner

Visually, we can represent this like this:

![Interaction Example One](/img/experiments/interactions/overlap-example-1.png)

Each experiment is still statistically valid: we can compare users who saw the banner to those who didn't. Since experiments are randomized independently, it's equally likely for a user to see the star regardless of whether they saw the banner.

Now imagine a case where these variants lead to UX collisions. For instance, if instead of adding a banner, our second test introduces a wider purchase button, we might see something like this:

![Interaction Example Two](/img/experiments/interactions/overlap-example-2.png)

Now imagine the star has a strong positive effect on conversion. Users who are enrolled in the treatment group for both variants won't see this uplift, since the star is not visible. In this case, we'll see a smaller lift in the star experiment, since only half of the "treatment" users were actually exposed to the new experience.

We call this situation an **interaction effect**. To detect interaction effects, we can measure the lift from the main experiment (introducing the star) broken out by the experience in the other experiment (normal vs wide button). In the example above, we'll see a strong lift in the star experiment from users who saw the narrow button. On the other hand, we'll see no lift for users who were shown the wide button.

## Measuring Interaction Effects in Eppo

Eppo makes it easy to check for interaction effects. To start, hover over a metric on the experiment page and click "Explore":

![Explore Button](/img/experiments/interactions/explore-button.png)

Next, under "Interaction Effect Detection" on the left sidebar, select the experiment against which you want to check for interactions. Once you click "Update Chart", Eppo will determine assignment counts and metric values from both experiments and check for interactions:

![Interaction Effect UI](/img/experiments/interactions/interaction-effect-ui.png)

Here the top table shows assignment volume between all possible combinations of variants. The bottom chart shows the lift in your main experiment, split by the variant value in the other experiment.

### Interpreting Results

Eppo will summarize results in the top banner. If there is no overlap, or if there is overlap but both assignments and metric values are independent, the banner will be green, confirming that there are no detectable interactions between the two experiments. 

The banner will be red if either of the following is true: 

1. The lift in your main experiment varies between the treatment and control groups in the other experiment. This means that your two experiments likely had some sort of UX collision leading to an interaction effect.
2. There is a correlation between assignment probabilities. That is, being in the treatment group for experiment 1 means it's more likely to be in the treatment group for experiment 2. This means that there was likely an issue with the way that your experiments were randomized.
