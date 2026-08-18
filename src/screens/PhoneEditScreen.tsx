import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeScrollView } from '../components';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { updatePhone } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';
import { TID } from '../testIDs';

export const PhoneEditScreen = () => {
  const { t } = useTranslation();
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { selectedCountryDialCode, setSelectedCountryDialCode } = useAppContext();
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const member = userData.member;

          if (member) {
            setMemberId(member);

            if (userData.mobile) {
              setPhone(userData.mobile.replace(/\s/g, ''));
            }
          }
        }
      } catch (error) {
        console.error('[전화번호수정] 사용자 정보 로드 실패:', error);
      }
    };

    loadUserInfo();
  }, []);

  const handleSave = async () => {

    if (!phone.trim()) {
      await showAlert(t('screens.phoneEdit.alerts.error'), t('screens.phoneEdit.alerts.phoneRequired'));
      return;
    }

    const phoneNumber = phone.replace(/\s/g, '').replace(/-/g, '');
    if (!/^\d+$/.test(phoneNumber)) {
      await showAlert(t('screens.phoneEdit.alerts.error'), t('screens.phoneEdit.alerts.phoneInvalid'));
      return;
    }

    if (!memberId) {
      await showAlert(t('screens.phoneEdit.alerts.error'), t('screens.phoneEdit.alerts.userDataNotFound'));
      return;
    }

    setIsSaving(true);

    try {
      console.log('[전화번호수정] 전화번호 수정 시도:', {
        memberId,
        phone: phoneNumber,
        mobilecode: parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10),
      });

      await updatePhone(
        memberId,
        phoneNumber,
        parseInt(selectedCountryDialCode.dialCode.replace('+', ''), 10),
        navigate,
      );

      await showAlert(t('screens.phoneEdit.alerts.saveSuccess'), t('screens.phoneEdit.alerts.saveSuccessMessage'), [
        {
          text: t('screens.phoneEdit.alerts.confirm'),
          onPress: () => {

            reset(ROUTES.myInfoEdit);
          },
        },
      ]);
    } catch (error) {
      console.error('[전화번호수정] 전화번호 수정 실패:', error);
      await showAlert(t('screens.phoneEdit.alerts.saveFailed'), t('screens.phoneEdit.alerts.saveFailedMessage'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCountryCodeSelect = () => {
    navigate(ROUTES.countryCodeSelect);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('screens.phoneEdit.title')}
        onBackPress={canGoBack ? goBack : () => reset(ROUTES.myInfoEdit)}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        autoAdjustKeyboardPadding={true}
      >
        <View style={styles.formWrapper}>
          <FormField
            label={t('screens.phoneEdit.phoneLabel')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder={t('screens.phoneEdit.phonePlaceholder')}
            editable={!isSaving}
            leftAccessory={
              <TouchableOpacity testID={TID.phoneEdit.countryCodeSelect}
                style={styles.phonePrefix}
                onPress={handleCountryCodeSelect}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <Text style={styles.flagEmoji}>{selectedCountryDialCode.flagEmoji}</Text>
                <Text style={styles.phonePrefixText}>{selectedCountryDialCode.dialCode}</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.bottomSection}>
          {isSaving ? (
            <View style={styles.loadingButtonContainer}>
              <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <PrimaryButton
              title={t('screens.phoneEdit.saveButton')}
              fullWidth
              onPress={handleSave}
              style={styles.primaryButton}
            />
          )}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#ededed',
  },
  flagEmoji: {
    fontSize: FONTS.size.large,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  primaryButton: {
    width: '100%',
  },
  loadingButtonContainer: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

