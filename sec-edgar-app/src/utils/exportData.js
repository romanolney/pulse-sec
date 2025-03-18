// src/utils/exportData.js
import { saveAs } from 'file-saver';

export const exportFilingsToCSV = (filings, companyName) => {
  // Prepare CSV content
  const headers = ['Form', 'Description', 'Filing Date', 'Reporting Date', 'URL'];
  const rows = filings.map(filing => [
    filing.form,
    getFilingDescription(filing.form),
    filing.filingDate,
    filing.reportDate || '',
    `https://www.sec.gov/Archives/edgar/data/${filing.cikNumber}/${filing.accessionNumber.replace(/-/g, '')}/${filing.primaryDocument}`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${companyName}-SEC-Filings.csv`);
};