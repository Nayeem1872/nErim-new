import { createContext, useEffect, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [value, setValue] = useState('basic');

  useEffect(() => {
    // Load value from localStorage or use 'basic' as the default value
    const storedValue = localStorage.getItem('myContextValue');
    setValue(storedValue || 'basic');
  }, []);

  // Update localStorage whenever the value changes
  useEffect(() => {
    localStorage.setItem('myContextValue', value);
  }, [value]);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
    // console.log(storedDarkMode);
    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode);
    }
  }, []);


  return (
    <MyContext.Provider value={{ value, updateValue, isDarkMode}}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
