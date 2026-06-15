import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import StatsPage from './StatsPage';
import GalleryPage from './GalleryPage';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Call handler immediately on mount to catch initial hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // If we are on HomePage, clicking regular anchors should scroll smoothly
    if (currentHash && !currentHash.startsWith('#stats') && !currentHash.startsWith('#gallery')) {
      const elementId = currentHash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentHash]);

  if (currentHash.startsWith('#stats')) {
    return <StatsPage />;
  }

  if (currentHash.startsWith('#gallery')) {
    return <GalleryPage />;
  }

  return <HomePage />;
}

export default App;

