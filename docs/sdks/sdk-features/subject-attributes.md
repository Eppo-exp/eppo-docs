# Subject attributes

You can pass Eppo subject attributes to take advantage of advanced targeting conditions, like app versions or country checks. See [targeting rules](/feature-flagging/targeting) for how to configure these in the Eppo application.

## Pass subject attributes to the Eppo SDK

The below code examples show how to pass a value for a "device" attribute. The subject attributes are a free-form map, so you may also pass any other attribute names.

<Tabs>
<TabItem value="javascript" label="JavaScript (Client)">

```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const subjectAttributes = { device: "iOS" };
const variation = EppoSdk.getInstance().getAssignment(
  "<SUBJECT-KEY>",
  "<EXPERIMENT-KEY>",
  subjectAttributes
);
```

</TabItem>

<TabItem value="node" label="Node">

```javascript
import * as EppoSdk from "@eppo/node-server-sdk";

const subjectAttributes = { device: "iOS" };
const variation = EppoSdk.getInstance().getAssignment(
  "<SUBJECT-KEY>",
  "<EXPERIMENT-KEY>",
  subjectAttributes
);
```

</TabItem>

<TabItem value="python" label="Python">

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_assignment("<SUBJECT-KEY>", "<EXPERIMENT-KEY>", { "device": "iOS" })
```

</TabItem>
</Tabs>