import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { nodeGatewayRequest } from '../services';
import { getEnv } from '../utils/env';

type Step = 'enter-old' | 'enter-new' | 'confirm-new';

export const MyInfoPaymentPinScreen: React.FC = () => {
  const { goBack } = useAppNavigation();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>('enter-new');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (!userDataStr) {
          Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
          goBack();
          return;
        }
        const userData = JSON.parse(userDataStr);
        const m = Number(userData?.member);
        if (!m) {
          Alert.alert('오류', '회원 번호를 찾을 수 없습니다.');
          goBack();
          return;
        }
        setMemberId(m);
        const authCode = getEnv().GATEWAY_AUTH_CODE;
        const res = await nodeGatewayRequest(`/hasPaymentPin?member=${m}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${authCode}` },
        });
        const json = await res.json().catch(() => ({})) as { data?: { hasPin?: boolean }[] };
        const has = !!json?.data?.[0]?.hasPin;
        setHasPin(has);
        setStep(has ? 'enter-old' : 'enter-new');
      } catch (e: any) {
        console.warn('[paymentPin] init failed', e?.message ?? e);
        setHasPin(false);
        setStep('enter-new');
      }
    })();
  }, [goBack]);

  const currentInput = step === 'enter-old' ? oldPin : step === 'enter-new' ? newPin : confirmPin;
  const setCurrent = (v: string) => {
    if (step === 'enter-old') setOldPin(v);
    else if (step === 'enter-new') setNewPin(v);
    else setConfirmPin(v);
  };

  const onPressDigit = (d: string) => {
    setError('');
    if (currentInput.length >= 6) return;
    setCurrent(currentInput + d);
  };
  const onPressBackspace = () => {
    setError('');
    if (currentInput.length === 0) return;
    setCurrent(currentInput.slice(0, -1));
  };

  useEffect(() => {
    if (currentInput.length !== 6) return;
    if (step === 'enter-old') {
      setStep('enter-new');
    } else if (step === 'enter-new') {
      setStep('confirm-new');
    } else if (step === 'confirm-new') {

      if (confirmPin !== newPin) {
        setError('새 결제 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        setNewPin('');
        setConfirmPin('');
        setStep('enter-new');
        return;
      }
      submit();
    }

  }, [currentInput]);

  const submit = async () => {
    if (!memberId) return;
    setLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = { member: memberId, pin: newPin };
      if (hasPin) body.oldPin = oldPin;
      const authCode = getEnv().GATEWAY_AUTH_CODE;
      const res = await nodeGatewayRequest('/setPaymentPin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCode}`,
        },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { status?: string; code?: number; message?: string };
      if (json.status === 'success') {
        Alert.alert('완료', '결제 비밀번호가 저장되었습니다.', [
          { text: '확인', onPress: () => goBack() },
        ]);
      } else {
        setError(json.message || '저장 실패');
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
        setStep(hasPin ? 'enter-old' : 'enter-new');
      }
    } catch (e: any) {
      const msg = e?.message ?? '저장 중 오류가 발생했습니다.';
      setError(msg);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setStep(hasPin ? 'enter-old' : 'enter-new');
    } finally {
      setLoading(false);
    }
  };

  const title =
    step === 'enter-old'
      ? '기존 결제 비밀번호 입력'
      : step === 'enter-new'
        ? '새 결제 비밀번호 입력 (숫자 6자리)'
        : '새 결제 비밀번호 다시 입력';

  if (hasPin === null) {
    return (
      <View style={styles.container}>
        <Header title="결제 비밀번호" onBackPress={goBack} showBackButton />
        <View style={styles.center}>
          <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="결제 비밀번호" onBackPress={goBack} showBackButton />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dotsRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.dot, currentInput.length > i && styles.dotFilled]} />
          ))}
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
        {loading && (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
          </View>
        )}

        {}
        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.key}
              onPress={() => onPressDigit(String(n))}
              disabled={loading}
            >
              <Text style={styles.keyText}>{n}</Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.key, { backgroundColor: 'transparent' }]} />
          <TouchableOpacity
            style={styles.key}
            onPress={() => onPressDigit('0')}
            disabled={loading}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.key}
            onPress={onPressBackspace}
            disabled={loading}
          >
            <Text style={[styles.keyText, { fontSize: 18 }]}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...COMMON_STYLES.container },
  body: { flex: 1, paddingHorizontal: SIZES.large, paddingTop: SIZES.large },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: FONTS.size.large,
    fontWeight: '700',
    color: COLORS.text,
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
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
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
    color: COLORS.text,
  },
});
