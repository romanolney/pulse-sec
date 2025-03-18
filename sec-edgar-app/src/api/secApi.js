import axios from 'axios';

// Sample data for testing
const DEMO_COMPANIES = [
  { name: "APPLE INC", ticker: "AAPL", cik: "0000320193" },
  { name: "MICROSOFT CORP", ticker: "MSFT", cik: "0000789019" },
  { name: "ALPHABET INC", ticker: "GOOGL", cik: "0001652044" },
  { name: "AMAZON.COM INC", ticker: "AMZN", cik: "0001018724" },
  { name: "META PLATFORMS INC", ticker: "META", cik: "0001326801" },
  { name: "TESLA INC", ticker: "TSLA", cik: "0001318605" },
  { name: "NVIDIA CORP", ticker: "NVDA", cik: "0001045810" },
  { name: "LENOVO GROUP LTD", ticker: "LNVGY", cik: "0001005870" },
  { name: "DELL TECHNOLOGIES INC", ticker: "DELL", cik: "0001571996" },
  { name: "HP INC", ticker: "HPQ", cik: "0000047217" }
];

// Search company by name or ticker (demo version)
export const searchCompany = async (query) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, just search through our hardcoded list
    const normalizedQuery = query.toLowerCase().trim();
    const matches = DEMO_COMPANIES.filter(company => 
      company.name.toLowerCase().includes(normalizedQuery) || 
      company.ticker.toLowerCase().includes(normalizedQuery)
    );
    
    if (matches.length === 0) {
      throw new Error("No companies found matching your search.");
    }
    
    return matches;
  } catch (error) {
    console.error('Error searching for company:', error);
    throw error;
  }
};

// Mock company details
export const getCompanyDetails = async (cik) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Find company in demo data
    const company = DEMO_COMPANIES.find(c => c.cik === cik);
    
    if (!company) {
      throw new Error("Company not found");
    }
    
    // Return mock company details
    return {
      name: company.name,
      cik: company.cik,
      ticker: company.ticker,
      sic: company.ticker === "LNVGY" ? "3571" : "7370",
      sicDescription: company.ticker === "LNVGY" ? "ELECTRONIC COMPUTERS" : "SERVICES-COMPUTER PROGRAMMING, DATA PROCESSING, ETC.",
      fiscalYearEnd: "1231",
      addresses: {
        business: {
          street1: "1 Example Street",
          city: "San Francisco",
          stateOrCountry: "CA",
          zipCode: "94105"
        }
      }
    };
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

// Other functions with demo implementations...
export const getCompanyFilings = async (cik) => {
  // Mock implementation...
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    recent: [
      {
        form: "10-K",
        filingDate: "2024-02-15",
        reportDate: "2023-12-31",
        accessionNumber: "0001193125-24-012345",
        primaryDocument: "d123456d10k.htm"
      },
      {
        form: "10-Q",
        filingDate: "2023-11-01",
        reportDate: "2023-09-30",
        accessionNumber: "0001193125-23-098765",
        primaryDocument: "d987654d10q.htm"
      }
      // Add more mock filings as needed
    ]
  };
};

export const getFinancialData = async (cik) => {
  // Mock implementation...
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return {
    facts: {
      us_gaap: {
        Revenue: {
          units: {
            USD: [
              {form: "10-K", end: "2023-12-31", val: 394328000000, filed: "2024-02-15"},
              {form: "10-K", end: "2022-12-31", val: 365817000000, filed: "2023-02-16"},
              {form: "10-K", end: "2021-12-31", val: 329315000000, filed: "2022-02-17"}
            ]
          }
        },
        NetIncomeLoss: {
          units: {
            USD: [
              {form: "10-K", end: "2023-12-31", val: 96995000000, filed: "2024-02-15"},
              {form: "10-K", end: "2022-12-31", val: 83032000000, filed: "2023-02-16"},
              {form: "10-K", end: "2021-12-31", val: 79223000000, filed: "2022-02-17"}
            ]
          }
        }
      }
    }
  };
};