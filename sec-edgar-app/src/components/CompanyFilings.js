import React, { useState, useEffect } from 'react';
import { getCompanyFilings } from '../api/secApi';
import { FileText, ExternalLink, Filter } from 'lucide-react';

const CompanyFilings = ({ company }) => {
  const [filings, setFilings] = useState([]);
  const [filteredFilings, setFilteredFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    const fetchFilings = async () => {
      setLoading(true);
      try {
        const data = await getCompanyFilings(company.cik);
        setFilings(data);
        setFilteredFilings(data);
      } catch (err) {
        setError('Error loading filings');
      } finally {
        setLoading(false);
      }
    };

    fetchFilings();
  }, [company.cik]);
  
  useEffect(() => {
    if (filter) {
      setFilteredFilings(filings.filter(
        filing => filing.form.toLowerCase().includes(filter.toLowerCase())
      ));
    } else {
      setFilteredFilings(filings);
    }
  }, [filter, filings]);

  if (loading) return <div className="loading">Loading filings...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  // Generate actual SEC.gov URL for a filing
  const getFilingUrl = (accessionNumber, primaryDocument) => {
    const accessionFormatted = accessionNumber.replace(/-/g, '');
    const baseUrl = `https://www.sec.gov/Archives/edgar/data/${company.cik}/${accessionFormatted}`;
    return primaryDocument ? `${baseUrl}/${primaryDocument}` : baseUrl;
  };

  return (
    <div className="filings-container">
      <h2>SEC Filings for {company.name}</h2>
      
      <div className="filter-container">
        <div className="filter-input">
          <Filter size={18} />
          <input
            type="text"
            placeholder="Filter by form type (e.g., 10-K, 10-Q)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      
      {filteredFilings.length === 0 ? (
        <div className="no-results">No filings match your filter.</div>
      ) : (
        <table className="filings-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Description</th>
              <th>Filed Date</th>
              <th>Reporting Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFilings.map((filing, index) => (
              <tr key={index}>
                <td>{filing.form}</td>
                <td>{getFilingDescription(filing.form)}</td>
                <td>{filing.filingDate}</td>
                <td>{filing.reportDate || 'N/A'}</td>
                <td>
                  <a 
                    href={getFilingUrl(filing.accessionNumber, filing.primaryDocument)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    <ExternalLink size={16} />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Helper function to get descriptions for common filing types
function getFilingDescription(formType) {
  const descriptions = {
    '10-K': 'Annual Report',
    '10-Q': 'Quarterly Report',
    '8-K': 'Current Report',
    '4': 'Statement of Changes in Beneficial Ownership',
    '13F-HR': 'Quarterly Holdings Report',
    'DEF 14A': 'Proxy Statement',
    'S-1': 'Registration Statement',
    'S-3': 'Simplified Registration Statement',
    '6-K': 'Report of Foreign Private Issuer',
    '20-F': 'Annual Report (Foreign)',
    '40-F': 'Annual Report (Canadian)'
  };
  
  return descriptions[formType] || 'SEC Filing';
}

export default CompanyFilings;