import { useState } from 'react';

export function IncomeModal({ onSave }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || isNaN(value)) return;
    onSave(value);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="glass p-6 animate-fade-in text-center" style={{ maxWidth: '450px', width: '100%', boxSizing: 'border-box' }}>
        <h2 className="text-2xl mb-2 text-accent">Bem-vindo ao To Gastando!</h2>
        <p className="text-secondary mb-6">Para te ajudar a controlar melhor seus gastos, por favor, informe sua renda mensal atual.</p>

        <form onSubmit={handleSubmit}>
          <div className="text-left mb-6">
            <label className="text-sm text-secondary mb-1 block">Sua Renda Mensal (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 5000.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="w-full justify-center">
            Começar
          </button>
        </form>
      </div>
    </div>
  );
}
