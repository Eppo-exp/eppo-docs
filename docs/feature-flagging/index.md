# Feature Flagging

Eppo _analyzes_ your experimentation data, and assumes that the experimentation data is already in the data warehouse.

In order to perform its analyses, Eppo needs two kinds of experimentation data:

- Assignment data of which users saw which new features
- Event data

To _generate_ these two kinds of experiment data, you need to implement, respectively:

- A feature flagging solution (LaunchDarkly, Optimizely, Flagsmith, etc.)
- A system for logging arbitrary events (such as Segment)

Data from both the feature flagging solution and the events logging solution should eventually flow to your data warehouse.

To generate the assignment data and randomly assign users into variants, we encourage you to use Eppo's homegrown [Randomization SDK](./randomization-sdk/index.md).

If you are already using a 3rd party feature flagging tool, we also provide guides to make them play nice with Eppo:

- [LaunchDarkly](./launch-darkly)
- [Optimizely](./optimizely)
<!-- - [Unleash]() -->
