import React, { createContext, useContext, useState, useEffect } from 'react';

const HighContrastContext = createContext();

export const useHighContrast = () => {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within HighContrastProvider');
  }
  return context;
};

export const HighContrastProvider = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('highContrastMode');
    return saved === 'true';
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('highContrastMode', isHighContrast.toString());
    
    // Apply CSS class to body
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  );
};

export default HighContrastContext;
