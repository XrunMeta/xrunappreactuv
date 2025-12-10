import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Header, ReferralMemberRow } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { getMyGroup } from '../services';
import { MyGroupItem } from '../types';
import { SafeView } from '../components';

interface MemberData {
  id: string;
  rank: number;
  email: string;
  date: string;
  member: string;
  highlight?: boolean;
}

const transformDepthData = (apiData: MyGroupItem[]): MemberData[] => {
  return apiData.map((item, index) => {

    let formattedDate = '';
    try {
      const dateString = item.datejoin.replace(' ', 'T');
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('[Depth] 잘못된 날짜:', item.datejoin);
        formattedDate = '';
      } else {
        formattedDate = date
          .toISOString()
          .split('T')[0]
          .replace(/-/g, '.');
      }
    } catch (error) {
      console.log('[Depth] 날짜 파싱 오류:', item.datejoin, error);
      formattedDate = '';
    }

    return {
      id: `depth_${item.member}`,
      rank: index + 1,
      email: item.email || '',
      date: formattedDate,
      member: item.member || '',
      highlight: index === 0,
    };
  });
};

export const ReferralDepthOneScreen = () => {
  const { navigate, goBack, reset } = useAppNavigation();
  const { selectedReferralMember, setSelectedReferralMember } = useAppContext();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [depthMembers, setDepthMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [depthLevel, setDepthLevel] = useState<number>(2); 

  const handleClose = () => {
    reset(ROUTES.map);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMemberId(String(userData.member));
          }
        }
      } catch (error) {
        console.error('[Depth] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchDepthData = useCallback(async (targetMember: string) => {
    try {
      setLoading(true);
      const response = await getMyGroup(targetMember, navigate);

      if (response.status === 'success' && response.data) {
        const transformedData = transformDepthData(response.data);
        setDepthMembers(transformedData);
      } else {
        console.error('[Depth] Depth 데이터 조회 실패:', response.message);
        setDepthMembers([]);
      }
    } catch (error) {
      console.error('[Depth] Depth 데이터 조회 실패:', error);
      setDepthMembers([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedReferralMember?.member) {

      const currentDepth = selectedReferralMember.depth || 2;
      setDepthLevel(currentDepth);
      fetchDepthData(selectedReferralMember.member);
    } else if (memberId) {

      setDepthLevel(2);
      fetchDepthData(memberId);
    }
  }, [selectedReferralMember, memberId, fetchDepthData]);

  const renderDepthItem = ({ item }: { item: MemberData }) => {
    return (
      <ReferralMemberRow
        key={item.id}
        rank={item.rank}
        email={item.email}
        date={item.date}
        highlight={item.highlight}
        onPress={() => {

          setSelectedReferralMember({
            member: item.member,
            email: item.email,
            depth: depthLevel + 1,
          });
          navigate(ROUTES.referralDepthOne);
        }}
      />
    );
  };

  const { t } = useTranslation();

  return (
    <SafeView style={styles.container}>
      <Header
        title={`${t('screens.referralDepthOne.title')} ${depthLevel}`}
        onBackPress={goBack}
        showBackButton
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : depthMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('screens.referralDepthOne.emptyTitle')}</Text>
          <Text style={styles.emptyDescription}>
            {t('screens.referralDepthOne.emptyDescription')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={depthMembers}
          renderItem={renderDepthItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  loadingContainer: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#2a2727',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
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
