import { Pencil, Trash2, WalletCards } from 'lucide-react';
import { useWallets } from '../hooks/useWallets';
import { formatCurrency } from '../utils/finance';

export function SubscriptionCard({ subscription, onDelete, onEdit }) {
  const { wallets } = useWallets();
  const price = parseFloat(subscription.price) || 0;
  
  const wallet = wallets.find(w => w.id === subscription.walletId);

  return (
    <div className="glass p-5 animate-fade-in flex flex-col md:flex-row md:items-center justify-between mb-4 gap-6">
      <div className="flex-1">
        <h3 className="mb-1 text-xl">{subscription.name}</h3>
        <p className="text-secondary text-sm mb-2">
          {subscription.category} • Cobrança {subscription.cycle === 'monthly' ? 'Mensal' : 'Anual'}
          {subscription.cycle === 'monthly' && subscription.dueDay && ` • Vence dia ${subscription.dueDay}`}
          {subscription.cycle === 'annual' && (
            (subscription.dueDay && subscription.dueMonth) 
              ? ` • Renova dia ${subscription.dueDay}/${subscription.dueMonth.toString().padStart(2, '0')}` 
              : (subscription.dueDate && ` • Renova em ${new Date(subscription.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`)
          )}
        </p>
        {wallet && (
          <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--accent-color)' }}>
            <WalletCards size={12} /> Cobrado em: {wallet.name}
          </p>
        )}
        {subscription.description && (
          <p className="text-secondary text-sm italic border-l-2 border-accent-color/50 pl-2 mt-2">
            "{subscription.description}"
          </p>
        )}
      </div>

      <div className="text-right flex items-center">
        <p className="text-xl font-bold">
          {formatCurrency(price)}
        </p>
        <p className="text-secondary text-xs">
          / {subscription.cycle === 'monthly' ? 'mês' : 'ano'}
        </p>
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex gap-2">
          <button
            className="outline"
            onClick={() => onEdit(subscription)}
            aria-label="Editar conta"
            style={{ padding: '0.5rem' }}
          >
            <Pencil size={20} />
          </button>
          <button
            className="danger outline"
            onClick={() => onDelete(subscription.id)}
            aria-label="Deletar conta"
            style={{ padding: '0.5rem' }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
