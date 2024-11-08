---
sidebar_position: 1
---

# Subjects

## Introduction

When calling Eppo's SDK to get assignments, you'll need to provide a `subjectKey`. This key represents a unique identifier for the entity being targeted and/or experimented on (e.g., a user). When Eppo evaluates randomized targeting logic (experiment assignment, limited traffic exposure, etc.), this ID will be hashed and used to bucket subjects. That is, subsequent calls to `get<Type>Assignment` will always return the same variant for the same `subjectKey`, as long as targeting eligibility does not change. 

For experiment analysis, `subjectKey` is also used to join assignment events to outcome events. 

This page walks through several common choices for `subjectKey` and considerations for each.

## Examples 

### Authenticated users

A simple example of an experiment subject is an authenticated user, typically identified with a `userId`. In this case, simply pass that value in as the `subjectKey`. Downstream analysis should be simple: just add other tables from your data warehouse that also track `userId`. There's no need to instrument new events specifically for Eppo.

### Unauthenticated users

It's common to run experiments before a persistent `userId` has been created. For instance, any pre-authentication traffic on your site that does not yet have an associated `userId`. Fortunately there are several options for what to use as a `subjectKey` in this case.

Common solutions include storing an identifier in `localStorage`, accessing device-level identifiers, or leveraging a consistent identifier from a managed analytics platform like Segment, Amplitude, or Rudderstack.

For more details on each of these options, see our guide on choosing a [subject key for pre-auth experiments](/guides/engineering/preauth-experiments).


### Company (for B2B businesses)

B2B companies may want to guarantee that users from the same company see a consistent experience. This is easily achieved by simplying passing `companyId` in as the `subjectKey`. Subsequent analysis can either use company-level data or user-level data via [clustered experiment analysis](/experiment-analysis/clustered-analysis/).

### No subject

In cases where you want all traffic to see the same variant you can simply pass in a hardcoded value as the `subjectKey`. This may make sense for situations where you want to simply toggle a feature on or off for 100% of traffic.
