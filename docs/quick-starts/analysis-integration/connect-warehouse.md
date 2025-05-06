---
title: Connecting your warehouse
sidebar_position: 1
---

import WarehouseGrid from '@site/src/components/WarehouseGrid';

# Connecting your warehouse

Eppo uses your data warehouse to host all experimentation data. This means that you have full control over your data and full visibility into how Eppo calculates results. To connect your data warehouse, please see read the relevant guide below:

<WarehouseGrid />


## Identifying required data

When first integrating Eppo, it's helpful to map out what data will be required. At a minimum, you'll need to add the tables that hold the underlying metric data you wish to measure in Eppo. If you want to analyze past experiments, or experiments randomized outside of Eppo, you'll also need to add tables that track who was enrolled into those experiments. For more details, see the page on the [Eppo data model](/data-management/definitions/overview/).

Once you've connected your warehouse and granted the necessary permissions, you'll be able to start [adding metrics](/quick-starts/analysis-integration/adding-metrics). 
