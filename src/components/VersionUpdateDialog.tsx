import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FONTS, COLORS } from '../constants';
import { openStore } from '../services/versionCheck';

interface VersionUpdateDialogProps {
  visible: boolean;
  onClose?: () => void;
  latestVersion?: string;
  showLaterButton?: boolean; 
}

export const VersionUpdateDialog: React.FC<VersionUpdateDialogProps> = ({
  visible,
  onClose,
  latestVersion,
  showLaterButton = true, 
}) => {
  const { t } = useTranslation();

  const handleUpdate = async () => {
    await openStore();

  };

  const handleLater = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={showLaterButton ? handleLater : undefined}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-download-outline" size={48} color={COLORS.buttonPrimary} />
            </View>
            <Text style={styles.title}>
              {t('common.versionUpdate.title')}
            </Text>
            {latestVersion && (
              <Text style={styles.versionText}>
                {t('common.versionUpdate.latestVersion')}: {latestVersion}
              </Text>
            )}
          </View>

          <View style={styles.body}>
            <Text style={styles.message}>
              {t('common.versionUpdate.message')}
            </Text>
          </View>

          <View style={styles.actions}>
            {showLaterButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleLater}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  {t('common.versionUpdate.later')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, !showLaterButton && styles.fullWidthButton]}
              onPress={handleUpdate}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {t('common.versionUpdate.update')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: FONTS.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    textAlign: 'center',
  },
  body: {
    marginBottom: 24,
  },
  message: {
    fontSize: FONTS.size.mmedium,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimary,
  },
  secondaryButton: {
    backgroundColor: '#F8F8F8',
  },
  buttonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#4c4e55',
  },
});
