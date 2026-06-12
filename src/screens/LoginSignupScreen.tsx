import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton, SecondaryButton, SafeView } from '../components';
import { COLORS, SIZES, COMMON_STYLES, FONTS, IS_DEV_MODE } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { TaboolaBanner } from '../components/TaboolaBanner';
import { loginWithEmailPassword } from '../services';
import { useAlertDialog } from '../context/AlertDialogContext';

const DEV_QUICK_LOGIN_EMAIL = 'oth-user@example.invalid';
const DEV_QUICK_LOGIN_SECRET_KEY = '__dev_quick_login_usr_secret';
const DEV_QUICK_LOGIN_SECRET_VALUE = 'Aaaaaa1';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface TutorialItem {
  id: number;
  text: string;
  image: any;
}

const tutorialKeys = ['tutorial1', 'tutorial2', 'tutorial3'] as const;
const tutorialImages = [
  require('../../assets/title2.png'),
  require('../../assets/title3.png'),
  require('../../assets/title1.png'),
];

export const LoginSignupScreen = () => {
  const { navigate, reset } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [currentPage, setCurrentPage] = useState(0);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!IS_DEV_MODE) return;
    (async () => {
      const existing = await AsyncStorage.getItem(DEV_QUICK_LOGIN_SECRET_KEY);
      if (!existing) {
        await AsyncStorage.setItem(DEV_QUICK_LOGIN_SECRET_KEY, DEV_QUICK_LOGIN_SECRET_VALUE);
      }
    })();
  }, []);

  const handleQuickLogin = async () => {
    if (quickLoginLoading) return;
    setQuickLoginLoading(true);
    try {
      const secret = await AsyncStorage.getItem(DEV_QUICK_LOGIN_SECRET_KEY);
      if (!secret) {
        await showAlert('오류', 'USR_SECRET 가 저장되지 않았습니다.');
        return;
      }

      const allKeys = await AsyncStorage.getAllKeys();
      const toRemove = allKeys.filter((k) =>
        k === 'userData' || k === 'jwt' || k === 'loggedIn' || k === 'userEmail' || k === 'remember'
      );
      if (toRemove.length > 0) await AsyncStorage.multiRemove(toRemove);

      const res = await loginWithEmailPassword(DEV_QUICK_LOGIN_EMAIL, secret);
      if (res?.status === 'success') {
        const userData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (userData) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await AsyncStorage.setItem('userEmail', userData.email || DEV_QUICK_LOGIN_EMAIL);
          await AsyncStorage.setItem('loggedIn', 'true');
          await AsyncStorage.setItem('remember', 'true');
        }
        console.log('[dev 빠른 로그인] 성공:', DEV_QUICK_LOGIN_EMAIL);
        reset(ROUTES.map);
      } else {
        await showAlert('로그인 실패', String((res as any)?.message ?? '시크릿 또는 서버 설정 확인'));
      }
    } catch (e: any) {
      console.warn('[dev 빠른 로그인] 예외:', e?.message);
      await showAlert('로그인 오류', e?.message ?? '알 수 없는 오류');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleLogin = () => navigate(ROUTES.login);
  const handleSignUp = async () => {
    try {
      await AsyncStorage.multiRemove([
        'googleSignupRequired',
        'googleSignupEmail',
        'appleSignupRequired',
        'appleSignupEmail',
      ]);
    } catch (error) {
      console.error('[회원가입] 소셜 회원가입 플래그 제거 실패:', error);
    }
    navigate(ROUTES.signup);
  };

  const handlePageChange = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const tutorialData: TutorialItem[] = tutorialKeys.map((key, idx) => ({
    id: idx + 1,
    text: t(`screens.loginSignup.${key}`),
    image: tutorialImages[idx],
  }));

  const renderTutorialItem = ({ item }: { item: TutorialItem }) => (
    <View style={styles.tutorialItem}>
      <Text style={styles.tutorialText}>{item.text}</Text>
      <Image source={item.image} style={styles.tutorialImage} resizeMode="contain" />
    </View>
  );

  return (
    <SafeView style={styles.container}>
      <StatusBar style="dark" />

      {}
      <View style={styles.tutorialContainer}>
        <FlatList
          ref={flatListRef}
          data={tutorialData}
          renderItem={renderTutorialItem}
          keyExtractor={(item) => `tutorial-${item.id}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handlePageChange}
          style={styles.tutorialFlatList}
        />

        {}
        <View style={styles.paginationContainer}>
          {tutorialData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t('screens.loginSignup.loginButton')}
          onPress={handleLogin}
          fullWidth
        />
        <SecondaryButton
          title={t('screens.loginSignup.signupButton')}
          onPress={handleSignUp}
          fullWidth
        />

        {}
        {IS_DEV_MODE && (
          <TouchableOpacity
            style={styles.devQuickLoginButton}
            onPress={handleQuickLogin}
            disabled={quickLoginLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.devQuickLoginText}>
              {quickLoginLoading ? '로그인 중...' : '🧪 viaggio 빠른 로그인 (DEV)'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      <View style={styles.taboolaContainer}>
        <TaboolaBanner placementType="shop" />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
    flex: 1,
  },
  tutorialContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: SIZES.xlarge,
    paddingBottom: SIZES.small,
  },
  tutorialFlatList: {
    width: '100%',
  },
  tutorialItem: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.large,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tutorialText: {
    fontSize: FONTS.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: SIZES.large,
    paddingHorizontal: SIZES.large,
    lineHeight: FONTS.size.xlarge * 1.4,
  },
  tutorialImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.38,
    maxWidth: SCREEN_WIDTH - SIZES.large * 2,
    marginBottom: 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.small,
    gap: SIZES.small,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  paginationDotActive: {
    backgroundColor: '#1E3A8A',
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.medium,
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
  },

  devQuickLoginButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    alignItems: 'center',
  },
  devQuickLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
});
