
# Subject Keys for Pre-Auth Experiments

## Introduction 

When you run experiments on authenticated users, it's relatively easy to provide a consistent `userId` to ensure that users see the same experience and can be linked to downstream metric events.

In practice however, we often do not have the luxury of having a consistent, readily available `userId`. For instance, consider unauthenticated traffic on a marketing page, or mobile app data before a user logs into their account. In both of these cases there is not a convenient `userId` and instead we must use some other proxy to track the user.

This page discusses some options and practical considerations when faced with this issue. In what follows, it's worth considering two different ways that Eppo uses subject identifiers: 1) in the SDK to ensure a given user sees a consistent experience and 2) in the analysis engine to join experiment assignment logs to metric event logs for experiment measurement. 

We'll now discuss a few ways to run experiments on pre-authenticated traffic.

## Tracking pre-authenticated traffic

### Using local storage

If you simply want to ensure a user sees the same experience as long as they are on their current browser, consider using local storage to track an `anonymousId`:

```javascript
function getAnonymousId() {
    let anonymousId = localStorage.getItem('anonymous_id');
    if (!anonymousId) {
        anonymousId = crypto.randomUUID(); 
        localStorage.setItem('anonymous_id', anonymousId);
    }
    return anonymousId;
}
```

Once a user logs in, continue to pass `anonymousId` into Eppo's SDK as the `subjectKey`.

This method may be preferable as it's very easy to implement. The main downside is that this tracking will only last until a user clears their local storage, and in some situations may require users to opt in to tracking. 

As long as this `anonymousId` is also stored in any other event you'd like to measure, using Eppo's analysis engine should be straightforward: just create an [entity](/data-management/definitions/entities/) for anonymous traffic. If instead you want to associate the `anonymousId` with a `userId` value for downstream analysis, consider using Eppo's [secondary ID resolution](/guides/advanced-experimentation/anonymous-explainer).

### Using a device identifier

For mobile apps, you can use either Apple's [IDFV](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) or Android's [App set ID](https://developer.android.com/identity/app-set-id) instead of manually storing a unique identifier. This will behave similarly to the `localStorage` approach described above, but will persist for as long as the user is on the device. The primary downside is that the same user may see multiple experiences across different devices (which will apply to any method, to some extent).

Similar to the section above on using `localStorage`, you can analyze impact on any other event tracked with the same `deviceId`. If you'd like to also analyze data tracked with `userId`, see the page on [analyzing anonymous user experiments](/guides/advanced-experimentation/anonymous-explainer).

### Using a managed analytics platform

You should also check if you're using an analytics platform like Segment or Amplitude, as they might already be handling tracking at the device level. In addition to facilitating tracking devices, these platforms may also help reconcile when one user is identified on multiple devices. For instance, Amplitude [provides an ID](https://amplitude.com/docs/data/sources/instrument-track-unique-users#how-amplitude-assigns-amplitude-ids) to provide a centralized identifier for a user across devices, and Segment provides [a method](https://segment.com/docs/unify/identity-resolution/ecommerce-example/) to bridge the gap between pre-authenticated and post-authenticated data.

In this case, you can either continue to use a device identifier for randomization and use the analytic platform ID for analysis, or use the analytics platform ID for both randomization and analysis.

Here's a partial list of analytics platforms that manage identities that Eppo has worked with. In most cases we will support using any analytics platform's identities for flagging. If you are using a vendor not on this list, please reach out to your Eppo account team:

- [Amplitude](https://amplitude.com/docs/data/sources/instrument-track-unique-users)
- [Segment](https://segment.com/docs/connections/spec/best-practices-identify/)
- [Mixpanel](https://docs.mixpanel.com/docs/tracking-methods/id-management/migrating-to-simplified-id-merge-system#understanding-simplified-id-merge)
- [Heap](https://developers.heap.io/docs/using-identify)
- [GA4 (Google Analytics)](https://support.google.com/analytics/answer/11397207?hl=en)
- [Rudderstack](https://www.rudderstack.com/docs/event-spec/standard-events/identify/)

#### Option 1 - Device ID for Randomization, Resolved ID for Analysis

If you pass a stable `deviceID` into Eppo's SDK, the same device will always see the same experience. This may be helpful if variant hopping on the same device causes a meaningful degradation to user experience. If you point Eppo's analytic engine at the resolved ID, it will automatically connect two devices that were later determined to be the same user. If this user was exposed to both variants, they will be removed from the analysis.

#### Option 2 - Resolved ID for Randomization and Analysis

Alternatively, you can use the resolved ID for both randomization and analysis. This approach may help if you want to minimize the amount a time a user is exposed to a second variant, but some variant hopping is not detrimental to the end user's experience.

To better understand Eppo's behavior under this approach, imagine a scenario where a user starts a session on one device, logs in, moves to another device, performs actions, and then logs in. The event stream data will look something like:

| Timestamp | Device ID | User ID | Resolved ID |
|-----------|-----------|-----------|-----------|
| 9:00 AM | iPhone-123 | Alice | 2 |
| 9:05 AM | Desktop-abc | null | 3 |
| 9:10 AM | Desktop-abc | Alice | 2 |
| 9:15 AM | Desktop-abc | null | 2 |

In this case, Alice might see a different variant when she first starts her desktop session. Once she logs in however, she'll start receiving her original variant (the one associated with resolved ID 2). 

With this approach you can also use the resolved ID to join assignment and outcome events. However, each session will be treated as an independent sample. For instance, in the example above Eppo will include both resolved IDs 2 and 3 as separate samples, even though we later realize that this is indeed the same user. To avoid overstating sample size, you may want to consider removing events that are later associated with another known user. This can be done with some relatively straightforward transformations on the Assignment SQL Definition.

To read more about overstated sample sizes in pre-authenticated experiments, please see the statistical considerations section [here](/guides/advanced-experimentation/anonymous-explainer/#statistical-considerations).
