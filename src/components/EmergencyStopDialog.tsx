import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation';
import { ROUTES } from '../navigation';

interface EmergencyStopDialogProps {
  visible: boolean;
  message: string;
  link?: string;
  onClose?: () => void;
}

export const EmergencyStopDialog: React.FC<EmergencyStopDialogProps> = ({
  visible,
  message,
  link,
  onClose,
}) => {
  const { navigate } = useAppNavigation();

  const handleLinkPress = () => {
    if (!link) return;

    if (link.startsWith('http://') || link.startsWith('https://')) {
      Linking.openURL(link).catch((err) => {
        console.error('Failed to open URL:', err);
      });
    } else {

      const routeKeys = Object.keys(ROUTES) as Array<keyof typeof ROUTES>;
      const route = routeKeys.find((key) => ROUTES[key] === link);

      if (route) {
        navigate(ROUTES[route]);
      } else {
        console.warn('Unknown route:', link);
      }
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>긴급 안내</Text>
            {onClose ? (
              <TouchableOpacity
                onPress={onClose}
                hitSlop={HIT_SLOP}
                style={styles.close}
              >
                <Ionicons name="close" size={18} color="#747474" />
              </TouchableOpacity>
            ) : (
              <View style={styles.closePlaceholder} />
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>
            {link && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleLinkPress}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>자세히 보기</Text>
                <Ionicons name="chevron-forward" size={16} color="#4c4e55" />
              </TouchableOpacity>
            )}
          </View>

          {onClose && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={onClose}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionLabel, styles.primaryLabel]}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 25, 45, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 6.5,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
    width: 32,
    height: 32,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e4e4e4',
  },
  body: {
    paddingVertical: 20,
    minHeight: 100,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 24,
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#4c4e55',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFDC04',
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryLabel: {
    color: '#000000',
  },
});

