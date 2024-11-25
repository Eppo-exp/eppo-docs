import React from 'react';
import MDXContent from '@theme/MDXContent';

function ApiOptionRef({ name, children, defaultValue, type, typeUrl }) {
  return (
    <div className="api-option">
      <div className="api-option__header">
        <code className="api-option__name">{name}</code>
        
        {type && (
          <span className="api-option__type">
            {typeUrl ? (
              <a href={typeUrl} target="_blank" rel="noopener noreferrer">
                {type}
              </a>
            ) : (
              type
            )}
          </span>
        )}

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
