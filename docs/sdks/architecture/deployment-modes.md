# Deployment modes

Eppo's architecture is highly composable and can support a variety of deployment modes depending on what best fits your stack. This page describes a few common patterns for using Eppo, some tradeoffs, and a few anti-patterns to avoid (or at least be aware of).

## Considerations when integrating a flagging service

When weighing the pros and cons of the approaches outlined below, there are several dimensions to consider:

1. **Ease of integration and maintenance** - Do you want to use a system out of the box to minimize integration and operational overhead? Or are you comfortable maintaining some additional code on top of the service?
2. **Performance and latency** - What is your tolerance for load times for flagging and experiment configurations?
3. **Reliability and redundancy** - How many layers of redundancy do you want to have to ensure user experiences are never interrupted?
4. **Quality of data capture** - How well does a given deployment pattern guarantee that the data captured will lead to high-quality decision making? What level of confidence do you need that a given architecture will avoid data quality issues like Sample Ratio Mismatch (SRM)?

Each company might weigh each of these considerations differently. The purpose of this page is to highlight common patterns across Eppo customers and discuss the tradeoffs on the dimensions above.

## Common deployment patterns 

### Local flag evaluation using configurations from CDN (recommended)

The simplest and least error prone approach is to load feature flag configurations from Eppo's CDN each time the SDK is initialized (with optional subsequent polling for updates). This only requires one network call to Eppo's CDN at app initialization, which typically returns in under 15ms. 

Eppo's SDK will then locally determine what variant a user should see based on this configuration. The logging callback function is invoked at the exact moment the user was exposed to the variant. This is ideal from a data analysis perspective as only users exposed to the variant will be included in the analysis. That is, there is as little dilution as possible.

As an example, consider an ecommerce site that is running experiments on both a checkout page and a payment page. Here is a sequence diagram for this deployment mode:

![Local eval CDN config](/img/feature-flagging/architecture/local-eval-cdn-config.png)

Note that there is only one network call to Eppo right at the start of the application's lifecycle (optional polling is not shown in the diagram). Eppo's CDN is hosted on Fastly, which provides another degree of redundancy to this deployment pattern (if Eppo had an outage, configurations would remain cached in Fastly and there would be no impact to active feature flags or experiments).

Experiment exposure logs happen at the exact moment in time that the user is exposed to the variant. This provides high-quality data to allow experiment measurement to be as precise as possible.

#### Developer interface

This deployment pattern provides an easy way for engineers to fetch variants throughout the code base. For instance, in the client-side Javascript SDK:

**Initialize once**

```javascript
import { init } from "@eppo/js-client-sdk";

await init({apiKey: "<SDK_KEY>"});
```

**Assign anywhere**

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
const user = getCurrentUser();

const variation = eppoClient.getBooleanAssignment('show-new-feature', user.id, { 
  'country': user.country,
  'device': user.device,
}, false);
```


### Local flag evaluation using configurations from internal server

The majority of Eppo users opt to use the deployment mode outlined above. However, some teams prefer to manage the flagging configuration themselves and pass that to clients via internal API calls. Eppo supports this through the `offlineInit` method available in several client-side SDKs. This function allows you to pass in a configuration manually instead of making a request to Eppo's CDN. The configuration can be exported from one of Eppo's server side SDKs. 

The same example above would have a sequence diagram that looks something like this:

![Local eval server config](/img/feature-flagging/architecture/local-eval-internal-config.png)

This deployment mode provides more control over how the configuration object is handled but introduces complexity in both implementation and maintenance. It does however still provide high quality analytic data (logging events are only fired when a user is exposed to a variant).

#### Developer interface

This deployment mode requires using two of Eppo's SDKs: a server-side SDK for fetching and updating the experiment configuration, and a client-side SDK initialized with the configuration from the server SDK. For example, using the Node and client-side Javascript SDKs:

**Server-side implementation**

```javascript
import express from 'express';
import * as EppoSdk from "@eppo/node-server-sdk";

const app = express();
const eppoClient = EppoSdk.getInstance();

