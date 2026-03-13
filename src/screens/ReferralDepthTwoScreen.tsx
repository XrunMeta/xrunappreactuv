import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeScrollView } from '../components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { Header, ReferralMemberRow } from '../components';
import { COMMON_STYLES, SIZES, COLORS } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';

const rows = Array.from({ length: 7 }, (_, index) => ({
  rank: index === 0 ? 2 : 1,
  email: 'user1@user.com',
  date: '2025.05.05',
  highlight: index === 0,
}));

export const ReferralDepthTwoScreen = () => {
  const { t } = useTranslation();
  const { reset, goBack, navigate } = useAppNavigation();
  const { selectedReferralMember, setSelectedReferralMember } = useAppContext();

  const currentDepth = selectedReferralMember?.depth || 2;

  const handleClose = () => {
    reset(ROUTES.referralMyGroup);
  };

  const handleBack = () => {
    if (currentDepth > 2) {

      setSelectedReferralMember({
        ...selectedReferralMember,
        member: selectedReferralMember?.member || '',
        email: selectedReferralMember?.email || '',
        depth: currentDepth - 1,
      });
      goBack();
    } else {

      goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title={`${t('screens.referralDepthTwo.title')} ${currentDepth}`}
        showBackButton={true}
        onBackPress={handleBack}
        rightComponent={
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Feather name="x" size={20} color={COLORS.headerText} />
          </TouchableOpacity>
        }
      />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {rows.map((row, index) => (
            <ReferralMemberRow
              key={`${row.email}-${index}`}
              email={row.email}
              date={row.date}
              hideRank={true}
              hideHighlightBorder={true}
            />
          ))}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
  },
  wrapper: {
    paddingVertical: SIZES.small,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

