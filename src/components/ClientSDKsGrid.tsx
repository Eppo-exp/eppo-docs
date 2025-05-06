import React from 'react';
import TechnologyGrid from './TechnologyGrid';

const technologies = [
  { 
    name: "JavaScript", 
    logoSrc: "/img/icons/js.png",
    href: "/sdks/client-sdks/javascript/quickstart"
  },
  { 
    name: "Android", 
    logoSrc: "/img/icons/android.png",
    href: "/sdks/client-sdks/android/quickstart"
  },
  { 
    name: "iOS", 
    logoSrc: "/img/icons/ios.png",
    href: "/sdks/client-sdks/ios/quickstart"
  },
  { 
    name: "React Native", 
    logoSrc: "/img/icons/react-native.png",
    href: "/sdks/client-sdks/react-native/quickstart"
  },

  { 
    name: "Dart & Flutter", 
    logoSrc: "/img/icons/flutter.png",
    href: "/sdks/client-sdks/dart/quickstart"
  },
];

export default function ClientSDKsGrid() {
  return <TechnologyGrid technologies={technologies} columns={5} />;
}