app.get('/api/flag-configurations', (req, res) => {
  const flagConfigurations = eppoClient.getFlagConfigurations();
  res.json(flagConfigurations);
});
```

**Initialize client SDK from exported flag configurations**

```javascript
import { offlineInit, Flag, ObfuscatedFlag } from "@eppo/js-client-sdk";

// configuration from your server SDK
const configurationJsonString: string = getConfigurationFromServer();

// The configuration will be not-obfuscated from your server SDK.
// If you have obfuscated flag values, you can use the `ObfuscatedFlag` type.
const flagsConfiguration: Record<string, Flag | ObfuscatedFlag> = JSON.parse(configurationJsonString);

offlineInit({ 
  flagsConfiguration,
  // If you have obfuscated flag values, you can use the `ObfuscatedFlag` type.
  isObfuscated: true,
 });
 ```

**Assign anywhere**

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();
const user = getCurrentUser();

const variation = eppoClient.getBooleanAssignment('show-new-feature', user.id, { 
  'country': user.country,
  'device': user.device,
}, false);
```

### Fetching all flag values at app initialization (not recommended)

:::warning
This deployment pattern is not recommended as it can lead to unreliable analytic data. 
:::

Some feature flagging vendors provide methods to evaluate all feature flags at once (typically session start). This may seem tempting as it remediates any concern about downstream latency. However, Eppo's SDK's local evaluation architecture makes this concern irrelevant (post-initialize evaluations happen in under 1ms). 

While this pattern may make sense for a pure feature gating use case, it quickly falls apart in the experimentation context. To see this, consider the same use case discussed above and imagine fetching all variants at application start. The sequence diagram would look something like this: 

![Initialization eval](/img/feature-flagging/architecture/initialization-eval.png)

While Eppo supports [filtering experiments by post-assignment events](/experiment-analysis/configuration/filter-assignments-by-entry-point/) (e.g., viewing the checkout page), this deployment pattern makes no programmatic guarantee that exposure events will align with the moment that the user is actually exposed to the variant. 

A/B/n testing methodology relies on the assumption that we have a clear picture of who was exposed to a new variant, and at what time. If this assumption is violating two negative outcomes can occur:

1. **Users not exposed to the experiment are included in the analysis.** Imagine you're running a test on the checkout page and say you have 10,000 visitors to your site each day, 500 of whom reach the checkout page. If you include all 10,000 users in your analysis, you've unlikely to see even a large change in the behavior of the 500 that hit the checkout page. This can lead to understated experiment results, and calling tests neutral even if they are actually winners.

2. **Users are more likely to be included in the experiment if they are in control**. Imagine you're experimenting on a new search algorithm and users are flagged as "exposed" once they complete a search. If a new search model has a higher latency, this could lead to more control users being included in the analysis and introduce meaningful bias in experiment results. [Sample Ratio Mismatch](/experiment-analysis/diagnostics/#traffic-imbalance-diagnostic) (SRM) tests are designed to detect this type of issue, but often use a very low p value threshold (typically 0.001). That is, it's easy to imagine a case like this hypothetical search model experiment where SRM alerts are not triggered, but experiment results are still impacted by SRM-related bias.


Both of these issues are in theory solvable if teams are diligent about filtering on the correct exposure event. However, as experimentation programs grow we have observed that this becomes increasingly hard to enforce and monitor. As you consider different options to deploy Eppo's SDK, make sure that you consider not just immediate implementation costs, but also long term scalability and tech debt. 

For teams that need to fetch variants at session start (say, for fully server-side rendered architectures), Eppo can support this pattern. This is done by exporting a list of flags from the SDK and evaluating each of them in a for loop. That said, for the reasons above it is highly encouraged that teams instead follow one of the other deployment patterns whenever possible.

## Precomputed Assignments

The Eppo JavaScript SDK supports additional deployment modes for precomputed assignments:
- [Online](/sdks/client-sdks/javascript/precomputed-assignments/#initialize-precomputed-client) 
- [Offline (bootstrapped)](/sdks/client-sdks/javascript/precomputed-assignments#offline-precomputed-assignments) 

With precomputed assignments, all flag assignments are precomputed for a subject and the SDK does not do any evaluation at runtime. This can be useful for performance and security. See the [precomputed assignments](/sdks/client-sdks/javascript/precomputed-assignments) sections for more details.
