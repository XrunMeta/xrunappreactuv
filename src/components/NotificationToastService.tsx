import v_a3453e, { v_c4deb2, v_e662ae } from 'bapkr';
import { v_6b5698, v_c3551b } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_ab08d0 } from '../services';
import { v_cba33f } from '../utils';

export const NotificationToastService: v_a3453e.FC = () => {
  const v_3ac63b = v_e662ae<NodeJS.Timeout | null>(null);
  const v_1b7402 = v_e662ae<v_c3551b>(v_6b5698.currentState);
  const v_636b6b = v_e662ae<boolean>(false);

  const v_ffe9e6 = (v_479f05): number => {
    const v_fd5f43 = String(v_479f05 ?? '').trim();
    if (!v_fd5f43) return 0;
    const v_6fc191 = v_fd5f43.includes('T') ? v_fd5f43 : v_fd5f43.replace(' ', 'T') + (v_fd5f43.endsWith('Z') ? '' : 'Z');
    return new Date(v_6fc191).getTime();
  };

  const v_38bcc2 = async () => {
    if (v_636b6b.current) return;
    v_636b6b.current = true;
    try {
      const v_f24fd5 = await v_e84827.getItem('userData');
      if (!v_f24fd5) return;
      const v_ef7306 = JSON.parse(v_f24fd5);
      const v_660822 = v_ef7306?.member;
      if (!v_660822) return;

      const v_3393e3 = await v_ab08d0(v_660822, 0);
      if (!v_3393e3?.data || v_3393e3.data.length === 0) return;

      const v_fb6d7a = await v_e84827.getItem('lastToastedNotificationTime');
      const v_b9d109 = v_fb6d7a ? new Date(v_fb6d7a).getTime() : 0;

      const v_715061 = v_3393e3.data.filter((v_f4e98d) => {
        const v_8d41d7 = v_ffe9e6(v_f4e98d.datetime);
        return v_8d41d7 > v_b9d109;
      });
      if (v_715061.length === 0) return;

      const v_6eba2f = v_715061.filter((v_f4e98d) => Number(v_f4e98d.type) !== 9303);
      if (v_6eba2f.length > 0) {
        const v_1300ee = v_6eba2f[0];
        const v_c92005 = v_6eba2f.length > 1 ? ` 외 ${v_6eba2f.length - 1}건` : '';
        const v_3b27d9 = Number(v_1300ee.type);
        const v_badeaf = v_3b27d9 === 9304
          ? `💬 1:1 문의 답변 도착${v_c92005}`
          : `🔔 ${v_1300ee.title || '새 알림'}${v_c92005}`;
        v_cba33f(v_badeaf);
      }

      const v_bdd083 = Math.max(...v_715061.map((v_f4e98d) => v_ffe9e6(v_f4e98d.datetime)));
      if (v_bdd083 > 0) {
        await v_e84827.setItem('lastToastedNotificationTime', new Date(v_bdd083).toISOString());
      }
    } catch (v_9e86fd) {

    } finally {
      v_636b6b.current = false;
    }
  };

  const v_7592ef = () => {
    if (v_3ac63b.current) clearInterval(v_3ac63b.current);
    v_3ac63b.current = setInterval(v_38bcc2, 30000);
  };
  const v_65da2c = () => {
    if (v_3ac63b.current) {
      clearInterval(v_3ac63b.current);
      v_3ac63b.current = null;
    }
  };

  v_c4deb2(() => {

    v_38bcc2();
    v_7592ef();

    const v_1ae212 = v_6b5698.addEventListener('change', (v_3b10d8) => {
      const v_d19607 = !!v_1b7402.current.match(/inactive|background/);
      const v_1039f5 = v_3b10d8 === 'active';
      if (v_d19607 && v_1039f5) {

        v_38bcc2();
        v_7592ef();
      } else if (
        v_1b7402.current === 'active' &&
        v_3b10d8.match(/inactive|background/)
      ) {
        v_65da2c();
      }
      v_1b7402.current = v_3b10d8;
    });

    return () => {
      v_65da2c();
      v_1ae212.remove();
    };
  }, []); 

  return null;
};
