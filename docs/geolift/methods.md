---
sidebar_position: 4
---
# Methods

Eppo's Bayesian Synthetic Control model is a comprehensive framework for estimating causal effects in geographic experiments. The model builds on established methodologies in the causal inference space, including the widely-adopted Bayesian structural time series approach. The model learns relationships between regional units during a pre-treatment period to construct synthetic controls, which are then used to estimate counterfactual performance - what would have happened in treated regions had they not received the treatment. The causal effect is estimated by comparing actual performance against this counterfactual.

Eppo’s model includes several specific enhancements:

- Region-specific baseline modeling
- Intelligent filtering of low-signal units
- Advanced advertising effect modeling including adstock (ad decay) and saturation (reach) functions
- Robust uncertainty quantification through full Bayesian inference

There are four distinct phases during the Geolift process: unit selection, power analysis, activation, and results analysis:

## Unit Selection

The process begins with careful selection and grouping of geographic units based on their historical metric behavior and correlations. Units are stratified based on these characteristics to ensure representative sampling across different types of regions. This includes:

- Stratified sampling to create balanced treatment groups
- Balancing among KPI patterns and ad spend (when available)
- Low-signal regions are filtered out to ensure robust synthetic control construction

## Power analysis

Once candidate treatment units are established, the model conducts extensive power analysis using historical data. This phase involves modeling various components including time series patterns, potential treatment effects, and delayed impacts. This includes:

- Running thousands of simulations to generate credible intervals and assess statistical power
- Modeling of complex patterns including seasonality, trends, and advertising response
- Calculation of credible intervals and resulting Minimum Detectable Effect (MDE) to guide experimental design decisions

## Activation

The activation phase marks the transition from planning to execution. During this phase, the planned intervention is implemented and the experiment's start date is recorded in the system. This timestamp serves as the key reference point for all subsequent analysis.

## Results Analysis

Two weeks after activation, Eppo begins analyzing the experiment results using the model constructed during the planning process. The analysis provides continuously updated estimates of the treatment effect. This includes:

- Effect sizes with uncertainty quantification
- Region-specific impact assessment
- Continuous monitoring with maintained statistical rigor
- “Cooldown” periods following experiment conclusion

The final analysis will be issued 2-4 weeks following the conclusion of the advertising treatment, and can be extended on a case-by-case basis.
