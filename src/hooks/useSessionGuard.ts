

import { v_c4deb2, v_e662ae } from 'bapkr';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import v_a928e1 from 'yvptvjtrs';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_77f799 } from '../services/walletKeyStore';

function v_ed1ab8(v_56b352): boolean {
  try {
    const v_468545 = v_56b352.split('.');
    if (v_468545.length !== 3) return false;
    let v_8a9589 = v_468545[1].replace(/-/g, '+').replace(/_/g, '/');
    while (v_8a9589.length % 4 !== 0) v_8a9589 += '=';
    const v_7ecfd1 = v_a928e1.enc.Base64.parse(v_8a9589).toString(v_a928e1.enc.Utf8);
    const v_931bf0 = JSON.parse(v_7ecfd1);
    if (typeof v_931bf0?.exp !== 'number') return false;
    return Date.now() >= v_931bf0.exp * 1000;
  } catch (v_9e86fd) {
    console.warn('[useSessionGuard] JWT payload 디코드 실패 — 만료 판정 보류:', v_9e86fd);
    return false;
  }
}

export async function v_7195bf(): Promise<boolean> {
  try {
    const v_042a8b = await v_e84827.getItem('isLoggedIn');
    if (v_042a8b !== 'true') return false;
    return true;
  } catch (v_9e86fd) {

    console.warn('[useSessionGuard] 세션 확인 중 오류 — 유효한 것으로 간주:', v_9e86fd);
    return true;
  }
}

async function v_6606a0(): Promise<void> {
  try {
    const [v_e0c7e8, v_f24fd5] = await Promise.all([
      v_e84827.getItem('userEmail'),
      v_e84827.getItem('userData'),
    ]);
    const v_660822 = v_f24fd5 ? JSON.parse(v_f24fd5)?.member : undefined;
    if (v_e0c7e8 && typeof v_660822 === 'number') {
      v_77f799(v_e0c7e8, v_660822);
    }
  } catch (v_9e86fd) {
    console.warn('[useSessionGuard] 지갑 PIN 언락 캐시 클리어 실패 (userData 파싱):', v_9e86fd);
  }
}

export function v_6e4589(v_695063): void {
  const { t: v_8d41d7 } = v_772971();
  const { reset: v_487a25 } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const v_00b19b = v_e662ae(false);

  v_c4deb2(() => {
    v_00b19b.current = false;
    let v_2008a4 = false;

    (async () => {
      const v_d065ee = await v_7195bf();
      if (v_2008a4 || v_00b19b.current) return;
      if (v_d065ee) return;

      v_00b19b.current = true;
      console.warn(`[useSessionGuard] ${v_695063} 진입 — 세션 만료/무효 감지, 로그인 화면으로 이동`);

      await v_6606a0();

      try {
        await Promise.all([
          v_e84827.removeItem('isLoggedIn'),
          v_e84827.removeItem('rememberMe'),
          v_e84827.removeItem('jwt'),
          v_e84827.removeItem('userData'),
        ]);
      } catch (v_9e86fd) {
        console.warn('[useSessionGuard] auth state 클리어 실패:', v_9e86fd);
      }

      await v_889fad(v_8d41d7('common.notice'), v_8d41d7('common.sessionExpired.message'));

      v_487a25(v_ce4741.login);
    })();

    return () => {
      v_2008a4 = true;
    };

  }, []);
}
