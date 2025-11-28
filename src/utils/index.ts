import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CryptoJS from 'crypto-js';

export const copyToClipboard = async (
  value: string,
  showAlert: (title: string, message?: string, buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>) => Promise<number | undefined>,
  successMessage = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await Clipboard.setStringAsync(value);
    await showAlert('주소 복사', successMessage);
  } catch (error) {
    await showAlert('복사 실패', '주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};

export * from './env';

export * from './imageCache';

export const formatXrunAmount = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  if (num === 0) return '0';

  if (num > 0 && num < 0.000001) {
    return '< 0.000001';
  }

  return num.toFixed(6);
};

export const formatWonAmount = (amount: number): string => {
  const num = parseFloat(String(amount));
  if (isNaN(num) || num === 0) return '₩0';

  return (
    '₩' +
    num.toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export const calculateWonEquivalent = (xrunAmount: string | number, gopaxPrice: number): number => {
  const numAmount = typeof xrunAmount === 'string' ? parseFloat(xrunAmount) : xrunAmount;
  const priceNum = typeof gopaxPrice === 'string' ? parseFloat(gopaxPrice) : gopaxPrice;

  if (isNaN(numAmount) || isNaN(priceNum) || numAmount === 0 || priceNum === 0) {
    return 0;
  }

  const result = numAmount * priceNum;
  return Math.round(result * 100) / 100;
};

export const formatCurrency = (amount: string | number | object | null | undefined, currency: string = ''): string => {

  if (amount === null || amount === undefined) return '0';

  if (typeof amount === 'object' && amount !== null) {
    console.warn('[formatCurrency] 객체를 받았습니다:', amount);
    return '0';
  }

  let numericValue: number;
  if (typeof amount === 'string') {

    numericValue = parseFloat(amount.replace(/[^\d.-]/g, ''));
  } else if (typeof amount === 'number') {
    numericValue = amount;
  } else {
    console.warn('[formatCurrency] 유효하지 않은 타입:', typeof amount);
    return '0';
  }

  if (isNaN(numericValue)) {
    return '0';
  }

  const addCommas = (number: number): string => {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  if (currency === 'KRW') {

    return addCommas(numericValue) + ' KRW';
  } else if (currency === 'USD') {

    return '$' + numericValue.toFixed(2);
  } else if (currency === 'XRUN') {

    return addCommas(numericValue) + ' XRUN';
  } else {

    const formatted = addCommas(numericValue);
    return currency ? `${formatted} ${currency}` : formatted;
  }
};

export const shareReferralLink = async (
  t: (key: string) => string,
  userDetails: { email: string },
  showAlert: (title: string, message?: string, buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>) => Promise<number | undefined>,
  navigation?: any,
): Promise<void> => {
  try {

    const androidLink = 'https://play.google.com/store/apps/details?id=run.xrun.xrunapp';
    const iosLink = 'https://apps.apple.com/id/app/xrun-go/id6502924173';

    const shareText = t('screens.referral.share.shareText');
    const downloadLabel = t('screens.referral.share.download');

    const message = `${shareText}${userDetails.email}\n\n\n${downloadLabel}\nAndroid: ${androidLink}\niOS: ${iosLink}`;

    const result = await Share.share({
      message,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {

        console.log(`${result.activityType}로 성공적으로 공유됨`);
      } else {

        console.log('성공적으로 공유됨');
      }
    } else if (result.action === Share.dismissedAction) {

      console.log('공유가 취소됨');
    }
  } catch (error: any) {
    await showAlert(t('screens.referral.share.shareFailed'), error.message || t('screens.referral.share.shareFailedMessage'));
    console.log('Share error:', error);
    if (navigation) {

    }
  }
};

export const generateUserHash = (member: number | string, email: string): string => {
  const combined = `${member}${email}`;
  return CryptoJS.SHA256(combined).toString();
};

export const saveCustomTokens = async (
  member: number | string,
  email: string,
  tokens: any[],
): Promise<void> => {
  if (!member) return;

  const hash = generateUserHash(member, email);
  await AsyncStorage.setItem(`customTokens_${hash}`, JSON.stringify(tokens));
};

export const loadCustomTokens = async (
  member: number | string,
  email: string,
): Promise<any[]> => {
  if (!member) return [];

  const hash = generateUserHash(member, email);
  const tokens = await AsyncStorage.getItem(`customTokens_${hash}`);
  return tokens ? JSON.parse(tokens) : [];
};

