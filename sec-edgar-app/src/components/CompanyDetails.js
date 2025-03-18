import React, { useState, useEffect } from 'react';
import { getCompanyDetails } from '../api/secApi';
import { Info } from 'lucide-react';

const CompanyDetails = ({ company, onViewFilings }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getCompanyDetails(company.cik);
        setDetails(data);
      } catch (err) {
        setError('Error loading company details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [company.cik]);

  if (loading) return <div className="loading">Loading company details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!details) return null;

  return (
    <div className="company-details">
      <h2>{details.name}</h2>
      
      <div className="details-grid">
        <div className="detail-item">
          <h4>CIK</h4>
          <p>{company.cik}</p>
        </div>
        <div className="detail-item">
          <h4>Ticker</h4>
          <p>{company.ticker}</p>
        </div>
        <div className="detail-item">
          <h4>SIC</h4>
          <p>{details.sic} - {details.sicDescription}</p>
        </div>
        <div className="detail-item">
          <h4>Fiscal Year End</h4>
          <p>{details.fiscalYearEnd}</p>
        </div>
        <div className="detail-item">
          <h4>State of Incorporation</h4>
          <p>{details.addresses?.business?.stateOrCountry || 'N/A'}</p>
        </div>
        <div className="detail-item">
          <h4>Business Address</h4>
          <p>
            {details.addresses?.business?.street1}<br />
            {details.addresses?.business?.city}, {details.addresses?.business?.stateOrCountry} {details.addresses?.business?.zipCode}
          </p>
        </div>
      </div>
      
      <div className="buttons">
        <button className="primary-button" onClick={onViewFilings}>
          View SEC Filings
        </button>
      </div>
      
      <div className="info-box">
        <Info size={18} />
        <p>
          {details.name} is registered with the SEC with CIK #{company.cik}.
          The company files under SIC code {details.sic} ({details.sicDescription}).
        </p>
      </div>
    </div>
  );
};

export default CompanyDetails;