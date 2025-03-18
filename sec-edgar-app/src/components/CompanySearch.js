import React, { useState } from 'react';
import { searchCompany } from '../api/secApi';
import { Search } from 'lucide-react';

const CompanySearch = ({ onCompanySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const companies = await searchCompany(query);
      setResults(companies);
      if (companies.length === 0) {
        setError('No companies found matching your search.');
      }
    } catch (err) {
      setError('Error searching for companies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company name or ticker..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : <><Search size={18} /> Search</>}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          <ul>
            {results.map((company) => (
              <li key={company.cik} onClick={() => onCompanySelect(company)}>
                <strong>{company.name}</strong> ({company.ticker})
                <span className="cik">CIK: {company.cik}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;