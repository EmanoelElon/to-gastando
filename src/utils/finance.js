export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

export function getBalanceByType(type, wallets, transactions) {
  const typeWallets = wallets.filter(w => w.type === type);
  let balance = typeWallets.reduce((acc, w) => acc + (parseFloat(w.initialBalance) || 0), 0);

  transactions.forEach(t => {
    const wallet = wallets.find(w => w.id === t.walletId);
    if (wallet && wallet.type === type) {
      const val = parseFloat(t.amount) || 0;
      if (t.type === 'income') balance += val;
      else balance -= val;
    }
  });

  return balance;
}

export function getWalletBalance(walletId, initialBalance, transactions) {
  const walletTransactions = transactions.filter(t => t.walletId === walletId);
  let balance = parseFloat(initialBalance) || 0;

  walletTransactions.forEach(t => {
    const amount = parseFloat(t.amount) || 0;
    if (t.type === 'income') balance += amount;
    if (t.type === 'expense') balance -= amount;
  });

  return balance;
}

export function getSubscriptionTotals(subscriptions) {
  return subscriptions.reduce((acc, sub) => {
    const price = parseFloat(sub.price) || 0;
    if (sub.cycle === 'monthly') {
      acc.totalMonthly += price;
      acc.totalAnnual += price * 12;
    } else if (sub.cycle === 'annual') {
      acc.totalAnnual += price;
      acc.totalMonthly += price / 12;
    }
    return acc;
  }, { totalMonthly: 0, totalAnnual: 0 });
}

export function getIncomeCommitmentPercentage(totalMonthly, income) {
  return income && income > 0 ? ((totalMonthly / income) * 100).toFixed(1) : 0;
}
