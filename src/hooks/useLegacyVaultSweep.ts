

import { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_cdaed9 } from '../services/walletKeyStore';

export function v_f799e3(
  v_e2ba40,
  v_e0c7e8,
  v_660822,
): { needsPinUpgrade: boolean } {
  const [v_de8f06, v_0bc5b7] = v_5ab095(false);

  v_c4deb2(() => {
    let v_759436 = true;
    if (!v_e2ba40) return; 
    (async () => {
      const v_66ed66 = await v_cdaed9(v_e0c7e8, v_660822);
      if (v_759436 && v_66ed66) v_0bc5b7(true);
    })();
    return () => {
      v_759436 = false;
    };
  }, [v_e2ba40, v_e0c7e8, v_660822]);

  return { needsPinUpgrade: v_de8f06 };
}
