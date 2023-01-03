import React from "react";

/**
 * Component to style terms being defined.
 * 
 * TODO: Incorporate this into a way to provide pop-up definitions for common terms in a glossary
 * 
 * @param {boolean} def - Whether term is being defined (``true``) or simply used (``false``). Being defined will set the styling appropriately.
 */
export default function Term({ children, def = false }) {
  return <span style={def ? { fontWeight: "bold" } : {}}>{children}</span>;
}
