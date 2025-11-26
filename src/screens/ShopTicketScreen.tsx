import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ImageSourcePropType, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl, ShopItemCard, TaboolaBanner } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ShopItem } from '../types';
import { getXRUNGopaxPrice, getXrunBuyableItems } from '../services';
import { ShopItemData } from '../types';
import { formatXrunAmount, formatWonAmount, formatCurrency } from '../utils';
import { cashingimages } from '../utils/imageCache';
import { COLORS } from '../constants';

const transformShopItem = (
  item: ShopItemData,
  gopaxPrice: number,
): ShopItem & ShopItemData => {
  const priceKRW = item.priceKRW || '0';
  const priceKRWNum = parseFloat(priceKRW.replace(/,/g, ''));

  const isxrunbuy = typeof item.isxrunbuy === 'object' ? item.isxrunbuy?.data || 0 : item.isxrunbuy || 0;

  const gpkrprice = typeof item.gpkrprice === 'object' ? item.gpkrprice?.data || 0 : item.gpkrprice || 0;

  const gtkrPrice = typeof item.gtkrPrice === 'object' ? item.gtkrPrice?.data || 0 : item.gtkrPrice || 0;

  let basePriceXrun: number;
  let chargeXrun: number;
  let totalPriceXrun: number;
  let chargeKRW: number;

  if (isxrunbuy == 1) {

    const gopaxPriceToUse = gopaxPrice || gpkrprice || 1;
    basePriceXrun = priceKRWNum / gopaxPriceToUse;
    chargeXrun = basePriceXrun * 0.05;
    totalPriceXrun = basePriceXrun + chargeXrun;
    chargeKRW = priceKRWNum * 0.05;
  } else {

    const priceXrun = item.priceXrun || '0';
    const priceXrunNum = parseFloat(priceXrun.replace(/,/g, ''));
    const priceXrunRounded = Math.ceil(priceXrunNum);

    basePriceXrun = priceXrunRounded;
    chargeXrun = priceXrunRounded * 0.05;
    totalPriceXrun = priceXrunRounded + chargeXrun;
    chargeKRW = priceKRWNum * 0.05;
  }

  const imageSource = require('../../assets/xrun-horizontal-logo.png');

  const hasSku = item.sku && item.sku.trim() !== '';

  if (isxrunbuy == 1) {
    const gopaxPriceToUse = gopaxPrice || gpkrprice || 1;
    console.log('[상점] XRUN 구매 아이템 계산:', {
      priceKRW,
      priceKRWNum,
      gopaxPriceToUse,
      basePriceXrun,
      chargeXrun,
      totalPriceXrun,
    });
  } else {
    const priceXrun = item.priceXrun || '0';
    const priceXrunNum = parseFloat(priceXrun.replace(/,/g, ''));
    const priceXrunRounded = Math.ceil(priceXrunNum);
    console.log('[상점] 일반 아이템 계산:', {
      priceKRW,
      priceKRWNum,
      priceXrun,
      priceXrunNum,
      priceXrunRounded,
      chargeXrun,
      totalPriceXrun,
    });
  }

  return {
    id: String(item.item),
    priceLabel: hasSku ? 'Loading...' : priceKRW, 
    detailPrice: `${priceKRW} / ${formatXrunAmount(basePriceXrun)} XRUN`,
    detailFee: `${formatWonAmount(chargeKRW)} / ${formatXrunAmount(chargeXrun)} XRUN`,
    detailTotal: `${formatXrunAmount(totalPriceXrun)} XRUN`,

    ...item,

    title: item.title || '',
    image: imageSource,
    priceXrun: String(basePriceXrun), 
    isxrunbuy: isxrunbuy,
    gpkrprice: gpkrprice,
    gtkrPrice: gtkrPrice,
    gpkChargePrice: chargeXrun,
    price: {
      won: item.priceKRW,
      wonSymbol: 'KRW',
      coin: basePriceXrun,
      coinSymbol: 'XRUN',
    },
    charge: {
      won: chargeKRW,
      wonSymbol: 'KRW',
      coin: chargeXrun,
      coinSymbol: 'XRUN',
    },
    totalPrice: {
      coin: totalPriceXrun,
      coinSymbol: 'XRUN',
      gtkrPrice: gtkrPrice,
    },
  } as ShopItem & ShopItemData;
};

