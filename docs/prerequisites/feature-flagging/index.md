# Feature Flagging

### Randomize subjects

The first step to running experiments is setting up randomization. Randomization refers to a function in your code that can assign subjects (e.g users) to variants (e.g `control`, `treatment`) given an experiment configuration. If you don't already have a way to randomize users in your app, you'll need to setup one of the following options:

- [Eppo's Randomization SDKs](./randomization-sdk)
- A third party tool such as [Launch Darkly](./launch-darkly) or [Optimizely](./optimizely)
- An internal tool that you build yourself


### Log assignments

Once you are able to randomize, you'll also need a way to log assignment data into your data warehouse, the mechanics of which will depend on what tool you use for randomization. In your warehouse, the most straighforward way to store assignment history is an append-only <b>assignments table</b> with the following columns:

| timestamp | user_id | experiment | variation |
| :-- | :-- | :-- | :-- |
| `2021-06-22T17:35:12.000Z` | `6342` | `checkout-button-color` | `purple` |

This row represents the fact that the user with ID `6342` was assigned to the variation `blue` of the experiment `checkout-button-color` on June 22nd, which Eppo will need to properly analyze that
experiment.

It's ok for this table to contain duplicate rows for the same subject, however for a given experiment, the same subject should only ever be assigned one variation. The relative ordering of rows relative to each other is not important.

Refer to our tool specific guides to understand how to log assignments to your warehouse:

- [Logging assignment data using Eppo's Randomization SDKs](./randomization-sdk/)
- [Exporting assignment data from Launch Darkly](./launch-darkly)
- [Exporting assignment data from Optimizely](./optimizely)

For all other systems, email us at feature-flagging@geteppo.com and we'll happily walk you through the process.