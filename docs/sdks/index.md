---
title: Introduction
sidebar_position: 1
---

# Eppo's SDKs

Eppo's SDKs are built for simplicity, speed, and reliability, and support everything from simple kill switches to cutting-edge experimentation methods. Developers only need to learn one simple, consistent API for all feature flagging and experiments use cases, abstracting away the complexity of the underlying allocation logic.

This page provides an introduction to Eppo's SDKs: the basics of keeping configurations in sync for users around the world, how the flag-assignment model supports a wide variety of use cases through simple concepts, and the design principles that help the SDK fit naturally into your tech stack and development workflows.

The examples on this page will all be in JavaScript, but Eppo supports a variety of languages and frameworks. You can find the complete list of SDKs on the [client SDK](/sdks/client-sdks) and [server SDK](/sdks/server-sdks) pages.

## Initialize once, assign anywhere

Eppo follows a "initialize once, evaluate anywhere" approach. On app start, initialize the SDK with a call like this:

```javascript
import { init } from "@eppo/js-client-sdk";

await init({apiKey: "<SDK_KEY>"});
```

You can then evaluate flags anywhere in your app with the `get<Type>Assignment` method:

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const eppoClient = EppoSdk.getInstance();

const variation = eppoClient.getStringAssignment(
  'show-new-feature',  // flag key
  user.id,  // subject key
  {}, // optional subject attributes for targeting
  'control' // default value
);
```

:::note
The examples on this page will focus on user-randomized experiments. Eppo's SDK can however be used to randomize on any unit (cookie, company ID, etc.). For these scenarios, simply pass in an appropriate identifier as the subject key and replace the word "user" with your unit of randomization.
:::

### Local evaluation

On initialization, SDK configurations are pulled from Eppo's CDN (hosted on Fastly). The CDN is globally distributed and for most regions returns the configuration within 20 ms. From there, flags are evaluated locally. That is, there are no additional network calls required to determine a user's variant. Accordingly, evaluation of a specific flag is incredibly fast (typically under 1 ms). 

Targeting attributes are passed in as part of the `get<Type>Assignment` call, meaning that changes in eligibility based on user behavior are reflected immediately. Imagine a use case where you only want to target users once they perform a specific action. Server-side evaluation would require you to do a network call to understand new targeting eligibility each time the user context changes. By doing all evaluations locally, you can get very expressive with realtime targeting, all without any performance degradation. 

For client SDKs, this [configuration is obfuscated](/sdks/sdk-features/obfuscation/) to ensure that end users cannot reverse engineer what flags are active, or what targeting logic is in place.


### Configurable polling

To keep targeting logic up to date, most of Eppo's SDKs provide automatic polling out of the box. Once the SDK is initialized, a background process runs to periodically check for new updates for the configuration file. This process is highly configurable, allowing you to set polling cadence, request timeouts, and much more.

### Offline initialization

Some teams prefer to manage the configuration file themselves as opposed to requesting it from Eppo's CDN on initialization. This is supported through [**offline mode**](/sdks/architecture/deployment-modes/#local-flag-evaluation-using-configurations-from-internal-server). Most server-side SDKs have the option to export configurations as JSON. You can then pass that JSON to your client-side applications via an internal endpoint as part of routine app start up. The client-side SDK can be initialized from this JSON directly, without any additional network calls to Eppo.


## Built for advanced allocation

Each flag in Eppo has a set of associated **assignments** specifying who should see what. These come in two flavors: feature gates (for a single variant) or experiments (for randomizing across multiple variants). These assignments are evaluated in a waterfall fashion allowing for complex rollouts while still providing an intuitive UI to understand who will see what:

![Intro Flag Example](/img/feature-flagging/intro-flag-example.png)

In this example, when you evaluate the `add-profile-picture-nudge` flag, the SDK will first check if it's an internal user (based on the specified `user_id`). If so, it will return true, specifying to render the new feature. Otherwise, it will check the next condition: whether `has_profile_pic` is false. If so, it will randomly return either treatment or variant. This will continue for the rest of the waterfall and if no targeting conditions are met, it will return whatever is specified as the default value.

### Cascading hash-based randomization

Subsequent calls to the `get<Type>Assignment` method method will always return the same variant for a subject, as long as they are still in the same target audience. This is done using a set of cascading hash-based randomization functions to implement sampling, randomization, and any active holdouts or mutual exclusivity.

When you call `get<Type>Assignment`, the SDK will evaluate assignments in order until one is met, apply the cascading hashing described above, and deterministically return the correct variant. All of the underlying allocation logic is abstracted away from the engineer implementing the experiment.

### High quality data capture

Experimentation programs depend on high quality analytic data to track experiment assignments. Eppo's interface reinforces best practices: tracking *why* a user saw a variant (was it an override or a true randomized assignment?), identifying when a user moves from one target audience to another, and attributing experiment assignments to the precise moment a user was exposed to a new variant.

When you use Eppo's SDKs, you'll pass in a logging callback function at initialization: 

```javascript
import { init } from "@eppo/js-client-sdk";

