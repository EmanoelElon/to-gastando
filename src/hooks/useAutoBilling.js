import { useEffect } from 'react';

export function useAutoBilling(subscriptions, transactions, addTransaction) {
  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) return;

    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    let newTransactions = [];

    subscriptions.forEach(sub => {
      // Se a assinatura não tem carteira vinculada, não tem como debitar
      if (!sub.walletId) return;

      let billingKey = '';
      let shouldBill = false;
      let billingDate = today.toISOString().split('T')[0];

      if (sub.cycle === 'monthly') {
        const dueDay = parseInt(sub.dueDay) || 1;
        billingKey = `bill_${sub.id}_${currentYear}_${currentMonth}`;
        
        if (currentDay >= dueDay) {
          shouldBill = true;
          // Ajusta a data da transação para o dia exato do vencimento (se já passou)
          const billDateObj = new Date(currentYear, currentMonth, dueDay);
          billingDate = billDateObj.toISOString().split('T')[0];
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
        
        billingKey = `bill_${sub.id}_${currentYear}_annual`;
        
        if (currentMonth > dueMonth || (currentMonth === dueMonth && currentDay >= dueDay)) {
           shouldBill = true;
           const billDateObj = new Date(currentYear, dueMonth, dueDay);
           billingDate = billDateObj.toISOString().split('T')[0];
        }
      }

      if (shouldBill) {
        // Verifica se a transação E a nova transação gerada nesta rodada já possuem a key
        const alreadyBilled = transactions.some(t => t.billingKey === billingKey) || 
                              newTransactions.some(t => t.billingKey === billingKey);
        
        if (!alreadyBilled) {
          newTransactions.push({
            type: 'expense',
            amount: sub.price,
            description: `Débito Automático: ${sub.name}`,
            date: billingDate,
            walletId: sub.walletId,
            billingKey: billingKey
          });
        }
      }
    });

    // Se encontrou transações pendentes, adiciona todas
    if (newTransactions.length > 0) {
      newTransactions.forEach(t => addTransaction(t));
    }

  }, [subscriptions, transactions, addTransaction]);
}
