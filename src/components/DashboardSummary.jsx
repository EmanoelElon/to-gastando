import React from 'react';
import { DollarSign, Calendar, Wallet, Pencil } from 'lucide-react';

export function DashboardSummary({ subscriptions, income, onEditIncome }) {
  // Calculate equivalent costs
  const { totalMonthly, totalAnnual } = subscriptions.reduce((acc, sub) => {
    const price = parseFloat(sub.price) || 0;
    if (sub.cycle === 'monthly') {
      acc.totalMonthly += price;
      acc.totalAnnual += price * 12;
    } else if (sub.cycle === 'annual') {
      acc.totalAnnual += price;
      acc.totalMonthly += price / 12;
    }
    return acc;
  }, { totalMonthly: 0, totalAnnual: 0 });

  const percentageSpent = income && income > 0 ? ((totalMonthly / income) * 100).toFixed(1) : 0;

  return (
    <>
      {income !== null && (
        <div className="glass p-6 animate-fade-in flex items-center justify-between mb-4">
          <div>
            <p className="text-secondary text-sm">Sua Renda Mensal</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
              </h2>
              <button className="outline" style={{ padding: '0.25rem' }} onClick={onEditIncome} aria-label="Editar Renda">
                <Pencil size={14} />
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-secondary text-sm mb-1">Comprometido</p>
            <div className={`text-xl font-bold ${percentageSpent > 30 ? 'text-danger-color' : 'text-accent'}`}>
              {percentageSpent}%
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
        <div className="glass p-6 animate-fade-in flex items-center justify-between" style={{ animationDelay: '0.1s' }}>
          <div>
            <p className="text-secondary text-sm">Gasto Mensal Estimado</p>
            <h2 className="text-accent text-3xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthly)}
            </h2>
          </div>
          <div className="p-3 bg-accent-color/10 rounded-full text-accent">
            <DollarSign size={32} />
          </div>
        </div>
        <div className="glass p-6 animate-fade-in flex items-center justify-between" style={{ animationDelay: '0.2s' }}>
          <div>
            <p className="text-secondary text-sm">Gasto Anual Estimado</p>
            <h2 className="text-3xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAnnual)}
            </h2>
          </div>
          <div className="p-3 bg-accent-color/10 rounded-full text-accent">
            <Calendar size={32} />
          </div>
        </div>
      </div>
    </>
  );
}
