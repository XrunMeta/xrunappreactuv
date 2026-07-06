

import React, { createContext, useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Platform, BackHandler, ActivityIndicator, NativeModules } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Progress from 'react-native-progress';
import { checkOTAVersion, downloadBundle, updateLocalVersion, OTAVersionInfo } from '../services/otaCheck';
import { LoadingText } from '../components/AnimatedDots';

type OTAUpdateContextValue = {
  checkForUpdate: () => Promise<void>;
};

const OTAUpdateContext = createContext<OTAUpdateContextValue | undefined>(undefined);

export const useOTAUpdate = (): OTAUpdateContextValue => {
  const ctx = useContext(OTAUpdateContext);
  if (ctx === undefined) {
    throw new Error('useOTAUpdate must be used within OTAUpdateProvider');
  }
  return ctx;
};

export const OTAUpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<OTAVersionInfo | null>(null);
  const [waitingForRestart, setWaitingForRestart] = useState(false);

  const checkForUpdate = useCallback(async () => {
    if (__DEV__) return;
    const info = await checkOTAVersion();
    if (info) {
      setUpdateInfo(info);
      setVisible(true);
    }
  }, []);

  const handleUpdate = async () => {
    if (!updateInfo) return;
    setDownloading(true);
    setProgress(0);

    const success = await downloadBundle(updateInfo.url, (p) => setProgress(p));

    if (success) {
      await updateLocalVersion(updateInfo.version);
      setDownloading(false);
      setProgress(1);

      if (Platform.OS === 'android') {
        Alert.alert(
          t('common.versionUpdate.updateComplete'),
          t('common.versionUpdate.restartMessage'),
          [{
            text: t('common.versionUpdate.confirm'),
            onPress: () => {

              const ForceKill = (NativeModules as any).ForceKill;
              if (ForceKill?.killProcess) {
                ForceKill.killProcess();
              } else {
                BackHandler.exitApp();
              }
            },
          }],
          { cancelable: false }
        );
      } else {
        setWaitingForRestart(true);
      }
    } else {
      setDownloading(false);
      Alert.alert(t('common.messages.error'), t('common.versionUpdate.downloadFailed'));
    }
  };

  const value: OTAUpdateContextValue = { checkForUpdate };

  return (
    <OTAUpdateContext.Provider value={value}>
      {children}

      {!visible ? null : waitingForRestart ? (
        <Modal visible transparent={false} animationType="fade">
          <View style={styles.fullScreenContainer}>
            <ActivityIndicator size="large" color="#4A90E2" style={{ marginBottom: 30, transform: [{ scale: 1.5 }] }} />
            <Text style={styles.fullScreenTitle}>{t('common.versionUpdate.updateComplete')}</Text>
            <Text style={styles.fullScreenMessage}>{t('common.versionUpdate.restartRequired')}</Text>
          </View>
        </Modal>
      ) : (
        <Modal visible animationType="slide" transparent={false}>
          <View style={styles.fullScreenContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.fullScreenTitle}>{t('common.versionUpdate.title')}</Text>
              <Text style={styles.fullScreenMessage}>
                {updateInfo?.description || t('common.versionUpdate.message')}
              </Text>
              {downloading ? (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                  <Progress.Bar
                    progress={progress}
                    width={250}
                    color="#4A90E2"
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    height={10}
                  />
                  <LoadingText text={t('common.messages.loading')} style={styles.downloadingText} />
                </View>
              ) : (
                <TouchableOpacity style={styles.mainButton} onPress={handleUpdate} activeOpacity={0.8}>
                  <Text style={styles.mainButtonText}>{t('common.versionUpdate.update')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </OTAUpdateContext.Provider>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fullScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
    textAlign: 'center',
  },
  fullScreenMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginBottom: 10,
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  downloadingText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    marginTop: 20,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
