// src/App.js (final version)
import React, { useState } from 'react';
import { ErrorProvider } from './contexts/ErrorContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ErrorDisplay from './components/ErrorDisplay';
import SettingsPanel from './components/SettingsPanel';
import CompanySearch from './components/CompanySearch';
import CompanyDetails from './components/CompanyDetails';
import CompanyFilings from './components/CompanyFilings';
import FinancialCharts from './components/FinancialCharts';
import CompanyComparison from './components/CompanyComparison';
import { Settings as SettingsIcon } from 'lucide-react';
import './styles/App.css';

function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [view, setView] = useState('search'); // search, details, filings, financials, comparison
  const [comparisonList, setComparisonList] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setView('details');
  };
  
  const handleViewFilings = () => {
    setView('filings');
  };
  
  const handleViewFinancials = () => {
    setView('financials');
  };
  
  const handleBackToDetails = () => {
    setView('details');
  };
  
  const handleBackToSearch = () => {
    setSelectedCompany(null);
    setView('search');
  };
  
  const handleAddToComparison = () => {
    if (selectedCompany && !comparisonList.some(c => c.cik === selectedCompany.cik)) {
      setComparisonList(prev => [...prev, selectedCompany]);
    }
  };
  
  const handleViewComparison = () => {
    setView('comparison');
  };
  
  const handleRemoveFromComparison = (cik) => {
    setComparisonList(prev => prev.filter(company => company.cik !== cik));
  };
  
  const toggleSettings = () => {
    setSettingsOpen(prev => !prev);
  };
  
  return (
    <ErrorProvider>
      <SettingsProvider>
        <div className="app-container">
          <header>
            <div className="header-content">
              <h1>SEC EDGAR Explorer</h1>
              <button className="settings-button" onClick={toggleSettings}>
                <SettingsIcon size={20} />
              </button>
            </div>
            
            {selectedCompany && (
              <div className="navigation">
                <button onClick={handleBackToSearch}>New Search</button>
                {view !== 'details' && (
                  <button onClick={handleBackToDetails}>Company Details</button>
                )}
                {view !== 'filings' && selectedCompany && (
                  <button onClick={handleViewFilings}>SEC Filings</button>
                )}
                {view !== 'financials' && selectedCompany && (
                  <button onClick={handleViewFinancials}>Financial Data</button>
                )}
                {view !== 'comparison' && comparisonList.length > 0 && (
                  <button onClick={handleViewComparison}>View Comparison</button>
                )}
              </div>
            )}
          </header>
          
          <ErrorDisplay />
          <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          
          <main>
            {view === 'search' && (
              <CompanySearch onCompanySelect={handleCompanySelect} />
            )}
            
            {view === 'details' && selectedCompany && (
              <CompanyDetails 
                company={selectedCompany} 
                onViewFilings={handleViewFilings}
                onAddToComparison={handleAddToComparison}
                isInComparison={comparisonList.some(c => c.cik === selectedCompany.cik)}
              />
            )}
            
            {view === 'filings' && selectedCompany && (
              <CompanyFilings company={selectedCompany} />
            )}
            
            {view === 'financials' && selectedCompany && (
              <FinancialCharts company={selectedCompany} />
            )}
            
            {view === 'comparison' && (
              <div className="comparison-view">
                {comparisonList.length > 0 ? (
                  <>
                    <div className="comparison-companies">
                      <h3>Companies in Comparison</h3>
                      <div className="company-chips">
                        {comparisonList.map(company => (
                          <div key={company.cik} className="company-chip">
                            <span>{company.name} ({company.ticker})</span>
                            <button 
                              onClick={() => handleRemoveFromComparison(company.cik)}
                              title="Remove from comparison"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <CompanyComparison companies={comparisonList} />
                  </>
                ) : (
                  <div className="no-comparison">
                    <p>No companies added to comparison. Return to company details and add companies to compare.</p>
                    <button onClick={handleBackToSearch} className="primary-button">
                      Back to Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
          
          <footer>
            <p>
              SEC EDGAR Explorer &copy; {new Date().getFullYear()} | 
              Data provided by U.S. Securities and Exchange Commission
            </p>
          </footer>
        </div>
      </SettingsProvider>
    </ErrorProvider>
  );
}

export default App;