# Interaction Detection

## What Is an Experiment Interaction?

Experiments can interact in two possible ways:
* **Assignment Dependence**: The probability an entity is exposed to control or variant depends on the their exposure in some other experiment, and
* **Effect Interaction**: The effect of one variant depends on exposure in some other experiment.

As an example, consider two parallel experiments running on a landing page. 

* Experiment 1: The call to action is changed from "Sign Up Now!" (Control) to "Sign Up For Free!" (Variant). 
* Experiment 2: In the second experiment, the color of the sign up button is changed from white (Control) to black (Variant). 

Each experiment plans to randomize entities to control or variant with a 50% probability and each seeks to estimate the lift of the variant over the control. Since the two experiments are going to be running on the same landing page at the same time, entities entering the experiment will be randomized to Control or Variant for _both experiments_ and will see some combination of "Sign Up Now!"/"Sign Up For Free!" and a White/Black sign up button.


### Assignment Dependence

To determine assignment dependence is present, a cross tabulation can be used to count the number of distinct entities exposed to each combination of exposures in each experiment.  If 100, 000 unique entities are randomized across the two experiments, we would expect the number of assignments across the four possibilities to look close to the table below

| Expected Counts         | Experiment 2: White Button | Experiment 2: Black Button |
|------------------------------|-----------------------|-----------------------|
| Experiment 1: "Sign Up Now!"             |           25,000            |                 25,000      |
| Experiment 1: "Sign Up For Free!"        |                  25,000     |           25,000            |

Since each experiment randomizes to Control or Varaint with 50% probability, then the probability of seeing any combination of Control and Variant across the two experiments is 25%.  Therefore, we should expect to see $25\% \times 100, 000 = 25, 000$ unique entites on average across the four combinations. Suppose instead, the counts looked like

| Observed Counts         | Experiment 2: White Button | Experiment 2: Black Button |
|------------------------------|-----------------------|-----------------------|
| Experiment 1: "Sign Up Now!"             |           15,000            |                 25,000      |
| Experiment 1: "Sign Up For Free!"        |                  35,000     |           25,000            |

Note that when entities were randomized to see a white sign up button in experiment 2, they were more likely to see the "Sign Up For Free" in experiment 1. We know this is the case because 35, 000 entities were randomized to see "Sign up For Free" with a white button as compared to the 25, 000 we expected.  When this happens, we say the assignments are not independent and that the assignment display "_assignment dependence_".



### Effect Interactions

Even when assignments between experiments do not display assignment dependence, the effects in each experiment can still interact. This happens when the effect of a variant in one experiment depends on which variant a user received in another experiment. 

Suppose the estimated lift from Experiment 1, looking only at users who saw the white button, is +5%. But when you look at users who saw the black button, the estimated lift is only +1%.  The effect of the call to action change is different depending on which button color the subject was exposed to. In this case, “Sign Up For Free!” might look more compelling on a white button than on a black button, hence leading to a larger lift.

| Estimated Lift (CTA Variant vs Control) | Experiment 2: White Button | Experiment 2: Black Button |
|----------------------------------------|-----------------------------|-----------------------------|
| Experiment 1: "Sign Up Now!"           | —                    |    —                 |
| Experiment 1: "Sign Up For Free!"      | +5%                         | +1%                         |


## How Does Eppo Detect Interaction Between Experiments?

If the call to action and button color experiments were run in real life, we would almost _never_ expect to see 25,000 entities in each cell of that table.  Likewise, we may see slight differences in the lift of the call to action variant when looking at users who saw different button colors, even when no effect interaction is present.  Real data will naturally display variation, so then  how  can Eppo distinguish between genuine assignment dependence/effect interaction and cases where just by luck of the draw assignment counts/lift estimates vary?

Both assignment dependence and effect interactions require statistical tests in order to differentiate true assignment dependence/effect interaction from statistical noise.  Assignment dependence is tested using a [Chi-Square hypothesis test](https://en.wikipedia.org/wiki/Chi-squared_test#Example_chi-squared_test_for_categorical_data), and effect interaction is tested using Analysis of Variance ([ANOVA](https://en.wikipedia.org/wiki/Analysis_of_variance)).  For each test, Eppo considers a p value smaller than 0.01 to be statistically significant.  When the result is statistically significant, an alert will be raised.



## How Can I Use The Interaction Effect Detection?

To check for either type of interaction, click the breadcrumbs on any metric in your experiment and select "Check for Interaction Effect".

![Breadcrumbs](/img/interaction-detection/bread-crumbs.png)

You will be brought to the interaction effect detection explore, shown below.  Select the metric and experiment for which you would like to check for interaction effects.  Press "Update Chart" to populate the assignment interaction overlap table.  When there is no assignment dependence, Eppo will show a green banner indicating there is no assignment dependence.

![Green Banner](/img/interaction-detection/green-banner.png)

When assignments are not independent, then Eppo will show a red banner indicating that assignments are dependent.

![Red Banner](/img/interaction-detection/dependent-assignments.png)


If assignments are independent, but an interaction effect exists, Eppo will display a yellow banner indicating so.

![Yellow Banner](/img/interaction-detection/yellow-banner.png)


## Eppo Is Warning Me Of Experiment Interactions: What Should I Do?

* **Green Banner**: Assignments are independent and no effect interaction.

    Make decisions for each experiment.  All else equal, the lift you should achieve does not depend on exposures in other experiments.  The assignments display independence and the inference you make should be reliable.

* **Yellow Banner**: Assignments are independent and effect interaction.

    The assignments display independence and the inference you make should be reliable, however the lift you achieve depends on which combination of exposures are used.  Determine if the presence of the interaction would change your decision. If so, try to understand why these interactions may arise, especially if the result is in the opposite direction you would hope for.

* **Red Banner**: Assignments are dependent and no effect interaction.

    Try to understand why assignments display dependence (e.g. is the dependence intended, is there an error with the eventing to track assignments, etc).  We recommend refraining from making a decision until the reason for the dependence is understood.  

* **Red Banner**: Assignments are dependent and effect interaction.

    Similar to above.