import React from 'react';

export default function Term({children, def=false}) {
  return (
    <span
     style={
      def ? {fontWeight: "bold"} : {}
     }>
      {children}
     </span>
  )
}