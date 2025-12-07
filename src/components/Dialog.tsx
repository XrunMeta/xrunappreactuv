import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants';

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

interface DialogProps {
  visible: boolean;
  title: string;
  children?: React.ReactNode;
  actions?: DialogAction[];
  onClose?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  children,
  actions = [],
  onClose,
  containerStyle,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, containerStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {onClose ? (
              <TouchableOpacity onPress={onClose} hitSlop={HIT_SLOP} style={styles.close}>
                <Ionicons name="close" size={18} color="#747474" />
              </TouchableOpacity>
            ) : (
              <View style={styles.closePlaceholder} />
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.body}>{children}</View>

          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={[
                    styles.actionButton,
                    action.variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
                    action.style,
                  ]}
                  onPress={action.onPress}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.actionLabel,
                      action.variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
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
    fontSize: FONTS.size.large,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#DEDEDE',
  },
  primaryButton: {
    backgroundColor: '#FFDC04',
  },
  actionLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryLabel: {
    color: '#000000',
  },
  secondaryLabel: {
    color: '#000000',
  },
});


