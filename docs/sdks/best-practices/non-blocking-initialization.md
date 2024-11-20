---
sidebar_position: 10
title: Initialize before assigning
---

# Finish initialization before using assignments

:::note
Don't be blocked! We're here to help you get up and running with Eppo. Contact us at [support@geteppo.com](mailto:support@geteppo.com).
:::

Eppo's SDK initialization is non-blocking by default. This means your application can continue running while the SDK initializes in the background. However, if you call `get<Type>Assignment` before initialization completes, you may get unexpected results due to race conditions.

### What Happens If You Don't Wait
When you call `get<Type>Assignment` before initialization completes, one of two things will happen:

1. If the SDK has a cached configuration in persistent storage (like localStorage in JavaScript):
   - It will use the previous configuration
   - This might not include your latest changes

2. If there's no cached configuration:
   - The SDK will return your specified default value
   - Your feature flags won't work as expected

### Best Practice
Take advantage of your programming language's tools for waiting for asynchronous operations to complete. For example, the `await` keyword in JavaScript can be used to wait for an async operation to complete.

:::tip
Check your specific SDK's documentation for initialization options and best practices for your programming language.
:::