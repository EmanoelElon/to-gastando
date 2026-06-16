import { useState, useEffect } from 'react';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('user_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction
  };
}
