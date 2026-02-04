import { Share, Platform, ToastAndroid, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CryptoJS from 'crypto-js';

export const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {

    Alert.alert('', message, [{ text: '확인' }]);
  }
};

export const copyToClipboard = async (
  value: string,
  showAlert?: (title: string, message?: string, buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>) => Promise<number | undefined>,
  successMessage = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await Clipboard.setStringAsync(value);

    showToast(successMessage);
  } catch (error) {

    showToast('주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};

export * from './env';

export { getPlayStoreUrl, ANDROID_PACKAGE_ID } from './playStoreUrl';

export * from './imageCache';

export * from './input';

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
    console.log('[shareReferralLink] 시작 - 플랫폼:', Platform.OS);
    console.log('[shareReferralLink] 사용자 이메일:', userDetails.email);

    const androidLink = getPlayStoreUrl({ gl: 'kr', campaignId: 'web_share' });
    const iosLink = 'https://apps.apple.com/id/app/xrun-go/id6502924173';

    const encodedEmail = encodeURIComponent(userDetails.email);
    const deepLinkUrl = `https://www.xrun.run/invite?referral=${encodedEmail}`;

    const shareText = t('screens.referral.share.shareText');
    const downloadLabel = t('screens.referral.share.download');

    const message = `${shareText}${userDetails.email}\n\n🔗 바로가기 ${deepLinkUrl}`;

    console.log('[shareReferralLink] 공유 메시지:', message);

    let shareOptions: { message: string; url?: string; title?: string };

    if (Platform.OS === 'ios') {

      shareOptions = {
        message,
        url: deepLinkUrl,
        title: shareText,
      };
    } else {

      shareOptions = {
        message,
      };
    }

    console.log('[shareReferralLink] Share API 호출 시작:', shareOptions);

    const result = await Share.share(shareOptions);

    console.log('[shareReferralLink] Share API 결과:', result);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log(`[shareReferralLink] ${result.activityType}로 성공적으로 공유됨`);
      } else {
        console.log('[shareReferralLink] 성공적으로 공유됨');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('[shareReferralLink] 공유가 취소됨');
    }
  } catch (error: any) {
    console.error('[shareReferralLink] Share 오류:', error);
    console.error('[shareReferralLink] 오류 상세:', JSON.stringify(error, null, 2));
    await showAlert(t('screens.referral.share.shareFailed'), error.message || t('screens.referral.share.shareFailedMessage'));
    if (navigation) {

    }
  }
};

export const maskEmail = (email: string): string => {

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return email; 
  }

  const [localPart, domain] = email.split('@');

  if (!localPart || localPart.length === 0) {
    return email;
  }

  const visibleChars = Math.min(2, localPart.length);
  const visiblePart = localPart.substring(0, visibleChars);

  const maskedLength = Math.floor(Math.random() * 5) + 5; 
  const maskedPart = '*'.repeat(maskedLength);

  return `${visiblePart}${maskedPart}@${domain}`;
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

