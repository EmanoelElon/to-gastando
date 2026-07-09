import { DollarSign, Calendar, Pencil } from 'lucide-react';
import { formatCurrency, getSubscriptionTotals, getIncomeCommitmentPercentage } from '../utils/finance';

export function DashboardSummary({ subscriptions, income, onEditIncome }) {
  const { totalMonthly, totalAnnual } = getSubscriptionTotals(subscriptions);
  const percentageSpent = getIncomeCommitmentPercentage(totalMonthly, income);

  return (
    <>
      {income !== null && (
        <div className="glass p-6 animate-fade-in flex items-center justify-between mb-4">
          <div>
            <p className="text-secondary text-sm">Sua Renda Mensal</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl">
                {formatCurrency(income)}
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass p-6 animate-fade-in flex items-center justify-between" style={{ animationDelay: '0.1s' }}>
          <div>
            <p className="text-secondary text-sm">Gasto Mensal Estimado</p>
            <h2 className="text-accent text-3xl">
              {formatCurrency(totalMonthly)}
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
              {formatCurrency(totalAnnual)}
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
