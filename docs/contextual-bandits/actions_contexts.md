# Actions and Contexts

On this page, we take a deeper dive into actions and contexts with a focus on integrating the Eppo SDK.

:::note
Check the [Quickstart guide](/bandit-quickstart) if you want to get up and running with contextual bandits in 5 minutes.
:::


Some notes:

- philosophy: integrate bandits easily with your existing stack
- customization by explicitly supplying available actions
    allows users to filter actions
- generic context model: user and action specific attributes. 
    each action has its own context
- underlying model: predict effectiveness of each action based on supplied contexts, then select action based on predictions.
- we update the bandit model periodically (by default: once a day)




