import v_a3453e, { v_c4deb2, v_e662ae } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_39a996 } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_961d2c, v_c8c60c } from '../services/ayet';
import { v_cba33f } from '../utils';

const v_8c7ac1 = v_c8c60c;

export interface AyetOffersScreenProps {

  slotName?: string;
}

export const AyetOffersScreen: v_a3453e.FC<AyetOffersScreenProps> = ({ slotName: v_b27fa5 = v_8c7ac1 }) => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const v_124e9d = v_e662ae(false);

  v_c4deb2(() => {
    if (v_124e9d.current) return;
    const v_207c31 = async () => {
      v_124e9d.current = true;
      try {
        let v_717992;
        try {
          const v_f24fd5 = await v_e84827.getItem('userData');
          if (v_f24fd5) {
            const v_ef7306 = JSON.parse(v_f24fd5);
            if (v_ef7306.member != null) v_717992 = String(v_ef7306.member);
          }
        } catch (v_37eab7) {}
        await v_961d2c(v_b27fa5, { memberId: v_717992 });
        v_c7ac57();
      } catch (v_9e86fd) {
        const v_badeaf =
          v_9e86fd instanceof Error && v_9e86fd.message === 'OFFERWALL_UNAVAILABLE'
            ? v_8d41d7('screens.myInfoSettings.ayet_android_only')
            : (v_9e86fd instanceof Error ? v_9e86fd.message : v_8d41d7('screens.myInfoSettings.offers_error'));
        v_cba33f(v_badeaf ?? '오퍼월을 열 수 없습니다.');
        v_c7ac57();
      }
    };
    v_207c31();
  }, [v_b27fa5, v_c7ac57, v_8d41d7]);

  const v_8667e1 =
    v_b27fa5 === 'Xplay'
      ? 'screens.myInfoSettings.ayet_offers_xplay'
      : 'screens.myInfoSettings.ayet_offers';

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7(v_8667e1)} onBackPress={v_c7ac57} showBackButton />
      <View style={v_d81136.centered}>
        <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
        <Text style={v_d81136.loadingText}>{v_8d41d7('screens.myInfoSettings.offers_loading')}</Text>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: v_9b1a04.large,
  },
  loadingText: {
    marginTop: v_9b1a04.small,
    fontSize: v_843035.size.medium,
    color: v_1bfbd0.text,
  },
});
