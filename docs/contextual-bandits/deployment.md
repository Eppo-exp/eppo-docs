# Creation and Deployment

bandit is deployed as part of a feature flag. this also enables experiment analysis.

go through creation flow

## Creating a Contextual Bandit Flag

We can create a contextual bandit from the Configuration page.

![Create a contextual bandit flag](/img/contextual-bandits/create-bandit-0.png)

### Configure the contextual bandit 

We enter the configuration page for the new contextual bandit.

![Configure bandit](/img/contextual-bandits/create-bandit-1.png)

Fill out the form with the following information:

- **Name**: The name of the contextual bandit. This is the name that will be displayed throughout the Eppo UI.
- **Key**: Reference this key when you query the Eppo SDK for a bandit action. Note that this key cannot be changed once the bandit has been created.
- **Bandit entity**: this is the entity used to track the bandit, such as the `User` or `Session` entity
- **Bandit actions logging**: Provide the name of the table in your data warehouse where bandit actions are logged, leveraging [the contextual bandit logger](/sdks/sdk-features/bandits#logging-bandit-assignments).
- **Metric for optimization**: Choose the metric that you want to contextual bandit to optimize for. Note that this metric has to match the entity selected for the bandit entity.
- **Lookback window**: Select the lookback window, which is how many days of data the bandit will use to update its model. Choose a short time window when the problem is dynamic and historic data is less relevant to optimize the experience today.

### Add control variation

![Create a contextual bandit control variation](/img/contextual-bandits/create-bandit-2.png)

To finish creating the bandit, add a control variation to the bandit. 
The main purpose of this variation is to have a source of comparison to measure the performance of the bandit,
but this variation is also used as a default variation during a gradual rollout of the bandit, or as a fallback.

A good candidate for a default variation is the status quo experience that decides the current user experience.
If there is no status quo experience, perhaps because the bandit is used for a new feature, then consider creating a simple
baseline by choosing a fixed (best) action, or randomly selecting an action.


## Contextual Bandit Feature Flag

Once the Contextual Bandit has been created, we are directed to the bandit's feature flag page.
Similar to any other feature flag, this page allows you to control the bandit across environments.

:::info
To learn more about how to set up the Contextual Bandit using the Eppo SDK, check out the [Contextual Bandit SDK page](sdks/sdk-features/bandits).
:::


Templates help guide you set up the bandit based on the most common pattern.

![Create a contextual bandit flag](/img/contextual-bandits/bandit-ff-page.png)

Let's walk through this page:

1. **Bandit key**: At the top we find the bandit key that is used by the Eppo SDK. In this example, the key is `banner-bandit`.
2. **Switching environments**: You can easily switch between environments. While developing the bandit, you can leverage your staging or local environment.
3. **Turning on the bandit**: Before the bandit is available in the SDK, make sure to turn it on for the current environment
4. **Bandit Analysis template**: The Bandit Analysis template helps you set up an experiment allocation to measure the performance of the bandit versus the control variation. Refer to the [Contextual Bandit Analysis page](/contextual-bandits/analysis) for more details.
5. **Bandit Training template**: The second template guides through creating an allocation to set up the contextual bandit for training and a gradual rollout.

## Creating a Bandit Training Allocation

The final step is to create a bandit training allocation.

![Create the contextual bandit training allocation](/img/contextual-bandits/bandit-training-allocation.png)

1. **Targeting rules**: Define targeting rules if you only want to target specific users, for example based on device or country.
2. **Traffic exposure**: Use the traffic exposure slider to select what percentage of traffic (that matches the traffic rules, if set up), gets allocated and sees the contextual bandit. It is common to start with a small percentage (say 1% or 10%), and gradually increase this percentage.
3. **Targeting rules testing**: If you have configured targeting rules, test them here by supplying subject attributes.