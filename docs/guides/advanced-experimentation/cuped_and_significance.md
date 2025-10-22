---
sidebar_position: 7
---

# CUPED and Significance

This guide is intended as an high-level explanation of how CUPED works. Notably, if you are wondering why a result that was significant without CUPED could be significant with it, this is for you.

If you are looking for a more in-depth exploration for how our custom implementation of CUPED++ works, we recommend:
- [our documentation](/statistics/cuped/)
- a [write-up of our statistics engine](https://www.geteppo.com/assets/pdf/code-2022-ci-pdf) presented at [MIT CODE](https://ide.mit.edu/events/2022-conference-on-digital-experimentation-mit-codemit/)
- a [paper on regression adjustments for experimental data](https://projecteuclid.org/journals/annals-of-applied-statistics/volume-7/issue-1/Agnostic-notes-on-regression-adjustments-to-experimental-data--Reexamining/10.1214/12-AOAS583.full).

## What CUPED is trying to address 

When splitting a large group of thousands or millions of subjects in two, you expect both halves to be identical, or rather, almost identical. Out randomness, there could be small differences. With smaller samples, or if you have a few very active subjects, even if we split randomly and fairly, those differences between the two groups might be more noticeable.

Say Control has a few more very active customers, then the comparison will be unfair, because that will make Treatment look worse.

You can tell if a group has more active users by looking how they behave **before the experiment starts**. That’s actually what CUPED does: we can look at how people behave before, and use that to correct the measurement. If you knew, say, that users in Control were very active before, and that, during the experiment Treatment performed slightly worse than Control, the correction could flip the direction of the impact.

The same thing can happen in the opposite direction: Treatment for the primary metric can look great without the Cuped correction, but only because the Treatment group has more very active users. With the correction, you can tell that it’s not a real improvement, but an illusion because of a small imbalance.

## Significance

Why do we present CUPED as "reducing noise" and accelerating experiments, then?

That correction is best when you can use recent data to predice current activity: the most accurate the prediction, the better the correction. It remove some of the noise from one possible source of non-material difference between Control and Treatment. By doign so, it reduces the uncertainty of the experiment. With a narrower precision, the same measured impact is more likely to be significant. But with CUPED, the measured impact is not going to be same.

That is the benefit of CUPED when looking at your overall experimentation program: it makes results faster, however, that’s not its direct effect. The effect on each result is that it corrects for small, measurable engagement imbalances, changing the estimated impact to make a fairer comparison. If for some reason a lot of very active subjects where in Treatment, the impact would be over-estimated; it would be significant without CUPED, but wrongly so. With CUPED, you can avoid errors like that. 

So the direct effect is avoiding fluke results. Because of that, we don’t have to prevent those false positive results from happening, so we don’t need to make confidence intervals nearly as wide. By making confidence intervals narrower, we can detect smaller effects earlier, making your whole program faster.

That doesn’t make every results automatically more significant, only the valid ones.

You can think of it as an ABS for a car: it doesn’t directly make your engine faster, but it makes it safer to drive, so you can go faster, with the same level of safety.

## Precautions

Is Cuped always the right approach? Generally, yes. With the right conditions, CUPED might have no material effect, but it can’t make your results less reliable or slower.

When applying the CUPED correction, we assume that your split is fair. In practice, that means that we make two assumptions:
1. The split between Control and Treatment is balanced through randomness: the users in both groups have similar distribution, joined at the same time, etc.
2. In particular, their behavior before the experiment should be similar. We should expect small differences, but not large ones: they should be close to identical, depending on how large the samples are. If we notice larger differences than expected, then we flag a Diagnostic error, identifying a *Pre-experiment metric imbalance*.

If either of those diagnostic warnings or error appear, we strongly recommend that you investigate that before looking at results; notably, we recommend you address those before looking a CUPED- or non-CUPED-corrected results
