import v_a3453e, { v_c4deb2 } from 'bapkr';
import { v_3094a2, v_472849 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_1bfbd0 } from '../constants';
import { v_bebb2d } from '../utils';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_6b5698 } from 'rcmrninabrnb';

export const v_7c6176 = () => {
  v_c4deb2(() => {

    const v_a08492 = async () => {
      const v_43c42e = await v_bebb2d();
      if (v_43c42e) {
        console.log(`[SplashScreen] 콜드스타트 체크 완료: ${v_43c42e.isColdStart ? '콜드스타트' : '웜스타트'} (경과 시간: ${v_43c42e.elapsedSeconds}초)`);
      }

      await v_e84827.setItem('app_last_state', v_6b5698.currentState);
    };

    v_a08492();
  }, []);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: v_1bfbd0.background,
  },
});

