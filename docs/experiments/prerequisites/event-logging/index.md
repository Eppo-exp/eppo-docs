# Event logging

The second prerequisite to running experiments on Eppo is logging application events to your warehouse.

It's best practice to centralize application logging as much as possible. For illustration using a basic web app and Segment as an event logger, you might define the following logging functions on the your client (e.g a single page app):

```js
// logging.js

function logEvent(eventData) {
  segment.track(eventData)
}
```

and the same function on your server (this example assumes a Python backend):

```python
# logging.py

def log_event(event_data):
    segment.track(event_data)
```

All client logging would use the JS function and all backend would use the Python function. The last piece would be configuring Segment to route your data into your data warehouse.