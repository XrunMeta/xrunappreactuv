import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CODES, LanguageCode, setStoredLanguage } from '../locales';
import { COLORS, FONTS } from '../constants';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  ko: '한국어',
  'zh-CN': '简体中文',
  en: 'English',
  id: 'Bahasa Indonesia',
  ja: '日本語',
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(i18n.language as LanguageCode);

  const handleLanguageChange = async (language: LanguageCode) => {
    try {
      await setStoredLanguage(language);
      setCurrentLanguage(language);

      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('언어 변경 실패:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>언어 선택</Text>
          <ScrollView style={styles.scrollView}>
            {Object.entries(LANGUAGE_CODES).map(([code, value]) => {
              const isSelected = currentLanguage === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.option, isSelected && styles.selectedOption]}
                  onPress={() => handleLanguageChange(code as LanguageCode)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                    {LANGUAGE_NAMES[code as LanguageCode]}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
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
  },
  container: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: COLORS.buttonPrimary,
  },
  optionText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: COLORS.text,
  },
  selectedOptionText: {
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  checkmark: {
    fontSize: FONTS.size.mmedium,
    color: '#fff',
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.text,
  },
});

