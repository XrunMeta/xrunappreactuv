import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ReferralMemberRow, ReferralStatsCard, SegmentedControl, DataList, DataListRef } from '../components';
import { COLORS, LANG } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { shareReferralLink } from '../utils';
import { useAlertDialog } from '../context/AlertDialogContext';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { getMyGroup } from '../services';
import { MyGroupItem } from '../types';

interface MemberData {
  rank: number;
  email: string;
  date: string;
  member: string; 
  highlight?: boolean;
}

export const ReferralMyGroupScreen = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const { setSelectedReferralMember } = useAppContext();
  const dataListRef = useRef<DataListRef>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [allMembers, setAllMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const hasLoadedRef = useRef<boolean>(false);
  const membersDataRef = useRef<MemberData[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {

            setMemberId(String(userData.member));

            hasLoadedRef.current = false;
            setAllMembers([]);
            setTotalMembers(0);
          }
          if (userData.email) {
            setUserEmail(userData.email);
          }
        }
      } catch (error) {
        console.error('[추천] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchReferralMembers = useCallback(async (
    params: PaginationParams
  ): Promise<PaginationResponse<MemberData>> => {
    if (!memberId) {
      return { data: [], total: 0, hasMore: false };
    }

    try {

      if (params.page === 1 && !hasLoadedRef.current && !isLoadingRef.current) {
        isLoadingRef.current = true;

        try {
          const response = await getMyGroup(memberId, navigate);

          if (response.status === 'success' && response.data) {

            const members: MemberData[] = response.data.map((item: MyGroupItem, index: number) => {

              let formattedDate = '';
              try {
                const dateString = item.datejoin.replace(' ', 'T');
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                  console.log('[내 그룹] 잘못된 날짜:', item.datejoin);
                  formattedDate = '';
                } else {
                  formattedDate = date
                    .toISOString()
                    .split('T')[0]
                    .replace(/-/g, '.');
                }
              } catch (error) {
                console.log('[내 그룹] 날짜 파싱 오류:', item.datejoin, error);
                formattedDate = '';
              }

              return {
                rank: index + 1,
                email: item.email || '',
                date: formattedDate,
                member: item.member || '',
                highlight: index === 0, 
              };
            });

            membersDataRef.current = members;
            setAllMembers(members);
            setTotalMembers(members.length);
            hasLoadedRef.current = true;
            setIsLoading(false);
          } else {
            membersDataRef.current = [];
            setAllMembers([]);
            setTotalMembers(0);
            hasLoadedRef.current = true;
            setIsLoading(false);
          }
        } finally {
          isLoadingRef.current = false;
        }
      }

      const members = membersDataRef.current;
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = members.slice(startIndex, endIndex);
      const hasMore = endIndex < members.length;

      return {
        data: paginatedData,
        total: members.length,
        hasMore,
      };
    } catch (error) {
      console.error('[추천] 내가 추천한 사람 목록 조회 실패:', error);
      isLoadingRef.current = false;
      setIsLoading(false);
      return { data: [], total: 0, hasMore: false };
    }
  }, [memberId, navigate]);

  const segmentedOptions = useMemo(
    () => [
      { label: t('screens.referralRank.group'), value: 'group' },
      { label: t('screens.referralRank.settlement'), value: 'settlement' },
      { label: t('screens.referralRank.rank'), value: 'rank' },
    ] as const,
    [t],
  );

  const handleSegmentChange = (value: typeof segmentedOptions[number]['value']) => {
    if (value === 'settlement') {
      navigate(ROUTES.referralSettlement);
    } else if (value === 'rank') {
      navigate(ROUTES.referralRank);
    } else if (value === 'group') {

      hasLoadedRef.current = false;
      setAllMembers([]);
      setTotalMembers(0);
      setIsLoading(true);
      dataListRef.current?.reloadData();
    }
  };

  const handleShare = async () => {
    if (!userEmail) {
      await showAlert(t('screens.referralMyGroup.shareFailed'), t('screens.referralMyGroup.shareFailedMessage'));
      return;
    }
    await shareReferralLink(
      t,
      { email: userEmail },
      showAlert,
      navigate,
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.referralMyGroup.title')} />
      <View style={styles.content}>
        <View style={styles.wrapper}>
          <View style={styles.topRow}>
            <ReferralStatsCard title={t('screens.referralMyGroup.myGroupMembers')} value={`${totalMembers} ${t('screens.referralMyGroup.members')}`} helperText=" " />
            <TouchableOpacity style={styles.iconButton} onPress={handleShare} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={COLORS.headerText} />
            </TouchableOpacity>
          </View>

          <SegmentedControl
            options={segmentedOptions}
            value="group"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
          />
        </View>

        <View style={styles.listContainer}>
          {!isLoading && totalMembers === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>그룹 멤버 없음</Text>
              <Text style={styles.emptyDescription}>
                아직 그룹에 멤버를 추가하지 않았습니다.{'\n'}
                네트워크를 확장하기 위해 사람들을 초대해보세요!
              </Text>
            </View>
          ) : (
            <DataList<MemberData>
              ref={dataListRef}
              fetchData={fetchReferralMembers}
              ItemComponent={ReferralMemberRow}
              pageSize={20}
              keyExtractor={(item, index) => `member-${item.rank}-${item.email}-${index}`}
              onItemPress={(item) => {
                setSelectedReferralMember({ member: item.member, email: item.email });
                navigate(ROUTES.referralDepthOne);
              }}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  content: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  topRow: {
    position: 'relative',
    marginBottom: 24,
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    marginTop: 16,
    marginBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
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
});

