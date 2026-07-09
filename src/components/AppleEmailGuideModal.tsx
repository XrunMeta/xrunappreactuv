

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../constants';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export const AppleEmailGuideModal: React.FC<Props> = ({ visible, onDismiss }) => {
  const { t } = useTranslation();

  const handleClose = async () => {
    await AsyncStorage.setItem('appleEmailGuideShown', 'true');
    onDismiss();
  };

  const steps = [
    { icon: 'settings-outline' as const, lib: 'ionicons', label: '설정 앱' },
    { icon: 'person-circle-outline' as const, lib: 'ionicons', label: 'Apple 계정' },
    { icon: 'logo-apple' as const, lib: 'ionicons', label: 'Apple로 로그인' },
    { icon: 'star' as const, lib: 'feather', label: 'XRUN', highlight: true },
  ];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
            <Feather name="x" size={22} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={styles.title}>
            {t('screens.myInfo.appleEmailGuide.title') || '가상 이메일 확인 방법'}
          </Text>
          <Text style={styles.subtitle}>
            {t('screens.myInfo.appleEmailGuide.subtitle')
              || 'Apple 로그인 시 발급된 가상 이메일 (@privaterelay.appleid.com) 은 아래 경로에서 확인할 수 있어요.'}
          </Text>

          <ScrollView contentContainerStyle={styles.stepsWrap} showsVerticalScrollIndicator={false}>
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <View style={[styles.stepBox, step.highlight && styles.stepBoxHighlight]}>
                  <View style={[styles.stepIconWrap, step.highlight && styles.stepIconWrapHighlight]}>
                    {step.lib === 'ionicons' ? (
                      <Ionicons name={step.icon as any} size={22} color={step.highlight ? '#fff' : '#374151'} />
                    ) : (
                      <Feather name={step.icon as any} size={20} color={step.highlight ? '#fff' : '#374151'} />
                    )}
                  </View>
                  <Text style={[styles.stepLabel, step.highlight && styles.stepLabelHighlight]}>
                    {step.label}
                  </Text>
                </View>
                {idx < steps.length - 1 && (
                  <View style={styles.arrowWrap}>
                    <Feather name="chevron-down" size={20} color="#9ca3af" />
                  </View>
                )}
              </React.Fragment>
            ))}
          </ScrollView>

          <Text style={styles.footNote}>
            {t('screens.myInfo.appleEmailGuide.footNote')
              || '해당 경로에서 XRUN 항목을 탭하면 발급된 이메일 주소를 볼 수 있습니다.'}
          </Text>

          <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.confirmText}>
              {t('screens.myInfo.appleEmailGuide.confirm') || '확인'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    maxHeight: '85%',
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  stepsWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 220,
  },
  stepBoxHighlight: {
    backgroundColor: COLORS.buttonPrimary,
  },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIconWrapHighlight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1f2937',
  },
  stepLabelHighlight: {
    color: '#ffffff',
  },
  arrowWrap: {
    paddingVertical: 4,
  },
  footNote: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#6b7280',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  confirmButton: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
  },
});