await init({
  apiKey: "<SDK_KEY>",
  assignmentLogger,
});
```

This `assignmentLogger` function takes a single input: an Eppo-maintained `assignment` analytic event. This function is invoked each time the `get<Type>Assignment` method is called, meaning that once the SDK is installed in your application, engineers need to think about assignment logging. The `assignment` [analytic event](/sdks/event-logging/) contains all of the fields needed for Eppo's analytic engine, including targeting details and holdout group evaluations.

## Ergonomic API

Eppo's interface is designed to be intuitive and consistent. Whether you are using Eppo for a kill switch, targeted rollout, A/B/n experiment, dynamic configuration, mutual exclusive layer, or even a global holdout, your call to Eppo remains the same: 

```javascript
get<Type>Assignment: (
  flagKey: string,
  subjectKey: string,
  subjectAttributes: Record<string, any>,
  defaultValue: <Type>,
) => <Type>
```

Note that flags in Eppo all have an associated type, specified upon creation in the UI. Each of these types has a corresponding function to evaluate. To read more, see our page on [flag types](/sdks/sdk-features/flag-types).

## Flags for all of your environments

Modern software teams need to manage flags across both environments (local, staging, production, etc.) and across surface areas (mobile apps, web clients, servers, etc.).

Eppo allows you to easily manage flags across both of these dimensions. Unlimited environments can be created in the UI to match your development process. You can then, for instance, turn a flag on for all traffic in your local or staging environments without impacting production.

You can also manage what instances of the SDK should have which flags. For example, you may want to load a different set of flags for your mobile applications than you do for your backend server, or even match flags to specific app versions. This helps manage the SDK configuration file size as your number of flags increases over time.


## Navigating the docs

We hope that you are excited to explore how Eppo can fit into your work stream and tech stack. To start integrating Eppo, check out our getting started guides on [creating your first flag](/feature-flag-quickstart/) and [running your first experiment](/experiment-allocation-quickstart/).

The read more about our specific SDKs, check out the SDK-specific docs below:

### Client SDKs

- [JavaScript](client-sdks/javascript/intro)
- [React Native](client-sdks/react-native)
- [Android](client-sdks/android)
- [iOS](client-sdks/ios)


### Server SDKs

- [Node](server-sdks/node/intro)
- [Java](server-sdks/java)
- [Python](server-sdks/python)
- [Go](server-sdks/go)
- [Rust](server-sdks/rust)
- [Ruby](server-sdks/ruby/intro)
- [.NET](server-sdks/dotnet)
- [PHP](server-sdks/php)

### Hybrid implementations

If you'd like to explore managing the Eppo configuration file yourself, or other advanced deployment options, check out our [deployment modes page](/sdks/architecture/deployment-modes). If you are using Next JS, see our [Next JS setup guide](/sdks/client-sdks/javascript/nextjs-setup).

## Getting help

At Eppo we strive to keep our documentation thorough, up to date, and intuitive. If you find any gaps or sections that could be more clear, don't hesitate to file an issue on our public documentation [Github repository](https://github.com/Eppo-exp/eppo-docs/). 
