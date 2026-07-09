import { useEffect, useRef } from 'react';
import { getDismissedBillingKeys } from '../utils/billingDismissals';

// Quantos meses/anos olhar para trás em busca do último período resolvido.
// Limita o backfill para não gerar um histórico absurdo caso o billingKey nunca exista.
const MAX_LOOKBACK_MONTHS = 24;
const MAX_LOOKBACK_YEARS = 5;

function monthlyBillingKey(subId, year, month) {
  return `bill_${subId}_${year}_${month}`;
}

function annualBillingKey(subId, year) {
  return `bill_${subId}_${year}_annual`;
}

// Um período é "resolvido" se já existe uma transação com essa key OU se o usuário
// deletou a cobrança de propósito (key na lista de dispensadas). Nos dois casos não
// deve ser recriado.
function isResolved(key, transactions, dismissedKeys) {
  return dismissedKeys.has(key) || transactions.some(t => t.billingKey === key);
}

// Encontra o mês mais recente (antes do atual) já resolvido para esta assinatura.
// Retorna null se não houver nenhum registro anterior (assinatura nova).
function findLastResolvedMonth(subId, transactions, dismissedKeys, currentYear, currentMonth) {
  for (let i = 1; i <= MAX_LOOKBACK_MONTHS; i++) {
    let month = currentMonth - i;
    let year = currentYear;
    while (month < 0) {
      month += 12;
      year -= 1;
    }
    if (isResolved(monthlyBillingKey(subId, year, month), transactions, dismissedKeys)) {
      return { year, month };
    }
  }
  return null;
}

function findLastResolvedYear(subId, transactions, dismissedKeys, currentYear) {
  for (let i = 1; i <= MAX_LOOKBACK_YEARS; i++) {
    const year = currentYear - i;
    if (isResolved(annualBillingKey(subId, year), transactions, dismissedKeys)) {
      return year;
    }
  }
  return null;
}

export function useAutoBilling(subscriptions, transactions, addTransaction) {
  // Evita reprocessar o mesmo par (subscriptions, transactions) duas vezes seguidas —
  // o StrictMode do React roda todo efeito de montagem duas vezes em desenvolvimento,
  // com o mesmo estado, o que duplicaria as transações de backfill sem essa guarda.
  const lastProcessedRef = useRef({ subscriptions: null, transactions: null });

  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) return;

    if (
      lastProcessedRef.current.subscriptions === subscriptions &&
      lastProcessedRef.current.transactions === transactions
    ) {
      return;
    }
    lastProcessedRef.current = { subscriptions, transactions };

    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    const dismissedKeys = new Set(getDismissedBillingKeys());
    let newTransactions = [];

    const alreadyResolved = (key) =>
      dismissedKeys.has(key) ||
      transactions.some(t => t.billingKey === key) ||
      newTransactions.some(t => t.billingKey === key);

    const queueBill = (sub, key, billDateObj) => {
      if (alreadyResolved(key)) return;
      newTransactions.push({
        type: 'expense',
        amount: sub.price,
        description: `Débito Automático: ${sub.name}`,
        date: billDateObj.toISOString().split('T')[0],
        walletId: sub.walletId,
        billingKey: key
      });
    };

    subscriptions.forEach(sub => {
      // Se a assinatura não tem carteira vinculada, não tem como debitar
      if (!sub.walletId) return;

      if (sub.cycle === 'monthly') {
        const dueDay = parseInt(sub.dueDay) || 1;

        // Só preenche meses retroativos se já existir ao menos um período resolvido
        // anterior para esta assinatura — evita inventar histórico para uma assinatura nova.
        const lastResolved = findLastResolvedMonth(sub.id, transactions, dismissedKeys, currentYear, currentMonth);
        let year = lastResolved ? lastResolved.year : currentYear;
        let month = lastResolved ? lastResolved.month + 1 : currentMonth;
        if (month > 11) {
          month = 0;
          year += 1;
        }

        while (year < currentYear || (year === currentYear && month <= currentMonth)) {
          const isCurrentMonth = year === currentYear && month === currentMonth;
          const dueDatePassed = !isCurrentMonth || currentDay >= dueDay;

          if (dueDatePassed) {
            queueBill(sub, monthlyBillingKey(sub.id, year, month), new Date(year, month, dueDay));
          }

          month += 1;
          if (month > 11) {
            month = 0;
            year += 1;
          }
        }
      } else if (sub.cycle === 'annual') {
        let dueMonth, dueDay;

        if (sub.dueMonth && sub.dueDay) {
          dueMonth = parseInt(sub.dueMonth) - 1; // 0-based for JS Date
          dueDay = parseInt(sub.dueDay);
        } else if (sub.dueDate) {
          // Retrocompatibilidade
          const dueDateObj = new Date(sub.dueDate);
          dueMonth = dueDateObj.getUTCMonth();
          dueDay = dueDateObj.getUTCDate();
        } else {
          return;
        }

        const lastResolvedYear = findLastResolvedYear(sub.id, transactions, dismissedKeys, currentYear);
        const startYear = lastResolvedYear ? lastResolvedYear + 1 : currentYear;

        for (let year = startYear; year <= currentYear; year++) {
          const isCurrentYear = year === currentYear;
          const dueDatePassed = !isCurrentYear ||
            currentMonth > dueMonth ||
            (currentMonth === dueMonth && currentDay >= dueDay);

          if (dueDatePassed) {
            queueBill(sub, annualBillingKey(sub.id, year), new Date(year, dueMonth, dueDay));
          }
        }
      }
    });

    // Se encontrou transações pendentes, adiciona todas
    if (newTransactions.length > 0) {
      newTransactions.forEach(t => addTransaction(t));
    }

  }, [subscriptions, transactions, addTransaction]);
}
