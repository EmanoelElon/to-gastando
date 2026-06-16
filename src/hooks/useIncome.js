import { useState, useEffect } from 'react';

export function useIncome() {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('user_income');
    return saved ? parseFloat(saved) : null;
  });

  const saveIncome = (value) => {
    const numValue = parseFloat(value);
    setIncome(numValue);
  };

  useEffect(() => {
    if (income !== null) {
      localStorage.setItem('user_income', income.toString());
    } else {
      localStorage.removeItem('user_income');
    }
  }, [income]);

  return { income, saveIncome };
}
