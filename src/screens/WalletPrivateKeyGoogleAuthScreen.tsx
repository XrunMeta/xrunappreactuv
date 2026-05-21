

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Header, SafeView, SafeScrollView, WalletKeyPinPromptModal } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  jwtPayloadSub,
  exportBackup,
  type BackupPayload,
} from '../services/walletKeyStore';

type Stage = 'loading' | 'pin' | 'options' | 'busy';

export const WalletPrivateKeyGoogleAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [stage, setStage] = useState<Stage>('loading');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [pinPromptVisible, setPinPromptVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const jwt = await AsyncStorage.getItem('jwt');
        const mid = jwt ? jwtPayloadSub(jwt) : null;
        let emailRaw = await AsyncStorage.getItem('userEmail');
        if (!emailRaw) {
          try {
            const ud = await AsyncStorage.getItem('userData');
            if (ud) emailRaw = (JSON.parse(ud) as { email?: string })?.email ?? null;
          } catch {  }
        }
        if (cancelled) return;
        if (mid == null || !emailRaw) {
          await showAlert(
            t('common.messages.error') || '오류',
            t('screens.wallet.missingInfo') || '사용자 정보를 찾을 수 없습니다',
          );
          goBack();
          return;
        }
        setMemberId(mid);
        setEmail(emailRaw.toLowerCase().trim());
        setStage('pin');
        setPinPromptVisible(true);
      } catch (e) {
        if (__DEV__) console.warn('[WalletKeyBackup] mount fail:', e);
        goBack();
      }
    })();
    return () => { cancelled = true; };

  }, []);

  const onPinPromptSuccess = (_wallets: unknown[]) => {

    setPinPromptVisible(false);
    setStage('options');
  };

  const onPinPromptCancel = () => {
    setPinPromptVisible(false);
    goBack();
  };

  const buildBackupPayload = async (): Promise<BackupPayload | null> => {
    if (memberId == null || !email) return null;
    return exportBackup(email, memberId);
  };

  const handleFileBackup = async () => {
    if (stage !== 'options') return;
    setStage('busy');
    try {
      const payload = await buildBackupPayload();
      if (!payload) {
        await showAlert(
          t('common.messages.error') || '오류',
          'PIN 설정된 지갑이 없습니다. 먼저 지갑 PIN 을 설정하세요.',
        );
        setStage('options');
        return;
      }
      const json = JSON.stringify(payload, null, 2);
      const fileName = `xrun-wallet-backup-${payload.member}-${payload.exported_at}.json`;
      const path = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(path, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const shareUrl = path.startsWith('file://') ? path : `file://${path}`;
      try {
        await Share.share({
          url: shareUrl,
          title: 'XRUN 지갑 백업',
          message: 'XRUN 지갑 키 백업 (PIN 으로 보호됨)',
        });
      } catch {

      }
      await showAlert(
        '백업 완료',
        `파일 저장 완료\n경로: ${path}\n\n이 파일은 PIN 없이는 복호화할 수 없습니다.`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] file fail:', e);
      await showAlert(
        t('common.messages.error') || '오류',
        '파일 저장에 실패했습니다',
      );
      setStage('options');
    }
  };

  const handleGdriveBackup = async () => {

    Alert.alert(
      'Google Drive 백업',
      '구현 준비 중입니다. 현재는 파일 백업만 사용 가능합니다.',
    );
  };

  return (
    <SafeView>
      <Header title="지갑 키 백업" onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.content}>
        {stage === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
          </View>
        )}

        {stage === 'pin' && (
          <View style={styles.center}>
            <Text style={styles.message}>PIN 입력을 기다리는 중...</Text>
          </View>
        )}

        {(stage === 'options' || stage === 'busy') && (
          <View style={styles.optionsContainer}>
            <Text style={styles.title}>백업 방식을 선택하세요</Text>
            <Text style={styles.subtitle}>
              지갑 키는 현재 PIN 으로 암호화되어 있습니다.{'\n'}
              백업 파일은 PIN 없이 복호화할 수 없습니다.
            </Text>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={handleFileBackup}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="document-outline" size={32} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>파일로 저장</Text>
                <Text style={styles.optionDesc}>
                  앱 문서 폴더에 저장 + 다른 앱으로 공유
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={handleGdriveBackup}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-upload-outline" size={32} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>Google Drive 에 저장</Text>
                <Text style={styles.optionDesc}>구글 계정 클라우드에 암호화 저장</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            {stage === 'busy' && (
              <View style={styles.busyOverlay}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
                <Text style={styles.busyText}>처리 중...</Text>
              </View>
            )}
          </View>
        )}
      </SafeScrollView>

      {memberId != null && email !== '' && (
        <WalletKeyPinPromptModal
          visible={pinPromptVisible}
          memberId={memberId}
          email={email}
          onSuccess={onPinPromptSuccess}
          onCancel={onPinPromptCancel}
        />
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  message: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: FONTS.medium,
  },
  optionsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.darkGray,
    fontFamily: FONTS.regular,
    marginBottom: 24,
    lineHeight: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
  },
  disabled: {
    opacity: 0.5,
  },
  busyOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  busyText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.darkGray,
  },
});
