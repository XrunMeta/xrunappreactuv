import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export const copyToClipboard = async (
  value: string,
  successMessage = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await Clipboard.setStringAsync(value);
    Alert.alert('주소 복사', successMessage);
  } catch (error) {
    Alert.alert('복사 실패', '주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};

export * from './env';

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

