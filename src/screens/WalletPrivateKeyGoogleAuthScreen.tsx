

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Modal,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as FileSystem from 'expo-file-system/legacy';
import * as Clipboard from 'expo-clipboard';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Header, SafeView, SafeScrollView, WalletKeyPinPromptModal, WalletKeyPinSetupModal } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import {
  jwtPayloadSub,
  findEntriesForUser,
  exportBackup,
  encryptBackupJson,
  buildPlainBackup,
  NETWORK_MAP,
  type BackupPayload,
  type WalletKey,
  type WalletNetwork,
} from '../services/walletKeyStore';
import { getWalletKeyATStatus } from '../services';

type Stage = 'loading' | 'pin' | 'options' | 'view' | 'busy';

const NETWORK_LABEL: Record<WalletNetwork, string> = {
  eth: 'Ethereum',
  pol: 'Polygon',
};

export const WalletPrivateKeyGoogleAuthScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();

  const [stage, setStage] = useState<Stage>('loading');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [pinPromptVisible, setPinPromptVisible] = useState(false);

  const [pinSetupVisible, setPinSetupVisible] = useState(false);

  const [wallets, setWallets] = useState<WalletKey[]>([]);

  const [pin, setPinState] = useState<string>('');

  const CONSENT_BASE_LABELS = [
    t('screens.walletPrivateKeyGoogleAuth.consentCheck1'),
    t('screens.walletPrivateKeyGoogleAuth.consentCheck2'),
    t('screens.walletPrivateKeyGoogleAuth.consentCheck3'),
    t('screens.walletPrivateKeyGoogleAuth.consentCheck4'),
  ];
  const CONSENT_GDRIVE_LABEL = t('screens.walletPrivateKeyGoogleAuth.consentCheckGdrive');

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmChecks, setConfirmChecks] = useState<boolean[]>([]);
  const [confirmLabels, setConfirmLabels] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<{ run: () => void } | null>(null);
  const [confirmDangerNote, setConfirmDangerNote] = useState<string | null>(null);

  const requestBackupConsent = (
    action: () => void,
    opts?: { isGoogleDrive?: boolean; dangerNote?: string },
  ) => {
    const labels = opts?.isGoogleDrive
      ? [...CONSENT_BASE_LABELS, CONSENT_GDRIVE_LABEL]
      : CONSENT_BASE_LABELS;
    setConfirmLabels(labels);
    setConfirmChecks(labels.map(() => false));
    setConfirmDangerNote(opts?.dangerNote ?? null);
    setPendingAction({ run: action });
    setConfirmVisible(true);
  };

  const toggleConfirmCheck = (idx: number) => {
    setConfirmChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const closeConsent = () => {
    setConfirmVisible(false);
    setConfirmChecks([]);
    setConfirmLabels([]);
    setPendingAction(null);
    setConfirmDangerNote(null);
  };

  const allChecked = confirmChecks.length > 0 && confirmChecks.every((v) => v);

  const proceedConsent = () => {
    if (!allChecked || !pendingAction) return;
    const fn = pendingAction.run;
    closeConsent();
    fn();
  };

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
        console.log('[WalletKeyBackup] mount', { mid, email: emailRaw, hasJwt: !!jwt });
        if (mid == null || !emailRaw) {
          await showAlert(
            t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
            t('screens.walletPrivateKeyGoogleAuth.missingUserInfo'),
          );
          goBack();
          return;
        }
        const normEmail = emailRaw.toLowerCase().trim();
        setMemberId(mid);
        setEmail(normEmail);

        const entries = await findEntriesForUser(normEmail, mid);
        const hasS1 = (entries.eth?.s === 's1') || (entries.pol?.s === 's1');
        if (!hasS1) {
          const atStatus = await getWalletKeyATStatus().catch(() => ({ at: false, at_at: null, ok: false }));
          if (cancelled) return;
          console.log('[WalletKeyBackup] AT 상태', atStatus);

          const shouldShowRestore = atStatus.at || !atStatus.ok;
          if (shouldShowRestore) {
            const choice = await showAlert(
              t('screens.walletRestore.restoreNeededTitle'),
              t('screens.walletRestore.restoreNeededMessage'),
              [
                { text: t('screens.walletRestore.restoreLater'), style: 'cancel' },
                { text: t('screens.walletRestore.restoreNow') },
              ],
            );
            if (choice === 1) navigate(ROUTES.walletRestore);
            else goBack();
          } else {

            setPinSetupVisible(true);
          }
          return;
        }

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
        t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
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
          t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
          'PIN 설정된 지갑이 없습니다. 먼저 지갑 PIN 을 설정하세요.',
        );
        setStage('options');
        return;
      }

      const json = JSON.stringify(payload);
      const encrypted = encryptBackupJson(json, pin);
      const fileName = `xrunwallet-${payload.exported_at}.keyencrypted`;

      if (Platform.OS === 'android') {
        const SAF = (FileSystem as any).StorageAccessFramework;
        if (!SAF) throw new Error('StorageAccessFramework 미지원 환경');
        const perm = await SAF.requestDirectoryPermissionsAsync();
        if (!perm.granted) {

          await showAlert('', t('screens.walletPrivateKeyGoogleAuth.folderPickCancelled'));
          setStage('options');
          return;
        }
        const newUri = await SAF.createFileAsync(perm.directoryUri, fileName, 'application/octet-stream');
        await SAF.writeAsStringAsync(newUri, encrypted);
        await showAlert(
          t('screens.walletPrivateKeyGoogleAuth.alertBackupComplete'),
          `${fileName}`,
        );
      } else {

        const path = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, encrypted);
        const shareUrl = path.startsWith('file://') ? path : `file://${path}`;
        try {
          await Share.share({
            url: shareUrl,
            title: 'XRUN 지갑 백업',
          });
        } catch {

        }
        await showAlert(
          t('screens.walletPrivateKeyGoogleAuth.alertBackupComplete'),
          `${fileName}`,
        );
      }
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] file fail:', e);
      await showAlert(
        t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
        `${t('screens.walletPrivateKeyGoogleAuth.fileSaveFail')}: ${e?.message ?? t('screens.walletPrivateKeyGoogleAuth.unknownError')}`,
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
          t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
          'PIN 설정된 지갑이 없습니다. 먼저 지갑 PIN 을 설정하세요.',
        );
        setStage('options');
        return;
      }

      if (!pin) throw new Error('PIN 정보 누락 — 화면을 다시 열어주세요');
      const jsonRaw = JSON.stringify(payload);
      const json = encryptBackupJson(jsonRaw, pin);
      const fileName = `xrunwallet-${payload.exported_at}.keyencrypted`;

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
        t('screens.walletPrivateKeyGoogleAuth.alertBackupComplete'),
        `${fileName}`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] gdrive fail:', e);
      await showAlert(
        t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
        `${t('screens.walletPrivateKeyGoogleAuth.gdriveSaveFail')}: ${e?.message ?? t('screens.walletPrivateKeyGoogleAuth.unknownError')}`,
      );
      setStage('options');
    }
  };

  const performGdrivePlainUpload = async () => {
    setStage('busy');
    try {
      if (wallets.length === 0) {
        throw new Error(t('screens.walletPrivateKeyGoogleAuth.noDisplayableWallet'));
      }
      const payload = buildPlainBackup(email, wallets);
      const json = JSON.stringify(payload, null, 2);
      const fileName = `xrunwallet-PLAIN-${payload.exported_at}.keyplain`;

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
        t('screens.walletPrivateKeyGoogleAuth.alertPlainBackupComplete'),
        `${fileName}`,
      );
      setStage('options');
    } catch (e: any) {
      if (__DEV__) console.warn('[WalletKeyBackup] gdrive plain fail:', e);
      await showAlert(
        t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
        `${t('screens.walletPrivateKeyGoogleAuth.gdrivePlainSaveFail')}: ${e?.message ?? t('screens.walletPrivateKeyGoogleAuth.unknownError')}`,
      );
      setStage('options');
    }
  };

  const handleGdrivePlainBackup = async () => {
    if (stage !== 'options') return;
    const r1 = await showAlert(
      t('screens.walletPrivateKeyGoogleAuth.alertVeryDangerTitle'),
      t('screens.walletPrivateKeyGoogleAuth.alertVeryDangerMessage'),
      [
        { text: t('screens.walletPrivateKeyGoogleAuth.cancel'), style: 'cancel' },
        { text: t('screens.walletPrivateKeyGoogleAuth.alertUnderstoodContinue'), style: 'destructive' },
      ],
    );
    if (r1 !== 1) return;
    const r2 = await showAlert(
      t('screens.walletPrivateKeyGoogleAuth.alertFinalConfirmTitle'),
      t('screens.walletPrivateKeyGoogleAuth.alertFinalConfirmMessage'),
      [
        { text: t('screens.walletPrivateKeyGoogleAuth.cancel'), style: 'cancel' },
        { text: t('screens.walletPrivateKeyGoogleAuth.alertYesPlainSave'), style: 'destructive' },
      ],
    );
    if (r2 !== 1) return;
    void performGdrivePlainUpload();
  };

  const handleViewKey = async () => {
    if (stage !== 'options') return;
    const r = await showAlert(
      t('screens.walletPrivateKeyGoogleAuth.alertWarning'),
      t('screens.walletPrivateKeyGoogleAuth.alertShowPlainKey'),
      [
        { text: t('screens.walletPrivateKeyGoogleAuth.cancel'), style: 'cancel' },
        { text: t('screens.walletPrivateKeyGoogleAuth.confirm') },
      ],
    );
    if (r === 1) setStage('view');
  };

  const handleCopyKey = async (pk: string) => {
    const r = await showAlert(
      t('screens.walletPrivateKeyGoogleAuth.alertWarning'),
      t('screens.walletPrivateKeyGoogleAuth.alertCopyClipboard'),
      [
        { text: t('screens.walletPrivateKeyGoogleAuth.cancel'), style: 'cancel' },
        { text: t('screens.walletPrivateKeyGoogleAuth.confirm') },
      ],
    );
    if (r !== 1) return;
    try {
      await Clipboard.setStringAsync(pk);
      await showAlert(
        t('screens.walletPrivateKeyGoogleAuth.alertCopyComplete'),
        t('screens.walletPrivateKeyGoogleAuth.alertCopyCompleteMessage'),
      );
    } catch (e: any) {
      await showAlert(
        t('screens.walletPrivateKeyGoogleAuth.errorTitle'),
        `${t('screens.walletPrivateKeyGoogleAuth.copyFail')}: ${e?.message ?? t('screens.walletPrivateKeyGoogleAuth.unknownError')}`,
      );
    }
  };

  return (
    <SafeView>
      {}
      <Header
        title={t('screens.walletPrivateKeyGoogleAuth.headerTitle') || '지갑 키 백업'}
        onBackPress={() => {
          if (stage === 'view') {
            setStage('options');
          } else {
            goBack();
          }
        }}
        showBackButton
      />
      <SafeScrollView contentContainerStyle={styles.content}>
        {stage === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
          </View>
        )}

        {stage === 'pin' && (
          <View style={styles.center}>
            <Text style={styles.message}>{t('screens.walletPrivateKeyGoogleAuth.pinWaiting')}</Text>
          </View>
        )}

        {(stage === 'options' || stage === 'busy') && (
          <View style={styles.optionsContainer}>
            <Text style={styles.title}>{t('screens.walletPrivateKeyGoogleAuth.chooseBackup')}</Text>
            <Text style={styles.subtitle}>
              {t('screens.walletPrivateKeyGoogleAuth.chooseBackupSubtitle')}
            </Text>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={() => requestBackupConsent(() => { void handleFileBackup(); }, {})}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="document-outline" size={28} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>{t('screens.walletPrivateKeyGoogleAuth.optionFileLabel')}</Text>
                <Text style={styles.optionDesc}>{t('screens.walletPrivateKeyGoogleAuth.optionFileDesc')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, stage === 'busy' && styles.disabled]}
              onPress={() => requestBackupConsent(() => { void handleGdriveBackup(); }, { isGoogleDrive: true })}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-upload-outline" size={28} color={COLORS.buttonPrimary} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>{t('screens.walletPrivateKeyGoogleAuth.optionGdriveLabel')}</Text>
                <Text style={styles.optionDesc}>{t('screens.walletPrivateKeyGoogleAuth.optionGdriveDesc')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.viewCard, stage === 'busy' && styles.disabled]}
              onPress={() => requestBackupConsent(handleViewKey, { dangerNote: t('screens.walletPrivateKeyGoogleAuth.consentDangerView') })}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="eye-outline" size={28} color="#a36a00" />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>{t('screens.walletPrivateKeyGoogleAuth.optionViewLabel')}</Text>
                <Text style={styles.optionDesc}>{t('screens.walletPrivateKeyGoogleAuth.optionViewDesc')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.dangerCard, stage === 'busy' && styles.disabled]}
              onPress={() => requestBackupConsent(handleGdrivePlainBackup, { isGoogleDrive: true, dangerNote: t('screens.walletPrivateKeyGoogleAuth.consentDangerPlain') })}
              disabled={stage === 'busy'}
              activeOpacity={0.7}
            >
              <Ionicons name="warning-outline" size={28} color="#ffffff" />
              <View style={styles.optionTextWrap}>
                <Text style={styles.dangerLabel}>{t('screens.walletPrivateKeyGoogleAuth.optionPlainLabel')}</Text>
                <Text style={styles.dangerDesc}>
                  {t('screens.walletPrivateKeyGoogleAuth.optionPlainDesc')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />
            </TouchableOpacity>

            {stage === 'busy' && (
              <View style={styles.busyOverlay}>
                <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
                <Text style={styles.busyText}>{t('screens.walletPrivateKeyGoogleAuth.processing')}</Text>
              </View>
            )}
          </View>
        )}

        {stage === 'view' && (
          <View style={styles.viewContainer}>
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color="#a36a00" />
              <Text style={styles.warningText}>
                {t('screens.walletPrivateKeyGoogleAuth.plainWarning')}
              </Text>
            </View>

            {wallets.map((w) => {
              const network = NETWORK_MAP[w.wallet_code];
              if (!network) return null;
              return (
                <View key={w.wallet_code} style={styles.keyCard}>
                  {}
                  <Text style={styles.networkLabel}>{NETWORK_LABEL[network]}</Text>
                  <Text style={styles.fieldLabel}>{t('screens.walletPrivateKeyGoogleAuth.walletAddress')}</Text>
                  <Text style={styles.fieldValue} selectable>
                    {w.address}
                  </Text>
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>{t('screens.walletPrivateKeyGoogleAuth.privateKey')}</Text>
                  <Text style={[styles.fieldValue, styles.privateKey]} selectable>
                    {w.private_key}
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyKey(w.private_key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="copy-outline" size={18} color="#ffffff" />
                    <Text style={styles.copyButtonText}>{t('screens.walletPrivateKeyGoogleAuth.copyKey')}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            {}
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

      {}
      {memberId != null && email !== '' && pinSetupVisible && (
        <WalletKeyPinSetupModal
          memberId={memberId}
          email={email}
          visible={pinSetupVisible}
          onSuccess={() => {
            setPinSetupVisible(false);

            setStage('pin');
            setPinPromptVisible(true);
          }}
        />
      )}

      {}
      <Modal
        visible={confirmVisible}
        animationType="fade"
        transparent
        onRequestClose={closeConsent}
      >
        <View style={styles.consentOverlay}>
          <View style={styles.consentCard}>
            <View style={styles.consentIconWrap}>
              <Ionicons name="warning" size={36} color="#cf3a3a" />
            </View>
            <Text style={styles.consentTitle}>{t('screens.walletPrivateKeyGoogleAuth.consentTitle')}</Text>
            <Text style={styles.consentBody}>
              {t('screens.walletPrivateKeyGoogleAuth.consentBodyPrefix')}<Text style={styles.consentStrong}>{t('screens.walletPrivateKeyGoogleAuth.consentKeyEmphasis')}</Text>{t('screens.walletPrivateKeyGoogleAuth.consentBodySuffix')}{'\n\n'}
              • {t('screens.walletPrivateKeyGoogleAuth.consentRule1')}{'\n'}
              • {t('screens.walletPrivateKeyGoogleAuth.consentRule2')}{'\n'}
              • {t('screens.walletPrivateKeyGoogleAuth.consentRule3')}{'\n'}
              • {t('screens.walletPrivateKeyGoogleAuth.consentRule4')}
            </Text>
            {!!confirmDangerNote && (
              <View style={styles.consentDangerBox}>
                <Text style={styles.consentDangerText}>{confirmDangerNote}</Text>
              </View>
            )}

            <View style={styles.consentChecksWrap}>
              {confirmLabels.map((label, idx) => {
                const checked = confirmChecks[idx] ?? false;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.consentCheckRow}
                    activeOpacity={0.7}
                    onPress={() => toggleConfirmCheck(idx)}
                  >
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={checked ? COLORS.buttonPrimary : COLORS.darkGray}
                    />
                    <Text style={styles.consentCheckLabel}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.consentButtonRow}>
              <TouchableOpacity
                style={[styles.consentButton, styles.consentCancel]}
                onPress={closeConsent}
                activeOpacity={0.8}
              >
                <Text style={styles.consentCancelText}>{t('screens.walletPrivateKeyGoogleAuth.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.consentButton,
                  styles.consentProceed,
                  !allChecked && styles.consentProceedDisabled,
                ]}
                onPress={proceedConsent}
                disabled={!allChecked}
                activeOpacity={allChecked ? 0.8 : 1}
              >
                <Text style={styles.consentProceedText}>{t('screens.walletPrivateKeyGoogleAuth.continue')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  fieldLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.darkGray,
    marginTop: 8,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: '#222',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 6,
  },
  privateKey: {

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

  consentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  consentCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  consentIconWrap: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffe5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  consentTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: '#cf3a3a',
    textAlign: 'center',
    marginBottom: 10,
  },
  consentBody: {
    fontSize: 13,
    color: '#343434',
    lineHeight: 20,
  },
  consentStrong: {
    fontFamily: FONTS.semiBold,
    color: '#cf3a3a',
  },
  consentDangerBox: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffe5e5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#cf3a3a',
  },
  consentDangerText: {
    fontSize: 12,
    color: '#a02828',
    lineHeight: 18,
  },
  consentChecksWrap: {
    marginTop: 12,
  },
  consentCheckRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  consentCheckLabel: {
    flex: 1,
    fontSize: 13,
    color: '#343434',
    marginLeft: 10,
    lineHeight: 19,
  },
  consentButtonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  consentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentCancel: {
    backgroundColor: '#eeeeee',
  },
  consentCancelText: {
    fontSize: 15,
    color: '#343434',
    fontFamily: FONTS.medium,
  },
  consentProceed: {
    backgroundColor: COLORS.buttonPrimary,
  },
  consentProceedDisabled: {
    backgroundColor: '#c5c5c5',
  },
  consentProceedText: {
    fontSize: 15,
    color: '#ffffff',
    fontFamily: FONTS.semiBold,
  },
});
