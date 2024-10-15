import React from 'react';

const FeatureCard = ({ title, description, link, iconSrc, noGreyScale }) => (
  <a href={link} className="feature-card-link">
    <div className="feature-card">
      {iconSrc && (
        <img 
          src={iconSrc} 
          alt="" 
          className={`feature-card-icon ${noGreyScale ? 'feature-card-icon--noGrey' : ''}`} 
          aria-hidden="true"
        />
      )}
      <h3 className="feature-card-title">
        <span>{title}</span>
      </h3>
      <p className="feature-card-description">{description}</p>
    </div>
  </a>
);

export default FeatureCard;
