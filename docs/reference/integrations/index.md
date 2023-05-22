# Integrating a third-party or internal experiment assignment system

You can use Eppo for end-to-end experimentation, or only for analysis. To integrate Eppo with an existing feature flagging tool, you just need a log of experiment assignments in your warehouse. Eppo expects data in the following format (the specific column names do not matter):

| timestamp | user_id | experiment | variation |
| :-- | :-- | :-- | :-- |
| `2021-06-22T17:35:12.000Z` | `6342` | `checkout-button-color` | `purple` |

This row represents the fact that the user with ID `6342` was assigned to the variation `blue` of the experiment `checkout-button-color` on June 22nd, which Eppo will need to properly analyze that
experiment.

See below for tool-specific examples:

1. [LaunchDarkly](./launch-darkly)
2. [Optimizely](./optimizely)
3. [Unlesah](./unleash)