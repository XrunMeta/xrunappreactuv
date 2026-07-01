

import { useEffect, useState } from 'react';
import { detectLegacyEntries } from '../services/walletKeyStore';

export function useLegacyVaultSweep(
  justLoggedIn: boolean,
  email: string,
  member: number,
): { needsPinUpgrade: boolean } {
  const [needsPinUpgrade, setNeeds] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!justLoggedIn) return; 
    (async () => {
      const legacy = await detectLegacyEntries(email, member);
      if (alive && legacy) setNeeds(true);
    })();
    return () => {
      alive = false;
    };
  }, [justLoggedIn, email, member]);

  return { needsPinUpgrade };
}
