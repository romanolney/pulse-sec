// src/utils/xbrlParser.js
export const parseXBRLData = (data) => {
    // Define known concepts we want to extract
    const concepts = {
      'Revenue': ['Revenue', 'RevenueFromContractWithCustomerExcludingAssessedTax'],
      'NetIncome': ['NetIncomeLoss', 'ProfitLoss'],
      'Assets': ['Assets', 'AssetsCurrent'],
      'Liabilities': ['Liabilities', 'LiabilitiesCurrent'],
      'EPS': ['EarningsPerShareBasic', 'EarningsPerShareDiluted'],
      'OperatingIncome': ['OperatingIncomeLoss'],
      'CashFlow': ['NetCashProvidedByUsedInOperatingActivities']
    };
    
    const parsed = {};
    
    // Loop through each concept and find matching data
    Object.entries(concepts).forEach(([conceptName, possibleTags]) => {
      parsed[conceptName] = [];
      
      // Try each possible tag until we find data
      for (const tag of possibleTags) {
        if (data?.facts?.us_gaap?.[tag]?.units?.USD) {
          const values = data.facts.us_gaap[tag].units.USD
            .filter(item => item.form === '10-K')
            .map(item => ({
              date: item.end,
              value: item.val,
              filed: item.filed
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          if (values.length > 0) {
            parsed[conceptName] = values;
            break;
          }
        }
      }
    });
    
    return parsed;
  };