import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function TransactionCard({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income';
  const amount = parseFloat(transaction.amount) || 0;

  return (
    <div className="glass p-5 animate-fade-in flex items-center justify-between mb-3 border-l-4" 
         style={{ borderLeftColor: isIncome ? '#10b981' : '#ef4444' }}>
      <div className="flex gap-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`} style={{ color: isIncome ? '#10b981' : '#ef4444'}}>
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>
        <div>
          <h3 className="text-lg mb-0">{transaction.description}</h3>
          <p className="text-secondary text-xs">
            {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-lg font-bold`} style={{ color: isIncome ? '#10b981' : '#ef4444' }}>
            {isIncome ? '+' : '-'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
          </p>
        </div>
        <button 
          className="danger outline" 
          onClick={() => onDelete(transaction.id)}
          aria-label="Deletar transação"
          style={{ padding: '0.4rem' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
