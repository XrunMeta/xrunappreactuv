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
      visible={visible}
      animationType="slide"
      onRequestClose={() => {}} 
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>안내</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.body}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={64} color="#FF6B6B" />
          </View>
          <Text style={styles.message}>{message}</Text>
          {link && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleLinkPress}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>자세히 보기</Text>
              <Ionicons name="chevron-forward" size={20} color="#4c4e55" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e4e4e4',
    marginBottom: 32,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginBottom: 32,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#4c4e55',
  },
});

