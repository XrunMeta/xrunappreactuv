

import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_4623af, v_19b633, v_472849, v_39a996, v_7e4944, v_5e8657 } from 'rcmrninabrnb';
import { v_18f201, v_84fca1, v_2b25f9 } from '../services/admob';
import { v_f3de6d } from '../utils/napApiUtils';
import { v_719e34 } from '../types';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_1bfbd0, v_9b1a04, v_843035 } from '../constants';

interface AdMobRewardedButtonProps {

  title?: string;

  member?: string;

  adUnitId?: string;

  onRewarded?: (reward: { type: string; amount: number }) => void;

  onAdClosed?: () => void;

  onAdFailedToLoad?: (error: Error) => void;

  buttonStyle?: v_7e4944;

  textStyle?: v_5e8657;

  disabled?: boolean;

  testMode?: boolean;
}

export const AdMobRewardedButton: v_a3453e.FC<AdMobRewardedButtonProps> = ({
  title: v_9f1622 = '광고 보기',
  member: v_660822,
  adUnitId: v_61418d,
  onRewarded: v_6ae10d,
  onAdClosed: v_ecd42e,
  onAdFailedToLoad: v_0721a3,
  buttonStyle: v_91b9f8,
  textStyle: v_197d6e,
  disabled: v_4a6533 = false,
  testMode: v_53fadb = false,
}) => {
  const [v_cd31a8, v_deef62] = v_5ab095(false);

  const v_5ba0f2 = async () => {
    if (v_4a6533 || v_cd31a8 || !v_2b25f9()) {
      return;
    }

    try {
      v_deef62(true);

      let v_14079b = v_660822;
      if (!v_14079b) {
        try {
          const v_f24fd5 = await v_e84827.getItem('userData');
          if (v_f24fd5) {
            const v_ef7306 = JSON.parse(v_f24fd5);
            v_14079b = v_ef7306?.member?.toString();
          }
        } catch (v_5e9bfe) {
          console.error('[AdMobRewardedButton] 사용자 정보 가져오기 실패:', v_5e9bfe);
        }
      }

      const v_e7f87b = await v_f3de6d();

      const v_819f69 = v_61418d || v_84fca1();

      await v_18f201(
        v_819f69,
        v_14079b,
        v_e7f87b,
        (v_36c043) => {
          console.log('[AdMobRewardedButton] 보상 수령:', v_36c043);
          v_deef62(false);
          if (v_6ae10d) {
            v_6ae10d(v_36c043);
          }
        },
        () => {
          console.log('[AdMobRewardedButton] 광고 닫힘');
          v_deef62(false);
          if (v_ecd42e) {
            v_ecd42e();
          }
        },
        (v_5e9bfe) => {
          console.error('[AdMobRewardedButton] 광고 로드 실패:', v_5e9bfe);
          v_deef62(false);
          if (v_0721a3) {
            v_0721a3(v_5e9bfe);
          }
        },
      );
    } catch (v_5e9bfe) {
      console.error('[AdMobRewardedButton] 오류:', v_5e9bfe);
      v_deef62(false);
      if (v_0721a3) {
        v_0721a3(v_5e9bfe as Error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        v_d81136.button,
        v_91b9f8,
        (v_4a6533 || v_cd31a8 || !v_2b25f9()) && v_d81136.buttonDisabled,
      ]}
      onPress={v_5ba0f2}
      disabled={v_4a6533 || v_cd31a8 || !v_2b25f9()}
      activeOpacity={0.7}
    >
      {v_cd31a8 ? (
        <ActivityIndicator color={v_1bfbd0.text} size="small" />
      ) : (
        <Text style={[v_d81136.buttonText, v_197d6e]}>
          {v_9f1622}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const v_d81136 = v_472849.create({
  button: {
    backgroundColor: v_1bfbd0.buttonSecondary,
    paddingHorizontal: v_9b1a04.large,
    paddingVertical: v_9b1a04.medium,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.text,
  },
});

