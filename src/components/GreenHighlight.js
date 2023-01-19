import React from "react";
import Highlight from "./Highlight";

export default function GreenHighlight({ children, fgColor = "#333" }) {
  return (
    <Highlight bgColor={"rgb(158, 230, 213)"} fgColor={fgColor}>
      {children}
    </Highlight>
  );
}
