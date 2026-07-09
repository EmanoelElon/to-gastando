import { useState, useEffect } from 'react';
import { useWallets } from '../hooks/useWallets';

export function SubscriptionForm({ initialData, onSave, onClose }) {
  const { wallets } = useWallets();

  const [activeTab, setActiveTab] = useState(initialData?.cycle || 'monthly');

  const [formData, setFormData] = useState(initialData || {
    name: '',
    price: '',
    category: 'Entretenimento',
    cycle: 'monthly',
    dueDate: '',
    dueMonth: '1',
    dueDay: '1',
    description: '',
    walletId: wallets.length > 0 ? wallets[0].id : ''
  });

  useEffect(() => {
    if (initialData) {
      setActiveTab(initialData.cycle || 'monthly');
      setFormData({
        ...initialData,
        dueMonth: initialData.dueMonth || (initialData.dueDate ? initialData.dueDate.split('-')[1] : '1'),
        dueDay: initialData.dueDay || (initialData.dueDate ? initialData.dueDate.split('-')[2] : '1'),
        walletId: initialData.walletId || (wallets.length > 0 ? wallets[0].id : '')
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'Entretenimento',
        cycle: activeTab,
        dueDate: '',
        dueMonth: '1',
        dueDay: '1',
        description: '',
        walletId: wallets.length > 0 ? wallets[0].id : ''
      });
    }
  }, [initialData, wallets, activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.walletId) return;
    onSave({ ...formData, cycle: activeTab });
    onClose();
  };

  if (wallets.length === 0) {
    return (
      <div className="glass p-6 animate-fade-in mb-8 border-l-4 border-accent-color">
        <h3 className="text-xl mb-2 text-accent">Nenhuma Carteira Encontrada</h3>
        <p className="text-secondary mb-4">Você precisa criar uma Carteira (ex: Cartão de Crédito) antes de cadastrar uma conta fixa, para saber de onde ela será cobrada.</p>
        <div className="flex justify-end">
          <button type="button" className="outline" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 animate-fade-in mb-4">
      <h3 className="mb-4">{initialData ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}</h3>
      
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
        <button 
          type="button"
          className={`px-4 py-2 bg-transparent ${activeTab === 'monthly' ? 'page-selected text-white border-b-2 bg-white border-accent-color' : 'text-white hover:text-white'}`}
          style={{ borderRadius: 0, paddingBottom: '0.5rem' }}
          onClick={() => { setActiveTab('monthly'); setFormData({...formData, cycle: 'monthly'}) }}
        >
          Plano Mensal
        </button>
        <button 
          type="button"
          className={`px-4 py-2 text-white bg-transparent ${activeTab === 'annual' ? 'page-selected text-white border-b-2 border-accent-color' : 'text-white hover:text-white'}`}
          style={{ borderRadius: 0, paddingBottom: '0.5rem' }}
          onClick={() => { setActiveTab('annual'); setFormData({...formData, cycle: 'annual'}) }}
        >
          Plano Anual
        </button>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-secondary mb-1 block">Categoria</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="Entretenimento">Entretenimento</option>
              <option value="Serviços">Serviços</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary mb-1 block">Carteira de Cobrança</label>
            <select 
              value={formData.walletId}
              onChange={(e) => setFormData({...formData, walletId: e.target.value})}
              required
            >
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          {activeTab === 'monthly' ? (
            <div>
              <label className="text-sm text-secondary mb-1 block">Dia do Vencimento (1 a 31)</label>
              <input 
                type="number" 
                min="1"
                max="31"
                placeholder="Ex: 15"
                value={formData.dueDay}
                onChange={(e) => setFormData({...formData, dueDay: e.target.value})}
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-secondary mb-1 block">Dia do Vencimento</label>
                <input 
                  type="number" 
                  min="1"
                  max="31"
                  placeholder="Ex: 15"
                  value={formData.dueDay}
                  onChange={(e) => setFormData({...formData, dueDay: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-secondary mb-1 block">Mês do Vencimento</label>
                <select 
                  value={formData.dueMonth}
                  onChange={(e) => setFormData({...formData, dueMonth: e.target.value})}
                  required
                >
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-secondary mb-1 block">Descrição (opcional)</label>
          <textarea 
            placeholder="Ex: Conta de luz, internet, etc." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <button type="button" className="outline" onClick={onClose}>Cancelar</button>
          <button type="submit">Salvar Conta Fixa</button>
        </div>
      </form>
    </div>
  );
}
