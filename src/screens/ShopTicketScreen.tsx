import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, ImageSourcePropType, ActivityIndicator, Text, Platform, TouchableOpacity } from 'react-native';
import { SafeScrollView, SafeView } from '../components';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl, ShopItemCard, TaboolaBanner } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ShopItem } from '../types';
import { getXRUNGopaxPrice, getXrunBuyableItems, sendInAppPurchase, getPointsBalance, spendPoints } from '../services';
import { ShopItemData } from '../types';
import { formatXrunAmount, formatWonAmount, formatCurrency } from '../utils';
import { cashingimages } from '../utils/imageCache';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import * as IAP from 'expo-iap';

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

  const sku = item.sku?.trim() ?? '';
  const isIapSku = Boolean(sku !== '' && !sku.startsWith('TRANSFER'));

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
    priceLabel: isIapSku ? 'Loading...' : priceKRW, 
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
  const [tab, setTab] = useState<'ticket' | 'myTicket' | 'xplay'>('ticket');
  const { navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();
  const [shopItems, setShopItems] = useState<(ShopItem & ShopItemData)[]>([]);
  const [loading, setLoading] = useState(true);
  const [gopaxPrice, setGopaxPrice] = useState<number>(0);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [itemImages, setItemImages] = useState<Record<string, string>>({}); 
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false); 

  const [iapProducts, setIapProducts] = useState<Record<string, any>>({});
  const [iapLoading, setIapLoading] = useState(false);

  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [pointsBalanceLoading, setPointsBalanceLoading] = useState(false);
  const [pointsSpendLoading, setPointsSpendLoading] = useState(false);

  useEffect(() => {

    const initIAP = async () => {
      try {
        await IAP.initConnection();
        console.log('[상점] IAP 연결 초기화 성공');
      } catch (error) {
        console.error('[상점] IAP 연결 초기화 실패:', error);
      }
    };
    initIAP();

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
            console.log(`[상점] ✅ 이미지 ${fileIdStr}가 캐시에서 발견됨 (유효성 검증 통과)`);
            imageCache[String(item.item)] = cachedImage;
          } else {

            console.log(`[상점] ⚠️ 이미지 ${fileIdStr}가 캐시에 없거나 유효하지 않음, 다운로드 시도...`);

            const isCached = await cashingimages.isCached(fileIdStr);
            if (isCached) {
              console.log(`[상점] 🔄 유효하지 않은 캐시 감지, 재다운로드 진행...`);
            }

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
                console.log(`[상점] ❌ 다운로드 후 이미지 ${fileIdStr} 가져오기 실패 (유효성 검증 실패)`);
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

    Object.keys(imageCache).forEach((itemId) => {
      const imageData = imageCache[itemId];
      console.log(`[상점] 아이템 ${itemId} 이미지 데이터 길이: ${imageData?.length || 0}자`);
    });

    console.log('[상점] === loadItemImages 끝 ===');

    setItemImages(imageCache);
  }, [navigate]);

  const extractSkusFromItems = useCallback((items: ShopItemData[]): string[] => {
    const skus: string[] = [];
    items.forEach((item) => {

      const sku = item.sku?.trim() ?? '';
      if (sku !== '' && !sku.startsWith('TRANSFER') && !skus.includes(sku)) {
        skus.push(sku);
      }
    });
    console.log('[상점] 추출된 SKU 목록:', skus);
    return skus;
  }, []);

  const fetchIapProducts = useCallback(async (skus: string[]) => {
    try {
      if (!skus || skus.length === 0) {
        console.log('[상점] IAP SKU가 없습니다.');
        return;
      }

      setIapLoading(true);
      console.log('[상점] IAP 제품 정보 가져오기 시작:', skus);

      const fetchedProducts = await IAP.fetchProducts({
        skus: skus,
        type: 'in-app',
      });

      console.log('[상점] IAP 제품 정보 응답:', JSON.stringify(fetchedProducts, null, 2));

      if (fetchedProducts && fetchedProducts.length > 0) {

        const productMap: Record<string, any> = {};
        fetchedProducts.forEach((product: any) => {
          const productId = product.productId || product.id;
          if (productId) {
            productMap[productId] = product;
            console.log(`[상점] IAP 제품 추가: ${productId}`, {
              price: product.price || product.localizedPrice,
              title: product.title || product.name,
            });
          }
        });
        setIapProducts(productMap);
        console.log('[상점] IAP 제품 맵 설정 완료:', Object.keys(productMap));
      }
    } catch (error) {
      console.error('[상점] IAP 제품 정보 가져오기 오류:', error);
    } finally {
      setIapLoading(false);
    }
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
          await fetchIapProducts(dynamicSkus);
        } else {
          console.log('[상점] 상점 아이템에서 IAP SKU를 찾을 수 없음');
        }

        await loadItemImages(result.data);
      } else {
        console.log('[상점] 상점 아이템 가져오기 실패:', result);
        await showAlert(t('screens.shopBuy.alerts.error'), t('screens.shopBuy.alerts.loadShopItemsFailed'));
        setShopItems([]);
      }
    } catch (error) {
      console.error('[상점] 상점 아이템 가져오기 오류:', error);
      await showAlert(t('screens.shopBuy.alerts.error'), t('screens.shopBuy.alerts.loadShopItemsFailed'));
      setShopItems([]);
    } finally {
      setLoading(false);
    }
  }, [memberId, gopaxPrice, navigate, fetchGopaxPrice, loadItemImages, extractSkusFromItems, fetchIapProducts]);

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
      { label: 'Xplay', value: 'xplay' },
    ] as const,
    [],
  );

  const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
    setTab(value);
    if (value === 'myTicket') {
      navigate(ROUTES.shopMyTicket);
    }
  };

  useEffect(() => {
    if (tab !== 'xplay' || !memberId) return;
    let cancelled = false;
    const fetchPoints = async () => {
      setPointsBalanceLoading(true);
      setPointsBalance(null);
      try {
        const result = await getPointsBalance(memberId, navigate);
        if (!cancelled) {
          setPointsBalance(result.current_p_balance);
        }
      } catch (e) {
        if (!cancelled) {
          setPointsBalance(0);
          console.error('[Xplay] 포인트 잔액 조회 실패:', e);
        }
      } finally {
        if (!cancelled) setPointsBalanceLoading(false);
      }
    };
    fetchPoints();
    return () => { cancelled = true; };
  }, [tab, memberId, navigate]);

  const handleTestSpend10 = useCallback(async () => {
    if (!memberId || pointsSpendLoading) return;
    const current = pointsBalance ?? 0;
    if (current < 10) {
      showAlert(t('screens.shopBuy.alerts.insufficientBalanceTitle'), t('screens.shopBuy.alerts.insufficientPointsMessage'), [{ text: t('screens.shopBuy.confirm') }]);
      return;
    }
    setPointsSpendLoading(true);
    try {
      const order_id = `member_${memberId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const result = await spendPoints(
        { snuid: memberId, order_id, item_name: '테스트 결제 10P', spent_amount: 10 },
        navigate,
      );
      setPointsBalance(result.remaining_balance);
      showAlert(t('screens.shopBuy.alerts.testPaymentComplete'), t('screens.shopBuy.alerts.testPaymentBalance', { balance: result.remaining_balance.toLocaleString() }), [{ text: t('screens.shopBuy.confirm') }]);
    } catch (e) {
      console.error('[Xplay] 테스트 결제 실패:', e);
      showAlert(t('screens.shopBuy.alerts.paymentFailed'), e instanceof Error ? e.message : t('screens.shopBuy.alerts.pointUseFailed'), [{ text: t('screens.shopBuy.confirm') }]);
    } finally {
      setPointsSpendLoading(false);
    }
  }, [memberId, pointsBalance, pointsSpendLoading, navigate, showAlert]);

  const getIapPrice = useCallback((sku: string): string | null => {
    const product = iapProducts[sku];
    if (product) {

      return product.localizedPrice || product.price || null;
    }
    return null;
  }, [iapProducts]);

  const hasIapProduct = useCallback((sku: string): boolean => {
    return !!iapProducts[sku];
  }, [iapProducts]);

  const handleSelectItem = (item: ShopItem & ShopItemData) => {
    setSelectedShopItem(item);
    navigate(ROUTES.shopBuy);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return shopItems;
    }

    const query = searchQuery.toLowerCase().trim();
    return shopItems.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const description = ((item as any)?.description || '').toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [shopItems, searchQuery]);

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
    <SafeView style={styles.container} backgroundColor='#F8FAFC'>
      <Header
        title={t('screens.shop.title')}
        rightComponent={
          <TouchableOpacity
            onPress={() => setShowSearchBar(!showSearchBar)}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <Feather name="search" size={20} color={COLORS.headerText} />
          </TouchableOpacity>
        }
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : (
        <>
          <View style={styles.contentContainer} >

            <SegmentedControl
              options={segmentedOptions}
              value={tab}
              onChange={handleTabChange}
              containerStyle={styles.segmented}
              hideIndicator={true}
            />

            {showSearchBar && (
              <View style={styles.searchBar}>
                <Feather name="search" size={18} color="#0296f2" />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('screens.shop.searchPlaceholder')}
                  placeholderTextColor="#bcbec4"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor='transparent'>
              {tab === 'xplay'
                ? (
                    <View style={styles.xplayContainer}>
                      {pointsBalanceLoading
                        ? (
                            <ActivityIndicator size="small" color={COLORS.buttonPrimary} style={styles.xplayLoader} />
                          )
                        : (
                            <Text style={styles.xplayBalanceLabel}>
                              {t('screens.shop.pointsBalance', '포인트 잔액')}: {pointsBalance !== null ? pointsBalance.toLocaleString() : '-'}
                            </Text>
                          )}
                      <TouchableOpacity
                        style={[styles.xplayTestButton, (pointsBalanceLoading || pointsSpendLoading || (pointsBalance !== null && pointsBalance < 10)) && styles.xplayTestButtonDisabled]}
                        onPress={handleTestSpend10}
                        disabled={pointsBalanceLoading || pointsSpendLoading || (pointsBalance !== null && pointsBalance < 10)}
                      >
                        {pointsSpendLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.xplayTestButtonText}>결제하기 10 (테스트)</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )
                : tab === 'ticket' && filteredItems.length > 0
                ? filteredItems.map((item) => {

                  const itemImage = itemImages[item.id];
                  let imageSource: ImageSourcePropType;

                  if (itemImage) {

                    if (itemImage && itemImage.length > 100) {
                      imageSource = { uri: `data:image/png;base64,${itemImage}` };
                      console.log(`[상점] 아이템 ${item.id} base64 이미지 사용 (길이: ${itemImage.length})`);
                    } else {
                      console.warn(`[상점] ⚠️ 아이템 ${item.id}의 base64 데이터가 유효하지 않음 (길이: ${itemImage?.length || 0}), 기본 이미지 사용`);
                      imageSource = item.image;
                    }
                  } else {
                    console.log(`[상점] 아이템 ${item.id} 캐시된 이미지 없음, 기본 이미지 사용`);
                    imageSource = item.image;
                  }

                  const sku = (item.sku ?? '').trim();
                  const isIapSku = Boolean(sku !== '' && !sku.startsWith('TRANSFER'));
                  const iapPrice = isIapSku ? getIapPrice(sku) : null;
                  const isIapReady = isIapSku && hasIapProduct(sku);

                  let displayPrice: string;
                  if (isIapSku) {
                    if (isIapReady && iapPrice) {
                      displayPrice = iapPrice; 
                    } else if (iapLoading) {
                      displayPrice = 'Loading...'; 
                    } else {
                      displayPrice = formatCurrency(item.priceKRW || '0', 'KRW'); 
                    }
                  } else {
                    displayPrice = formatCurrency(item.priceKRW || '0', 'KRW');
                  }

                  return renderCard(item.title, displayPrice, imageSource, { shopItem: item });
                })
                : tab === 'ticket' && filteredItems.length === 0
                  ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {searchQuery.trim()
                          ? 'No search results'
                          : '구매 가능한 아이템이 없습니다.'
                        }
                      </Text>
                    </View>
                  )
                  : null}
            </SafeScrollView>
          </View>

          {}
          <View style={styles.taboolaContainer}>
            <TaboolaBanner placementType="shop" />
          </View>
        </>
      )}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  contentContainer: {
    flex: 1,
    ...COMMON_STYLES.contentContainer,
    paddingBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmented: {
    marginBottom: SIZES.large,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ededed',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    marginBottom: 20,
    shadowColor: '#182b78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    minHeight: 28,
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  xplayContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  xplayLoader: {
    marginVertical: 8,
  },
  xplayBalanceLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  xplayTestButton: {
    marginTop: 16,
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  xplayTestButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  xplayTestButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#fff',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
    marginTop: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
