
import { db } from './firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, setDoc } from 'firebase/firestore';
import { subMonths } from 'date-fns';

// Types
export type Currency = 'INR' | 'USD' | 'EUR';

export interface UserSettings {
  income: number;
  currency: Currency;
  monthlyBudget: number;
  notifications: {
    overspending: boolean;
    billReminders: boolean;
    incomeDeposits: boolean;
  };
  security: {
      twoFactorEnabled: boolean;
  }
}

export interface Transaction {
  id: string;
  userId: string;
  merchant: string;
  amount: number;
  category: string;
  date: string; // ISO string
}

const defaultSettings: UserSettings = {
    income: 0,
    currency: 'INR',
    monthlyBudget: 0,
    notifications: {
        overspending: true,
        billReminders: true,
        incomeDeposits: false
    },
    security: {
        twoFactorEnabled: false
    }
}

// User Settings Functions
export const listenToUserSettings = (userId: string, callback: (settings: UserSettings | null) => void): (() => void) => {
  const docRef = doc(db, 'users', userId);
  return onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserSettings);
    } else {
      // Create default settings for new user
      await setDoc(docRef, defaultSettings);
      callback(defaultSettings);
    }
  });
};

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, settings);
};


// Transaction Functions
export const listenToTransactions = (userId: string, callback: (transactions: Transaction[]) => void): (() => void) => {
  const sixMonthsAgo = subMonths(new Date(), 6);
  const q = query(
      collection(db, 'transactions'), 
      where('userId', '==', userId),
      where('date', '>=', sixMonthsAgo.toISOString()),
      orderBy('date', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    callback(transactions);
  });
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
  await addDoc(collection(db, 'transactions'), transaction);
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
    const docRef = doc(db, 'transactions', transactionId);
    await deleteDoc(docRef);
}
