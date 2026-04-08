import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_700696 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_dedaa7 } from '../services';

interface LevelNotificationProps {
  navigation?: any;
}

export const LevelNotification: v_a3453e.FC<LevelNotificationProps> = ({ navigation: v_c65f5d }) => {
  const [v_679b8a, v_3c92ee] = v_5ab095<string | null>('Loading...');

  v_c4deb2(() => {
    const v_79caf4 = async () => {
      try {
        const v_ef7306 = await v_e84827.getItem('userData');
        if (!v_ef7306) {
          console.log('[LevelNotification] userData가 없습니다. 레벨 정보 조회 건너뛰기');
          return;
        }

        const v_ff39bc = JSON.parse(v_ef7306);
        const v_660822 = v_ff39bc?.member;
        if (!v_660822) {
          console.log('[LevelNotification] userData에 member가 없습니다. 레벨 정보 조회 건너뛰기');
          return;
        }

        console.log('[LevelNotification] 사용자 레벨 정보 조회 시작:', v_660822);
        const v_3393e3 = await v_dedaa7(Number(v_660822), v_c65f5d);

        const v_a34953 = Array.isArray(v_3393e3?.data) ? v_3393e3.data[0] : v_3393e3?.data;
        if (v_3393e3 && v_3393e3.status === 'success' && v_a34953 && v_a34953.lv !== undefined) {
          const v_fbe91e = v_a34953.lv;
          v_3c92ee(`Level ${v_fbe91e}`);
          console.log('[LevelNotification] 사용자 레벨 정보 업데이트 완료:', `Level ${v_fbe91e}`);
        } else {
          console.warn('[LevelNotification] 레벨 정보 응답 형식이 올바르지 않습니다:', v_3393e3);
        }
      } catch (v_5e9bfe) {
        console.error('[LevelNotification] 사용자 레벨 정보 조회 실패:', v_5e9bfe);

      }
    };

    v_79caf4();
  }, [v_c65f5d]); 

  if (!v_679b8a) {
    return null;
  }

  return (
    <View style={v_d81136.notificationTextContainer}>
      <Text style={v_d81136.notificationText}>{v_679b8a}</Text>
    </View>
  );
};

const v_d81136 = v_472849.create({
  notificationTextContainer: {
    position: 'absolute',
    top: 65,
    left: 10,
    right: 0,
    width: v_700696.get('window').width / 4,
    height: 28,
    paddingVertical: 2,
    backgroundColor: 'rgb(255, 255, 255)',
    zIndex: 9999, 
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  notificationText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
