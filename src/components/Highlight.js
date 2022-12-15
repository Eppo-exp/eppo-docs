import React from 'react';

export default function Highlight({children, bgColor, fgColor='#fff'}) {
  return (
    <span
      style={{
        backgroundColor: bgColor,
        borderRadius: '2px',
        color: fgColor,
        padding: '0.05rem 0.1rem 0.2rem',
      }}>
      {children}
    </span>
  );
}