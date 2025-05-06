import React from 'react';
import TechnologyGrid from './TechnologyGrid';

const technologies = [
  { 
    name: "Node.js", 
    logoSrc: "/img/icons/node.png",
    href: "/sdks/server-sdks/node/quickstart"
  },
  { 
    name: "Python", 
    logoSrc: "/img/icons/python.png",
    href: "/sdks/server-sdks/python/quickstart"
  },
  { 
    name: "Java", 
    logoSrc: "/img/icons/java.png",
    href: "/sdks/server-sdks/java/quickstart"
  },
  { 
    name: "Go", 
    logoSrc: "/img/icons/go.png",
    href: "/sdks/server-sdks/go/quickstart"
  },
  { 
    name: "Ruby", 
    logoSrc: "/img/icons/ruby.png",
    href: "/sdks/server-sdks/ruby/quickstart"
  },
  { 
    name: "PHP", 
    logoSrc: "/img/icons/php.png",
    href: "/sdks/server-sdks/php/quickstart"
  },
  { 
    name: "Rust", 
    logoSrc: "/img/icons/rust.png",
    href: "/sdks/server-sdks/rust/quickstart"
  },
  { 
    name: ".NET", 
    logoSrc: "/img/icons/dotnet.png",
    href: "/sdks/server-sdks/dotnet/quickstart"
  },
  { 
    name: "Elixir", 
    logoSrc: "/img/icons/elixir.png",
    href: "/sdks/server-sdks/elixir/quickstart"
  },
  
  
];
export default function ServerSDKsGrid() {
  return <TechnologyGrid technologies={technologies} columns={5} />;
}