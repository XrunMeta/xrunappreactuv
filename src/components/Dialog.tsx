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
  disabled?: boolean;
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
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose || (() => { })}>
      <View style={styles.overlay}>
        <View style={[styles.card, containerStyle]}>
          <View style={styles.header}>
            {
}
            {onClose && actions.length === 0 ? (
              <>
                <View style={styles.closePlaceholder} />
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={HIT_SLOP} style={styles.close}>
                  <Ionicons name="close" size={24} color="#747474" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.body}>{children}</View>

          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={`${action.label}-${index}`}
                  style={[
                    styles.actionButton,
                    action.variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
                    action.disabled && styles.disabledButton,
                    action.style,
                  ]}
                  onPress={action.disabled ? undefined : action.onPress}
                  activeOpacity={action.disabled ? 1 : 0.9}
                  disabled={action.disabled}
                >
                  <Text
                    style={[
                      styles.actionLabel,
                      action.variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
                      action.disabled && styles.disabledLabel,
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

const HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 };

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
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
    width: 40,
    height: 40,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e4e4e4',
  },
  body: {
    paddingVertical: 12,
    minHeight: 60,
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
  disabledButton: {
    opacity: 0.5,
  },
  disabledLabel: {
    opacity: 0.7,
  },
});

