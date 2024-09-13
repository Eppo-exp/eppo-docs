# Segments and filters

When conducting experiments, it's often important to understand how the results impact specific subsets of subjects.
Eppo provides powerful tools to help you analyze experiment results for specific segments and apply filters to focus on particular properties.
This documentation will guide you through the process of creating segments and using filters to gain valuable insights from your experiments.

Eppo provides two approaches:

- Pre-defined segments of subjects, which allows for complicated cuts of experiment results.
- Ad-hoc filters on a single property, which is useful for quickly exploring results for a single property.

:::info

We do not compute [CUPED](/statistics/cuped) results for neither segments nor ad-hoc filters due to the computational cost of computing CUPED results.

:::

## Segments

Segments allow you to define pre-defined filters to create subsets of users for analysis.
By creating segments, you can efficiently examine experiment results across different user groups.

You can find all segments under the Metrics page in the Segments tab
![overview of segments](/img/experiments/segments/segments_overview.png)

### Creating a segment

You can create a new segment on the segments page. For example, let's create a segment of North American users

![create a new segment button](/img/experiments/segments/create_segment.png)

Next, select a property to filter by, in this case, we will filter by the Country property of the relevant assignment source

![select property for segment](/img/experiments/segments/segment_select_source.png)

Finally, we add Canada, Mexico, and the United States as property values.

![select property values for segment](/img/experiments/segments/segment_add_dimensions.png)

This defines the North America segment. However, it is easy to create more fine-grained segments (such as North American Mobile users) by adding additional filters to the segment.

:::info
When using a property filter based on an [assignment property](/data-management/definitions/properties#assignment-properties), only experiments that use that particular assignment definition are able to leverage that segments.  
:::

### Analyzing results by segment

On the experiments detail page, we can now filter the results of the experiment by the pre-defined segments

![filter results by segment](/img/experiments/segments/filter_by_segment.png)

:::note
You may need to manually refresh the experiment results (or wait for the next pipeline run) for newly created segment results to be available.
:::

Now, the results indicate that we are analyzing the selected segment

![experiment results filtered by a segment](/img/experiments/segments/segment_results.png)

:::info 
If an Assignment Property value includes fewer than five subjects, we will not let you create a Segment with that value for privacy reasons.
:::

## Single property filter

The single property filter allows you to quickly explore experiment results based on a specific property.
In the filter menu, select the "Single Value" filter and select the property and value you want to explore

![filter results by property](/img/experiments/segments/filter_by_dimension.png)

and the experiment results are now filtered to users that fit the filter

![experiment results filtered by a segment](/img/experiments/segments/filter_results.png)
