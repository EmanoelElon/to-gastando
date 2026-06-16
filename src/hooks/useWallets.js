import { useState, useEffect } from 'react';

export function useWallets() {
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('user_wallets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_wallets', JSON.stringify(wallets));
  }, [wallets]);

  const addWallet = (wallet) => {
    setWallets(prev => [...prev, { ...wallet, id: crypto.randomUUID() }]);
  };

  const deleteWallet = (id) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  const updateWallet = (id, updatedWallet) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...updatedWallet, id } : w));
  };

  return {
    wallets,
    addWallet,
    deleteWallet,
    updateWallet
  };
}
