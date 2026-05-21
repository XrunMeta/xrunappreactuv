

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

import * as FileSystem from 'expo-file-system/legacy';
import * as Clipboard from 'expo-clipboard';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Header, SafeView, SafeScrollView, WalletKeyPinPromptModal } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  jwtPayloadSub,
  exportBackup,
  encryptBackupJson,
  buildPlainBackup,
  NETWORK_MAP,
  type BackupPayload,
  type WalletKey,
  type WalletNetwork,
} from '../services/walletKeyStore';

type Stage = 'loading' | 'pin' | 'options' | 'view' | 'busy';

const NETWORK_LABEL: Record<WalletNetwork, string> = {
  eth: 'Ethereum (ETH 계열)',
  pol: 'Polygon (POL 계열)',
};

export const WalletPrivateKeyGoogleAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [stage, setStage] = useState<Stage>('loading');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [pinPromptVisible, setPinPromptVisible] = useState(false);

  const [wallets, setWallets] = useState<WalletKey[]>([]);

  const [pin, setPinState] = useState<string>('');

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

  const onPinPromptSuccess = (ws: WalletKey[], pinPlain: string) => {

    setWallets(ws);
    setPinState(pinPlain);
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
    if (!pin) {
      await showAlert(
        t('common.messages.error') || '오류',
        'PIN 정보가 메모리에 없습니다. 화면을 다시 열어 PIN 을 입력해주세요.',
      );
      setStage('pin');
      setPinPromptVisible(true);
      return;
    }
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

      const json = JSON.stringify(payload);
      const encrypted = encryptBackupJson(json, pin);
      const fileName = `xrunwallet-${payload.exported_at}.txt`;
      const path = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(path, encrypted);
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
        `파일 저장 완료\n파일명: ${fileName}\n\n이 파일은 PIN 없이는 복호화할 수 없습니다.`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] file fail:', e);
      await showAlert(
        t('common.messages.error') || '오류',
        `파일 저장 실패: ${e?.message ?? '알 수 없는 오류'}`,
      );
      setStage('options');
    }
  };

  const handleGdriveBackup = async () => {
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

      if (!pin) throw new Error('PIN 정보 누락 — 화면을 다시 열어주세요');
      const jsonRaw = JSON.stringify(payload);
      const json = encryptBackupJson(jsonRaw, pin);
      const fileName = `xrunwallet-${payload.exported_at}.txt`;

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false }).catch(() => {});
      let current: any = null;
      try { current = GoogleSignin.getCurrentUser(); } catch {  }
      if (!current) {
        await GoogleSignin.signIn();
      }

      try {
        await GoogleSignin.addScopes({
          scopes: ['https://www.googleapis.com/oth-path'],
        });
      } catch (scopeErr: any) {

        if (__DEV__) console.warn('[WalletKeyBackup] addScopes:', scopeErr);
      }

      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens?.accessToken;
      if (!accessToken) throw new Error('Google access token 획득 실패');

      const boundary = '------xrunbackup-' + Date.now();
      const metadata = JSON.stringify({
        name: fileName,
        mimeType: 'text/plain',
      });
      const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${metadata}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: text/plain\r\n\r\n` +
        `${json}\r\n` +
        `--${boundary}--`;

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body,
        },
      );
      if (!res.ok) {
        const errBody = await res.text();

        if (res.status === 403 && /has not been used|disabled/i.test(errBody)) {
          throw new Error(
            'Google Drive API 가 활성화되어 있지 않습니다.\n관리자가 GCP 콘솔에서 Drive API 를 활성화해야 합니다.',
          );
        }
        throw new Error(`Drive upload ${res.status}: ${errBody.slice(0, 200)}`);
      }
      await res.json(); 

      await showAlert(
        '백업 완료',
        `Google Drive 에 저장 완료\n파일명: ${fileName}\n\n이 파일은 PIN 없이는 복호화할 수 없습니다.`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] gdrive fail:', e);
      await showAlert(
        t('common.messages.error') || '오류',
        `Google Drive 저장 실패: ${e?.message ?? '알 수 없는 오류'}`,
      );
      setStage('options');
    }
  };

  const performGdrivePlainUpload = async () => {
    setStage('busy');
    try {
      if (wallets.length === 0) {
        throw new Error('표시 가능한 wallet 이 없습니다');
      }
      const payload = buildPlainBackup(email, wallets);
      const json = JSON.stringify(payload, null, 2);
      const fileName = `xrunwallet-PLAIN-${payload.exported_at}.txt`;

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false }).catch(() => {});
      let current: any = null;
      try { current = GoogleSignin.getCurrentUser(); } catch {  }
      if (!current) {
        await GoogleSignin.signIn();
      }
      try {
        await GoogleSignin.addScopes({
          scopes: ['https://www.googleapis.com/oth-path'],
        });
      } catch {  }
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens?.accessToken;
      if (!accessToken) throw new Error('Google access token 획득 실패');

      const boundary = '------xrunplain-' + Date.now();
      const metadata = JSON.stringify({
        name: fileName,
        mimeType: 'text/plain',
      });
      const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${metadata}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: text/plain\r\n\r\n` +
        `${json}\r\n` +
        `--${boundary}--`;

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body,
        },
      );
      if (!res.ok) {
        const errBody = await res.text();
        if (res.status === 403 && /has not been used|disabled/i.test(errBody)) {
          throw new Error('Google Drive API 가 활성화되어 있지 않습니다.');
        }
        throw new Error(`Drive upload ${res.status}: ${errBody.slice(0, 200)}`);
      }
      await res.json();
      await showAlert(
        '평문 저장 완료',
        `Google Drive 에 평문 키 저장됨\n파일명: ${fileName}\n\n!! 이 파일이 유출되면 즉시 자산을 옮길 수 있습니다 !!\n사용 후 반드시 Drive 에서 삭제해주세요.`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] gdrive plain fail:', e);
      await showAlert(
        t('common.messages.error') || '오류',
        `Google Drive 평문 저장 실패: ${e?.message ?? '알 수 없는 오류'}`,
      );
      setStage('options');
    }
  };

  const handleGdrivePlainBackup = () => {
    if (stage !== 'options') return;

    Alert.alert(
      '⚠️ 매우 위험합니다',
      '평문 (암호화 없이) 으로 개인 키를 Google Drive 에 저장합니다.\n\n' +
      '이 파일을 누군가 받으면 비밀번호 없이 지갑의 모든 자산을 옮길 수 있습니다.\n\n' +
      '정말 진행하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '이해했습니다, 계속',
          style: 'destructive',
          onPress: () => {

            Alert.alert(
              '⚠️ 마지막 확인',
              '평문 PK 가 그대로 Drive 에 저장됩니다.\n' +
              '파일을 받은 사람은 즉시 자산을 옮길 수 있습니다.\n\n' +
              '계속하시겠습니까?',
              [
                { text: '취소', style: 'cancel' },
                {
                  text: '예, 평문 저장합니다',
                  style: 'destructive',
                  onPress: () => { void performGdrivePlainUpload(); },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleViewKey = () => {
    if (stage !== 'options') return;
    Alert.alert(
      '경고',
      '개인 키를 평문으로 표시합니다.\n주변에 다른 사람이 화면을 보지 못하도록 주의해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => setStage('view') },
      ],
    );
  };

  const handleCopyKey = (pk: string) => {
    Alert.alert(
      '경고',
      '키를 클립보드에 복사합니다.\n다른 앱이 클립보드를 읽을 수 있습니다. 사용 후 즉시 다른 내용을 복사해 클립보드를 비워주세요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            try {
              await Clipboard.setStringAsync(pk);
              await showAlert(
                '복사 완료',
                '복사 완료되었습니다.\n사용하고자 하는 곳에 붙여넣으시면 됩니다.',
              );
            } catch (e: any) {
              await showAlert(
                t('common.messages.error') || '오류',
                `복사 실패: ${e?.message ?? '알 수 없는 오류'}`,
              );
            }
          },
        },
      ],
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
              지갑 키는 PIN 으로 보호되어 있습니다.{'\n'}
              파일/Drive 백업은 PIN 없이 복호화할 수 없습니다.
            </Text>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={handleFileBackup}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="document-outline" size={28} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>파일로 저장</Text>
                <Text style={styles.optionDesc}>다른 앱으로 공유 (메일·iCloud·파일 등)</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={handleGdriveBackup}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-upload-outline" size={28} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>Google Drive 에 저장</Text>
                <Text style={styles.optionDesc}>구글 계정 클라우드에 암호화 저장</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.viewCard, stage === 'busy' && styles.disabled]}
              onPress={handleViewKey}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="eye-outline" size={28} color="#a36a00" />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>키 직접 보기 / 복사</Text>
                <Text style={styles.optionDesc}>평문으로 화면에 표시 + 복사 가능 (주의)</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.dangerCard, stage === 'busy' && styles.disabled]}
              onPress={handleGdrivePlainBackup}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="warning-outline" size={28} color="#ffffff" />
              <View style={styles.optionTextWrap}>
                <Text style={styles.dangerLabel}>Google Drive 에 평문 저장</Text>
                <Text style={styles.dangerDesc}>
                  암호화 없이 PK 저장. 파일 유출 시 즉시 자산 손실.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />
            </TouchableOpacity>

            {stage === 'busy' && (
              <View style={styles.busyOverlay}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
                <Text style={styles.busyText}>처리 중...</Text>
              </View>
            )}
          </View>
        )}

        {stage === 'view' && (
          <View style={styles.viewContainer}>
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color="#a36a00" />
              <Text style={styles.warningText}>
                평문 키가 표시되어 있습니다. 화면 캡처·녹화·노출에 주의해주세요.
              </Text>
            </View>

            {wallets.map((w) => {
              const network = NETWORK_MAP[w.wallet_code];
              if (!network) return null;
              return (
                <View key={w.wallet_code} style={styles.keyCard}>
                  <Text style={styles.networkLabel}>{NETWORK_LABEL[network]}</Text>
                  <Text style={styles.codeLabel}>
                    {w.wallet_code} · {w.address}
                  </Text>
                  <Text style={styles.privateKey} selectable>
                    {w.private_key}
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyKey(w.private_key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="copy-outline" size={18} color="#ffffff" />
                    <Text style={styles.copyButtonText}>이 키 복사</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStage('options')}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>옵션으로 돌아가기</Text>
            </TouchableOpacity>
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
  viewCard: {
    backgroundColor: '#fffaf2',
    borderColor: '#f0c97a',
  },
  dangerCard: {
    backgroundColor: '#c0392b',
    borderColor: '#a3271b',
  },
  dangerLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
    marginBottom: 2,
  },
  dangerDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#ffdedb',
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  optionLabel: {
    fontSize: 15,
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
  viewContainer: {
    flex: 1,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7e6',
    borderColor: '#f0c97a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#7a4a00',
    fontFamily: FONTS.medium,
  },
  keyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
    padding: 16,
    marginBottom: 12,
  },
  networkLabel: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 4,
  },
  codeLabel: {
    fontSize: 11,
    color: COLORS.darkGray,
    fontFamily: FONTS.regular,
    marginBottom: 10,
  },
  privateKey: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#222',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: 10,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginLeft: 6,
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: FONTS.medium,
    textDecorationLine: 'underline',
  },
});
