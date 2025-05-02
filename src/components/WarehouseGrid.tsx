import React from 'react';
import TechnologyGrid from './TechnologyGrid';

const technologies = [
  { 
    name: "Snowflake", 
    logoSrc: "/img/icons/snowflake.png", 
    href: "/data-management/connecting-dwh/snowflake" 
  },
  { 
    name: "Databricks", 
    logoSrc: "/img/icons/databricks.png", 
    href: "/data-management/connecting-dwh/databricks" 
  },
  { 
    name: "BigQuery", 
    logoSrc: "/img/icons/bigquery.png", 
    href: "/data-management/connecting-dwh/bigquery" 
  },
  { 
    name: "Redshift", 
    logoSrc: "/img/icons/redshift.png", 
    href: "/data-management/connecting-dwh/redshift" 
  },
];

export default function WarehouseGrid() {
  return <TechnologyGrid technologies={technologies} />;
}