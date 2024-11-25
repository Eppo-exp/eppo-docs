import React from 'react';
import MDXContent from '@theme/MDXContent';

<<<<<<< Updated upstream
function ApiOptionRef({ name, children, defaultValue }) {
=======
function ApiOptionRef({ name, children, defaultValue, type, typeUrl }) {
>>>>>>> Stashed changes
  return (
    <div className="api-option">
      <div className="api-option__header">
        <code className="api-option__name">{name}</code>
<<<<<<< Updated upstream
=======
        
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

>>>>>>> Stashed changes
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
