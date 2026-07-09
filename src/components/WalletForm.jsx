import { useState } from 'react';

export function WalletForm({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'debit',
    initialBalance: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.initialBalance) return;
    onSave(formData);
    if(onClose) onClose();
  };

  return (
    <div className="glass p-6 animate-fade-in mb-4">
      <h3 className="mb-4">Nova Carteira</h3>
      <form onSubmit={handleSubmit} className="grid gap-4">
        
        <div className="grid grid-cols-3 gap-2 mb-2">
          <button 
            type="button" 
            className={formData.type === 'debit' ? '' : 'outline'} 
            style={formData.type === 'debit' ? { backgroundColor: '#6366f1', borderColor: '#6366f1' } : {}}
            onClick={() => setFormData({...formData, type: 'debit'})}
          >
            Débito
          </button>
          <button 
            type="button" 
            className={formData.type === 'credit' ? '' : 'outline'} 
            style={formData.type === 'credit' ? { backgroundColor: '#f59e0b', borderColor: '#f59e0b' } : {}}
            onClick={() => setFormData({...formData, type: 'credit'})}
          >
            Crédito
          </button>
          <button 
            type="button" 
            className={formData.type === 'investment' ? '' : 'outline'} 
            style={formData.type === 'investment' ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
            onClick={() => setFormData({...formData, type: 'investment'})}
          >
            Investimento
          </button>
        </div>

        <div>
          <label className="text-sm text-secondary mb-1 block">Nome da Carteira</label>
          <input 
            type="text" 
            placeholder="Ex: Nubank, Itaú, Rico Corretora" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm text-secondary mb-1 block">Saldo/Limite Inicial (R$)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={formData.initialBalance}
            onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
            required
          />
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button type="button" className="outline" onClick={onClose}>Cancelar</button>
          <button type="submit">Criar Carteira</button>
        </div>
      </form>
    </div>
  );
}
