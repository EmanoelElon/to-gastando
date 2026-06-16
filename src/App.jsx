import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useIncome } from './hooks/useIncome';
import { useTransactions } from './hooks/useTransactions';
import { useAutoBilling } from './hooks/useAutoBilling';
import { MainDashboard } from './components/MainDashboard';
import { DashboardSummary } from './components/DashboardSummary';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionCard } from './components/SubscriptionCard';
import { IncomeModal } from './components/IncomeModal';
import { TransactionsView } from './components/TransactionsView';
import { WalletsView } from './components/WalletsView';

function App() {
  const { subscriptions, addSubscription, deleteSubscription, updateSubscription } = useSubscriptions();
  const { transactions, addTransaction } = useTransactions();
  const { income, saveIncome } = useIncome();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Inicializa o motor de cobrança automática
  useAutoBilling(subscriptions, transactions, addTransaction);

  // Se não houver renda definida e não estivermos exibindo o modal, o usuário entrou a primeira vez
  const needsIncome = income === null;

  const handleSave = (data) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data);
    } else {
      addSubscription(data);
    }
    setEditingSubscription(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingSubscription(null);
    setShowForm(true);
  };

  const handleEdit = (sub) => {
    setEditingSubscription(sub);
    setShowForm(true);
  };

  return (
    <div className="w-full">
      {(needsIncome || showIncomeModal) && (
        <IncomeModal onSave={(val) => {
          saveIncome(val);
          setShowIncomeModal(false);
        }} />
      )}

      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl mb-1 text-accent">To Gastando</h1>
          <p className="text-secondary">Seu controle financeiro inteligente</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10">
        <button
          className={`px-4 py-2 bg-transparent ${activeTab === 'dashboard' ? 'page-selected text-white font-bold border-b-2 border-accent-color' : 'bg-transparent text-white hover:text-white'}`}
          style={{ borderRadius: 0 }}
          onClick={() => setActiveTab('dashboard')}
        >
          Visão Geral
        </button>
        <button
          className={`px-4 py-2 bg-transparent ${activeTab === 'subscriptions' ? 'page-selected text-white font-bold border-b-2 border-accent-color' : 'bg-transparent text-white hover:text-white'}`}
          style={{ borderRadius: 0 }}
          onClick={() => setActiveTab('subscriptions')}
        >
          Contas Fixas
        </button>
        <button
          className={`px-4 py-2 bg-transparent ${activeTab === 'transactions' ? 'page-selected text-white font-bold border-b-2 border-accent-color' : 'bg-transparent text-white hover:text-white'}`}
          style={{ borderRadius: 0 }}
          onClick={() => setActiveTab('transactions')}
        >
          Transações Diárias
        </button>
        <button
          className={`px-4 py-2 bg-transparent ${activeTab === 'wallets' ? 'page-selected text-white font-bold border-b-2 border-accent-color' : 'bg-transparent text-white hover:text-white'}`}
          style={{ borderRadius: 0 }}
          onClick={() => setActiveTab('wallets')}
        >
          Carteiras
        </button>
      </div>

      <main>
        {activeTab === 'dashboard' && <MainDashboard />}

        {activeTab === 'subscriptions' && (
          <>
            <DashboardSummary
              subscriptions={subscriptions}
              income={income}
              onEditIncome={() => setShowIncomeModal(true)}
            />

            {showForm && (
              <SubscriptionForm
                initialData={editingSubscription}
                onSave={handleSave}
                onClose={() => {
                  setShowForm(false);
                  setEditingSubscription(null);
                }}
              />
            )}

            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="mb-4 text-xl border-b border-white/10 pb-2">Suas Contas Fixas</h2>
                <button className='mb-4' onClick={handleAddNew}>
                  <PlusCircle size={20} />
                  Nova Conta Fixa
                </button>
              </div>
              {subscriptions.length === 0 ? (
                <div className="glass p-5 text-center text-secondary">
                  <p>Nenhuma conta fixa cadastrada. Clique em "Nova Conta Fixa" para começar.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {subscriptions.map(sub => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onDelete={deleteSubscription}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <TransactionsView />
        )}

        {activeTab === 'wallets' && (
          <WalletsView />
        )}
      </main>
    </div>
  );
}

export default App;
