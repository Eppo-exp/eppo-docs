# Feature Flagging

Eppo _analyzes_ your experimentation data, and assumes that the experimentation data is already in the data warehouse.

In order to perform its analyses, Eppo needs two kinds of experimentation data:

- assignment data of which users saw which new features
- event data

To _generate_ these two kinds of experiment data, you need to implement, respectively:

- A feature flagging solution (LaunchDarkly, Optimizely, Flagsmith, etc.)
- A system for logging arbitrary events (such as Segment)

Data from both the feature flagging solution and the events logging solution should eventually flow to your data warehouse.

We provide guides for how you can get a few of the top feature flagging tools to play nice with Eppo:

- [LaunchDarkly](./launch-darkly.md)
- [Optimizely](./optimizely.md)
<!-- - [Unleash]() -->
