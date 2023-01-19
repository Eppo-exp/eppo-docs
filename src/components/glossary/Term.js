import React from "react";

/*
NB: If you start a line with a Term (or any other react component),
Docusaurus will interpret everything that follows as JSX, not markdown, so
markdown formatting will not work.

As a workaround, you can insert a zero-width space (&#8203;) before the
start of the React component, and that will allow the markdown to be parsed correctly.

See https://docusaurus.io/docs/markdown-features/react#markdown-and-jsx-interoperability
*/

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
