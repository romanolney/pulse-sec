// src/components/SettingsPanel.js
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Settings, X, Trash2 } from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSetting, clearSearchHistory } = useSettings();
  
  if (!isOpen) return null;
  
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3><Settings size={18} /> Application Settings</h3>
        <button className="close-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      
      <div className="settings-content">
        <div className="setting-group">
          <h4>Display</h4>
          
          <div className="setting-item">
            <label>Theme</label>
            <select 
              value={settings.theme} 
              onChange={(e) => updateSetting('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>Results Per Page</label>
            <select 
              value={settings.itemsPerPage} 
              onChange={(e) => updateSetting('itemsPerPage', Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        
        <div className="setting-group">
          <h4>Search Preferences</h4>
          
          <div className="setting-item">
            <label>Default Form Type</label>
            <select 
              value={settings.defaultFormType} 
              onChange={(e) => updateSetting('defaultFormType', e.target.value)}
            >
              <option value="all">All Forms</option>
              <option value="10-K">10-K (Annual Reports)</option>
              <option value="10-Q">10-Q (Quarterly Reports)</option>
              <option value="8-K">8-K (Current Reports)</option>
            </select>
          </div>
          
          <div className="setting-item checkbox">
            <label>
              <input 
                type="checkbox"
                checked={settings.saveSearchHistory}
                onChange={(e) => updateSetting('saveSearchHistory', e.target.checked)}
              />
              Save Search History
            </label>
          </div>
        </div>
        
        {settings.saveSearchHistory && settings.searchHistory.length > 0 && (
          <div className="setting-group">
            <div className="history-header">
              <h4>Recent Searches</h4>
              <button 
                className="clear-history"
                onClick={clearSearchHistory}
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
            
            <ul className="search-history-list">
              {settings.searchHistory.map((item, index) => (
                <li key={index}>
                  <span>{item.query}</span>
                  <span className="history-date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;