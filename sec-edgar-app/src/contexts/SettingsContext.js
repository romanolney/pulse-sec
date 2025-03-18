// src/contexts/SettingsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('sec-app-settings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : {
          theme: 'light',
          itemsPerPage: 10,
          defaultFormType: 'all',
          saveSearchHistory: true,
          searchHistory: []
        };
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sec-app-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Add a search to history
  const addToSearchHistory = (query) => {
    if (!settings.saveSearchHistory) return;
    
    setSettings(prev => ({
      ...prev,
      searchHistory: [
        { query, timestamp: new Date().toISOString() },
        ...prev.searchHistory.slice(0, 9) // Keep only the 10 most recent
      ]
    }));
  };
  
  // Clear search history
  const clearSearchHistory = () => {
    setSettings(prev => ({
      ...prev,
      searchHistory: []
    }));
  };
  
  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        updateSetting, 
        addToSearchHistory, 
        clearSearchHistory 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);