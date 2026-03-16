

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { loadAndShowRewardedAd, getPangleRewardedAdUnitId, isPangleReadySync } from '../services/pangle';
import { loadAndShowRewardedAd as loadAndShowRewardedAdAdMob, isAdMobReady, getAdMobMediationGroupId } from '../services/admob';
import { collectDeviceInfo } from '../utils/napApiUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, FONTS } from '../constants';
import { Platform } from 'react-native';

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

  const canShow = Platform.OS === 'android' ? isAdMobReady() : isPangleReadySync();

  const handlePress = async () => {
    if (disabled || isLoading || !canShow) return;

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

      if (Platform.OS === 'android') {
        const finalAdUnitId = adUnitId || getAdMobMediationGroupId() || getPangleRewardedAdUnitId() || undefined;
        await loadAndShowRewardedAdAdMob(
          finalAdUnitId,
          finalMember,
          deviceInfo,
          (reward) => {
            setIsLoading(false);
            if (onRewarded) onRewarded(reward);
          },
          () => {
            setIsLoading(false);
            if (onAdClosed) onAdClosed();
          },
          (error) => {
            setIsLoading(false);
            if (onAdFailedToLoad) onAdFailedToLoad(error);
          },
        );
      } else {
        const finalAdUnitId = adUnitId || getPangleRewardedAdUnitId();
        await loadAndShowRewardedAd(
          finalAdUnitId,
          finalMember,
          deviceInfo,
          (reward) => {
            setIsLoading(false);
            if (onRewarded) onRewarded(reward);
          },
          () => {
            setIsLoading(false);
            if (onAdClosed) onAdClosed();
          },
          (error) => {
            setIsLoading(false);
            if (onAdFailedToLoad) onAdFailedToLoad(error);
          },
        );
      }
    } catch (error) {
      console.error('[AdMobRewardedButton] 오류:', error);
      setIsLoading(false);
      if (onAdFailedToLoad) onAdFailedToLoad(error as Error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        (disabled || isLoading || !canShow) && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading || !canShow}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.text} size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
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
