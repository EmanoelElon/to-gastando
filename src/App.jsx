import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { DashboardSummary } from './components/DashboardSummary';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionCard } from './components/SubscriptionCard';

function App() {
  const { subscriptions, addSubscription, deleteSubscription, updateSubscription } = useSubscriptions();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

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
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-1 text-accent">SubTrack</h1>
          <p className="text-secondary">Gerencie suas assinaturas de forma inteligente</p>
        </div>
        <button onClick={handleAddNew}>
          <PlusCircle size={20} />
          Nova Assinatura
        </button>
      </header>

      <DashboardSummary subscriptions={subscriptions} />

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
        <h2 className="mb-4 text-xl border-b border-white/10 pb-2">Suas Assinaturas</h2>
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
