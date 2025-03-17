# Ensuring Fresh Feature Flag Configurations

When working with feature flags, there are certain use cases, like kill switches, where it can be important to ensure your application always has the most up-to-date configuration. This guide explains how to maintain fresh configurations across different platforms when using Eppo's SDKs.

## Server-Side Applications

Server-side applications automatically handle configuration freshness through built-in polling mechanisms. You can configure the polling interval during initialization of the SDK.

## Client-Side Applications

### JavaScript Client
For browser-based applications, you have several options to ensure fresh configurations:

1. **Enable Polling**
```javascript
const client = init({
    apiKey: 'your-sdk-key',
    pollAfterSuccessfulInitialization: true, // Set SDK to poll
    pollInterval: 30000 // Poll every 30 seconds
});
```

2. **Manual Refresh**
```javascript
// Force a configuration refresh when needed
const client = init({
    apiKey: 'your-sdk-key',
    forceReinitialize: true,
    // Other initialization options
});
```

### Mobile Applications
Mobile apps can implement similar strategies:

EppoClient.resetSharedInstance()
eppoClient = try await EppoClient.initialize(
    sdkKey: "your-sdk-key",
    assignmentLogger: segmentAssignmentLogger
)
```

```kotlin
val client = new EppoClient.Builder("your-sdk-key", getApplication())
    .forceReinitialize(true)
    .pollingEnabled(true)
    .pollingIntervalMs(30 * 1000) // seconds
    .build()
    .build()
```

## Best Practices and Considerations

When implementing polling or real-time updates, consider how configuration changes might affect active user sessions. Specifically,Configuration changes during an active session might create an inconsistent user experience. Consider these strategies:
  - Reserve changing flag values in a session for only the flags that absolutely need it, like kill switches
  - Update configurations only between sessions
  - Implement graceful transitions when flags change

### Real-Time Updates
For the cases when real-time updates are necessary, we recommend adding a listener for a push from the server to force a refresh:

1. **WebSocket Integration**
```javascript
// Example of listening to a WebSocket for configuration updates
webSocket.on('config-update', async () => {
    await client.refreshConfiguration();
});
```

2. **Server-Sent Events**
```javascript
const eventSource = new EventSource('your-config-endpoint');
eventSource.onmessage = async () => {
    await client.load();
};
```

## Summary
- Server-side applications handle freshness automatically
- Client-side applications can use polling or manual refresh
- Consider user experience when implementing mid-session updates
- Use real-time updates for critical features requiring immediate changes