export const ShopTicketScreen = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [tab, setTab] = useState<'ticket' | 'myTicket'>('ticket');
  const { navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();
  const [shopItems, setShopItems] = useState<(ShopItem & ShopItemData)[]>([]);
  const [loading, setLoading] = useState(true);
  const [gopaxPrice, setGopaxPrice] = useState<number>(0);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [itemImages, setItemImages] = useState<Record<string, string>>({}); 

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
        console.error('[상점] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchGopaxPrice = useCallback(async () => {
    try {
      const result = await getXRUNGopaxPrice(navigate);
      if (result.status === 'success' && result.data) {
        const price = result.data.gopaxPrice || 0;
        setGopaxPrice(price);
        console.log('[상점] 고팍스 가격 가져오기 성공:', price);
        return price;
      } else {
        console.log('[상점] 고팍스 가격 가져오기 실패:', result.message);
        setGopaxPrice(0);
        return 0;
      }
    } catch (error) {
      console.log('[상점] 고팍스 가격 가져오기 오류:', error);
      setGopaxPrice(0);
      return 0;
    }
  }, [navigate]);

  const loadItemImages = useCallback(async (items: ShopItemData[]) => {
    const imageCache: Record<string, string> = {};

    for (const item of items) {

      const imageFileId = item.thumbnail || item.image;

      if (imageFileId) {
        const fileIdStr = String(imageFileId);
        console.log(`[상점] 파일 ID로 이미지 로드 시도: ${fileIdStr}`);

        try {

          const cachedImage = await cashingimages.getCachedImage(fileIdStr);
          if (cachedImage) {
            console.log(`[상점] ✅ 이미지 ${fileIdStr}가 캐시에서 발견됨`);
            imageCache[String(item.item)] = cachedImage;
          } else {
            console.log(`[상점] ❌ 이미지 ${fileIdStr}가 캐시에 없음, 다운로드 시도...`);

            const downloadSuccess = await cashingimages.downloadAndCacheImage(
              fileIdStr,
            );

            if (downloadSuccess) {
              console.log(`[상점] ✅ 다운로드 성공, 캐시에서 다시 가져오기 시도...`);
              const newCachedImage = await cashingimages.getCachedImage(fileIdStr);
              if (newCachedImage) {
                console.log(`[상점] ✅ 이미지 ${fileIdStr}가 다운로드 후 성공적으로 가져옴`);
                imageCache[String(item.item)] = newCachedImage;
              } else {
                console.log(`[상점] ❌ 다운로드 후 이미지 ${fileIdStr} 가져오기 실패`);
              }
            } else {
              console.log(`[상점] ❌ ${fileIdStr} 다운로드 실패`);
            }
          }
        } catch (error) {
          console.error(`[상점] ❌ 아이템 ${item.item}의 이미지 로드 오류:`, error);
        }
      } else {
        console.log(`[상점] ⚠️ 아이템 ${item.item}에 이미지 또는 썸네일 ID가 없음`);
      }
    }

    console.log('[상점] === loadItemImages 요약 ===');
    console.log('[상점] 처리된 총 아이템 수:', items.length);
    console.log('[상점] 성공적으로 캐시된 이미지 수:', Object.keys(imageCache).length);
    console.log('[상점] 캐시된 아이템들:', Object.keys(imageCache));
    console.log('[상점] === loadItemImages 끝 ===');

    setItemImages(imageCache);
  }, [navigate]);

  const extractSkusFromItems = useCallback((items: ShopItemData[]): string[] => {
    const skus: string[] = [];
    items.forEach((item) => {

      if (item.sku && item.sku.trim() !== '' && !skus.includes(item.sku)) {
        skus.push(item.sku);
      }
    });
    console.log('[상점] 추출된 SKU 목록:', skus);
    return skus;
  }, []);

  const fetchShopItems = useCallback(async (currentGopaxPrice?: number) => {
    if (!memberId) return;

    try {
      setLoading(true);
      const priceToUse = currentGopaxPrice || gopaxPrice || 0;

      console.log('[상점] === 상점 아이템 가져오기 시작 ===');
      const result = await getXrunBuyableItems(memberId, navigate);

      if (result && result.status === 'success' && result.data) {
        console.log('[상점] API 응답 성공, 받은 아이템 수:', result.data.length);

        const transformedItems = result.data.map((item) => {
          console.log(`[상점] === 아이템 ${item.item} 변환 중 ===`);
          console.log('[상점] 원본 아이템 데이터:', {
            item: item.item,
            title: item.title,
            image: item.image,
            thumbnail: item.thumbnail,
            priceKRW: item.priceKRW,
            priceXrun: item.priceXrun,
            isxrunbuy: item.isxrunbuy,
            gpkrprice: item.gpkrprice,
            sku: item.sku,
          });

          if (priceToUse === 0) {
            fetchGopaxPrice();
          }
          return transformShopItem(item, priceToUse || gopaxPrice);
        });

        setShopItems(transformedItems);
        console.log('[상점] 변환된 아이템 수:', transformedItems.length);

        const dynamicSkus = extractSkusFromItems(result.data);
        if (dynamicSkus.length > 0) {
          console.log('[상점] SKU에 대한 IAP 제품 가져오기:', dynamicSkus);

        } else {
          console.log('[상점] 상점 아이템에서 IAP SKU를 찾을 수 없음');
        }

        await loadItemImages(result.data);
      } else {
        console.log('[상점] 상점 아이템 가져오기 실패:', result);
        await showAlert('Error', '상점 아이템을 불러오는데 실패했습니다.');
        setShopItems([]);
      }
    } catch (error) {
      console.error('[상점] 상점 아이템 가져오기 오류:', error);
      await showAlert('Error', '상점 아이템을 불러오는데 실패했습니다.');
      setShopItems([]);
    } finally {
      setLoading(false);
    }
  }, [memberId, gopaxPrice, navigate, fetchGopaxPrice, loadItemImages, extractSkusFromItems]);

  useEffect(() => {
    const loadData = async () => {
      if (!memberId) return;

      const price = await fetchGopaxPrice();

      await fetchShopItems(price);
    };

    if (memberId) {
      loadData();
    }
  }, [memberId, fetchGopaxPrice, fetchShopItems]);

  const segmentedOptions = useMemo(
    () => [
      { label: 'Ticket', value: 'ticket' },
      { label: 'My Ticket', value: 'myTicket' },
    ] as const,
    [],
  );

  const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
    setTab(value);
    if (value === 'myTicket') {
      navigate(ROUTES.shopMyTicket);
    }
  };

  const getIapPrice = useCallback((sku: string): string | null => {

    return null;
  }, []);

  const handleSelectItem = (item: ShopItem & ShopItemData) => {
    setSelectedShopItem(item);
    navigate(ROUTES.shopBuy);
  };

  const renderCard = (
    title: string,
    price: string,
    imageSource: ImageSourcePropType,
    options?: { quantityLabel?: string; shopItem?: ShopItem },
  ) => (
    <ShopItemCard
      key={title}
      title={title}
      priceLabel={price}
      imageSource={imageSource}
      quantityLabel={options?.quantityLabel}
      onPress={options?.shopItem ? () => handleSelectItem(options.shopItem as ShopItem & ShopItemData) : undefined}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.shop.title')} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.wrapper}>
              <SegmentedControl
                options={segmentedOptions}
                value={tab}
                onChange={handleTabChange}
                containerStyle={styles.segmented}
              />

              <View style={styles.searchBar}>
                <Feather name="search" size={18} color="#bcbec4" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#bcbec4"
                />
              </View>

              {tab === 'ticket' && shopItems.length > 0
                ? shopItems.map((item) => {

                    const itemImage = itemImages[item.id];
                    const imageSource = itemImage
                      ? { uri: `data:image/png;base64,${itemImage}` }
                      : item.image;

                    const hasSku = item.sku && item.sku.trim() !== '';
                    const iapPrice = hasSku ? getIapPrice(item.sku) : null;
                    const displayPrice = hasSku
                      ? (iapPrice || 'Loading...')
                      : formatCurrency(item.priceKRW || '0', 'KRW');

                    return renderCard(item.title, displayPrice, imageSource, { shopItem: item });
                  })
                : tab === 'ticket' && shopItems.length === 0
                ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>구매 가능한 아이템이 없습니다.</Text>
                    </View>
                  )
                : null}
            </View>
          </ScrollView>

          {}
          <View style={styles.taboolaContainer}>
            <TaboolaBanner placementType="shop" />
          </View>
        </>
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
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  segmented: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#d5dde0',
    backgroundColor: '#f7f8f9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  taboolaContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
});
