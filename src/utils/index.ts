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


