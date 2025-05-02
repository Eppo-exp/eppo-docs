import React from 'react';

interface TechnologyCardProps {
  name: string;
  logoSrc: string;
  href?: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ name, logoSrc, href = "#" }) => (
  <a href={href} className="tech-card-link">
    <div className="tech-card">
      <div className="tech-card-icon-wrapper">
        <img 
          src={logoSrc} 
          alt={`${name} Logo`}
          className="tech-card-icon"
        />
      </div>
      <span className="tech-card-text">{name}</span>
    </div>
  </a>
);

export default TechnologyCard;