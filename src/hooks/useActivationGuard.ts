'use client';

import { useState } from 'react';
import { useWallet } from '@/components/WalletProvider';

/**
 * Hook qui vérifie si le compte est activé avant d'exécuter une action.
 * Si le compte est en attente, ouvre le popup de premier dépôt.
 *
 * Usage :
 *   const { guardAction, showDepositModal, closeDepositModal } = useActivationGuard();
 *   <button onClick={() => guardAction(() => doSomething())} />
 */
export function useActivationGuard() {
  const { user } = useWallet();
  const [showDepositModal, setShowDepositModal] = useState(false);

  const isActivated = user?.status === 'active';

  function guardAction(action: () => void) {
    if (!isActivated) {
      setShowDepositModal(true);
      return;
    }
    action();
  }

  function closeDepositModal() {
    setShowDepositModal(false);
  }

  return { isActivated, guardAction, showDepositModal, closeDepositModal };
}
