import React from 'react';
import MDXContent from '@theme/MDXContent';

function ApiOptionRef({ name, children, defaultValue }) {
  return (
    <div className="api-option">
      <div className="api-option__header">
        <code className="api-option__name">{name}</code>
        {defaultValue && (
          <span className="api-option__default">
            Default: <code>{defaultValue}</code>
          </span>
        )}
      </div>
      
      <div className="api-option__description">
        <MDXContent>{children}</MDXContent>
      </div>
    </div>
  );
}

export default ApiOptionRef;
