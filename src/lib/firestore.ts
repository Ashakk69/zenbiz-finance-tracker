
import { db } from './firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

// Types
export type Currency = 'INR' | 'USD' | 'EUR';

export interface UserSettings {
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
    currency: 'INR',
    monthlyBudget: 50000,
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
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserSettings);
    } else {
      // Create default settings for new user
      updateUserSettings(userId, defaultSettings);
      callback(defaultSettings);
    }
  });
};

export const updateUserSettings = async (userId: string, settings: UserSettings): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, settings, { merge: true });
};

// Transaction Functions
export const listenToTransactions = (userId: string, callback: (transactions: Transaction[]) => void): (() => void) => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId), orderBy('date', 'desc'));
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
