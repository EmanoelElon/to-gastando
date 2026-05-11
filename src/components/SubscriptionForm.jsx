import React, { useState, useEffect } from 'react';

export function SubscriptionForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    price: '',
    cycle: 'monthly',
    category: 'Entretenimento',
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: '',
        cycle: 'monthly',
        category: 'Entretenimento',
        dueDate: '',
        description: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="glass p-6 animate-fade-in mb-4">
      <h3 className="mb-4">{initialData ? 'Editar Assinatura' : 'Nova Assinatura'}</h3>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="text-sm text-secondary mb-1 block">Nome do Serviço</label>
          <input 
            type="text" 
            placeholder="Ex: Netflix" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1 block">Preço (R$)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm text-secondary mb-1 block">Ciclo de Cobrança</label>
            <select 
              value={formData.cycle}
              onChange={(e) => setFormData({...formData, cycle: e.target.value})}
            >
              <option value="monthly">Mensal</option>
              <option value="annual">Anual</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1 block">Categoria</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Entretenimento">Entretenimento</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Utilidades">Utilidades</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1 block">Data de Vencimento/Renovação</label>
            <input 
              type="date" 
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-secondary mb-1 block">Descrição (opcional)</label>
          <textarea 
            placeholder="Ex: Assinatura para assistir séries com a família" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <button type="button" className="outline" onClick={onClose}>Cancelar</button>
          <button type="submit">Salvar Assinatura</button>
        </div>
      </form>
    </div>
  );
}
