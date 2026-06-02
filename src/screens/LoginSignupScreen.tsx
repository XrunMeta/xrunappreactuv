import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton, SecondaryButton, SafeView } from '../components';
import { COLORS, SIZES, COMMON_STYLES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { PangleBanner } from '../components/PangleBanner';

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
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
      </View>

      {}
      <View style={styles.taboolaContainer}>
        <PangleBanner placementType="shop" />
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
});
