
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { listenToTransactions, listenToUserSettings, UserSettings, Transaction, updateUserSettings, addTransaction, deleteTransaction } from '@/lib/firestore';
import { useCurrency, Currency } from './currency-context';

interface UserDataContextType {
  transactions: Transaction[];
  settings: UserSettings | null;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'date'>) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { setCurrency } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      const unsubscribeTransactions = listenToTransactions(user.uid, setTransactions);
      const unsubscribeSettings = listenToUserSettings(user.uid, (newSettings) => {
        setSettings(newSettings);
        if (newSettings?.currency) {
          setCurrency(newSettings.currency);
        }
        setLoading(false);
      });

      return () => {
        unsubscribeTransactions();
        unsubscribeSettings();
      };
    } else {
      // Not logged in, clear data
      setTransactions([]);
      setSettings(null);
      setLoading(false);
    }
  }, [user, setCurrency]);

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    if (user && settings) {
      const updatedSettings = { ...settings, ...newSettings };
      await updateUserSettings(user.uid, updatedSettings);
    }
  };
  
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'|'userId'|'date'>) => {
      if(!user) throw new Error("User not authenticated");
      const newTransaction = {
          ...transaction,
          userId: user.uid,
          date: new Date().toISOString(),
      }
      await addTransaction(newTransaction);
  }
  
  const handleDeleteTransaction = async (transactionId: string) => {
      if(!user) throw new Error("User not authenticated");
      await deleteTransaction(transactionId);
  }

  const value = {
    transactions,
    settings,
    loading,
    addTransaction: handleAddTransaction,
    deleteTransaction: handleDeleteTransaction,
    updateSettings: handleUpdateSettings
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
