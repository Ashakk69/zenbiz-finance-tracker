
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
  formatCompact: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency') as Currency | null;
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted) {
        localStorage.setItem('currency', currency);
    }
  }, [currency, isMounted]);

  const formatCurrency = (value: number) => {
    if (!isMounted) return ''; // or a loading state
    if (currency === 'INR') {
        return `Rs ${new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)}`;
    }
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const formatCompact = (value: number) => {
    if (!isMounted) return ''; // or a loading state
    const symbol = currency === 'INR' ? 'Rs' : (currency === 'USD' ? '$' : '€');
     if (value >= 1000) {
      return `${symbol} ${Math.round(value/1000)}k`;
    }
    return `${symbol} ${value}`;
  }

  const value = {
    currency,
    setCurrency: (newCurrency: Currency) => setCurrency(newCurrency),
    formatCurrency,
    formatCompact,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
