---
sidebar_position: 5
---

# Why Bayesian lift doesn't match (Treatment − Control) / Control

When you run an experiment, it's natural to think of lift as:

**"How much did the treatment go up compared to control?"** → **(Treatment − Control) / Control**

That shorthand is exactly how we express *relative* lift: if control revenue is $10 and treatment is $12, the lift is ($12 − $10) / $10 = **20%**.

With **Bayesian** analysis, the number Eppo shows for lift often does *not* match that simple formula—especially when the sample is small or the naive lift is very large. This guide explains why, in plain terms, and walks through an example with numbers.

## The idea in one sentence

Bayesian analysis doesn’t just report “what the data says.” It combines **what the data says** with **what we believed before the experiment** (the *prior*). When the data is limited or suggests an extreme lift, the prior pulls the estimate toward more typical, reasonable values.

---

## Why the naive formula feels right

The formula **(Treatment − Control) / Control** is the *observed* relative difference. It’s what you get when you take the averages (or totals) from your experiment and plug them in. No prior, no correction—just the raw comparison.

- **Frequentist** methods (fixed-sample, sequential) use the data to estimate lift and then build a confidence interval around that estimate. So the *center* of the interval is usually close to that naive lift (possibly adjusted e.g. by CUPED).
- **Bayesian** methods use the data to *update* a prior distribution for the lift. The reported lift is the center of the *posterior* distribution—i.e., “our best guess for the true lift given the prior and the data.” So the number you see is not necessarily the naive (T−C)/C.

So: **the naive formula is “lift from the data only.” The Bayesian number is “lift after we’ve combined the data with our prior.”** They match only when the data dominates the prior (e.g. large sample, modest lift).

---

## Why Bayesian results look “shrunk,” especially for small samples and big lifts

Two things drive the difference:

1. **The prior says most lifts are modest.**  
   In practice, huge relative lifts (e.g. +200%) are rare; most experiments show smaller effects. The Bayesian prior reflects that: it’s centered around zero with a spread that makes very large lifts unlikely unless the data strongly supports them.

2. **With a small sample, the data is noisy.**  
   A few users can make the *observed* (T−C)/C look huge or tiny by chance. So we don’t want to fully trust that one number. The prior acts like a stabilizer: it pulls the estimate toward more plausible values. With **more** data, the data dominates and the Bayesian lift gets closer to the naive one.

So: **Bayesian lift is “reasonableness-adjusted.”** For small samples and large naive lifts, it will usually be *smaller* (in absolute terms) than (T−C)/C, because the prior pulls toward more typical effects.

---

## Example with numbers

Suppose we’re measuring **sign-up rate** (binary: did the user sign up or not).

- **Control:** 4 sign-ups out of 200 users → **2%**
- **Treatment:** 10 sign-ups out of 200 users → **5%**

**Naive lift:**

$$$
\text{Naive lift} = \frac{\text{Treatment} - \text{Control}}{\text{Control}} = \frac{5\% - 2\%}{2\%} = \frac{3\%}{2\%} = 1.5 = 150\%
$$$

So the simple formula says: **“150% lift.”**

But with only 200 users per group, a 2% vs 5% difference is very noisy. It could be a real 150% lift, or it could be bad luck in control and good luck in treatment—the true lift might be much smaller. A Bayesian analysis starts with a prior that says “most experiments don’t have 150% lifts” and then updates with your data. The *posterior* (the distribution of the true lift given the prior and the data) will be centered at something more moderate.

A typical kind of prior (e.g. centered at 0% lift, with a spread such that 50% of experiments fall roughly between about -21% and +21% lift) would pull that 150% toward zero. So you might see something like:

- **Bayesian estimated lift:** e.g. **+25%** (or another value in that ballpark, depending on the exact prior and model)

So:

| Quantity              | Value   |
|-----------------------|---------|
| Naive (T−C)/C         | **150%** |
| Bayesian (with prior) | **~25%** (example) |

The Bayesian number is not “wrong”—it’s a different answer to a different question: *“Given that most lifts are modest, and we only have 400 users total, what’s a reasonable estimate of the true lift?”* The naive 150% is *one* estimate (data only). The Bayesian ~25% is a *prior-adjusted* estimate that reflects both the data and the belief that 150% is unusual.

As you collect more data, the same observed 2% vs 5% would move the posterior more. With tens of thousands of users per group, the Bayesian estimate would get much closer to 150% if the difference persisted.

---

## Summary

| Question | Answer |
|----------|--------|
| **Why doesn’t Bayesian lift equal (T−C)/C?** | Because Bayesian lift is the center of the *posterior* (prior updated by data), not the raw data lift. |
| **Why is it often smaller for big naive lifts?** | The prior says extreme lifts are rare; with small samples the prior has a strong pull, so the estimate is “shrunk” toward more typical values. |
| **Is the Bayesian number “wrong”?** | No. It’s a coherent estimate that combines prior belief with the data. Use it when you want a prior-adjusted, often more conservative, view of the lift. |
| **When will they match closely?** | When you have a lot of data and/or the observed lift is moderate, so the data dominates the prior. |

For more on how Eppo’s Bayesian analysis works (including the prior we use), see [Analysis methods](/statistics/confidence-intervals/analysis-methods#bayesian-analysis) and [Statistical nitty-gritty](/statistics/confidence-intervals/statistical-nitty-gritty).
