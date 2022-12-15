import React from 'react';

export default function NoBreak({children}) {
  return (
    <span
     style={{
      whiteSpace: 'nowrap'
     }}>
      {children}
    </span>
  )
}