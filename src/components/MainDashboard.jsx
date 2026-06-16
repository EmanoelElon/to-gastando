import React, { useState } from 'react';
import { useWallets } from '../hooks/useWallets';
import { useTransactions } from '../hooks/useTransactions';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useIncome } from '../hooks/useIncome';
import { WalletCards, CreditCard, PiggyBank, TrendingUp, TrendingDown, Calendar, AlertCircle, PlusCircle } from 'lucide-react';
import { TransactionCard } from './TransactionCard';
import { SubscriptionCard } from './SubscriptionCard';
import { TransactionForm } from './TransactionForm';
import { SubscriptionForm } from './SubscriptionForm';
import { WalletForm } from './WalletForm';

export function MainDashboard() {
  const [activeForm, setActiveForm] = useState(null);

  const { wallets, addWallet } = useWallets();
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const { subscriptions, addSubscription } = useSubscriptions();
  const { income } = useIncome();

  // 1. Saldos por Tipo de Carteira
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
  const investmentBalance = getBalanceByType('investment');

  // 2. Visão do Mês Atual
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let thisMonthIncome = 0;
  let thisMonthExpense = 0;

  transactions.forEach(t => {
    if (!t.date) return;
    const tDate = new Date(t.date);
    // Usa UTC para extrair o mês correto evitando fuso horário
    if (tDate.getUTCFullYear() === currentYear && tDate.getUTCMonth() === currentMonth) {
      const val = parseFloat(t.amount) || 0;
      if (t.type === 'income') thisMonthIncome += val;
      else thisMonthExpense += val;
    }
  });

  // 3. Comprometimento de Renda
  const totalMonthlySubscriptions = subscriptions.reduce((acc, sub) => {
    const price = parseFloat(sub.price) || 0;
    if (sub.cycle === 'monthly') return acc + price;
    if (sub.cycle === 'annual') return acc + (price / 12);
    return acc;
  }, 0);

  const percentageSpent = income && income > 0 ? ((totalMonthlySubscriptions / income) * 100).toFixed(1) : 0;

  // 4. Próximos Vencimentos
  // Algoritmo simples: Ordenar as assinaturas mensais cujo dueDay > currentDay
  const currentDay = today.getDate();
  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      if (sub.cycle === 'monthly') {
        const due = parseInt(sub.dueDay) || 1;
        return due >= currentDay; // Vence ainda este mês a partir de hoje
      }
      return false; // Simplificando para mostrar apenas as mensais próximas
    })
    .sort((a, b) => (parseInt(a.dueDay) || 1) - (parseInt(b.dueDay) || 1))
    .slice(0, 3); // Pega as 3 próximas

  // 5. Últimas Movimentações globais
  const recentTransactions = [...transactions].reverse().slice(0, 5);

  return (
    <div className="animate-fade-in">

      {/* Botões de Ação Rápida */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="outline" onClick={() => setActiveForm('transaction')}>
          <PlusCircle size={20} /> Lançar Transação
        </button>
        <button className="outline" onClick={() => setActiveForm('subscription')}>
          <PlusCircle size={20} /> Nova Conta
        </button>
        <button className="outline" onClick={() => setActiveForm('wallet')}>
          <PlusCircle size={20} /> Nova Carteira
        </button>
      </div>

      {activeForm === 'transaction' && (
        <TransactionForm
          onSave={(data) => {
            addTransaction(data);
            setActiveForm(null);
          }}
          onClose={() => setActiveForm(null)}
        />
      )}

      {activeForm === 'subscription' && (
        <SubscriptionForm
          onSave={(data) => {
            addSubscription(data);
            setActiveForm(null);
          }}
          onClose={() => setActiveForm(null)}
        />
      )}

      {activeForm === 'wallet' && (
        <WalletForm
          onSave={(data) => {
            addWallet(data);
            setActiveForm(null);
          }}
          onClose={() => setActiveForm(null)}
        />
      )}

      {/* 1. Saldos por Tipo */}
      <h3 className="text-lg text-secondary mb-4">Seus Saldos</h3>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass p-5 flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#6366f1' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-secondary text-sm m-0">Conta Corrente (Débito)</p>
            <WalletCards size={18} style={{ color: '#6366f1' }} />
          </div>
          <h2 className="text-2xl m-0" style={{ color: debitBalance < 0 ? '#ef4444' : '#6366f1' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debitBalance)}
          </h2>
        </div>

        <div className="glass p-5 flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#f59e0b', animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-secondary text-sm m-0">Faturas (Crédito)</p>
            <CreditCard size={18} style={{ color: '#f59e0b' }} />
          </div>
          <h2 className="text-2xl m-0" style={{ color: creditBalance < 0 ? '#ef4444' : '#f59e0b' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditBalance)}
          </h2>
        </div>

        <div className="glass p-5 flex flex-col justify-between border-l-4" style={{ borderLeftColor: '#10b981', animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-secondary text-sm m-0">Investimentos</p>
            <PiggyBank size={18} style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-2xl m-0" style={{ color: investmentBalance < 0 ? '#ef4444' : '#10b981' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investmentBalance)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* 2 e 3. Visão do Mês e Renda */}
        <div className="flex flex-col gap-4 lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg text-secondary mb-4">Fluxo deste Mês</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-5 flex items-center justify-between border-l-4" style={{ borderLeftColor: '#10b981' }}>
                <div className='w-full'>
                  <div className="flex gap-2 justify-between items-center p-2 rounded-full" style={{ color: '#10b981' }}>
                    <p className="text-secondary text-sm">Entradas</p>
                    <TrendingUp size={24} />
                  </div>
                  <h2 className="text-xl" style={{ color: '#10b981' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(thisMonthIncome)}
                  </h2>
                </div>

              </div>
              <div className="glass p-5 flex items-center justify-between border-l-4" style={{ borderLeftColor: '#ef4444' }}>
                <div className='w-full'>
                  <div className="w-full flex gap-2 justify-between items-center p-2 rounded-full" style={{  color: '#ef4444' }}>
                    <p className="text-secondary text-sm">Saídas</p>
                    <TrendingDown size={24} />
                  </div>
                  <h2 className="text-xl" style={{ color: '#ef4444' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(thisMonthExpense)}
                  </h2>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg text-secondary mb-4">Comprometimento de Renda</h3>
            <div className="glass p-6 animate-fade-in flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Sua Renda Mensal</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income || 0)}
                  </h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-secondary text-sm mb-1">Custo Fixo Mensal</p>
                <div className={`text-xl font-bold ${percentageSpent > 30 ? 'text-danger-color' : 'text-accent'}`}>
                  {percentageSpent}%
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. Próximos Vencimentos */}
        <div className="space-y-4">
          <h3 className="text-lg text-secondary mb-4">Próximos Vencimentos</h3>
          {upcomingSubscriptions.length === 0 ? (
            <div className="glass p-6 text-center text-secondary">
              <p>Nenhuma conta fixa para vencer em breve.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingSubscriptions.map(sub => (
                <div key={sub.id} className="glass p-4 flex justify-between items-center border-l-2 border-accent-color">
                  <div>
                    <h4 className="m-0 text-md">{sub.name}</h4>
                    <p className="text-xs text-secondary m-0 mt-1 flex items-center gap-1">
                      <Calendar size={12} /> Vence dia {sub.dueDay}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.price)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 5. Últimas Transações */}
      <section>
        <h3 className="text-lg text-secondary mb-4">Últimas Movimentações</h3>
        {recentTransactions.length === 0 ? (
          <div className="glass p-6 text-center text-secondary">
            <p>Nenhuma transação registrada ainda.</p>
          </div>
        ) : (
          <div className="grid gap-0">
            {recentTransactions.map(t => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
