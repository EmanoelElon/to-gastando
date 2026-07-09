const STORAGE_KEY = 'dismissed_billing_keys';

// Quando o usuário deleta uma transação de débito automático de propósito, guardamos
// a billingKey aqui para o useAutoBilling saber que aquele período foi resolvido
// (e não deve ser recriado no próximo backfill), em vez de tratar a ausência da
// transação como "ainda não cobrado".
export function getDismissedBillingKeys() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function dismissBillingKey(billingKey) {
  const dismissed = getDismissedBillingKeys();
  if (dismissed.includes(billingKey)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, billingKey]));
}
