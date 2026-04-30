import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_39a996,
  v_03e392,
  v_326be8,
} from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_1bfbd0, v_a61db3, v_843035, v_9b1a04 } from '../constants';
import { v_12a388 } from '../services';
import { v_e4a763 } from '../utils/env';

type Step = 'enter-old' | 'enter-new' | 'confirm-new';

export const MyInfoPaymentPinScreen: v_a3453e.FC = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);
  const [v_1cc7e7, v_2a7a8f] = v_5ab095<boolean | null>(null);
  const [v_729796, v_fd7d1f] = v_5ab095<Step>('enter-new');
  const [v_0ef310, v_6bd8e2] = v_5ab095('');
  const [v_a85523, v_f8869d] = v_5ab095('');
  const [v_45b3eb, v_7d780f] = v_5ab095('');
  const [v_683210, v_34a50a] = v_5ab095(false);
  const [v_5e9bfe, v_3a7d09] = v_5ab095<string>('');

  v_c4deb2(() => {
    (async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (!v_f24fd5) {
          v_03e392.alert('오류', '로그인 정보를 찾을 수 없습니다.');
          v_c7ac57();
          return;
        }
        const v_ef7306 = JSON.parse(v_f24fd5);
        const v_35f85c = Number(v_ef7306?.member);
        if (!v_35f85c) {
          v_03e392.alert('오류', '회원 번호를 찾을 수 없습니다.');
          v_c7ac57();
          return;
        }
        v_9d6aeb(v_35f85c);
        const v_36dd9e = v_e4a763().GATEWAY_AUTH_CODE;
        const v_8f00b9 = await v_12a388(`/hasPaymentPin?member=${v_35f85c}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${v_36dd9e}` },
        });
        const v_7ecfd1 = await v_8f00b9.json().catch(() => ({})) as { data?: { hasPin?: boolean }[] };
        const v_4982f8 = !!v_7ecfd1?.data?.[0]?.hasPin;
        v_2a7a8f(v_4982f8);
        v_fd7d1f(v_4982f8 ? 'enter-old' : 'enter-new');
      } catch (v_9e86fd) {
        console.warn('[paymentPin] init failed', v_9e86fd?.message ?? v_9e86fd);
        v_2a7a8f(false);
        v_fd7d1f('enter-new');
      }
    })();
  }, [v_c7ac57]);

  const v_bdc450 = v_729796 === 'enter-old' ? v_0ef310 : v_729796 === 'enter-new' ? v_a85523 : v_45b3eb;
  const v_5d3889 = (v_81e2ef) => {
    if (v_729796 === 'enter-old') v_6bd8e2(v_81e2ef);
    else if (v_729796 === 'enter-new') v_f8869d(v_81e2ef);
    else v_7d780f(v_81e2ef);
  };

  const v_4464f1 = (v_d5dda0) => {
    v_3a7d09('');
    if (v_bdc450.length >= 6) return;
    v_5d3889(v_bdc450 + v_d5dda0);
  };
  const v_7e2cc5 = () => {
    v_3a7d09('');
    if (v_bdc450.length === 0) return;
    v_5d3889(v_bdc450.slice(0, -1));
  };

  v_c4deb2(() => {
    if (v_bdc450.length !== 6) return;
    if (v_729796 === 'enter-old') {
      v_fd7d1f('enter-new');
    } else if (v_729796 === 'enter-new') {
      v_fd7d1f('confirm-new');
    } else if (v_729796 === 'confirm-new') {

      if (v_45b3eb !== v_a85523) {
        v_3a7d09('새 결제 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        v_f8869d('');
        v_7d780f('');
        v_fd7d1f('enter-new');
        return;
      }
      v_fbb22a();
    }

  }, [v_bdc450]);

  const v_fbb22a = async () => {
    if (!v_717992) return;
    v_34a50a(true);
    v_3a7d09('');
    try {
      const v_4d33b2 = { member: v_717992, pin: v_a85523 };
      if (v_1cc7e7) v_4d33b2.oldPin = v_0ef310;
      const v_36dd9e = v_e4a763().GATEWAY_AUTH_CODE;
      const v_8f00b9 = await v_12a388('/setPaymentPin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${v_36dd9e}`,
        },
        body: JSON.stringify(v_4d33b2),
      });
      const v_7ecfd1 = (await v_8f00b9.json().catch(() => ({}))) as { status?: string; code?: number; message?: string };
      if (v_7ecfd1.status === 'success') {
        v_03e392.alert('완료', '결제 비밀번호가 저장되었습니다.', [
          { text: '확인', onPress: () => v_c7ac57() },
        ]);
      } else {
        v_3a7d09(v_7ecfd1.message || '저장 실패');
        v_6bd8e2('');
        v_f8869d('');
        v_7d780f('');
        v_fd7d1f(v_1cc7e7 ? 'enter-old' : 'enter-new');
      }
    } catch (v_9e86fd) {
      const v_badeaf = v_9e86fd?.message ?? '저장 중 오류가 발생했습니다.';
      v_3a7d09(v_badeaf);
      v_6bd8e2('');
      v_f8869d('');
      v_7d780f('');
      v_fd7d1f(v_1cc7e7 ? 'enter-old' : 'enter-new');
    } finally {
      v_34a50a(false);
    }
  };

  const v_9f1622 =
    v_729796 === 'enter-old'
      ? '기존 결제 비밀번호 입력'
      : v_729796 === 'enter-new'
        ? '새 결제 비밀번호 입력 (숫자 6자리)'
        : '새 결제 비밀번호 다시 입력';

  if (v_1cc7e7 === null) {
    return (
      <View style={v_d81136.container}>
        <Header title="결제 비밀번호" onBackPress={v_c7ac57} showBackButton />
        <View style={v_d81136.center}>
          <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View style={v_d81136.container}>
      <Header title="결제 비밀번호" onBackPress={v_c7ac57} showBackButton />
      <View style={v_d81136.body}>
        <Text style={v_d81136.title}>{v_9f1622}</Text>
        <View style={v_d81136.dotsRow}>
          {Array.from({ length: 6 }).map((v_37eab7, v_ebec57) => (
            <View key={v_ebec57} style={[v_d81136.dot, v_bdc450.length > v_ebec57 && v_d81136.dotFilled]} />
          ))}
        </View>
        {!!v_5e9bfe && <Text style={v_d81136.error}>{v_5e9bfe}</Text>}
        {v_683210 && (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
          </View>
        )}

        {}
        <View style={v_d81136.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v_f4e98d) => (
            <TouchableOpacity
              key={v_f4e98d}
              style={v_d81136.key}
              onPress={() => v_4464f1(String(v_f4e98d))}
              disabled={v_683210}
            >
              <Text style={v_d81136.keyText}>{v_f4e98d}</Text>
            </TouchableOpacity>
          ))}
          <View style={[v_d81136.key, { backgroundColor: 'transparent' }]} />
          <TouchableOpacity
            style={v_d81136.key}
            onPress={() => v_4464f1('0')}
            disabled={v_683210}
          >
            <Text style={v_d81136.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={v_d81136.key}
            onPress={v_7e2cc5}
            disabled={v_683210}
          >
            <Text style={[v_d81136.keyText, { fontSize: 18 }]}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: { ...v_a61db3.container },
  body: { flex: 1, paddingHorizontal: v_9b1a04.large, paddingTop: v_9b1a04.large },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: v_843035.size.large,
    fontWeight: '700',
    color: v_1bfbd0.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  dotFilled: { backgroundColor: '#343a5a', borderColor: '#343a5a' },
  error: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  keypad: {
    marginTop: 'auto',
    marginBottom: v_326be8.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    margin: '1.5%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: v_1bfbd0.text,
  },
});
