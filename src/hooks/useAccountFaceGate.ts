

import { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_80fa10 } from 'rcmrninabrnb';
import { v_31ecf2 } from '../services/faceAccount';

export function v_972604(): boolean {
  return !!(v_80fa10.CameraView || v_80fa10.CameraDevices || (global as any).VisionCameraProxy);
}

export function v_c9b96f(v_f8b770): { needs: boolean; refresh: () => void } {
  const [v_ce5d84, v_0bc5b7] = v_5ab095(false);
  const [v_9a5f22, v_6d48d1] = v_5ab095(0);

  v_c4deb2(() => {
    if (!v_f8b770 || !v_972604()) {
      v_0bc5b7(false);
      return;
    }
    let v_759436 = true;
    v_31ecf2()
      .then((v_fd5f43) => {
        if (v_759436) v_0bc5b7(v_fd5f43.enabled === true && (v_fd5f43.faceStatus ?? 'none') === 'none');
      })
      .catch((v_9e86fd) => {
        console.warn('[account-face] status failed (gate skip):', (v_9e86fd as Error).message);
        if (v_759436) v_0bc5b7(false);
      });
    return () => {
      v_759436 = false;
    };
  }, [v_f8b770, v_9a5f22]);

  return { needs: v_ce5d84, refresh: () => v_6d48d1((v_8d41d7) => v_8d41d7 + 1) };
}
