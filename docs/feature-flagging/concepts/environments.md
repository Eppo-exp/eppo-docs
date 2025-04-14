---
sidebar_position: 2
---

# Environments

Every Eppo instance comes with two out-of-the-box environments: **Test** and **Production**.  Use the **Test** environment to check feature flag behavior before releasing them in **Production**.

Additional environments can be added with no limit to match the ways you develop and ship code. For example, you can create environments for every developer's local environment or if you have multiple lower environments. Use _Flags > Environments_ to create new environments.

![Environment setup](/img/feature-flagging/environments/environment-setup.png)

SDK keys for environments can be created on the _Flags > Environments > SDK Keys_ section of the interface:

![SDK key setup](/img/feature-flagging/environments/sdk-keys.png)

There is no limit to the number of SDK keys per environment. Once keys are generated, they can be used to initialize the SDK in the given environment.

Flags can be toggled on an off independently per environment on the flag list and flag detail views. You can also define different targeting rules per environment:

![Feature flag detail page](/img/feature-flagging/environments/ff-detail-page.png)

## Use cases
### Flags for your local environment
Every developer on the team can have their own local environment defined. This has a number of benefits:
* Faster development - Individual environments enable developers to quickly toggle features on and off without impacting the wider team. This speeds up the development and testing process, allowing for faster feature releases and more agile development practices.
* Personalized testing - Developers can experiment with different feature flag configurations without affecting others' work. This allows for more thorough testing of new features in isolation, leading to higher quality code and fewer integration issues.

### Environments for each application
Environments can be used to limit exposure of flags on a per application basis. For example, the Production environment can be set to a web app while additional environments can be created for the company's iOS and Android apps.

These separate environments allow teams to tailor feature flags to each platform's unique requirements. This enables fine-grained control over feature rollouts, accommodating differences in implementation, user interface, or functionality across platforms.

With distinct environments, teams can manage feature releases for each platform independently. This flexibility is crucial when dealing with varying app store approval processes or when coordinating staged rollouts across different user bases.

Segregating environments by platform also makes it easier to isolate and diagnose issues. When a problem arises, teams can quickly determine if it's platform-specific or affects all applications, streamlining the debugging process and reducing resolution time. It also allows for disabling a problematic feature on on a single platform without impacting others.