// src/components/ErrorDisplay.js
import React from 'react';
import { useError } from '../contexts/ErrorContext';
import { X } from 'lucide-react';

const ErrorDisplay = () => {
  const { errors, dismissError } = useError();
  
  if (errors.length === 0) return null;
  
  return (
    <div className="error-display">
      {errors.map(error => (
        <div key={error.id} className="error-toast">
          <div className="error-content">
            <p className="error-message">{error.message}</p>
            {error.source && <p className="error-source">{error.source}</p>}
          </div>
          <button 
            className="error-dismiss"
            onClick={() => dismissError(error.id)}
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorDisplay;