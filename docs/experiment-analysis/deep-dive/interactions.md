# Interaction Effect Detection

## Interaction Effect Detection

Eppo makes it easy to detect interactions between experiments. While empirical studies have shown that interaction effects are rare in practice, there are situations where it can be useful to understand when two experiments interact.

Eppo's general advice is to run overlapping experiments where one user may be in dozens or hundreds of tests at once. This is inline with general recommendations from the industry, for instance see [this post from Microsoft](https://www.microsoft.com/en-us/research/articles/a-b-interactions-a-call-to-relax/).

## When to check for interactions

When experiments do have interactions, it's normally due to pretty obvious UI collisions. For instance, imagine we're running two experiments: one where we are adding a star next to our purchase button, and another where we are introducing a promotional banner at the top of the page. If we run these experiments at the same time with independent assignments, users will have one of four possible experiences:

1. They see the star and the banner
2. They see the star and no banner
3. They see no star and the banner
4. They see no star and no banner

Visually, we can represent this like this:

![Interaction Example One](/img/experiments/interactions/overlap-example-1.png)

Each experiment is still statistically valid: we can compare users who saw the banner to those who didn't. Since experiments are randomized independently, it's equally likely for a user to see the star regardless of whether they saw the banner.