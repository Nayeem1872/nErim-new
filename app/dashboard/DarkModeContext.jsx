
import { createContext, useContext, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('isDarkMode')) || false;
    }
    return false;
  });

  const handleClick = () => {
    setIsDarkMode((previousValue) => {
      const newMode = !previousValue;
      localStorage.setItem('isDarkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode, handleClick }}>
      {children}
    </DarkModeContext.Provider>
  );
};
