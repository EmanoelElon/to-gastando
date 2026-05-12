import { useState, useEffect } from 'react';

export function useIncome() {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('user_income');
    return saved ? parseFloat(saved) : null;
  });

  const saveIncome = (value) => {
    const numValue = parseFloat(value);
    setIncome(numValue);
    localStorage.setItem('user_income', numValue.toString());
  };

  return { income, saveIncome };
}
