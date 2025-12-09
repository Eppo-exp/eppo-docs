---
sidebar_position: 7
---

# CUPED and Significance

This guide is intended as a high-level explanation of how CUPED works. Notably, if you are wondering why a result that was significant without CUPED could be significant with it, this is for you.

If you are looking for a more in-depth exploration for how our custom implementation of CUPED++ works, we recommend:
- [our documentation on CUPED++](/statistics/cuped/)
- a [write-up of our statistics engine](https://www.geteppo.com/assets/pdf/code-2022-ci-pdf) presented at [MIT CODE](https://ide.mit.edu/events/2022-conference-on-digital-experimentation-mit-codemit/)
- a [paper on regression adjustments for experimental data](https://projecteuclid.org/journals/annals-of-applied-statistics/volume-7/issue-1/Agnostic-notes-on-regression-adjustments-to-experimental-data--Reexamining/10.1214/12-AOAS583.full).

## What CUPED is trying to address 

When splitting a large group of thousands or millions of subjects in two, you expect both halves to be identical, or rather, almost identical. Out of randomness, there could be small differences. With smaller samples, or if you have a few very active subjects, even if we split randomly and fairly, those differences between the two groups might be more noticeable.

Say Control has a few more very active customers, then the comparison will be unfair, because that will make Treatment look worse.

You can tell if a group has more active users by looking how they behave **before the experiment starts**. That’s how CUPED works: we know how people behave before, which group they belong to, and use that to correct the measurement. If you knew, say, that users in Control were very active before, the correction would increase the lift. If, during the experiment Treatment performed slightly worse than Control, that correction could flip the direction of the impact from negative to positive.

The same thing can happen in the opposite direction: Treatment for the primary metric can look great without the Cuped correction, but only because the Treatment group has more very active users. With the correction, you could tell that it’s not a real improvement, but an illusion because of a small imbalance.

## Why is the correction so large?

The larger the imbalance, the larger the correction. With a homogeneous audience of millions of users, there’s little risk to see big differences. However, if you happen to have a handful of users that represent a large part of your activity, they might not split evenly between variants, and larger differences are possible.

There is a limit though: some gaps are too large to be caused by randomness. As we’ll see further down, we flag those cases as suspicious. 

## Significance

Why do we present CUPED as "reducing noise" and accelerating experiments if it’s correcting for uneven splits, then?

CUPED removes some of the noise from one possible source of non-relevant difference between Control and Treatment. By doing so, it reduces the noise and the uncertainty of the experiment. If we set the significance threshold (the acceptable level of wrongly detecting something when there’s no difference) to 5% without that source of noise, the confidence interval can be narrower. With more precision, the same measured impact would be more likely to be significant. However, using CUPED, the measured impact might change so it’s not a guarantee.

That is the benefit of CUPED when looking at your overall experimentation program: it makes results faster; however, it does not just shrink the confidence interval. The effect on each result is that it corrects for small, measurable engagement imbalances, changing the estimated impact to make a fairer comparison. That correction allows us to reduce the confidence interval around the new, corrected value.

Let’s take an example and say that many of the most active subjects were randomly assigned to Treatment. Then, the impact of the change being tested would be over-estimated. In some rare cases, that over-estimation could be large enough to make the change appear significant, but wrongly so. With CUPED, you can avoid errors like that. When a result without CUPED is significant, but it is not with CUPED, this is likely what is happening.

In summary, CUPED corrects for assignment imbalances; with it, false positives because of that are less likely. Because of that, when we set the confidence interval, we don’t have to take as many precautions against that type of false positive results. Therefore, we can, with the same false positive risk, make confidence intervals narrower around the new value. By making confidence intervals narrower, we can detect smaller effects earlier, making your whole program faster. However, it doesn’t make each individual result “more significant” automatically.

You can think of it as ABS for a car: it doesn’t directly make your engine faster, but it makes it safer to drive, so you can go faster, with the same level of safety.

## How effective are CUPED and CUPED++?

We mentioned that CUPED can make the confidence interval narrower: by how much?

That correction is best when you can use recent data to predict current activity: the more accurate the prediction, the better the correction.
- Standard CUPED looks at the same metric the days before: it works great for, say, social media activity that is quite predictable from one week or month to the next.
- Eppo’s implementation of CUPED++ looks at all the metrics in the experiment, and all the Assignment attributes. If you want to predict if someone is going to buy a house, a holiday, or a wedding dress, whether they got one a month earlier is less helpful. However, if they scheduled a visit, searched for flights or booked a fitting, those are better predictors. Similarly: you might have little history about new users, but if you know they are connected from Colorado or Switzerland, that should affect their likelihood of buying skis.

This is always why you might see Eppo do large corrections on new users: if Control has more users from an assignment category with a high conversion rate, we take that into account.

## Precautions

Is Cuped always the right approach? Generally, yes. If your metrics are hard to predict based on past activity, CUPED might have no material effect. However, with the right precautions, it can’t make your results less reliable or slower.

What are those precautions? When applying the CUPED correction, we assume that your split is fair. In practice, that means that we make two assumptions:
1. The split between Control and Treatment is balanced through randomness: the users in both groups had had the same level of engagement before the experiment, joined at the same time, had the same number of new, or VIP users, etc.
2. In particular, their behavior before the experiment should be similar. We should expect small differences, but not large ones: they should be close to identical, depending on how large the samples are.

If we notice larger differences than expected, then we flag this a Diagnostic error, either *Traffic imbalance* by assignment properties or a *Pre-experiment metric imbalance*. Those imbalances should not happen: Control and Treatment should be taken from the same population and split randomly.

If either of those diagnostic warnings or errors appear, we strongly recommend that you investigate that before looking at results; notably, we recommend you address those before looking at CUPED- or non-CUPED-corrected results. Do not hesitate to reach out to support if you are not sure what to do.

## Common causes for Pre-experiment imbalance

All common causes for Traffic imbalance (telemetry issues, including non-participants, etc.) would also affect CUPED. 

What are patterns that specifically trigger an imbalance in pre-experiment metrics?

- **Iterating features**: If you test a first version of your new feature, and it fails because of a bug, then you might try again. You might want to use the same split so that users who saw the feature don’t see it vanish. Then what happened before the second experiment is different for Control (who didn’t see anything new) and Treatment (who saw a buggy version of the same feature). In that case, CUPED wouldn’t apply fairly. We recommend that you start the experiment assignments when you started the split originally, at the start of the first version; you can exclude events when the feature wasn’t working properly and use a later event start date.
- **Gradual roll-out**: If you want to roll-out a feature gradually, we recommend that you expose a small portion of customers, split that group between Control and Treatment, and expose more users gradually maintaining the split. This allows users to stay in their assigned variations once they are exposed. If you set the start date of your experiment to once the test was fully rolled-out, then the users who were assigned early would have a differentiated experiment prior to that. In that case, CUPED wouldn’t apply fairly either. Instead, start your test from the earliest roll-out. Eppo flags are designed to exclude the subjects who are not part of the test yet.
