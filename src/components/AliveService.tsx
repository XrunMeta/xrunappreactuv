import v_a3453e, { v_c4deb2, v_e662ae, v_5ab095 } from 'bapkr';
import { v_6b5698, v_c3551b } from 'rcmrninabrnb';

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_495832 } from '../services';
import { v_700ef9 } from '../context';
import { v_a0daa8 } from '../navigation';
import { v_ce4741 } from '../navigation';

export const AliveService: v_a3453e.FC = () => {
  const { setEmergencyStop: v_69fcdc } = v_700ef9();
  const { reset: v_487a25 } = v_a0daa8();
  const [v_75e98a, v_fd5a46] = v_5ab095(0);
  const v_0917d2 = v_e662ae(0); 
  const v_3ac63b = v_e662ae<NodeJS.Timeout | null>(null);
  const v_1b7402 = v_e662ae<v_c3551b>(v_6b5698.currentState);

  v_c4deb2(() => {
    v_0917d2.current = v_75e98a;
  }, [v_75e98a]);

  const v_f4cb97 = async () => {
    try {
      const v_3393e3 = await v_495832();

      if (v_3393e3.success) {

        v_fd5a46(0);
        v_0917d2.current = 0;

        if (v_3393e3.emergencyStop?.enabled) {
          v_69fcdc({
            enabled: true,
            message: v_3393e3.emergencyStop.message,
            link: v_3393e3.emergencyStop.link,
          });
        } else {

          v_69fcdc(null);
        }
      } else {

        v_fd4e8f();
      }
    } catch (v_5e9bfe) {

      console.error('Alive signal error:', v_5e9bfe);
      v_fd4e8f();
    }
  };

  const v_fd4e8f = async () => {
    const v_654087 = v_0917d2.current + 1;
    v_fd5a46(v_654087);
    v_0917d2.current = v_654087;

    if (v_654087 >= 2) {
      try {
        const v_042a8b = await v_e84827.getItem('isLoggedIn');

        if (v_042a8b === 'true') {

          v_487a25(v_ce4741.map);
        } else {

          v_487a25(v_ce4741.login);
        }

        v_fd5a46(0);
        v_0917d2.current = 0;
      } catch (v_5e9bfe) {
        console.error('Failed to handle alive signal failure:', v_5e9bfe);

        v_487a25(v_ce4741.login);
        v_fd5a46(0);
        v_0917d2.current = 0;
      }
    }
  };

  const v_7a424f = (nextAppState: v_c3551b) => {
    if (
      v_1b7402.current.match(/inactive|background/) &&
      v_3b10d8 === 'active'
    ) {

      v_f4cb97();
      v_7592ef();
    } else if (
      v_1b7402.current === 'active' &&
      v_3b10d8.match(/inactive|background/)
    ) {

      v_65da2c();
    }

    v_1b7402.current = v_3b10d8;
  };

  const v_7592ef = () => {

    if (v_3ac63b.current) {
      clearInterval(v_3ac63b.current);
    }

    v_3ac63b.current = setInterval(() => {
      v_f4cb97();
    }, 30000); 
  };

  const v_65da2c = () => {
    if (v_3ac63b.current) {
      clearInterval(v_3ac63b.current);
      v_3ac63b.current = null;
    }
  };

  v_c4deb2(() => {

    v_f4cb97();

    v_7592ef();

    const v_269481 = v_6b5698.addEventListener('change', v_7a424f);

    return () => {
      v_65da2c();
      v_269481.remove();
    };
  }, []); 

  return null;
};

