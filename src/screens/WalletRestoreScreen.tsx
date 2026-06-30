

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  decryptBackupJson,
  decryptBackupJsonAny,
  restoreBackup,
  restorePlainBackup,
  type BackupPayload,
  type PlainBackupPayload,
  type WalletKey,
} from '../services/walletKeyStore';

type Stage = 'loading' | 'pin' | 'options' | 'busy' | 'gdrive-list';

const NETWORK_LABEL: Record<string, string> = {
  eth: 'Ethereum',
  pol: 'Polygon',
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

  const [pendingBackup, setPendingBackup] = useState<{ content: string; source: string } | null>(null);

  const [passphraseModalVisible, setPassphraseModalVisible] = useState(false);
  const [passphraseInput, setPassphraseInput] = useState('');

  const [pendingBv2Data, setPendingBv2Data] = useState<{
    passphrase: string;
    payload: BackupPayload;
    source: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const jwt = await AsyncStorage.getItem('jwt');
        let mid: number | null = jwt ? jwtPayloadSub(jwt) : null;
        let emailRaw = await AsyncStorage.getItem('userEmail');

        if (mid == null || !emailRaw) {
          try {
            const ud = await AsyncStorage.getItem('userData');
            if (ud) {
              const parsed = JSON.parse(ud) as { email?: string; member?: number | string };
              if (mid == null && parsed?.member != null) mid = Number(parsed.member);
              if (!emailRaw && parsed?.email) emailRaw = parsed.email;
            }
          } catch {  }
        }
        if (cancelled) return;
        console.log('[WalletRestore] mount', { mid, email: emailRaw, hasJwt: !!jwt });
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

        setStage('options');
      } catch (e) {
        if (__DEV__) console.warn('[WalletRestore] mount fail:', e);
        goBack();
      }
    })();
    return () => { cancelled = true; };
  }, [goBack, showAlert, t]);

  const onPinPromptSuccess = (_wallets: WalletKey[], pinValue?: string) => {
    const p = pinValue ?? '';
    setPin(p);
    setPinPromptVisible(false);

    if (pendingBv2Data) {
      const { passphrase, payload, source } = pendingBv2Data;
      setPendingBv2Data(null);
      if (memberId == null || !email) return;
      setStage('busy');
      restoreBackup(payload, email, memberId, passphrase, p).then((result) => {
        setStage('options');
        showRestoreResult(result.ok, result.imported, result.skipped, result.reason, source);
      }).catch(() => {
        setStage('options');
      });
      return;
    }

    if (pendingBackup) {
      const { content, source } = pendingBackup;
      setPendingBackup(null);
      runDecryption(content, source, p);
    }
  };

  const onPinPromptCancel = () => {
    setPinPromptVisible(false);

    if (pendingBv2Data) {
      setPendingBv2Data(null);
      setStage('options');
      return;
    }

    if (pendingBackup) {
      setPendingBackup(null);
      setStage('options');
      return;
    }
    goBack();
  };

  const processBackupContent = async (
    content: string,
    sourceLabel: string,
  ) => {
    if (memberId == null || !email) {
      await showAlert(t('screens.walletRestore.alerts.errorTitle'), t('screens.walletRestore.alerts.missingAuthInfo'));
      return;
    }
    setPendingBackup({ content, source: sourceLabel });
    const trimmed = content.trim();
    if (trimmed.startsWith('bv2:')) {

      setPassphraseInput('');
      setPassphraseModalVisible(true);
    } else {

      setPinPromptVisible(true);
    }
  };

  const onPassphraseSubmit = async () => {
    if (!pendingBackup || !passphraseInput) return;
    const { content, source } = pendingBackup;
    const pp = passphraseInput;

    setPassphraseInput('');
    setPassphraseModalVisible(false);

    if (memberId == null || !email) return;
    setStage('busy');

    let json: string;
    try {
      json = await decryptBackupJsonAny(content.trim(), pp);
    } catch {
      setPendingBackup(null);
      setStage('options');
      await showAlert(
        t('screens.walletRestore.alerts.decryptFailTitle'),
        t('screens.walletRestore.alerts.decryptFailPin'),
      );
      return;
    }
    if (!json) {
      setPendingBackup(null);
      setStage('options');
      await showAlert(
        t('screens.walletRestore.alerts.decryptFailTitle'),
        t('screens.walletRestore.alerts.decryptFailPassphrase') ||
          '잘못된 비밀번호/passphrase 또는 손상된 백업입니다.',
      );
      return;
    }

    let payload: BackupPayload;
    try {
      payload = JSON.parse(json) as BackupPayload;
    } catch {
      setPendingBackup(null);
      setStage('options');
      await showAlert(
        t('screens.walletRestore.alerts.formatErrorTitle'),
        t('screens.walletRestore.alerts.jsonParseFail'),
      );
      return;
    }

    const networkCount = payload.entries?.length ?? 0;
    const dateStr = new Date(payload.exported_at || 0).toLocaleString();
    const msg = t('screens.walletRestore.alerts.restoreEncryptedTemplate', { date: dateStr, count: networkCount });
    const okIdx = await showAlert(t('screens.walletRestore.alerts.restoreTitle'), msg, [
      { text: t('common.cancel') || '취소' },
      { text: t('common.confirm') || '복원하기' },
    ]);

    if (okIdx !== 1) {
      setPendingBackup(null);
      setStage('options');
      return;
    }

    setPendingBv2Data({ passphrase: pp, payload, source });
    setPendingBackup(null);
    setStage('options');
    setPinPromptVisible(true);
  };

  const onPassphraseCancel = () => {

    setPassphraseModalVisible(false);
    setPassphraseInput('');
    setPendingBackup(null);
    setStage('options');
  };

  const runDecryption = async (
    content: string,
    sourceLabel: string,
    secretArg: string,
  ) => {
    if (memberId == null || !email || !secretArg) {
      await showAlert(t('screens.walletRestore.alerts.errorTitle'), t('screens.walletRestore.alerts.missingAuthInfo'));
      return;
    }
    const trimmed = content.trim();

    if (CIPHER_HEAD_RE.test(trimmed)) {

      let json: string;
      try {
        json = decryptBackupJson(trimmed, secretArg);
      } catch {
        await showAlert(t('screens.walletRestore.alerts.decryptFailTitle'), t('screens.walletRestore.alerts.decryptFailPin'));
        return;
      }

      if (!json) {
        await showAlert(
          t('screens.walletRestore.alerts.decryptFailTitle'),
          t('screens.walletRestore.alerts.decryptFailGeneric') ||
            '잘못된 비밀번호/passphrase 또는 손상된 백업입니다.',
        );
        return;
      }
      let payload: BackupPayload;
      try {
        payload = JSON.parse(json) as BackupPayload;
      } catch {
        await showAlert(t('screens.walletRestore.alerts.formatErrorTitle'), t('screens.walletRestore.alerts.jsonParseFail'));
        return;
      }

      const networkCount = payload.entries?.length ?? 0;
      const dateStr = new Date(payload.exported_at || 0).toLocaleString();
      const msg = t('screens.walletRestore.alerts.restoreEncryptedTemplate', { date: dateStr, count: networkCount });
      const ok = await showAlert(t('screens.walletRestore.alerts.restoreTitle'), msg, [
        { text: t('common.cancel') || '취소' },
        { text: t('common.confirm') || '복원하기' },
      ]);
      if (ok !== 1) return;
      const result = await restoreBackup(payload, email, memberId, secretArg);
      showRestoreResult(result.ok, result.imported, result.skipped, result.reason, sourceLabel);
      return;
    }

    if (trimmed.startsWith('{')) {

      let parsed: any;
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        await showAlert(t('screens.walletRestore.alerts.formatErrorTitle'), t('screens.walletRestore.alerts.unsupportedFormat'));
        return;
      }
      if (parsed && parsed.warning === 'PLAIN_TEXT_DO_NOT_SHARE' && Array.isArray(parsed.wallets)) {
        const plain = parsed as PlainBackupPayload;

        if ((plain.email || '').toLowerCase().trim() !== email) {
          await showAlert(
            t('screens.walletRestore.alerts.userMismatchTitle'),
            t('screens.walletRestore.alerts.userMismatchMessage', { backupEmail: plain.email, currentEmail: email }),
          );
          return;
        }

        const NETWORK_NAME: Record<string, string> = { eth: 'Ethereum', pol: 'Polygon' };
        const addrLines = plain.wallets
          .map((w) => `   ${NETWORK_NAME[w.network] || w.network}    ${w.address.slice(0, 10)}…${w.address.slice(-6)}`)
          .join('\n');
        const dateStr = new Date(plain.exported_at || 0).toLocaleString();
        const msg = t('screens.walletRestore.alerts.restorePlainTemplate', { date: dateStr, wallets: addrLines });
        const ok = await showAlert(t('screens.walletRestore.alerts.restoreTitle'), msg, [
          { text: t('common.cancel') || '취소' },
          { text: t('common.confirm') || '복원하기' },
        ]);
        if (ok !== 1) return;
        const result = await restorePlainBackup(plain, email, memberId, secretArg);
        showRestoreResult(
          result.ok,
          result.imported,
          result.skipped.map((s) => ({ network: s.wallet_code, reason: s.reason })),
          result.reason,
          sourceLabel,
        );
        return;
      }
      await showAlert(t('screens.walletRestore.alerts.formatErrorTitle'), t('screens.walletRestore.alerts.unsupportedJson'));
      return;
    }

    await showAlert(t('screens.walletRestore.alerts.formatErrorTitle'), t('screens.walletRestore.alerts.notEncryptedNotPlain'));
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
          case 'invalid-version': return t('screens.walletRestore.alerts.reasonInvalidVersion');
          case 'invalid-format': return t('screens.walletRestore.alerts.reasonInvalidFormat');
          case 'empty-entries':
          case 'empty-wallets': return t('screens.walletRestore.alerts.reasonEmptyEntries');
          case 'email-mismatch': return t('screens.walletRestore.alerts.reasonEmailMismatch');
          case 'hash-mismatch': return t('screens.walletRestore.alerts.reasonHashMismatch');
          default: return t('screens.walletRestore.alerts.reasonGeneric', { reason: reason || t('screens.walletRestore.alerts.reasonUnknown') });
        }
      })();

      const detail = skipped.length > 0
        ? '\n\n· ' + t('screens.walletRestore.alerts.skippedHeader') + '\n' + skipped.map((s) => `   ${NETWORK_LABEL[s.network] || s.network} (${s.reason})`).join('\n')
        : '';
      showAlert(t('screens.walletRestore.alerts.restoreFailTitle'), reasonText + detail, [
        { text: t('common.confirm') || '확인' },
      ]);
      return;
    }

    const successList = imported.map((n) => `✓ ${NETWORK_LABEL[n] || n}`).join('\n');
    const skipDetail = skipped.length > 0
      ? '\n\n' + t('screens.walletRestore.alerts.completeSkippedHeader') + '\n' + skipped.map((s) => `· ${NETWORK_LABEL[s.network] || s.network}`).join('\n')
      : '';
    showAlert(
      t('screens.walletRestore.alerts.completeTitle'),
      t('screens.walletRestore.alerts.completeTemplate', { list: successList }) + skipDetail,
      [{ text: t('common.confirm') || '확인' }],
    ).then(() => {
      navigate(ROUTES.wallet);
    });
  };

  const handleRestoreFromFile = async () => {

    if (!email || memberId == null) {
      await showAlert(t('screens.walletRestore.alerts.errorTitle'), t('screens.walletRestore.alerts.missingAuthInfoRetry'));
      return;
    }
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/octet-stream', '*/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if ((picked as any).__missingNative) {
        await showAlert(
          t('screens.walletRestore.alerts.restoreUnavailableTitle'),
          t('screens.walletRestore.alerts.restoreUnavailableNative'),
        );
        return;
      }
      if (picked.canceled) return;
      const asset = picked.assets?.[0];
      if (!asset?.uri) {
        await showAlert(t('screens.walletRestore.alerts.fileSelectFailTitle'), t('screens.walletRestore.alerts.uriFetchFail'));
        return;
      }
      setStage('busy');
      let content: string;
      try {
        content = await FileSystem.readAsStringAsync(asset.uri);
      } catch (e: any) {
        setStage('options');
        await showAlert(t('screens.walletRestore.alerts.fileReadFailTitle'), e?.message || t('screens.walletRestore.alerts.fileReadFailFallback'));
        return;
      }
      await processBackupContent(content, t('screens.walletRestore.alerts.fileSource'));
      setStage('options');
    } catch (e: any) {
      setStage('options');
      if (__DEV__) console.warn('[WalletRestore] file restore fail:', e);
      await showAlert(t('screens.walletRestore.alerts.restoreErrorTitle'), e?.message || t('screens.walletRestore.alerts.reasonUnknown'));
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

    if (!email || memberId == null) {
      await showAlert(t('screens.walletRestore.alerts.errorTitle'), t('screens.walletRestore.alerts.missingAuthInfoRetry'));
      return;
    }
    setStage('busy');
    try {
      const token = await ensureDriveAccessToken();
      const files = await fetchDriveFiles(token);
      if (files.length === 0) {
        setStage('options');
        await showAlert(t('screens.walletRestore.alerts.noBackupFileTitle'), t('screens.walletRestore.alerts.noBackupFileMessage'));
        return;
      }
      setDriveFiles(files);
      setStage('gdrive-list');
    } catch (e: any) {
      setStage('options');
      if (__DEV__) console.warn('[WalletRestore] gdrive list fail:', e);

      await showAlert(
        t('screens.walletRestore.driveAuthFailTitle'),
        t('screens.walletRestore.driveAuthFailMessage'),
      );
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
      await processBackupContent(content, 'Google ' + t('screens.walletRestore.alerts.driveSource'));
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletRestore] gdrive download fail:', e);
      await showAlert(t('screens.walletRestore.alerts.driveDownloadFailTitle'), e?.message || t('screens.walletRestore.alerts.reasonUnknown'));
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

  const isBv2PinPhase = pendingBv2Data != null;
  const pinModal = memberId != null && email ? (
    <WalletKeyPinPromptModal
      visible={pinPromptVisible}
      memberId={memberId}
      email={email}
      onSuccess={onPinPromptSuccess}
      onCancel={onPinPromptCancel}
      skipVaultCheck
      {...(isBv2PinPhase ? {
        titleOverride: '이 기기에서 사용할 PIN을 설정하세요',
        descriptionOverride: '복원된 지갑을 이 기기에서 보호할 6자리 PIN을 입력하세요.',
      } : {})}
    />
  ) : null;

  const passphraseModal = (
    <Modal
      visible={passphraseModalVisible}
      animationType="slide"
      transparent
      onRequestClose={onPassphraseCancel}
    >
      <KeyboardAvoidingView
        style={restoreStyles.ppOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={restoreStyles.ppCard}>
          <Text style={restoreStyles.ppTitle}>
            {t('screens.walletRestore.passphraseModalTitle') || '백업 비밀번호 입력'}
          </Text>
          <Text style={restoreStyles.ppDesc}>
            {t('screens.walletRestore.passphraseModalDesc') ||
              '이 백업은 passphrase로 암호화되어 있습니다. 백업 시 설정한 비밀번호를 입력하세요.'}
          </Text>
          <TextInput
            style={restoreStyles.ppInput}
            placeholder={t('screens.walletRestore.passphraseInputPlaceholder') || 'passphrase 입력'}
            secureTextEntry
            value={passphraseInput}
            onChangeText={setPassphraseInput}
            autoCapitalize="none"
            testID="restore-passphrase-input"
          />
          <View style={restoreStyles.ppButtonRow}>
            <TouchableOpacity
              style={[restoreStyles.ppButton, restoreStyles.ppCancelBtn]}
              onPress={onPassphraseCancel}
              activeOpacity={0.8}
            >
              <Text style={restoreStyles.ppCancelText}>{t('common.cancel') || '취소'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                restoreStyles.ppButton,
                restoreStyles.ppConfirmBtn,
                !passphraseInput && restoreStyles.ppDisabledBtn,
              ]}
              disabled={!passphraseInput}
              onPress={onPassphraseSubmit}
              activeOpacity={0.8}
              testID="restore-passphrase-submit"
            >
              <Text style={restoreStyles.ppConfirmText}>{t('common.confirm') || '복원 시작'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  if (stage === 'gdrive-list') {
    return (
      <SafeView style={styles.container}>
        {pinModal}
        {passphraseModal}
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
      {pinModal}
      {passphraseModal}
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
          testID="restore-from-file-btn"
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

const restoreStyles = StyleSheet.create({
  ppOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  ppCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  ppTitle: {
    fontSize: 17,
    fontFamily: FONTS.semiBold,
    color: COLORS.titleText,
    textAlign: 'center',
    marginBottom: 8,
  },
  ppDesc: {
    fontSize: 13,
    color: COLORS.darkGray,
    lineHeight: 19,
    marginBottom: 16,
    textAlign: 'center',
  },
  ppInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 16,
    color: '#222',
  },
  ppButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ppButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ppCancelBtn: { backgroundColor: '#eeeeee' },
  ppConfirmBtn: { backgroundColor: COLORS.buttonPrimary },
  ppDisabledBtn: { backgroundColor: '#c5c5c5' },
  ppCancelText: { fontSize: 15, color: '#343434', fontFamily: FONTS.medium },
  ppConfirmText: { fontSize: 15, color: '#ffffff', fontFamily: FONTS.semiBold },
});
