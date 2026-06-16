import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ShopSalesMemberRow, ShopSalesMemberData, DataList, DataListRef, SafeView } from '../components';
import { useAlertDialog } from '../context';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { PaginationParams, PaginationResponse } from '../types/pagination';
import { getItemInfo, getItemPurchaseList } from '../services';
import { PurchaseItem } from '../types';

type PeriodOption = '1week' | '1month' | '3months' | '6months' | 'custom';
type DatePickerTarget = 'start' | 'end' | null;

export const MyinfoShopSalesScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const dataListRef = useRef<DataListRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shopmember, setShopmember] = useState<string | null>(null);
  const [itemInfo, setItemInfo] = useState<{
    item: string | null;
    title: string | null;
    price: number;
    priceKRW: number;
    priceXrun: number;
    participantCount: number;
    totalSales: number;
    totalSalesXrun: number;
    description?: string;
    maxpurchase?: number;
    image?: number | null;
    thumbnail?: number | null;
    sdk?: string | null;
    is_approved?: string;
    status?: number;
  }>({
    item: null,
    title: null,
    price: 0,
    priceKRW: 0,
    priceXrun: 0,
    participantCount: 0,
    totalSales: 0,
    totalSalesXrun: 0,
    description: undefined,
    maxpurchase: undefined,
    image: null,
    thumbnail: null,
    sdk: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('1month');
  const [startDateObj, setStartDateObj] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDateObj, setEndDateObj] = useState<Date>(new Date());

  const [showCalendar, setShowCalendar] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const periodOptions: { key: PeriodOption; label: string }[] = [
    { key: '1week', label: t('screens.myinfoShopSales.period1Week') },
    { key: '1month', label: t('screens.myinfoShopSales.period1Month') },
    { key: '3months', label: t('screens.myinfoShopSales.period3Months') },
    { key: '6months', label: t('screens.myinfoShopSales.period6Months') },
    { key: 'custom', label: t('screens.myinfoShopSales.periodCustom') },
  ];

  const weekDays = [
    t('screens.myinfoShopSales.weekDays.sun'),
    t('screens.myinfoShopSales.weekDays.mon'),
    t('screens.myinfoShopSales.weekDays.tue'),
    t('screens.myinfoShopSales.weekDays.wed'),
    t('screens.myinfoShopSales.weekDays.thu'),
    t('screens.myinfoShopSales.weekDays.fri'),
    t('screens.myinfoShopSales.weekDays.sat'),
  ];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const reverseNameOrder = (name: string): string => {
    if (!name || !name.trim()) return name;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {

      return parts.reverse().join(' ');
    }
    return name; 
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {

            setShopmember(String(userData.member));
          }
        }
      } catch (error) {
        console.error('[Shop 매출] 사용자 정보 로드 실패:', error);
        setIsLoading(false);
      }

    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadItemInfo = async () => {
      if (!shopmember) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getItemInfo(shopmember, navigate);

        const itemData = Array.isArray(response.data) ? response.data[0] : response.data;
        if (response.status === 'success' && itemData) {
          const itemTitle = itemData.title;
          setItemInfo({
            item: itemData.item || null,
            title: itemTitle && itemTitle.trim() ? itemTitle : null,
            price: itemData.price || 0,
            priceKRW: itemData.priceKRW || 0,
            priceXrun: itemData.priceXrun || 0,
            participantCount: itemData.participantCount || 0,
            totalSales: itemData.totalSales || 0,
            totalSalesXrun: itemData.totalSalesXrun || 0,
            description: itemData.description,
            maxpurchase: itemData.maxpurchase,
            image: itemData.image || null,
            thumbnail: itemData.thumbnail || null,
            sdk: itemData.sdk || null,
            is_approved: itemData.is_approved || 'N',

            status: itemData.status != null ? Number(itemData.status) : undefined,
          });
        } else {

          setItemInfo({
            item: null,
            title: null,
            price: 0,
            priceKRW: 0,
            priceXrun: 0,
            participantCount: 0,
            totalSales: 0,
            totalSalesXrun: 0,
          });
        }
      } catch (error) {
        console.error('[Shop 매출] 상품 정보 조회 실패:', error);
        setItemInfo({
          item: null,
          title: null,
          price: 0,
          priceKRW: 0,
          priceXrun: 0,
          participantCount: 0,
          totalSales: 0,
          totalSalesXrun: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadItemInfo();
  }, [shopmember, navigate]);

  const handlePeriodSelect = (period: PeriodOption) => {
    setSelectedPeriod(period);

    const today = new Date();
    let newStartDate = new Date();

    switch (period) {
      case '1week':
        newStartDate.setDate(today.getDate() - 7);
        break;
      case '1month':
        newStartDate.setMonth(today.getMonth() - 1);
        break;
      case '3months':
        newStartDate.setMonth(today.getMonth() - 3);
        break;
      case '6months':
        newStartDate.setMonth(today.getMonth() - 6);
        break;
      case 'custom':
        return;
    }

    setStartDateObj(newStartDate);
    setEndDateObj(today);
  };

  const handleDateInputPress = (target: 'start' | 'end') => {
    setSelectedPeriod('custom');
    setDatePickerTarget(target);
    setCalendarDate(target === 'start' ? startDateObj : endDateObj);
    setShowCalendar(true);
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) return; 

    if (datePickerTarget === 'start') {
      if (selectedDate > endDateObj) {
        setEndDateObj(selectedDate);
      }
      setStartDateObj(selectedDate);
    } else if (datePickerTarget === 'end') {
      if (selectedDate < startDateObj) {
        setStartDateObj(selectedDate);
      }
      setEndDateObj(selectedDate);
    }

    setShowCalendar(false);
    setDatePickerTarget(null);
  };

  const changeCalendarMonth = (delta: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCalendarDate(newDate);
  };

  const handleApplySearch = () => {
    setShowDatePicker(false);
    setIsLoading(true);
    dataListRef.current?.reloadData();
  };

  const handleModifyItem = async () => {
    if (!itemInfo.item || !itemInfo.title) {
      return;
    }

    try {

      const editItemData = {
        item: itemInfo.item,
        title: itemInfo.title,
        price: itemInfo.price,
        priceKRW: itemInfo.priceKRW,
        priceXrun: itemInfo.priceXrun,
        description: itemInfo.description || '',
        maxpurchase: itemInfo.maxpurchase || 1,
        image: itemInfo.image || null,
        thumbnail: itemInfo.thumbnail || null,
        sdk: itemInfo.sdk || null,
        isEditMode: true,
      };
      await AsyncStorage.setItem('editShopItem', JSON.stringify(editItemData));

      navigate(ROUTES.shopItemRegister);
    } catch (error) {
      console.error('[Shop 매출] 상품 수정 정보 저장 실패:', error);
    }
  };

  useEffect(() => {
    if (shopmember && !isLoading) {
      dataListRef.current?.reloadData();
    }
  }, [startDateObj, endDateObj, shopmember]);

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const selectedDate = datePickerTarget === 'start' ? startDateObj : endDateObj;

    return (
      <View style={styles.calendarContainer}>
        {}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeCalendarMonth(-1)} style={styles.calendarNavButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.calendarHeaderText}>
            {t('screens.myinfoShopSales.yearMonth', { year, month: month + 1 })}
          </Text>
          <TouchableOpacity onPress={() => changeCalendarMonth(1)} style={styles.calendarNavButton}>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <Text
              key={day}
              style={[
                styles.weekDayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </Text>
          ))}
        </View>

        {}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const currentDate = new Date(year, month, day);
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const isSelected =
              day === selectedDate.getDate() &&
              month === selectedDate.getMonth() &&
              year === selectedDate.getFullYear();
            const isFuture = currentDate > today;
            const dayOfWeek = (firstDay + day - 1) % 7;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isSelected && styles.selectedDayCell,
                  isToday && !isSelected && styles.todayCell,
                ]}
                onPress={() => !isFuture && handleDateSelect(day)}
                disabled={isFuture}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dayText,
                  dayOfWeek === 0 && styles.sundayText,
                  dayOfWeek === 6 && styles.saturdayText,
                  isSelected && styles.selectedDayText,
                  isFuture && styles.disabledDayText,
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <TouchableOpacity
          style={styles.calendarCloseButton}
          onPress={() => {
            setShowCalendar(false);
            setDatePickerTarget(null);
          }}
        >
          <Text style={styles.calendarCloseButtonText}>{t('screens.myinfoShopSales.close')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchSalesMembers = useCallback(async (
    params: PaginationParams
  ): Promise<PaginationResponse<ShopSalesMemberData>> => {
    if (!shopmember) {
      setIsLoading(false);
      return { data: [], total: 0, hasMore: false };
    }

    try {

      if (params.page === 1) {
        setIsLoading(true);
      }

      const dateFrom = formatDateForAPI(startDateObj);
      const dateTo = formatDateForAPI(endDateObj);

      const response = await getItemPurchaseList(shopmember, dateFrom, dateTo, navigate);

      if (response.status === 'success' && response.data) {

        const purchaseList = response.data.purchaseList || [];
        const members: ShopSalesMemberData[] = purchaseList.map((purchase: PurchaseItem, index: number) => {

          const formattedDate = purchase.purchaseDate ? purchase.purchaseDate.replace(/-/g, '.') : '';

          const formattedAmount = `${Number(itemInfo.priceXrun ?? 0).toLocaleString('ko-KR')} XRUN`;

          const reversedName = reverseNameOrder(purchase.name);

          const uniqueId = purchase.email && purchase.purchaseDate
            ? `${purchase.email}-${purchase.purchaseDate}-${index}`
            : purchase.email
            ? `${purchase.email}-${index}`
            : `purchase-${index}`;

          return {
            id: uniqueId, 
            email: purchase.email, 
            name: reversedName, 
            date: formattedDate,
            settlement: formattedAmount,
          };
        });

        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = members.slice(startIndex, endIndex);
        const hasMore = endIndex < members.length;

        if (params.page === 1) {
          setIsLoading(false);
        }

        return {
          data: paginatedData,
          total: members.length,
          hasMore,
        };
      } else {

        if (params.page === 1) {
          setIsLoading(false);
        }
        return { data: [], total: 0, hasMore: false };
      }
    } catch (error) {
      console.error('[Shop 매출] 구매자 명단 조회 실패:', error);
      if (params.page === 1) {
        setIsLoading(false);
      }
      return { data: [], total: 0, hasMore: false };
    }
  }, [shopmember, startDateObj, endDateObj, navigate, t, itemInfo.priceXrun]);

  const renderHeaderRight = () => (
    <TouchableOpacity
      style={styles.headerSearchButton}
      onPress={() => setShowDatePicker(true)}
      activeOpacity={0.7}
    >
      <Ionicons name="calendar-outline" size={22} color={COLORS.headerText} />
    </TouchableOpacity>
  );

  return (
    <SafeView style={styles.container} backgroundColor='#F8FAFC'>
      <Header
        title={t('screens.myinfoShopSales.title')}
        onBackPress={goBack}
        rightComponent={renderHeaderRight()}
      />
      <View style={styles.content}>
        {}
        {!isLoading && shopmember && itemInfo.title && itemInfo.title.trim() ? (
          <View style={styles.infoCard}>
            {}
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text
                style={[styles.infoTitle, { textAlign: 'center', marginBottom: 6 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {itemInfo.title}
              </Text>
              {Number((itemInfo as any).status) === 0 ? (
                <View style={{ backgroundColor: '#6b7280', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>판매 종료</Text>
                </View>
              ) : itemInfo.is_approved === 'Y' ? (
                <View style={{ backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('screens.myinfoShopSales.approved')}</Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('screens.myinfoShopSales.pending')}</Text>
                </View>
              )}
            </View>

            {}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t('screens.myinfoShopSales.productPrice')}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{Number(itemInfo.priceXrun ?? 0).toLocaleString('ko-KR')}</Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>XRUN</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#e5e7eb' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t('screens.myinfoShopSales.participants')}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{Number(itemInfo.participantCount ?? 0).toLocaleString('ko-KR')}</Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>{t('screens.myinfoShopSales.personUnit')}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#e5e7eb' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t('screens.myinfoShopSales.totalSales')}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#16a34a' }}>{(Number(itemInfo.priceXrun ?? 0) * Number(itemInfo.participantCount ?? 0)).toLocaleString('ko-KR')}</Text>
                <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>XRUN</Text>
              </View>
            </View>

            {}
            <TouchableOpacity
              onPress={handleModifyItem}
              activeOpacity={0.7}
              style={{ marginTop: 12, alignSelf: 'flex-end', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' }}
            >
              <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600' }}>{t('screens.myinfoShopSales.modify')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {}
        {!isLoading && shopmember && (!itemInfo.title || !itemInfo.title.trim()) ? (
          <View style={styles.emptyItemContainer}>
            <Text style={styles.emptyItemDescription}>{t('screens.myinfoShopSales.noItemData')}</Text>
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => navigate(ROUTES.shopItemRegister)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color="#ffffff" style={styles.addItemIcon} />
              <Text style={styles.addItemButtonText}>{t('screens.myinfoShopSales.addItem')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {}
        {!isLoading && shopmember && itemInfo.title && (
          <View style={styles.selectedPeriodContainer}>
            <Ionicons name="calendar" size={16} color={COLORS.headerText} />
            <Text style={styles.selectedPeriodText}>{formatDate(startDateObj)} ~ {formatDate(endDateObj)}</Text>
          </View>
        )}

        {shopmember ? (
          itemInfo.title && itemInfo.title.trim() ? (
            <View style={styles.listContainer}>
              <DataList<ShopSalesMemberData>
                ref={dataListRef}
                fetchData={fetchSalesMembers}
                ItemComponent={ShopSalesMemberRow}
                pageSize={20}
                contentContainerStyle={{ paddingVertical: 0, paddingBottom: 32 }}
                emptyMessage={!isLoading ? t('screens.myinfoShopSales.noData') : undefined}
                keyExtractor={(item, index) => item.id || `purchase-${index}`}
              />
            </View>
          ) : null
        ) : (
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyDescription}>{t('screens.myinfoShopSales.noShopmember')}</Text>
            </View>
          )
        )}
      </View>

      {}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDatePicker(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{t('screens.myinfoShopSales.periodSelect')}</Text>

              {}
              <View style={styles.periodOptionsContainer}>
                {periodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.periodOptionButton,
                      selectedPeriod === option.key && styles.periodOptionButtonActive
                    ]}
                    onPress={() => handlePeriodSelect(option.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.periodOptionText,
                      selectedPeriod === option.key && styles.periodOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {}
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={styles.dateInputContainer}
                  onPress={() => handleDateInputPress('start')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateLabel}>{t('screens.myinfoShopSales.startDate')}</Text>
                  <View style={[
                    styles.dateInput,
                    datePickerTarget === 'start' && styles.dateInputActive
                  ]}>
                    <Text style={styles.dateInputText}>{formatDate(startDateObj)}</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.dateSeparator}>~</Text>
                <TouchableOpacity
                  style={styles.dateInputContainer}
                  onPress={() => handleDateInputPress('end')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateLabel}>{t('screens.myinfoShopSales.endDate')}</Text>
                  <View style={[
                    styles.dateInput,
                    datePickerTarget === 'end' && styles.dateInputActive
                  ]}>
                    <Text style={styles.dateInputText}>{formatDate(endDateObj)}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {}
              {showCalendar && renderCalendar()}

              {}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDatePicker(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{t('screens.myinfoShopSales.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplySearch}
                  activeOpacity={0.7}
                >
                  <Text style={styles.applyButtonText}>{t('screens.myinfoShopSales.apply')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  content: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
    paddingBottom: 0,
  },
  headerSearchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: '#e8f4fc',
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },
  infoTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoValue: {
    fontFamily: 'Roboto-Medium',
    color: '#333333',
  },
  infoHighlight: {
    fontFamily: 'Roboto-SemiBold',
    color: '#2196F3',
  },
  selectedPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SIZES.small,
    marginBottom: SIZES.small,
  },
  selectedPeriodText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xlarge,
  },
  emptyDescription: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xlarge,
    paddingHorizontal: SIZES.large,
  },
  emptyItemDescription: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.large,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: SIZES.xlarge,
    paddingVertical: SIZES.medium,
    borderRadius: 12,
    gap: 8,
  },
  addItemIcon: {
    marginRight: 4,
  },
  addItemButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#ffffff',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xlarge,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SIZES.xlarge,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: FONTS.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  periodOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SIZES.large,
  },
  periodOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  periodOptionButtonActive: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  periodOptionText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  periodOptionTextActive: {
    color: '#ffffff',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
    marginBottom: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  dateInputActive: {
    borderColor: COLORS.buttonPrimary,
    backgroundColor: '#F0F4FF',
  },
  dateInputText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#333333',
  },
  dateSeparator: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Medium',
    color: '#999999',
    marginHorizontal: 12,
    marginBottom: 12,
  },

  calendarContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarHeaderText: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 4,
  },
  selectedDayCell: {
    backgroundColor: COLORS.buttonPrimary,
  },
  todayCell: {
    backgroundColor: '#E8F4FC',
  },
  dayText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
    lineHeight: 24,
  },
  selectedDayText: {
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  disabledDayText: {
    color: '#CCCCCC',
  },
  sundayText: {
    color: '#E53935',
  },
  saturdayText: {
    color: '#1E88E5',
  },
  calendarCloseButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  calendarCloseButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#666666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.buttonPrimary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#ffffff',
  },
  modifyLink: {
    color: COLORS.buttonPrimary,
    textDecorationLine: 'underline',
    lineHeight: 20,
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
  },
});
