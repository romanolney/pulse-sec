import React, { useState, useEffect } from 'react';
import { getFinancialData } from '../api/secApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialCharts = ({ company }) => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('Revenue');
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const data = await getFinancialData(company.cik);
        setFinancialData(processFinancialData(data));
      } catch (err) {
        setError('Error loading financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [company.cik]);
  
  if (loading) return <div className="loading">Loading financial data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!financialData) return <div>No financial data available</div>;

  // Extract available metrics
  const metrics = Object.keys(financialData);
  
  // Get data for selected metric
  const chartData = financialData[selectedMetric] || [];
  
  return (
    <div className="financial-charts">
      <h2>Financial Information</h2>
      
      <div className="metric-selector">
        <label>Select Financial Metric:</label>
        <select 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          {metrics.map(metric => (
            <option key={metric} value={metric}>{metric}</option>
          ))}
        </select>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={selectedMetric} 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper function to process and structure financial data
function processFinancialData(data) {
  // This function will extract key financial metrics from the SEC XBRL data
  // SEC data format is complex - this is a simplified example
  
  const processedData = {
    Revenue: [],
    NetIncome: [],
    TotalAssets: [],
    TotalLiabilities: []
  };
  
  try {
    // Extract revenue data
    const revenueData = data.facts?.us_gaap?.Revenue?.units?.USD || [];
    processedData.Revenue = revenueData
      .filter(item => item.form === '10-K') // Only annual reports
      .map(item => ({
        date: item.end,
        value: item.val
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract net income data
    const netIncomeData = data.facts?.us_gaap?.NetIncomeLoss?.units?.USD || [];
    processedData.NetIncome = netIncomeData
      .filter(item => item.form === '10-K')
      .map(item => ({
        date: item.end,
        value: item.val
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract total assets
    const assetsData = data.facts?.us_gaap?.Assets?.units?.USD || [];
    processedData.TotalAssets = assetsData
      .filter(item => item.form === '10-K')
      .map(item => ({
        date: item.end,
        value: item.val
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract total liabilities
    const liabilitiesData = data.facts?.us_gaap?.Liabilities?.units?.USD || [];
    processedData.TotalLiabilities = liabilitiesData
      .filter(item => item.form === '10-K')
      .map(item => ({
        date: item.end,
        value: item.val
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error processing financial data:', error);
  }
  
  return processedData;
}

export default FinancialCharts;