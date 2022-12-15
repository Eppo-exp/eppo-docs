import React from 'react';
import Highlight from "./Highlight";

export default function RedHighlight({children, fgColor='#333'}) {
  return (
    <Highlight bgColor={'rgb(255, 182, 196)'} fgColor={fgColor}>
      {children}
    </Highlight>
  )
}