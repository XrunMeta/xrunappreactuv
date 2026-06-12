

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

let DocumentPicker: any;
try {
  DocumentPicker = require('expo-document-picker');
} catch (e) {
  console.warn('[WalletRestore] expo-document-picker 네이티브 모듈 없음 — 리빌드 필요:', e);
  DocumentPicker = { getDocumentAsync: async () => ({ canceled: true, assets: [], __missingNative: true }) };
}
import * as FileSystem from 'expo-file-system/legacy';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Header, SafeView, SafeScrollView, WalletKeyPinPromptModal } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  jwtPayloadSub,
  markUserUnlocked,
  decryptBackupJson,
  restoreBackup,
  restorePlainBackup,
  type BackupPayload,
  type PlainBackupPayload,
} from '../services/walletKeyStore';

type Stage = 'loading' | 'pin' | 'options' | 'busy' | 'gdrive-list';

const NETWORK_LABEL: Record<string, string> = {
  eth: 'Ethereum (ETH 계열)',
  pol: 'Polygon (POL 계열)',
};

interface DriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
  size?: string;

  isPlainGuess: boolean;
}

const CIPHER_HEAD_RE = /^[0-9a-fA-F]{32}:/;

export const WalletRestoreScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [stage, setStage] = useState<Stage>('loading');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [pinPromptVisible, setPinPromptVisible] = useState(false);
  const [pin, setPin] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);

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
        const normEmail = emailRaw.toLowerCase().trim();
        setMemberId(mid);
        setEmail(normEmail);
        setStage('pin');
        setPinPromptVisible(true);
      } catch (e) {
        if (__DEV__) console.warn('[WalletRestore] mount fail:', e);
        goBack();
      }
    })();
    return () => { cancelled = true; };
  }, [goBack, showAlert, t]);

  const onPinPromptSuccess = (_wallets: any[], pinValue?: string) => {
    if (email && memberId != null) {
      markUserUnlocked(email, memberId);
    }
    setPin(pinValue ?? '');
    setPinPromptVisible(false);
    setStage('options');
  };

  const onPinPromptCancel = () => {
    setPinPromptVisible(false);
    goBack();
  };

  const processBackupContent = async (
    content: string,
    sourceLabel: string,   
  ) => {
    if (memberId == null || !email || !pin) {
      Alert.alert('오류', '인증 정보 누락');
      return;
    }
    const trimmed = content.trim();

    if (CIPHER_HEAD_RE.test(trimmed)) {

      let json: string;
      try {
        json = decryptBackupJson(trimmed, pin);
      } catch {
        Alert.alert('복호화 실패', 'PIN 이 백업 시점과 다르거나 파일이 손상되었습니다');
        return;
      }
      if (!json) {
        Alert.alert('복호화 실패', '백업 파일을 풀 수 없습니다 (PIN 불일치)');
        return;
      }
      let payload: BackupPayload;
      try {
        payload = JSON.parse(json) as BackupPayload;
      } catch {
        Alert.alert('파일 형식 오류', '백업 JSON 파싱 실패');
        return;
      }

      const networkCount = payload.entries?.length ?? 0;
      const dateStr = new Date(payload.exported_at || 0).toLocaleString();
      const msg =
        `백업 일시   ${dateStr}\n` +
        `포함된 키   ${networkCount}개\n\n` +
        `지금 사용하고 있는 지갑 키를\n` +
        `이 백업으로 바꿔서 가져올게요.\n\n` +
        `진행해도 괜찮을까요?`;
      const ok = await showAlert('지갑 복원', msg, [
        { text: t('common.cancel') || '취소' },
        { text: t('common.confirm') || '복원하기' },
      ]);
      if (ok !== 1) return;
      const result = await restoreBackup(payload, email, memberId, pin);
      showRestoreResult(result.ok, result.imported, result.skipped, result.reason, sourceLabel);
      return;
    }

    if (trimmed.startsWith('{')) {

      let parsed: any;
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        Alert.alert('파일 형식 오류', '지원하지 않는 백업 형식입니다');
        return;
      }
      if (parsed && parsed.warning === 'PLAIN_TEXT_DO_NOT_SHARE' && Array.isArray(parsed.wallets)) {
        const plain = parsed as PlainBackupPayload;

        if ((plain.email || '').toLowerCase().trim() !== email) {
          Alert.alert(
            '사용자 불일치',
            `백업의 사용자(${plain.email}) 와 현재 사용자(${email}) 가 다릅니다.\n` +
              '자신의 계정으로 로그인한 상태에서 복원해주세요.',
          );
          return;
        }

        const NETWORK_NAME: Record<string, string> = { eth: 'Ethereum', pol: 'Polygon' };
        const addrLines = plain.wallets
          .map((w) => `   ${NETWORK_NAME[w.network] || w.network}    ${w.address.slice(0, 10)}…${w.address.slice(-6)}`)
          .join('\n');
        const dateStr = new Date(plain.exported_at || 0).toLocaleString();
        const msg =
          `이 백업은 암호화되지 않은 상태예요.\n` +
          `복원하면 비밀번호로 다시 안전하게 보호돼요.\n\n` +
          `백업 일시   ${dateStr}\n\n` +
          `복원될 지갑\n${addrLines}\n\n` +
          `진행해도 괜찮을까요?`;
        const ok = await showAlert('지갑 복원', msg, [
          { text: t('common.cancel') || '취소' },
          { text: t('common.confirm') || '복원하기' },
        ]);
        if (ok !== 1) return;
        const result = await restorePlainBackup(plain, email, memberId, pin);
        showRestoreResult(
          result.ok,
          result.imported,
          result.skipped.map((s) => ({ network: s.wallet_code, reason: s.reason })),
          result.reason,
          sourceLabel,
        );
        return;
      }
      Alert.alert('파일 형식 오류', '지원하지 않는 백업 JSON 입니다');
      return;
    }

    Alert.alert('파일 형식 오류', '암호화 백업도 평문 백업도 아닙니다');
  };

  const showRestoreResult = (
    ok: boolean,
    imported: string[],
    skipped: { network: string; reason: string }[],
    reason: string | undefined,
    sourceLabel: string,
  ) => {
    if (!ok) {
      const reasonText = (() => {
        switch (reason) {
          case 'invalid-version': return '지원하지 않는 백업 버전입니다';
          case 'invalid-format': return '지원하지 않는 백업 형식입니다';
          case 'empty-entries':
          case 'empty-wallets': return '백업에 복원 가능한 키가 없습니다';
          case 'email-mismatch': return '백업의 사용자와 현재 사용자가 다릅니다';
          case 'hash-mismatch': return '백업 무결성 검증 실패 — 파일이 손상되었거나 변조되었습니다';
          default: return `복원 실패: ${reason || '알 수 없는 오류'}`;
        }
      })();

      const detail = skipped.length > 0
        ? '\n\n· 복원 못 한 키:\n' + skipped.map((s) => `   ${NETWORK_LABEL[s.network] || s.network} (${s.reason})`).join('\n')
        : '';
      showAlert('지갑 복원 실패', reasonText + detail, [
        { text: t('common.confirm') || '확인' },
      ]);
      return;
    }

    const successList = imported.map((n) => `✓ ${NETWORK_LABEL[n] || n}`).join('\n');
    const skipDetail = skipped.length > 0
      ? '\n\n복원 못 한 키:\n' + skipped.map((s) => `· ${NETWORK_LABEL[s.network] || s.network}`).join('\n')
      : '';
    showAlert(
      '복원 완료',
      `다음 지갑이 복원됐어요:\n\n${successList}${skipDetail}`,
      [{ text: t('common.confirm') || '확인' }],
    ).then(() => {
      navigate(ROUTES.wallet);
    });
  };

  const handleRestoreFromFile = async () => {
    if (!email || memberId == null || !pin) {
      Alert.alert(t('common.messages.error') || '오류', '인증 정보 누락 — 다시 진입해주세요');
      return;
    }
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/octet-stream', '*/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if ((picked as any).__missingNative) {
        Alert.alert(
          '복원 불가',
          '파일 선택 기능이 현재 빌드에 포함되지 않았습니다.\n앱을 새 빌드로 업데이트한 뒤 다시 시도해주세요.\n(개발자: ./gradlew clean + EAS dev build 필요)',
        );
        return;
      }
      if (picked.canceled) return;
      const asset = picked.assets?.[0];
      if (!asset?.uri) {
        Alert.alert('파일 선택 실패', 'URI 를 가져오지 못했습니다');
        return;
      }
      setStage('busy');
      let content: string;
      try {
        content = await FileSystem.readAsStringAsync(asset.uri);
      } catch (e: any) {
        setStage('options');
        Alert.alert('파일 읽기 실패', e?.message || '파일을 읽을 수 없습니다');
        return;
      }
      await processBackupContent(content, '파일');
      setStage('options');
    } catch (e: any) {
      setStage('options');
      if (__DEV__) console.warn('[WalletRestore] file restore fail:', e);
      Alert.alert('복원 오류', e?.message || '알 수 없는 오류');
    }
  };

  const ensureDriveAccessToken = async (): Promise<string> => {
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
      if (__DEV__) console.warn('[WalletRestore] addScopes:', scopeErr);
    }
    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens?.accessToken;
    if (!accessToken) throw new Error('Google access token 획득 실패');
    return accessToken;
  };

  const fetchDriveFiles = async (accessToken: string): Promise<DriveFile[]> => {

    const q = "name contains 'xrunwallet-' and trashed=false";
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime%20desc&pageSize=30`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const errBody = await res.text();
      if (res.status === 403 && /has not been used|disabled/i.test(errBody)) {
        throw new Error('Google Drive API 가 활성화되어 있지 않습니다.\nGCP 콘솔에서 활성화 필요.');
      }
      throw new Error(`Drive list ${res.status}: ${errBody.slice(0, 200)}`);
    }
    const json = (await res.json()) as { files: Array<{ id: string; name: string; modifiedTime?: string; size?: string }> };
    return (json.files || []).map((f) => ({
      ...f,

      isPlainGuess: /\.keyplain$/i.test(f.name) || /PLAIN/i.test(f.name),
    }));
  };

  const handleRestoreFromGDrive = async () => {
    if (!email || memberId == null || !pin) {
      Alert.alert(t('common.messages.error') || '오류', '인증 정보 누락 — 다시 진입해주세요');
      return;
    }
    setStage('busy');
    try {
      const token = await ensureDriveAccessToken();
      const files = await fetchDriveFiles(token);
      if (files.length === 0) {
        setStage('options');
        Alert.alert('백업 파일 없음', 'Google Drive 에 백업 파일이 없습니다');
        return;
      }
      setDriveFiles(files);
      setStage('gdrive-list');
    } catch (e: any) {
      setStage('options');
      if (__DEV__) console.warn('[WalletRestore] gdrive list fail:', e);
      Alert.alert('Drive 목록 조회 실패', e?.message || '알 수 없는 오류');
    }
  };

  const handlePickDriveFile = async (file: DriveFile) => {
    setStage('busy');
    try {
      const token = await ensureDriveAccessToken();
      const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Drive download ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const content = await res.text();
      await processBackupContent(content, 'Google Drive');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletRestore] gdrive download fail:', e);
      Alert.alert('Drive 다운로드 실패', e?.message || '알 수 없는 오류');
    } finally {
      setStage('options');
    }
  };

  if (stage === 'loading') {
    return (
      <SafeView style={styles.container}>
        <Header title={t('screens.walletRestore.title') || '지갑 복원'} onBackPress={goBack} showBackButton />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      </SafeView>
    );
  }

  if (stage === 'pin') {
    return (
      <SafeView style={styles.container}>
        {}
        {memberId != null && email && (
          <WalletKeyPinPromptModal
            visible={pinPromptVisible}
            memberId={memberId}
            email={email}
            onSuccess={onPinPromptSuccess}
            onCancel={onPinPromptCancel}
            skipVaultCheck
          />
        )}
      </SafeView>
    );
  }

  if (stage === 'gdrive-list') {
    return (
      <SafeView style={styles.container}>
        <Header
          title={t('screens.walletRestore.title') || '지갑 복원'}
          onBackPress={() => setStage('options')}
          showBackButton
        />
        <SafeScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Google Drive 백업 목록</Text>
          <Text style={styles.subheading}>
            앱이 만든 백업 파일만 표시됩니다. 복원할 파일을 선택해주세요.
          </Text>
          {driveFiles.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={styles.optionCard}
              activeOpacity={0.85}
              onPress={() => handlePickDriveFile(f)}
            >
              <View style={[styles.optionIcon, f.isPlainGuess && styles.optionIconDanger]}>
                <Ionicons
                  name={f.isPlainGuess ? 'warning-outline' : 'lock-closed-outline'}
                  size={24}
                  color={f.isPlainGuess ? '#cf3a3a' : COLORS.buttonPrimary}
                />
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle} numberOfLines={1}>{f.name}</Text>
                <Text style={styles.optionDesc}>
                  {f.isPlainGuess ? '⚠️ 평문 백업' : '🔒 PIN 암호화'}
                  {f.modifiedTime ? ` · ${new Date(f.modifiedTime).toLocaleString()}` : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>
          ))}
        </SafeScrollView>
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.container}>
      <Header title={t('screens.walletRestore.title') || '지갑 복원'} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>
          {t('screens.walletRestore.heading') || '복원 소스 선택'}
        </Text>
        <Text style={styles.subheading}>
          {t('screens.walletRestore.subheading') ||
            '백업 파일을 선택해 키를 복원합니다. PIN 으로 암호화된 백업만 사용할 수 있어요.'}
        </Text>

        <TouchableOpacity
          style={[styles.optionCard, stage === 'busy' && styles.optionCardDisabled]}
          activeOpacity={0.85}
          onPress={handleRestoreFromFile}
          disabled={stage === 'busy'}
        >
          <View style={styles.optionIcon}>
            <Ionicons name="document-outline" size={28} color={COLORS.buttonPrimary} />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>
              {t('screens.walletRestore.fromFile') || '파일에서 복원'}
            </Text>
            <Text style={styles.optionDesc}>
              {t('screens.walletRestore.fromFileDesc') || '단말 저장소의 백업 파일 (.txt) 선택'}
            </Text>
          </View>
          {stage === 'busy' ? (
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, stage === 'busy' && styles.optionCardDisabled]}
          activeOpacity={0.85}
          onPress={handleRestoreFromGDrive}
          disabled={stage === 'busy'}
        >
          <View style={styles.optionIcon}>
            <Ionicons name="cloud-outline" size={28} color={COLORS.buttonPrimary} />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>
              {t('screens.walletRestore.fromGDrive') || 'Google Drive 에서 복원'}
            </Text>
            <Text style={styles.optionDesc}>
              {t('screens.walletRestore.fromGDriveDesc') || 'Drive 에 저장한 백업 파일 가져오기'}
            </Text>
          </View>
          {stage === 'busy' ? (
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          {t('screens.walletRestore.note') ||
            '복원 시 같은 PIN 을 입력해야 백업 내용을 풀 수 있습니다. PIN 을 잊으면 복원이 불가능합니다.'}
        </Text>
      </SafeScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
    paddingBottom: SIZES.xlarge,
  },
  heading: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginBottom: 20,
    lineHeight: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0eeff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionIconDanger: {
    backgroundColor: '#ffe5e5',
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  note: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
});
