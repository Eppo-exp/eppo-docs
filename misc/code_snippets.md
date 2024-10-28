# Eppo SDK Code Snippets
Code snippets for https://www.geteppo.com/feature-flagging.

## JavaScript
```javascript
import * as EppoSdk from "@eppo/js-client-sdk";

const variation = EppoSdk.getInstance().getStringAssignment(
  "my-feature-flag",
  user.id,
  { country: user.country },
  "flag-default-value"
);
```

## Node.js
```typescript
import * as EppoSdk from "@eppo/node-server-sdk";

const variation = EppoSdk.getInstance().getStringAssignment(
  "my-feature-flag",
  user.id,
  { country: user.country },
  "flag-default-value"
);
```

## Python
```python
import eppo_client

variation = eppo_client.get_instance().get_boolean_assignment(
    'my-feature-flag', 
    user.id, 
    { 'country': user.country }, 
    'flag-default-value'
)
```

## .NET
```csharp
using Eppo.Sdk;

var variation = EppoClient.GetInstance().GetStringAssignment(
  "my-feature-flag", 
  user.Id, 
  new Dictionary<string, string> { { "country", user.Country } }, 
  "flag-default-value"
);
```

## Go
```go
import "github.com/Eppo-exp/golang-sdk/v6/eppoclient"

var eppoClient = &eppoclient.EppoClient{}

variation, err := eppoClient.GetStringAssignment(
  "my-feature-flag", 
  user.Id, 
  map[string]string{"country": user.Country}, 
  "flag-default-value"
)
```

## PHP
```php
use Eppo\Client\EppoClient;

$variation = EppoClient::getInstance()->getStringAssignment(
  'my-feature-flag', 
  $user->id, 
  ['country' => $user->country], 
  'flag-default-value'
);
```

## Rust
```rust
use eppo::ClientConfig;

let mut client = ClientConfig::from_api_key("api-key").to_client();

let variation = client.get_string_assignment(
        "my-feature-flag",
        &user.id,
        &[("country", &user.country)].into_iter().collect(),
        "flag-default-value",
    )
    .unwrap_or("flag-default-value".to_string());
```

## Ruby
```ruby
require 'eppo_client'

variation = EppoClient::Client.instance.get_string_assignment(
  'my-feature-flag',
  user.id,
  { country: user.country },
  'flag-default-value'
)
```

## React Native
```javascript
import * as EppoSdk from "@eppo/react-native-sdk";

const variation = EppoSDK.getInstance().getStringAssignment(
  'my-feature-flag',
  user.id,
  { country: user.country },
  'flag-default-value'
);
```

## iOS (Swift)
```swift
import EppoSDK

let variation = EppoClient.shared().getStringAssignment(
    experimentKey: "my-feature-flag",
    subjectId: user.id,
    subjectAttributes: ["country": user.country],
    defaultValue: "flag-default-value"
)
```

## Java
```java
import com.eppo.sdk.EppoClient;
import cloud.eppo.api.Attributes;

String variation = EppoClient.getInstance().getStringAssignment(
    "my-feature-flag",
    user.getId(),
    new Attributes(Collections.singletonMap("country", user.getCountry())),
    "flag-default-value"
);
```

## Android (Kotlin)
```kotlin
import cloud.eppo.android.EppoClient
import cloud.eppo.ufc.dto.SubjectAttributes

val variation = EppoClient.getInstance().getStringAssignment(
    experimentKey = "my-feature-flag",
    subjectId = user.id,
    subjectAttributes = SubjectAttributes(mapOf("country" to user.country)),
    defaultValue = "flag-default-value"
)
```
