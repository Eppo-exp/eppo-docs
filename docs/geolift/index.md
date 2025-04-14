---
title: Introduction
sidebar_position: 1
---


# Geolift (Quasi-experiments)

Marketing teams face a critical challenge: how do you measure the true impact of regional marketing campaigns, pricing changes, or other geographic interventions when traditional A/B testing isn't feasible? Eppo Geolift solves this through sophisticated causal inference, allowing you to:

- Accurately measure the ROI of marketing initiatives
- Run reliable experiments without sacrificing huge control regions
- Optimize spending across different markets, channels, and budget levels

Geolift uses Bayesian Synthetic Control methods, a proven quasi-experimental approach that creates a precise counterfactual for each treated region. This means you can understand exactly what would have happened in your test regions if you hadn't made the change - giving you true causal measurement of your intervention's impact.

## Example use cases for Geolift

### Marketing incrementality and measurement

1. Evaluate the incrementality (causal contribution) of a **Meta acquisition campaign across the US**, randomized by media market
2. Evaluate the incrementality of an **out-of-home campaign in the San Francisco Bay Area media market**
3. Evaluate the marginal return of advertising at **multiple spend levels to calibrate the optimal level of spending** for a YouTube awareness campaign

## Differences between Geolift and experiments

There are some important differences between Geolift (quasi-experiments) and traditional experiments (randomized controlled trials.)

1. **No user level facts and assignments:** All users within each unit (geography) are treated (or not) together. Individual variation and behavior is not available to a Geolift test.
2. **Weaker statistical power:** in a Geolift test, there are many fewer units of randomization compared to a user-targeted experiment; there's more inherent noise and variability in each unit that happens across a geographic region.
3. **Need historical data:** Although Eppo supports methods like CUPED for traditional experiments that use historical data to reduce variance and increase power, it does not require it. In Geolift, historical data is needed to develop the synthetic control.
4. **Stronger statistical assumptions:** Since we can't rely on randomization to accomodate any differences between the treatment and control groups, there is a stricter set of assumptions users should follow to ensure the units are similar enough to be compared in the quasi-experiment. For more detail, see [Assumptions and Best Practices](/geolift/assumptions_best_practices/).

## Historical Data Needed

Geolift tests use the metrics you create in Eppo, which are based on your data warehouse. We recommend at least three months of historical data before designing a test and recommend up to 18 months of data if available.

## Compatible geographic units

The Geolift model does not have an internal geographic taxonomy so any geographic level, naming scheme, etc., can be used. They are read as strings and must be consistent across the entire pipeline, including KPI modeling, spend data, and results. Popular geographic levels include:

- US Regions (DMAs, MSAs)
- Commuting Zones
- ZIP Clusters
- States
- Countries

## Non-Geographic Tests

As Eppo does not enforce a geographic taxonomy, the model can be used for non-geographic based tests, like SEO ranking changes or store uplift. Please contact us for assistance.
