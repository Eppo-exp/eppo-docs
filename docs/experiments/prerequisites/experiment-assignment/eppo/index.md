# Assignments using Eppo's SDK

## Overview

You can use Eppo's SDKs to randomly assign subjects to your experiment variations. Our SDKs integrates with your existing event tracking system to log assignment events for later analysis in Eppo.

Our SDKs assign subjects to variations according to the experiment traffic allocations you set in Eppo's user interface. You can dial up an experiment's traffic exposure over time and limit who is exposed to the experiment using fine grained targeting rules. If the traffic exposure is increased, the SDK never reassigns subjects who were previously assigned. Our SDKs also enable you to test an experiment before launch via allow-list overrides on each variant.

To get started with the Eppo's SDKs for experiment assignment, refer to our [SDK guide on experiment assignment](/feature-flags/use-cases/experiment-assignment).

## Choosing an SDK

Eppo has two types of SDKs: client SDKs and server SDKs. Which type of SDK you choose depends on the environment your application runs in. Client SDKs are intended for applications that run on end-user devices such as web browsers. These SDKs usually assign variations for one subject. Server SDKs are meant for use by a web server that may serve multiple user requests at a time. See the below links for more details on each type of SDK:
- [Client SDKs](/feature-flags/sdks/client-sdks/)
- [Server SDKs](/feature-flags/sdks/server-sdks/)
