// src/components/CompanyComparison.js
import React, { useState, useEffect } from 'react';
import { getFinancialData } from '../api/secApi';
import { parseXBRLData } from '../utils/xbrlParser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CompanyComparison = ({ companies }) => {
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metric, setMetric] = useState('Revenue');
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const results = {};
        
        for (const company of companies) {
          const data = await getFinancialData(company.cik);
          results[company.ticker] = parseXBRLData(data);
        }
        
        setFinancialData(results);
      } catch (err) {
        setError('Error loading comparison data');
      } finally {
        setLoading(false);
      }
    };

    if (companies.length > 0) {
      fetchAllData();
    }
  }, [companies]);
  
  if (loading) return <div className="loading">Loading comparison data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (Object.keys(financialData).length === 0) return <div>No data available for comparison</div>;
  
  // Prepare comparison data for the selected metric and year
  const prepareComparisonData = () => {
    const comparisonData = [];
    
    Object.entries(financialData).forEach(([ticker, data]) => {
      const metricData = data[metric] || [];
      const yearData = metricData.find(item => item.date.includes(year.toString()));
      
      if (yearData) {
        comparisonData.push({
          name: ticker,
          value: yearData.value
        });
      }
    });
    
    return comparisonData;
  };
  
  const comparisonData = prepareComparisonData();
  
  // Get available years from the data
  const getAvailableYears = () => {
    const years = new Set();
    
    Object.values(financialData).forEach(data => {
      const metricData = data[metric] || [];
      metricData.forEach(item => {
        years.add(item.date.substring(0, 4));
      });
    });
    
    return Array.from(years).sort();
  };
  
  const availableYears = getAvailableYears();
  
  // Get metrics available for comparison
  const availableMetrics = Object.keys(Object.values(financialData)[0] || {});
  
  return (
    <div className="comparison-container">
      <h2>Company Comparison</h2>
      
      <div className="comparison-controls">
        <div className="control-group">
          <label>Financial Metric:</label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            {availableMetrics.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      
      {comparisonData.length > 0 ? (
        <div className="comparison-chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" name={metric} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="no-data">No comparison data available for the selected criteria.</div>
      )}
    </div>
  );
};

export default CompanyComparison;