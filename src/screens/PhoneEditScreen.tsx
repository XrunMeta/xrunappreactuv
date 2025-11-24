import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { updatePhone } from '../services';

export const PhoneEditScreen = () => {
  const { reset, canGoBack, goBack, navigate } = useAppNavigation();
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
      Alert.alert('오류', '전화번호를 입력해주세요.');
      return;
    }

    const phoneNumber = phone.replace(/\s/g, '').replace(/-/g, '');
    if (!/^\d+$/.test(phoneNumber)) {
      Alert.alert('오류', '전화번호는 숫자만 입력 가능합니다.');
      return;
    }

    if (!memberId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
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

      Alert.alert('저장 완료', '전화번호가 변경되었습니다.', [
        {
          text: '확인',
          onPress: () => {

            reset(ROUTES.myInfoEdit);
          },
        },
      ]);
    } catch (error) {
      console.error('[전화번호수정] 전화번호 수정 실패:', error);
      Alert.alert('저장 실패', '전화번호 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCountryCodeSelect = () => {
    navigate(ROUTES.countryCodeSelect);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title="전화번호 수정"
        onBackPress={canGoBack ? goBack : () => reset(ROUTES.myInfoEdit)}
        showBackButton
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <FormField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            editable={!isSaving}
            leftAccessory={
              <TouchableOpacity
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
              title="Save Changes"
              fullWidth
              onPress={handleSave}
              style={styles.primaryButton}
            />
          )}
        </View>
      </ScrollView>
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
    fontSize: 20,
    marginRight: 6,
  },
  phonePrefixText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
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

