import React, { useState } from 'react';
import { PlusCircle, WalletCards, CreditCard, PiggyBank, ArrowLeft } from 'lucide-react';
import { useWallets } from '../hooks/useWallets';
import { useTransactions } from '../hooks/useTransactions';
import { WalletForm } from './WalletForm';
import { TransactionCard } from './TransactionCard';

export function WalletsView() {
  const { wallets, addWallet, deleteWallet } = useWallets();
  const { transactions, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  // Calcula o saldo atual de cada carteira
  const getWalletBalance = (walletId, initialBalance, type) => {
    const walletTransactions = transactions.filter(t => t.walletId === walletId);
    let balance = parseFloat(initialBalance) || 0;

    walletTransactions.forEach(t => {
      const amount = parseFloat(t.amount) || 0;
      if (t.type === 'income') balance += amount;
      if (t.type === 'expense') balance -= amount;
    });

    return balance;
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'credit': return <CreditCard size={24} style={{ color: '#f59e0b' }} />;
      case 'investment': return <PiggyBank size={24} style={{ color: '#10b981' }} />;
      case 'debit':
      default: return <WalletCards size={24} style={{ color: '#6366f1' }} />;
    }
  };

  const getWalletColor = (type) => {
    switch (type) {
      case 'credit': return '#f59e0b';
      case 'investment': return '#10b981';
      case 'debit':
      default: return '#6366f1';
    }
  };

  // Visão de Detalhe de uma Carteira
  if (selectedWalletId) {
    const wallet = wallets.find(w => w.id === selectedWalletId);
    if (!wallet) {
      setSelectedWalletId(null);
      return null;
    }

    const currentBalance = getWalletBalance(wallet.id, wallet.initialBalance, wallet.type);
    const walletColor = getWalletColor(wallet.type);
    const walletTransactions = transactions.filter(t => t.walletId === wallet.id);

    return (
      <div className="animate-fade-in">
        <button className="outline mb-6" onClick={() => setSelectedWalletId(null)}>
          <ArrowLeft size={16} className="mr-2" style={{ display: 'inline' }} />
          Voltar para Carteiras
        </button>

        <div className="glass p-5 mb-8 border-t-4" style={{ borderTopColor: walletColor }}>
          <div className="flex justify-between items-center ">
            <div className="flex flex-row gap-4">
              <div className="p-3 rounded-full bg-white/5">
                {getWalletIcon(wallet.type)}
              </div>
              <div className='flex items-center m-0'>
                <h2 className="text-3xl m-b-0">{wallet.name}</h2>
              </div>
              <div className="ml-4">
                <p className="text-secondary uppercase text-sm font-bold tracking-wider">{wallet.type}</p>
              </div>
            </div>
            <button className="danger outline" onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir esta carteira e perder o vínculo com as transações dela?')) {
                deleteWallet(wallet.id);
                setSelectedWalletId(null);
              }
            }}>Excluir Carteira</button>
          </div>

          <div className="mt-6">
            <p className="text-secondary text-sm">Saldo Atual</p>
            <h1 className="text-5xl font-bold" style={{ color: currentBalance < 0 ? '#ef4444' : walletColor }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentBalance)}
            </h1>
          </div>
        </div>

        <h3 className="text-xl mb-4 border-b border-white/10 pb-2">Histórico desta Carteira</h3>

        {walletTransactions.length === 0 ? (
          <div className="glass p-8 text-center text-secondary">
            <p>Nenhuma transação registrada nesta carteira ainda.</p>
          </div>
        ) : (
          <div className="grid gap-0">
            {[...walletTransactions].reverse().map(t => (
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

  // Visão Geral das Carteiras
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl m-0">Suas Carteiras</h2>
        <button className="w-full md:w-auto justify-center" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} />
          Nova Carteira
        </button>
      </div>

      {showForm && (
        <WalletForm
          onSave={(data) => {
            addWallet(data);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {wallets.length === 0 ? (
        <div className="glass p-5 text-center text-secondary">
          <p>Você ainda não possui nenhuma carteira. Crie uma para começar a lançar transações!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map(w => {
            const balance = getWalletBalance(w.id, w.initialBalance, w.type);
            const color = getWalletColor(w.type);
            return (
              <div
                key={w.id}
                className="glass p-5 animate-fade-in cursor-pointer hover:border-white/20 transition-all border-l-4"
                style={{ borderLeftColor: color }}
                onClick={() => setSelectedWalletId(w.id)}
              >
                <div className="flex gap-4 justify-start items-start">
                  <div className="m-0 p-2 rounded-full bg-white/5">
                    {getWalletIcon(w.type)}
                  </div>
                  <div className='flex gap-4'>
                    <h3 className="text-lg">{w.name}</h3>
                    {/* <h4 className='m-b-0 text-secondary text-xs uppercase font-bold'></h4> */}
                    <span className='text-secondary text-xs uppercase font-bold'>{w.type}</span>
                    

                  </div>
                </div>
                <div>
                  <p className="text-secondary text-sm">Saldo Atual</p>
                  <h2 className="text-2xl" style={{ color: balance < 0 ? '#ef4444' : color }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
