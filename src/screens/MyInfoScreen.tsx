import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

type CardConfig = {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: 'Feather' | 'Material';
  route?: keyof typeof ROUTES;
  disabled?: boolean;
};

const cardConfigs: CardConfig[] = [
  {
    id: 'edit',
    label: '정보수정',
    iconName: 'edit-3',
    iconLibrary: 'Feather',
    route: 'myInfoEmailAuth',
  },
  {
    id: 'notify',
    label: '알림',
    iconName: 'bell',
    iconLibrary: 'Feather',
    route: 'myInfoNotify',
  },
  {
    id: 'faq',
    label: 'FAQ',
    iconName: 'head-question-outline',
    iconLibrary: 'Material',
    route: 'myInfoFaq',
  },
  {
    id: 'clause',
    label: '이용약관',
    iconName: 'file-text',
    iconLibrary: 'Feather',
    route: 'myInfoClauses',
  },
  {
    id: 'setting',
    label: '설정',
    iconName: 'settings',
    iconLibrary: 'Feather',
    route: 'myInfoSettings',
  },
  {
    id: 'referral',
    label: '래퍼럴 수정',
    iconName: 'refresh-ccw',
    iconLibrary: 'Feather',
    route: 'myInfoReferral',
  },
];

export const MyInfoScreen = () => {
  const { navigate } = useAppNavigation();

  const handleCardPress = (card: CardConfig) => {
    if (card.route) {
      navigate(ROUTES[card.route]);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'XRUNBackend • oth-user@example.invalid',
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 기능은 추후 연동됩니다.');
  };

  const renderIcon = (card: CardConfig) => {
    if (card.iconLibrary === 'Material') {
      return (
        <MaterialCommunityIcons
          name={card.iconName as any}
          size={18}
          color="#fff"
        />
      );
    }
    return <Feather name={card.iconName as any} size={18} color="#fff" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="My Info" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.adBanner}>
            <Text style={styles.adText}>AD</Text>
          </View>

          <View style={styles.profileCard}>
            <View>
              <Text style={styles.profileName}>XRUNBackend</Text>
              <Text style={styles.profileEmail}>oth-user@example.invalid</Text>
            </View>
            <View style={styles.profileActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Feather name="share-2" size={18} color={COLORS.headerText} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={18}
                  color={COLORS.headerText}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.grid}>
            {cardConfigs.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                ]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.85}
              >
                <View style={styles.cardIcon}>{renderIcon(card)}</View>
                <Text style={styles.cardLabel}>{card.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  adBanner: {
    width: '100%',
    height: 97,
    borderRadius: 8,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#10192d',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    minWidth: 100,
    height: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e7ec',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#343a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#111',
  },
});


