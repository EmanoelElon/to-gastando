import { useState, useEffect } from 'react';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (sub) => {
    setSubscriptions(prev => [...prev, { ...sub, id: crypto.randomUUID() }]);
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const updateSubscription = (id, updatedSub) => {
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...updatedSub, id } : sub));
  };

  return {
    subscriptions,
    addSubscription,
    deleteSubscription,
    updateSubscription
  };
}
