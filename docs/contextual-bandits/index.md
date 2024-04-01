# Contextual bandits

Eppo's Contextual Bandits allows us to automatically optimize _personalized_ user experiences.

If you immediately want to get started with Contextual Bandits, check out our [Getting Started guide](/quick-starts/bandit-quickstart).

### Example use cases for Contextual Bandits

Contextual bandits are particularly well suited for [lightweight and dynamic recommendation problems](https://www.geteppo.com/blog/contextual-bandit-algorithms-vs-recommendation-systems).

![contextual-bandit-comparison](/img/contextual-bandits/comparison-table.png)

#### Promotions

Suppes we have a rotating set of seasonal promotions that we can show to users. 
We can use Eppo's Contextual Bandit to automatically personalize promotions to particular users based on their past behavior.
Because promotions are often short-lived, it is important to efficiently learn which users get the most value out of them.

#### Dynamic feature highlighting

Product-led growth B2B companies use Eppo's Contextual Bandits to automatically personalize the features they show to their users.
In this case, past user behavior can indicate which out of an expanding set of pro features are most relevant in encouraging users to upgrade.

## Balancing exploration and exploitation

The main strength of [multi-armed bandits](http://sbubeck.com/SurveyBCB12.pdf) is that they efficiently learn which actions are the most effective. 
Rather than measuring efficiency with respect to time (how fast we can find the best action), we measure it with respect to how many times a suboptimal action is selected.
That is, multi-armed bandits carefully balance exploration (learning about new actions) and exploitation (showing the best action).

This makes multi-armed bandits particularly suitable for dynamic use cases: where the action space is changing over time.

## Personalize user experiences leveraging context

Traditional multi-armed bandits focus on finding the single best performing action. That is, there is no personalization.
Contextual bandits, on the other hand, incorporate _context_ into the learning process, so that it learns an optimal action based on the context.

Context is a generic term that can encompass a wide range of relevant information.
For example, the context for a bandit problem finding optimal promotions can be based on:

* User context: For example, the user's past behavior, demographic information, are they on a mobile device, etc.
* Action context: For example, the size of the discount, the type of product, the price, etc.
* User-action interaction context: For example, the brand affinity of the user to the product (based on past purchases, user reviews, etc.)


## Measuring impact using experiments

As with any other feature, we want to ensure that the impact of using contextual bandits is positive. 
Therefore, Eppo's Contextual Bandits are tightly integrated with our experimentation platform.
This makes it easy to measure performance compared to a control group, whether that is a simple fixed action, or an elaborate recommendation system maintained in-house.

Due to the tight integration with our experimentation platform, the analysis can leverage all of the same tools and metrics that you use in any experiment analysis: CUPED, Sequential and Bayesian analysis, explores and deep dives, guardrail metrics, reports, etc.