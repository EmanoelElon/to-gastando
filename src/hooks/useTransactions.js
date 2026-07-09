import { useState, useEffect } from 'react';
import { dismissBillingKey } from '../utils/billingDismissals';

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
    setTransactions(prev => {
      const target = prev.find(t => t.id === id);
      // Se era um débito automático, marca o período como dispensado para o
      // useAutoBilling não recriá-lo no próximo backfill.
      if (target?.billingKey) {
        dismissBillingKey(target.billingKey);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction
  };
}
