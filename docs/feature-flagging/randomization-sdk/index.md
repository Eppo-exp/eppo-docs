# Eppo Randomization SDK

## Overview

You can use Eppo's SDK to randomly assign subjects to your experiment variations. The SDK integrates with your existing event tracking system to log assignment events for later analysis in Eppo.

The SDK respects the experiment traffic allocation. You may choose to dialup the traffic allocation over a period of time. If the traffic allocation changes, the SDK never reassigns subjects who are already assigned to a variation.

You may also use the SDK to test an experiment before launch. Each variation in Eppo has an allow-list of subjects who should always be assigned to the variation for testing purposes. The SDK downloads this allow-list from Eppo's servers to give assignments.

## Choosing an SDK

Eppo has two types of SDKs:
- [Client SDKs](./client-sdks/)
- [Server SDKs](./server-sdks/)

Client SDKs are intended to run on a user device such as a web browser. These SDKs usually assign variations for one subject, for example the user ID. Server SDKs are meant for use by a web server that runs on your own application infrastructure. Server SDKs may assign variations for multiple subjects and experiments.


