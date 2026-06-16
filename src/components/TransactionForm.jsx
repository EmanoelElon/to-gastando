import React, { useState } from 'react';
import { useWallets } from '../hooks/useWallets';

export function TransactionForm({ onSave, onClose }) {
  const { wallets } = useWallets();
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    walletId: wallets.length > 0 ? wallets[0].id : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.date || !formData.walletId) return;
    onSave(formData);
    onClose();
  };

  if (wallets.length === 0) {
    return (
      <div className="glass p-6 animate-fade-in mb-4 border-l-4 border-accent-color">
        <h3 className="text-xl mb-2 text-accent">Nenhuma Carteira Encontrada</h3>
        <p className="text-secondary mb-4">Você precisa criar uma Carteira antes de registrar uma transação.</p>
        <div className="flex justify-end">
          <button className="outline" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 animate-fade-in mb-4">
      <h3 className="mb-4">Nova Transação</h3>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button 
            type="button" 
            className={formData.type === 'income' ? '' : 'outline'} 
            style={formData.type === 'income' ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
            onClick={() => setFormData({...formData, type: 'income'})}
          >
            Entrada (+)
          </button>
          <button 
            type="button" 
            className={formData.type === 'expense' ? 'danger' : 'outline'} 
            onClick={() => setFormData({...formData, type: 'expense'})}
          >
            Saída (-)
          </button>
        </div>

        <div>
          <label className="text-sm text-secondary mb-1 block">Descrição</label>
          <input 
            type="text" 
            placeholder="Ex: Almoço, Freela, Gasolina" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm text-secondary mb-1 block">Carteira Afetada</label>
          <select 
            value={formData.walletId}
            onChange={(e) => setFormData({...formData, walletId: e.target.value})}
            required
            className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white"
          >
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1 block">Valor (R$)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1 block">Data</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button type="button" className="outline" onClick={onClose}>Cancelar</button>
          <button type="submit">Salvar Transação</button>
        </div>
      </form>
    </div>
  );
}
