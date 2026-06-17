import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, WalletCards } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useWallets } from '../hooks/useWallets';
import { TransactionForm } from './TransactionForm';
import { TransactionCard } from './TransactionCard';

export function TransactionsView() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const { wallets } = useWallets();
  const [showForm, setShowForm] = useState(false);

  // Calcula os totais de Entradas e Saídas gerais
  const { totalIncome, totalExpense } = transactions.reduce((acc, curr) => {
    const val = parseFloat(curr.amount) || 0;
    if (curr.type === 'income') acc.totalIncome += val;
    else acc.totalExpense += val;
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  // Calcula os saldos específicos por tipo de carteira
  const getBalanceByType = (type) => {
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
  };

  const debitBalance = getBalanceByType('debit');
  const creditBalance = getBalanceByType('credit');

  return (
    <div>
      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
                <div className='grid grid-cols-2 gap-4' style={{ gridColumn: 'span 2' }}>

          <div className="glass p-5 animate-fade-in flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#6366f1', animationDelay: '0.2s' }}>
            <p className="text-secondary text-sm mb-2">Saldo em Débito</p>
            <div className="flex justify-between items-end">
              <h2 className="text-xl m-0" style={{ color: debitBalance < 0 ? '#ef4444' : '#6366f1' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debitBalance)}
              </h2>
              <WalletCards size={20} style={{ color: '#6366f1' }} />
            </div>
          </div>

          <div className="glass p-5 animate-fade-in flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#f59e0b', animationDelay: '0.3s' }}>
            <p className="text-secondary text-sm mb-2">Saldo em Crédito</p>
            <div className="flex justify-between items-end">
              <h2 className="text-xl m-0" style={{ color: creditBalance < 0 ? '#ef4444' : '#f59e0b' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditBalance)}
              </h2>
              <WalletCards size={20} style={{ color: '#f59e0b' }} />
            </div>
          </div>

        </div>
        
        <div className='grid grid-cols-2 gap-4' style={{ gridColumn: 'span 2' }}>
          <div className="glass p-5 animate-fade-in flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#10b981' }}>
            <p className="text-secondary text-sm mb-2">Entradas (Geral)</p>
            <div className="flex justify-between items-end">
              <h2 className="text-xl m-0" style={{ color: '#10b981' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
              </h2>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
          </div>

          <div className="glass p-5 animate-fade-in flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#ef4444', animationDelay: '0.1s' }}>
            <p className="text-secondary text-sm mb-2">Saídas (Geral)</p>
            <div className="flex justify-between items-end">
              <h2 className="text-xl m-0" style={{ color: '#ef4444' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
              </h2>
              <TrendingDown size={20} style={{ color: '#ef4444' }} />
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl m-0">Histórico</h2>
        <button className="w-full md:w-auto justify-center" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} />
          Nova Transação
        </button>
      </div>

      {showForm && (
        <TransactionForm
          onSave={(data) => {
            addTransaction(data);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Lista de transações (ordenadas da mais recente para a mais antiga por padrão) */}
      {transactions.length === 0 ? (
        <div className="glass p-5 text-center text-secondary">
          <p>Nenhuma transação registrada ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {[...transactions].reverse().map(t => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onDelete={deleteTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
