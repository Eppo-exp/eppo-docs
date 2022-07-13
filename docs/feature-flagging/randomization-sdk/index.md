# Eppo Randomization SDK

## Overview

You can use Eppo's SDK to randomly assign subjects to your experiment variations. The SDK integrates with your existing event tracking system to log assignment events for later analysis in Eppo.

The SDK assigns variations according to your experiment traffic allocation. You may choose to dialup the traffic allocation over a period of time. If the traffic allocation changes, the SDK never reassigns subjects who were already assigned to a variation. You may also use the SDK to test an experiment before launch. Each variation in Eppo has an allow-list override for test subjects. The SDK downloads this allow-list from Eppo's servers to give assignments.

To get started with the Randomization SDK, [create an API Key](./api-keys.md) and choose an SDK to use.

## Choosing an SDK

Eppo has two types of SDKs: client SDKs and server SDKs. Which type of SDK you choose depends on the environment your application runs in. Client SDKs are intended for applications that run on end-user devices such as web browsers. These SDKs usually assign variations for one subject. Server SDKs are meant for use by a web server that may serve multiple user requests at a time. See the below links for more details on each type of SDK:
- [Client SDKs](./client-sdks/)
- [Server SDKs](./server-sdks/)
