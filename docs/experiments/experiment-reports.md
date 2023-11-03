---
sidebar_position: 3
---

# Document Learnings with Reports

A key part of the experimentation workflow is post-experiment run time when results are shared. Teams have different rituals about how they do this such as a meeting with a presentation or an email to stakeholders. Regardless of how it's done, it's key to building a culture of experimentation but there is a lot of work needed to get the results from the the tool or data to create the needed artifact.

We're proud to introduce Eppo Reports which aims to solve this problem. Reports make it easier than ever to curate experiment insights, and then share those results widely. You can compose the story of the experiment’s hypothesis to show variants, cover the metrics that led to your decision, and then share those results with anyone.

## Creating a Report
Anyone with an Experiment Editor role or higher can edit the content on the Overview tab of an experiment. Those with a Viewer role can see the content, but cannot edit. 

On the overview tab you can summarize the learnings of your experiment by filling in your hypothesis, key takeaways, and decision. Help centralize your documentation by adding links to relevant planning docs, figma files, issue tracking, and more.

![Executive Summary Card](/img/experiments/reports/top-summary-card.png)


### Adding Cards and Blocks
Cards allow you to further customize your experiment report. Each card acts like a page where you can add text and experiment blocks. If you are familiar with Notion, Eppo reports uses a similar pattern with the page and block model. This includes using the slash (/) command to open up the menu to select from available blocks. Alternatively, you can add blocks by clicking on the plus icon when hovering over an existing block. 

![Adding Blocks](/img/experiments/reports/adding-metric-block.gif)

### Exporting Your Report as a PDF
Share your experiment report as a PDF by clicking on the "Export" button in the upper right of the page. A preview modal will appear and select "Export as PDF". Stay on the page until the export is complete and the PDF file will be available for download. 
![Export PDF](/img/experiments/reports/export-pdf.gif)


### Eppo Experiment Blocks
These are blocks that can be added to a report that are linked to your experiment configuration, data, and results. Metric block results will update with each experiment refresh.

#### Single Metric Lift
Select any metric that has been added to the decision metrics tab of the experiment. You can apply filters to a metric block by clicking on the filter dropdown when hovering over the block.
![Single Metric Block](/img/experiments/reports/single-metric-block.png)

#### Primary + Guardrail Metric Lift
A curated collection of metrics consisting of the experiments primary metric and any guardrail metrics on the experiment. You can apply filters to a metric block by clicking on the filter dropdown when hovering over the block.
![Primary Guardrail Blocks](/img/experiments/reports/primary-guardrail-block.png)

#### Explore Charts
Deep dive into metrics with exlore charts that allow you to slice-and-dice a metric.
![Explore Block](/img/experiments/reports/explore-block.png)

#### Variations
Add screenshots and descriptions for your variations. 
![Variation Block](/img/experiments/reports/variation-block.png)

#### Images
Upload any stand-alone image to your report.
![Image Block](/img/experiments/reports/image-block.png)

#### Block types coming soon:
Let us know if there is a block type or reports feature that would be useful for you and your team!