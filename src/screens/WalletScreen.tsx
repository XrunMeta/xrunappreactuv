import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, TokenListItem } from '../components';
import { COLORS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';

const WALLET_ADDRESS = '0xf9072c1c5c60c55daa7ee1ea72c8e7fed1aa63df';

type TokenData = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  suffix?: string;
  badgeLabel?: string;
  iconSource?: ImageSourcePropType;
  fallbackLabel?: string;
  fallbackColors?: {
    background: string;
    text: string;
  };
};

const TOKEN_DATA: TokenData[] = [
  {
    id: 'xrun-main',
    title: 'XRUN',
    subtitle: 'Polygon',
    amount: '12,200',
    suffix: 'XRUN',
    iconSource: require('../../assets/xrun-round-logo.png'),
  },
  {
    id: 'pol',
    title: 'POL',
    subtitle: 'Polygon',
    amount: '1,600',
    suffix: 'POL',
    iconSource: require('../../assets/pol-round-logo.png'),
  },
  {
    id: 'ad',
    title: 'AD XRUN',
    subtitle: 'XRUN',
    amount: '500',
    suffix: 'XRUN',
    iconSource: require('../../assets/ad-round-logo.png'),
  },
  {
    id: 'xrun-eth',
    title: 'XRUN',
    subtitle: 'Ethereum',
    amount: '1',
    suffix: '',
    iconSource: require('../../assets/xrun2-round-logo.png'),
  },
];

export const WalletScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const tokenList = useMemo(() => TOKEN_DATA, []);

  const handleCopyAddress = () => {
    Alert.alert('주소 복사', '지갑 주소가 복사되었습니다.');
  };

  const handleAction = (type: 'scan' | 'receive' | 'send') => {
    Alert.alert('준비 중', `${type} 기능은 아직 준비 중입니다.`);
  };

  const handleAddToken = () => {
    Alert.alert('추가 예정', '토큰 추가 기능이 곧 제공될 예정입니다.');
  };

  const handleCardPress = () => {
    navigate(ROUTES.verificationCode);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Wallet" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardStack}>
          <TouchableOpacity style={styles.walletCard} activeOpacity={0.85} onPress={handleCardPress}>
            <View style={styles.cardAccentOne} />
            <View style={styles.cardAccentTwo} />
            <View>
              <Text style={styles.cardTitle}>My Wallet</Text>
              <Text style={styles.cardAddress}>{WALLET_ADDRESS}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress} activeOpacity={0.7}>
              <Ionicons name="copy-outline" size={18} color="#ffffff" />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <QuickAction label="PolygonScan" icon={require('../../assets/icon-polygonscan.png')} onPress={() => handleAction('scan')} />
            <QuickAction label="Receive" icon={require('../../assets/icon-receive.png')} onPress={() => handleAction('receive')} />
            <QuickAction label="Send" icon={require('../../assets/icon-send.png')} onPress={() => handleAction('send')} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Balance</Text>
          <TouchableOpacity style={styles.addTokenButton} onPress={handleAddToken} activeOpacity={0.7}>
            <Text style={styles.addTokenText}>add token</Text>
            <Image source={require('../../assets/icon-addToken.png')} style={styles.addTokenIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {tokenList.map((token) => (
            <TokenListItem
              key={token.id}
              title={token.title}
              subtitle={token.subtitle}
              amount={token.amount}
              suffix={token.suffix}
              badgeLabel={token.badgeLabel}
              iconSource={token.iconSource}
              fallbackLabel={token.fallbackLabel}
              fallbackColors={token.fallbackColors}
            />
          ))}
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
};

const QuickAction = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: ReturnType<typeof require>;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onPress}>
    <Image source={icon} style={styles.actionIcon} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  cardStack: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: '#27345c',
    borderRadius: 16,
    padding: 24,
    minHeight: 170,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardAccentOne: {
    position: 'absolute',
    width: 140,
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -120,
    left: -40,
    transform: [{ rotate: '-20deg' }],
  },
  cardAccentTwo: {
    position: 'absolute',
    width: 100,
    height: 260,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    right: -30,
    transform: [{ rotate: '-15deg' }],
  },
  cardTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 12,
    color: '#f0f3ff',
    fontFamily: 'Roboto-Regular',
  },
  copyButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginTop: -24,
    marginHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  actionIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#454545',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
  addTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTokenIcon: {
    width: 20,
    height: 20,
  },
  addTokenText: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#000000',
  },
  addTokenPlus: {
    fontSize: 16,
    color: '#000000',
  },
  listWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  homeIndicator: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#10192d',
    borderRadius: 100,
    marginBottom: 9,
  },
});


