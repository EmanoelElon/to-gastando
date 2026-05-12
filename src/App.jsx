import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useIncome } from './hooks/useIncome';
import { DashboardSummary } from './components/DashboardSummary';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionCard } from './components/SubscriptionCard';
import { IncomeModal } from './components/IncomeModal';

function App() {
  const { subscriptions, addSubscription, deleteSubscription, updateSubscription } = useSubscriptions();
  const { income, saveIncome } = useIncome();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

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

      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-1 text-accent">To Gastando</h1>
          <p className="text-secondary">Gerencie suas assinaturas de forma inteligente</p>
        </div>
      </header>

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
          <h2 className="mb-4 text-xl border-b border-white/10 pb-2">Suas Assinaturas</h2>
          <button className='mb-4' onClick={handleAddNew}>
            <PlusCircle size={20} />
            Nova Assinatura
          </button>

        </div>
        {subscriptions.length === 0 ? (
          <div className="glass p-8 text-center text-secondary">
            <p>Nenhuma assinatura cadastrada. Clique em "Nova Assinatura" para começar.</p>
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
    </div>
  );
}

export default App;
