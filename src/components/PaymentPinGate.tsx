import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../constants';
import { nodeGatewayRequest } from '../services';
import { getEnv } from '../utils/env';
import { useAlertDialog } from '../context';

interface Props {
  memberId: number | string | null | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentPinGate: React.FC<Props> = ({ memberId, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [phase, setPhase] = useState<'checking' | 'input' | 'verifying' | 'done'>('checking');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const mid = Number(memberId);
      if (!mid) {

        setPhase('done');
        onSuccess();
        return;
      }
      try {
        const authCode = getEnv().GATEWAY_AUTH_CODE;
        const res = await nodeGatewayRequest(`/hasPaymentPin?member=${mid}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${authCode}` },
        });
        const json = (await res.json().catch(() => ({}))) as { data?: { hasPin?: boolean }[] };
        const hasPin = !!json?.data?.[0]?.hasPin;
        if (!hasPin) {
          setPhase('done');
          onSuccess();
        } else {
          setPhase('input');
        }
      } catch (e) {
        console.warn('[PaymentPinGate] hasPaymentPin 실패:', e);

        setPhase('done');
        onSuccess();
      }
    })();

  }, [memberId]);

  useEffect(() => {
    if (phase !== 'input' || pin.length !== 6) return;
    (async () => {
      setPhase('verifying');
      setError('');
      try {
        const authCode = getEnv().GATEWAY_AUTH_CODE;
        const res = await nodeGatewayRequest('/oth-pathPaymentPin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authCode}`,
          },
          body: JSON.stringify({ member: Number(memberId), pin }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          data?: { match?: boolean; hasPin?: boolean }[];
        };
        const match = !!json?.data?.[0]?.match;
        if (match) {
          setPhase('done');
          onSuccess();
        } else {
          setError(t('screens.paymentPin.wrongPin') || '결제 비밀번호가 일치하지 않습니다.');
          setPin('');
          setPhase('input');
        }
      } catch (e) {
        setError(t('screens.paymentPin.verifyError') || '검증 중 오류가 발생했습니다.');
        setPin('');
        setPhase('input');
      }
    })();

  }, [pin, phase]);

  const onPressDigit = (d: string) => {
    if (phase !== 'input') return;
    setError('');
    if (pin.length >= 6) return;
    setPin(pin + d);
  };
  const onPressBackspace = () => {
    if (phase !== 'input') return;
    setError('');
    if (pin.length === 0) return;
    setPin(pin.slice(0, -1));
  };

  if (phase === 'done') return null;
  if (phase === 'checking') {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>
        {t('screens.paymentPin.enterTitle') || '결제 비밀번호 입력'}
      </Text>
      <Text style={styles.subtitle}>
        {t('screens.paymentPin.enterSubtitle') || '송금을 위해 6자리 결제 비밀번호를 입력해 주세요.'}
      </Text>

      <View style={styles.dotsRow}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
        ))}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
      {phase === 'verifying' && (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        </View>
      )}

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <TouchableOpacity
            key={n}
            style={styles.key}
            onPress={() => onPressDigit(String(n))}
            disabled={phase !== 'input'}
          >
            <Text style={styles.keyText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={onCancel}>
          <Text style={[styles.keyText, { fontSize: 14, color: '#94a3b8' }]}>
            {t('common.cancel') || '취소'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => onPressDigit('0')} disabled={phase !== 'input'}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={onPressBackspace} disabled={phase !== 'input'}>
          <Text style={[styles.keyText, { fontSize: 18 }]}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingHorizontal: SIZES.large,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.size.large,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS.size.msmall,
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
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
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
    color: COLORS.text,
  },
});
