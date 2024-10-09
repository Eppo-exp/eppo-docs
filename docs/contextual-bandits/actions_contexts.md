---
sidebar_position: 2
---
# Actions and Contexts

We designed Eppo Contextual Bandits to be flexible and customizable, giving you a lot of control on how to integrate them with your application.

At a high level, to select a particular action, the Contextual Bandit performs two steps:
1. **Prediction**: First, the bandit algorithm predicts the outcome of the objective for each action based on the provided context.
2. **Selection**: Next, in the selection step the bandit algorithm selects an action balancing exploration and exploitation. Generally, it leans towards selecting actions with higher predicted outcomes, but it will also inject randomness in order to explore different actions.

There are two processes at play that make the Contextual Bandit work:

1. **Real-time decision making**: based on provided actions and contexts, select an action
2. **Model updating**: periodically, update the parameters of the Contextual Bandit based on outcome data.

## Bandit objective

First and foremost, we have to select an objective for the Contextual Bandit to optimize. 
Often, our ultimate aim is to improve long-term outcomes, but bandit algorithms generally work better with faster feedback cycles.
Therefore, we suggest selecting a metric that is measurable in the short term but also correlated with the long term outcome.


:::info An example objective
Consider optimizing across multiple product promotions that we can show the user. Some objectives that we could use:
- Clickthrough rate on the promotions
- Add to cart events
- Order events
:::

:::info Analyzing long-term effectiveness
We can leverage the built-in [experiment analysis](/contextual-bandits/analysis) to verify that the selected objective is well-aligned with improving long term outcomes.
:::

## Real-time decision making

In order to make real-time decisions, you provide Eppo with actions and contexts that are relevant to personalize the experience.
The Eppo SDK then uses the underlying Contextual Bandit model to select an action, balancing exploration and exploitation; learning and optimizing at the same time.

### Actions

Eppo Contextual Bandits select one action based on a list of available actions by your application.
At this point, the available actions must be provided by their names; of course, you can then map these names to more complex objects in your application.

The list of actions can be **dynamic** without any further configuration:
- The available actions can change over time
- The available actions can differ between subjects

This gives the application a lot of control over the bandit: while the Contextual Bandit might pick any of the available actions in order to explore, it is possible to filter available actions based on particular requirements. 

:::info An example of filtering actions
Consider using the Contextual Bandit to select a product promotion for an e-commerce shop.
Then there might be specific requirements such as not showing any maternity items to users that have not explicitly shared that they are pregnant.
:::

#### New actions

Contextual Bandits automatically explore new actions as they are encountered and over time will learn for which contexts these actions are most effective.

### Contexts

To create a bandit policy that personalizes, you need to provide context. 

Generally, there are three types of context:
1. Subject context: For example, the subjects's past behavior, demographic information, are they on a mobile device, etc.
2. Action context: For example, the size of the discount, the type of product, the price, etc.
3. Subject-action interaction context: For example, the brand affinity of the subject to the product (based on past purchases, user reviews, etc.)

Note that the first of these is independent of the actions, while the other two are action dependent. 
For convenience, you can supply the subject attributes once and they will be used across all actions, while
separately, you can supply action specific attributes.
Behind the scenes, we combine the two to create a single context per action that is used by the underlying model to select which action to pick.

#### Subject attributes

Subject attributes capture information about the subject that is relevant to the actions. 
Generic attributes such as age (bucket), gender, and device information can be helpful, but the most salient attributes are product specific.

#### Action attributes

Action attributes capture information that is unique to a particular action. For example, the discount offered in a promotion, the price of a product, etc.
Furthermore, you can also leverage action attributes to include information that is specific to the subject-action pair. For example, you can leverage an internal Machine Learning model that measures brand affinity.

:::info What context attributes to use
Selection of which attributes to include in the context is a bit of an art.

In general, there are two types of attributes that will help the Contextual Bandit efficiently learn a strong policy:
1. Attributes that provide a strong signal on personalization: For example, the brand affinity of the subject to the product, the price, etc.
2. Attributes that predict the outcome of an action: For example, when optimizing for purchases, whether a user is a new or returning user might not affect which action is best, but it can help reduce variance (similar to CUPED), helping the contextual bandit learn more efficiently
:::

:::warning Avoid high cardinality attributes
While it might seem tempting to add as much detail as possible, adding too much information will slow down learning.
In particular, try to reduce the cardinality of high dimensional attributes (e.g. group similar countries together; trying to personalize for Luxembourg and Liechtenstein is overkill).
:::


## Model updating

To optimize the Contextual Bandit policy over time, we update the underlying bandit model periodically. 
By default, this is done once per day.

The model updating pipeline combines the bandit selection data with data on the outcome for the selected objective.
Using this data, we fit a separate model for each action that predicts the outcome using a linear model.
We then push the updated parameters of these models to the Eppo SDK, updating the policy that selects future actions.
