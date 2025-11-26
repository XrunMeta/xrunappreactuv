import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralMemberRow } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { COLORS } from '../constants';
import { getMyGroup } from '../services';
import { MyGroupItem } from '../types';

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
  const { navigate, goBack } = useAppNavigation();
  const { selectedReferralMember } = useAppContext();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [depthMembers, setDepthMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchDepthData(selectedReferralMember.member);
    } else if (memberId) {

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

          navigate(ROUTES.referralDepthTwo);
        }}
      />
    );
  };

  const screenTitle = '1 Depth';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={screenTitle} onBackPress={goBack} showBackButton />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : depthMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>이 멤버는 아직 하위 추천인이 없습니다.</Text>
          <Text style={styles.emptyDescription}>
            이 사람의 직접 추천인이 추천한 멤버들이 여기에 표시됩니다.
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#2a2727',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
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
});
