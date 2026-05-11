import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_4623af,
  v_39a996,
  v_326be8,
} from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_1bfbd0, v_843035, v_9b1a04 } from '../constants';
import { v_12a388 } from '../services';
import { v_e4a763 } from '../utils/env';
import { v_4b1173 } from '../context';

interface Props {
  memberId: number | string | null | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentPinGate: v_a3453e.FC<Props> = ({ memberId: v_717992, onSuccess: v_fe60db, onCancel: v_c7001c }) => {
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_ab4803, v_ae4844] = v_5ab095<'checking' | 'input' | 'verifying' | 'done'>('checking');
  const [v_6bee94, v_240fbf] = v_5ab095('');
  const [v_5e9bfe, v_3a7d09] = v_5ab095('');

  v_c4deb2(() => {
    (async () => {
      const v_73ad51 = Number(v_717992);
      if (!v_73ad51) {

        v_ae4844('done');
        v_fe60db();
        return;
      }
      try {
        const v_36dd9e = v_e4a763().GATEWAY_AUTH_CODE;
        const v_8f00b9 = await v_12a388(`/hasPaymentPin?member=${v_73ad51}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${v_36dd9e}` },
        });
        const v_7ecfd1 = (await v_8f00b9.json().catch(() => ({}))) as { data?: { hasPin?: boolean }[] };
        const v_1cc7e7 = !!v_7ecfd1?.data?.[0]?.hasPin;
        if (!v_1cc7e7) {
          v_ae4844('done');
          v_fe60db();
        } else {
          v_ae4844('input');
        }
      } catch (v_9e86fd) {
        console.warn('[PaymentPinGate] hasPaymentPin 실패:', v_9e86fd);

        v_ae4844('done');
        v_fe60db();
      }
    })();

  }, [v_717992]);

  v_c4deb2(() => {
    if (v_ab4803 !== 'input' || v_6bee94.length !== 6) return;
    (async () => {
      v_ae4844('verifying');
      v_3a7d09('');
      try {
        const v_36dd9e = v_e4a763().GATEWAY_AUTH_CODE;
        const v_8f00b9 = await v_12a388('/oth-pathPaymentPin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${v_36dd9e}`,
          },
          body: JSON.stringify({ member: Number(v_717992), pin: v_6bee94 }),
        });
        const v_7ecfd1 = (await v_8f00b9.json().catch(() => ({}))) as {
          data?: { match?: boolean; hasPin?: boolean }[];
        };
        const v_a63110 = !!v_7ecfd1?.data?.[0]?.match;
        if (v_a63110) {
          v_ae4844('done');
          v_fe60db();
        } else {
          v_3a7d09(v_8d41d7('screens.paymentPin.wrongPin') || '결제 비밀번호가 일치하지 않습니다.');
          v_240fbf('');
          v_ae4844('input');
        }
      } catch (v_9e86fd) {
        v_3a7d09(v_8d41d7('screens.paymentPin.verifyError') || '검증 중 오류가 발생했습니다.');
        v_240fbf('');
        v_ae4844('input');
      }
    })();

  }, [v_6bee94, v_ab4803]);

  const v_4464f1 = (v_d5dda0) => {
    if (v_ab4803 !== 'input') return;
    v_3a7d09('');
    if (v_6bee94.length >= 6) return;
    v_240fbf(v_6bee94 + v_d5dda0);
  };
  const v_7e2cc5 = () => {
    if (v_ab4803 !== 'input') return;
    v_3a7d09('');
    if (v_6bee94.length === 0) return;
    v_240fbf(v_6bee94.slice(0, -1));
  };

  if (v_ab4803 === 'done') return null;
  if (v_ab4803 === 'checking') {
    return (
      <View style={v_d81136.overlay}>
        <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
      </View>
    );
  }

  return (
    <View style={v_d81136.overlay}>
      <Text style={v_d81136.title}>
        {v_8d41d7('screens.paymentPin.enterTitle') || '결제 비밀번호 입력'}
      </Text>
      <Text style={v_d81136.subtitle}>
        {v_8d41d7('screens.paymentPin.enterSubtitle') || '송금을 위해 6자리 결제 비밀번호를 입력해 주세요.'}
      </Text>

      <View style={v_d81136.dotsRow}>
        {Array.from({ length: 6 }).map((v_37eab7, v_ebec57) => (
          <View key={v_ebec57} style={[v_d81136.dot, v_6bee94.length > v_ebec57 && v_d81136.dotFilled]} />
        ))}
      </View>

      {!!v_5e9bfe && <Text style={v_d81136.error}>{v_5e9bfe}</Text>}
      {v_ab4803 === 'verifying' && (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
        </View>
      )}

      <View style={v_d81136.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v_f4e98d) => (
          <TouchableOpacity
            key={v_f4e98d}
            style={v_d81136.key}
            onPress={() => v_4464f1(String(v_f4e98d))}
            disabled={v_ab4803 !== 'input'}
          >
            <Text style={v_d81136.keyText}>{v_f4e98d}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={v_d81136.key} onPress={v_c7001c}>
          <Text style={[v_d81136.keyText, { fontSize: 14, color: '#94a3b8' }]}>
            {v_8d41d7('common.cancel') || '취소'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={v_d81136.key} onPress={() => v_4464f1('0')} disabled={v_ab4803 !== 'input'}>
          <Text style={v_d81136.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={v_d81136.key} onPress={v_7e2cc5} disabled={v_ab4803 !== 'input'}>
          <Text style={[v_d81136.keyText, { fontSize: 18 }]}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingHorizontal: v_9b1a04.large,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: v_843035.size.large,
    fontWeight: '700',
    color: v_1bfbd0.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: v_843035.size.msmall,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  keypad: {
    marginTop: 'auto',
    marginBottom: v_326be8.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
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
