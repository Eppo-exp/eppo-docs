import React from 'react';
import TechnologyCard from './TechnologyCard';

interface Technology {
  name: string;
  logoSrc: string;
  href?: string;
}

interface TechnologyGridProps {
  technologies: Technology[];
  columns?: 2 | 3 | 4 | 5; // Allow 2-5 columns
}

const TechnologyGrid: React.FC<TechnologyGridProps> = ({ technologies, columns = 4 }) => (
  <div className={`tech-grid tech-grid-${columns}`}>
    {technologies.map((tech, index) => (
      <TechnologyCard
        key={index}
        name={tech.name}
        logoSrc={tech.logoSrc}
        href={tech.href}
      />
    ))}
  </div>
);

export default TechnologyGrid;