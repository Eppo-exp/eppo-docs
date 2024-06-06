# Migrating to a New Data Warehouse

If you're planning to transition to a new data warehouse, Eppo simplifies this process for you. We assist in creating a new Workspace that seamlessly connects to your new data warehouse, ensuring a smooth transition.

**Key Features of Eppo's Migration Assistance:**

- **New Workspace Setup:** Eppo sets up a new Workspace tailored to connect with your new data warehouse.
- **Data Synchronization:** We help in syncing all Facts and Metrics from your existing workspace to the new one.
- **Continuous Access:** While Experiments cannot be migrated, you'll retain access to your old workspace for ongoing reference to past results.

**Migration Steps:**

1. **Create a New Workspace:**
    - Contact Eppo support to initiate the creation of your new Workspace.
2. **Connect Your New Data Warehouse:**
    - In your new Workspace, link your new data warehouse following our [Setup Quickstart Guide](/quick-starts/setup-quickstart.md).
3. **Export Facts & Metrics from Your Old Workspace:**
    - Reach out to Eppo support to facilitate the export of your existing Facts and Metrics in YML format.
4. **Import Facts & Metrics into Your New Workspace:**
    - Sync the exported YML files into your new workspace using [Eppo’s Certified Metrics API](/data-management/metrics/certified-metrics.md).
    - **Important:** Ensure the SQL in the YML files aligns with the syntax requirements of your new warehouse vendor.