

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { loadAndShowRewardedAd, getPangleRewardedAdUnitId, isPangleReadySync } from '../services/pangle';
import { collectDeviceInfo } from '../utils/napApiUtils';
import { DeviceInfo } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, FONTS } from '../constants';

interface AdMobRewardedButtonProps {

  title?: string;

  member?: string;

  adUnitId?: string;

  onRewarded?: (reward: { type: string; amount: number }) => void;

  onAdClosed?: () => void;

  onAdFailedToLoad?: (error: Error) => void;

  buttonStyle?: ViewStyle;

  textStyle?: TextStyle;

  disabled?: boolean;

  testMode?: boolean;
}

export const AdMobRewardedButton: React.FC<AdMobRewardedButtonProps> = ({
  title = '광고 보기',
  member,
  adUnitId,
  onRewarded,
  onAdClosed,
  onAdFailedToLoad,
  buttonStyle,
  textStyle,
  disabled = false,
  testMode = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (disabled || isLoading || !isPangleReadySync()) {
      return;
    }

    try {
      setIsLoading(true);

      let finalMember = member;
      if (!finalMember) {
        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            finalMember = userData?.member?.toString();
          }
        } catch (error) {
          console.error('[AdMobRewardedButton] 사용자 정보 가져오기 실패:', error);
        }
      }

      const deviceInfo = await collectDeviceInfo();

      const finalAdUnitId = adUnitId || getPangleRewardedAdUnitId();

      await loadAndShowRewardedAd(
        finalAdUnitId,
        finalMember,
        deviceInfo,
        (reward) => {
          console.log('[AdMobRewardedButton] 보상 수령:', reward);
          setIsLoading(false);
          if (onRewarded) {
            onRewarded(reward);
          }
        },
        () => {
          console.log('[AdMobRewardedButton] 광고 닫힘');
          setIsLoading(false);
          if (onAdClosed) {
            onAdClosed();
          }
        },
        (error) => {
          console.error('[AdMobRewardedButton] 광고 로드 실패:', error);
          setIsLoading(false);
          if (onAdFailedToLoad) {
            onAdFailedToLoad(error);
          }
        },
      );
    } catch (error) {
      console.error('[AdMobRewardedButton] 오류:', error);
      setIsLoading(false);
      if (onAdFailedToLoad) {
        onAdFailedToLoad(error as Error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        (disabled || isLoading || !isAdMobReady()) && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading || !isPangleReady()}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.text} size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.buttonSecondary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.text,
  },
});

