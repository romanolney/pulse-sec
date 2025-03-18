// src/contexts/ErrorContext.js
import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  
  const addError = (message, source) => {
    const id = Date.now();
    setErrors(prev => [...prev, { id, message, source, timestamp: new Date() }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissError(id);
    }, 5000);
    
    return id;
  };
  
  const dismissError = (id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };
  
  const clearAllErrors = () => {
    setErrors([]);
  };
  
  return (
    <ErrorContext.Provider value={{ errors, addError, dismissError, clearAllErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);