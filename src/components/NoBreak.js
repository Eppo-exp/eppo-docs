import React from "react";

/**
 * Ensure contents are not wrapped across lines.
 *
 * Useful especially when Katex components are wrapped unnaturally
 *
 * @param {*} children
 * @returns
 */
export default function NoBreak({ children }) {
  return (
    <span
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
