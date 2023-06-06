# Metric Collections

Metrics are often related to specific “themes”, e.g. sign-ups, revenue, search quality, and etc. So, Eppo provides the concept of *Metric Collections* to help organize metrics around these themes, so that you can

1. easily add related metrics to experiments without needing to know or remember which metrics should be included.
2. easily find and display experiment results for metrics related to specific themes.

A *Metric Collection* can be thought of as a "template" with a name and list of metrics, and the contents of the *Metric Collection* are copied together as a group when added to an experiment. Metrics can be added to or removed from this copied metric group without affecting the original *Metric Collection* "template."

## Creating a Metric Collection

1. **Navigate to `Metrics`, click `+ Create`, then select `Collection`**

![Creating a metric collection](../../../../static/img/building-experiments/create-metric-collection.gif)

And a modal will appear in which you can give the collection a name, select the entity that the metrics belong to, and optionally write a description about the collection.

![Submitting a metric collection](../../../../static/img/building-experiments/create-metric-collection-submit.gif)

2. **Add metrics to the collection**

On the Metric collection detail page, you can click `+ Add metric` and select from the popover to add metrics.

![Adding metrics to a metric collection](../../../../static/img/building-experiments/add-metrics-to-collection.gif)

## Adding a Metric Collection to an experiment

1. **Select a Metric Collection to add**

In the Overview tab within the experiment's page, you can click `+ Add` and the `Collection` option, and select from the popover to add the collection.

![Adding a metric collection to an experiment](../../../../static/img/building-experiments/add-metric-collection-to-experiment.gif)

2. **Edit the metrics in the added group**

"Adding" a Metric Collection to an experiment copies the metrics and title from Metric Collection into a group in the experiment. You can add or remove metrics from this group without affecting the original Metric Collection.

![Add and remove a metric from a group](../../../../static/img/building-experiments/add-and-remove-metric-from-group.gif)

## Editing a Metric Collection

1. **Navigate to the Metric Collection page**

![Navigate to a metric collection](../../../../static/img/building-experiments/navigate-to-metric-collection.gif)

2. **Remove a metric from the collection**

![Remove a metric from a collection](../../../../static/img/building-experiments/remove-metric-from-collection.gif)

3. **Add a metric to the collection**

![Add a metric to a collection](../../../../static/img/building-experiments/add-metric-to-collection.gif)

4. **Reorder the metrics in the collection**

Drag the handle on the right of each metric's row to reorder metrics.

![Reorder metrics in a collection](../../../../static/img/building-experiments/reorder-metrics-in-collection.gif)

5. **Update the collection's name**

Click the menu on the top right and click `Rename Collection` to open a modal to update the collection name.

![Rename the metric collection](../../../../static/img/building-experiments/rename-metric-collection.gif)