export const checkColdStart = async (): Promise<{ isColdStart: boolean; elapsedSeconds: number } | null> => {
  try {

    const coldStartChecked = await AsyncStorage.getItem('coldStartChecked');
    const lastBackgroundTimestamp = await AsyncStorage.getItem('app_last_background_timestamp');
    const checkedTimestamp = await AsyncStorage.getItem('checkedTimestamp');

    const currentTimestamp = Math.floor(Date.now() / 1000);

    console.log('[Utils] checkColdStart 시작:', {
      coldStartChecked,
      lastBackgroundTimestamp,
      checkedTimestamp,
      currentTimestamp,
      currentTimeISO: new Date(currentTimestamp * 1000).toISOString(),
    });

    if (coldStartChecked === 'true' && checkedTimestamp) {

      if (!lastBackgroundTimestamp) {

        const isColdStart = await AsyncStorage.getItem('isColdStart');
        const elapsedSecondsStr = await AsyncStorage.getItem('elapsedSeconds');
        const elapsedSeconds = elapsedSecondsStr ? parseInt(elapsedSecondsStr, 10) : 0;
        console.log('[Utils] 백그라운드 타임스탬프 없음 - 기존 결과 반환:', {
          isColdStart,
          elapsedSeconds,
        });
        return {
          isColdStart: isColdStart === 'true',
          elapsedSeconds,
        };
      }

      let backgroundTimestamp: number;

      const isNumeric = /^\d+$/.test(lastBackgroundTimestamp);
      if (!isNumeric) {

        console.warn('[Utils] 백그라운드 타임스탬프가 숫자 형식이 아닙니다:', lastBackgroundTimestamp, '(날짜 형식으로 변환 시도)');
        try {

          const dateObj = new Date(lastBackgroundTimestamp);
          const convertedTimestamp = Math.floor(dateObj.getTime() / 1000);

          if (isNaN(convertedTimestamp) || convertedTimestamp <= 0 || convertedTimestamp > currentTimestamp) {

            console.warn('[Utils] 날짜 형식 변환 실패 또는 유효하지 않은 값:', lastBackgroundTimestamp, '(콜드스타트로 간주합니다.)');
            await AsyncStorage.removeItem('app_last_background_timestamp');
            await AsyncStorage.setItem('isColdStart', 'true');
            await AsyncStorage.setItem('elapsedSeconds', '0');
            await AsyncStorage.setItem('checkedTimestamp', currentTimestamp.toString());
            return { isColdStart: true, elapsedSeconds: 0 };
          }

          backgroundTimestamp = convertedTimestamp;
          await AsyncStorage.setItem('app_last_background_timestamp', backgroundTimestamp.toString());
          console.log('[Utils] 날짜 형식을 타임스탬프(초 단위)로 변환하여 저장:', lastBackgroundTimestamp, '->', backgroundTimestamp);
        } catch (error) {

          console.warn('[Utils] 날짜 형식 변환 중 오류:', error, '(콜드스타트로 간주합니다.)');
          await AsyncStorage.removeItem('app_last_background_timestamp');
          await AsyncStorage.setItem('isColdStart', 'true');
          await AsyncStorage.setItem('elapsedSeconds', '0');
          await AsyncStorage.setItem('checkedTimestamp', currentTimestamp.toString());
          return { isColdStart: true, elapsedSeconds: 0 };
        }
      } else {

        let parsedTimestamp = parseInt(lastBackgroundTimestamp, 10);

        if (parsedTimestamp >= 1000000000000) {
          console.log('[Utils] 밀리초 형식 감지, 초 단위로 변환:', parsedTimestamp, '->', Math.floor(parsedTimestamp / 1000));
          parsedTimestamp = Math.floor(parsedTimestamp / 1000);

          await AsyncStorage.setItem('app_last_background_timestamp', parsedTimestamp.toString());
        }

        backgroundTimestamp = parsedTimestamp;
        if (isNaN(backgroundTimestamp) || backgroundTimestamp <= 0 || backgroundTimestamp > currentTimestamp) {

          console.warn('[Utils] 백그라운드 타임스탬프가 유효하지 않습니다:', lastBackgroundTimestamp, '(콜드스타트로 간주합니다.)');
          await AsyncStorage.removeItem('app_last_background_timestamp');
          await AsyncStorage.setItem('isColdStart', 'true');
          await AsyncStorage.setItem('elapsedSeconds', '0');
          await AsyncStorage.setItem('checkedTimestamp', currentTimestamp.toString());
          return { isColdStart: true, elapsedSeconds: 0 };
        }
      }

      let checkedTimestampNum = parseInt(checkedTimestamp, 10);

      if (checkedTimestampNum >= 1000000000000) {
        console.log('[Utils] checkedTimestamp 밀리초 형식 감지, 초 단위로 변환:', checkedTimestampNum, '->', Math.floor(checkedTimestampNum / 1000));
        checkedTimestampNum = Math.floor(checkedTimestampNum / 1000);

        await AsyncStorage.setItem('checkedTimestamp', checkedTimestampNum.toString());
      }

      console.log('[Utils] 타임스탬프 비교:', {
        backgroundTimestamp,
        checkedTimestampNum,
        currentTimestamp,
        backgroundTimeISO: new Date(backgroundTimestamp * 1000).toISOString(),
        checkedTimeISO: checkedTimestampNum > 0 ? new Date(checkedTimestampNum * 1000).toISOString() : 'invalid',
        currentTimeISO: new Date(currentTimestamp * 1000).toISOString(),
      });

      const elapsedSeconds = currentTimestamp - backgroundTimestamp;
      const isColdStart = elapsedSeconds >= 600; 

      console.log('[Utils] 경과 시간 재계산:', {
        currentTimestamp,
        backgroundTimestamp,
        elapsedSeconds,
        isColdStart,
        backgroundTimeISO: new Date(backgroundTimestamp * 1000).toISOString(),
        currentTimeISO: new Date(currentTimestamp * 1000).toISOString(),
      });

      if (!isNaN(checkedTimestampNum) && checkedTimestampNum > 0 && backgroundTimestamp <= checkedTimestampNum) {
        const savedIsColdStart = await AsyncStorage.getItem('isColdStart');
        const savedElapsedSecondsStr = await AsyncStorage.getItem('elapsedSeconds');
        const savedElapsedSeconds = savedElapsedSecondsStr ? parseInt(savedElapsedSecondsStr, 10) : 0;
        console.log('[Utils] 백그라운드 시간이 체크 시간 이전 - 기존 결과 반환:', {
          savedIsColdStart,
          savedElapsedSeconds,
          calculatedElapsedSeconds: elapsedSeconds,
          backgroundTimestamp,
          checkedTimestampNum,
        });
        return {
          isColdStart: savedIsColdStart === 'true',
          elapsedSeconds: savedElapsedSeconds,
        };
      }

      await AsyncStorage.setItem('isColdStart', isColdStart ? 'true' : 'false');
      await AsyncStorage.setItem('elapsedSeconds', elapsedSeconds.toString());
      await AsyncStorage.setItem('checkedTimestamp', currentTimestamp.toString());

      const savedElapsedSeconds = await AsyncStorage.getItem('elapsedSeconds');
      const savedIsColdStart = await AsyncStorage.getItem('isColdStart');
      console.log('[Utils] 재계산 결과 저장 완료:', {
        savedElapsedSeconds,
        savedIsColdStart,
        calculatedElapsedSeconds: elapsedSeconds,
        calculatedIsColdStart: isColdStart,
      });

      return { isColdStart, elapsedSeconds };
    }

    let isColdStart = false;
    let elapsedSeconds = 0;

    if (!lastBackgroundTimestamp) {

      isColdStart = true;
      elapsedSeconds = 0;
    } else {

      let backgroundTimestamp: number;

      const isNumeric = /^\d+$/.test(lastBackgroundTimestamp);
      if (!isNumeric) {

        console.warn('[Utils] 백그라운드 타임스탬프가 숫자 형식이 아닙니다:', lastBackgroundTimestamp, '(날짜 형식으로 변환 시도)');
        try {

          const dateObj = new Date(lastBackgroundTimestamp);
          const convertedTimestamp = Math.floor(dateObj.getTime() / 1000);

          if (isNaN(convertedTimestamp) || convertedTimestamp <= 0 || convertedTimestamp > currentTimestamp) {

            console.warn('[Utils] 날짜 형식 변환 실패 또는 유효하지 않은 값:', lastBackgroundTimestamp, '(콜드스타트로 간주합니다.)');
            await AsyncStorage.removeItem('app_last_background_timestamp');
            isColdStart = true;
            elapsedSeconds = 0;
          } else {

            backgroundTimestamp = convertedTimestamp;
            await AsyncStorage.setItem('app_last_background_timestamp', backgroundTimestamp.toString());
            console.log('[Utils] 날짜 형식을 타임스탬프(초 단위)로 변환하여 저장:', lastBackgroundTimestamp, '->', backgroundTimestamp);

            elapsedSeconds = currentTimestamp - backgroundTimestamp;

            isColdStart = elapsedSeconds >= 600;
          }
        } catch (error) {

          console.warn('[Utils] 날짜 형식 변환 중 오류:', error, '(콜드스타트로 간주합니다.)');
          await AsyncStorage.removeItem('app_last_background_timestamp');
          isColdStart = true;
          elapsedSeconds = 0;
        }
      } else {

        let parsedTimestamp = parseInt(lastBackgroundTimestamp, 10);

        if (parsedTimestamp >= 1000000000000) {
          console.log('[Utils] 밀리초 형식 감지, 초 단위로 변환:', parsedTimestamp, '->', Math.floor(parsedTimestamp / 1000));
          parsedTimestamp = Math.floor(parsedTimestamp / 1000);

          await AsyncStorage.setItem('app_last_background_timestamp', parsedTimestamp.toString());
        }

        backgroundTimestamp = parsedTimestamp;
        if (isNaN(backgroundTimestamp) || backgroundTimestamp <= 0 || backgroundTimestamp > currentTimestamp) {

          console.warn('[Utils] 백그라운드 타임스탬프가 유효하지 않습니다:', lastBackgroundTimestamp, '(콜드스타트로 간주합니다.)');
          await AsyncStorage.removeItem('app_last_background_timestamp');
          isColdStart = true;
          elapsedSeconds = 0;
        } else {

          elapsedSeconds = currentTimestamp - backgroundTimestamp;

          isColdStart = elapsedSeconds >= 600;

          console.log('[Utils] 새로 체크 - 경과 시간 계산:', {
            currentTimestamp,
            backgroundTimestamp,
            elapsedSeconds,
            isColdStart,
            backgroundTimeISO: new Date(backgroundTimestamp * 1000).toISOString(),
            currentTimeISO: new Date(currentTimestamp * 1000).toISOString(),
          });
        }
      }
    }

    await AsyncStorage.setItem('coldStartChecked', 'true');
    await AsyncStorage.setItem('isColdStart', isColdStart ? 'true' : 'false');
    await AsyncStorage.setItem('elapsedSeconds', elapsedSeconds.toString());
    await AsyncStorage.setItem('checkedTimestamp', currentTimestamp.toString());

    const savedElapsedSeconds = await AsyncStorage.getItem('elapsedSeconds');
    const savedIsColdStart = await AsyncStorage.getItem('isColdStart');
    console.log('[Utils] 최종 저장 확인:', {
      savedElapsedSeconds,
      savedIsColdStart,
      elapsedSeconds,
      isColdStart,
    });

    return { isColdStart, elapsedSeconds };
  } catch (error) {
    console.error('[Utils] 콜드스타트 감지 실패:', error);

    await AsyncStorage.setItem('coldStartChecked', 'true');
    await AsyncStorage.setItem('isColdStart', 'true');
    await AsyncStorage.setItem('elapsedSeconds', '0');
    return { isColdStart: true, elapsedSeconds: 0 };
  }
};

export const getColdStartResult = async (): Promise<{ isColdStart: boolean; elapsedSeconds: number } | null> => {
  try {
    const coldStartChecked = await AsyncStorage.getItem('coldStartChecked');
    if (coldStartChecked !== 'true') {

      return null;
    }

    const isColdStart = await AsyncStorage.getItem('isColdStart');
    const elapsedSecondsStr = await AsyncStorage.getItem('elapsedSeconds');
    const elapsedSeconds = elapsedSecondsStr ? parseInt(elapsedSecondsStr, 10) : 0;

    return {
      isColdStart: isColdStart === 'true',
      elapsedSeconds,
    };
  } catch (error) {
    console.error('[Utils] 콜드스타트 결과 가져오기 실패:', error);
    return null;
  }
};

export const maskPrivateKey = (pk: string): string => {
  if (!pk || pk.length < 10) return pk;
  return `${pk.substring(0, 6)}...${pk.substring(pk.length - 4)}`;
};

