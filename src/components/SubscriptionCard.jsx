import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

export function SubscriptionCard({ subscription, onDelete, onEdit }) {
  const price = parseFloat(subscription.price) || 0;
  
  return (
    <div className="glass p-6 animate-fade-in flex flex-col mb-4 gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl">{subscription.name}</h3>
          <p className="text-secondary text-sm mb-2">
            {subscription.category} • Cobrança {subscription.cycle === 'monthly' ? 'Mensal' : 'Anual'}
            {subscription.dueDate && ` • Vence em: ${new Date(subscription.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}
          </p>
          {subscription.description && (
            <p className="text-secondary text-sm italic border-l-2 border-accent-color/50 pl-2 mt-2">
              "{subscription.description}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
          </p>
          <p className="text-secondary text-xs">
            / {subscription.cycle === 'monthly' ? 'mês' : 'ano'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            className="outline" 
            onClick={() => onEdit(subscription)}
            aria-label="Editar assinatura"
            style={{ padding: '0.5rem' }}
          >
            <Pencil size={20} />
          </button>
          <button 
            className="danger outline" 
            onClick={() => onDelete(subscription.id)}
            aria-label="Deletar assinatura"
            style={{ padding: '0.5rem' }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
