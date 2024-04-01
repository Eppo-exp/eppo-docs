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

![Create a contextual bandit flag](/img/contextual-bandits/create-bandit-2.png)

To finish creating the bandit, add a control variation to the bandit. 
The main purpose of this variation is to have a source of comparison to measure the performance of the bandit,
but this variation is also used as a default variation during a gradual rollout of the bandit, or as a fallback.

A good candidate for a default variation is the status quo experience that decides the current user experience.
If there is no status quo experience, perhaps because the bandit is used for a new feature, then consider creating a simple
baseline by choosing a fixed (best) action, or randomly selecting an action.

