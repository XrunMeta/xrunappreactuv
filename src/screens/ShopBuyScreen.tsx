import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Linking, Image, ImageSourcePropType, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { ShopItemData } from '../types';
import { getUserBalance, purchaseXrunItem, sendInAppPurchase } from '../services';
import { formatCurrency, formatXrunAmount } from '../utils';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import * as IAP from 'expo-iap';

export const ShopBuyScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const { selectedShopItem } = useAppContext();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const [iapProduct, setIapProduct] = useState<any>(null);
  const [isLoadingIap, setIsLoadingIap] = useState(false);
  const [iapError, setIapError] = useState<string | null>(null);

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
        console.error('[구매] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const checkUserBalance = useCallback(async (memberID: string) => {
    try {
      setIsLoadingBalance(true);
      const result = await getUserBalance(memberID, navigate);

      if (result && result.status === 'success' && result.code === 200 && result.data?.realtimeBalance) {
        const balance = parseFloat(result.data.realtimeBalance.balance);
        setUserBalance(balance);
        console.log('[구매] 사용자 잔액 조회 성공:', balance);
        return balance;
      } else {
        console.log('[구매] 잔액 조회 실패:', result);
        setUserBalance(null);
        return 0;
      }
    } catch (error) {
      console.error('[구매] 잔액 조회 오류:', error);
      setUserBalance(null);
      return 0;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (memberId) {
      checkUserBalance(memberId);
    }
  }, [memberId, checkUserBalance]);

  const fetchIapProduct = useCallback(async (sku: string) => {
    if (!sku || sku.trim() === '') {
      setIapProduct(null);
      return;
    }

    try {
      setIsLoadingIap(true);
      setIapError(null);
      console.log('[구매] IAP 제품 정보 가져오기:', sku);

      try {
        await IAP.initConnection();
        console.log('[구매] IAP 연결 성공');
      } catch (connectionError: any) {
        console.error('[구매] IAP 연결 실패:', connectionError);
        setIapError('인앱 구매 서비스에 연결할 수 없습니다.');
        setIapProduct(null);
        return;
      }

      const products = await IAP.fetchProducts({
        skus: [sku],
        type: 'in-app',
      });

      console.log('[구매] IAP 제품 정보 응답:', JSON.stringify(products, null, 2));

      if (products && products.length > 0) {
        setIapProduct(products[0]);
        setIapError(null);
        console.log('[구매] IAP 제품 설정 완료:', products[0]);
      } else {
        console.log('[구매] IAP 제품을 찾을 수 없음:', sku);
        setIapProduct(null);
        setIapError('이 상품은 현재 구매할 수 없습니다.');
      }
    } catch (error: any) {
      console.error('[구매] IAP 제품 정보 가져오기 오류:', error);
      setIapProduct(null);
      setIapError(error?.message || '상품 정보를 가져올 수 없습니다.');
    } finally {
      setIsLoadingIap(false);
    }
  }, []);

  useEffect(() => {
    const item = selectedShopItem as unknown as ShopItemData;
    if (item?.sku && item.sku.trim() !== '') {
      fetchIapProduct(item.sku);
    }
  }, [selectedShopItem, fetchIapProduct]);

  useEffect(() => {
    if (!selectedShopItem) {
      console.log('[구매] 선택된 아이템이 없습니다.');
      goBack();
    }
  }, [selectedShopItem, goBack]);

  const handlePurchase = async () => {
    if (!selectedShopItem || !memberId) {
      await showAlert(t('screens.shopBuy.alerts.error'), t('screens.shopBuy.alerts.cannotPurchase'));
      return;
    }

    if (isPurchasing) {
      console.log('[구매] 이미 구매 진행 중입니다.');
      return;
    }

    setIsPurchasing(true);

    try {
      const item = (selectedShopItem as unknown) as ShopItemData & { totalPrice?: { coin?: number } };
      const hasSku = item.sku && item.sku.trim() !== '';

      if (hasSku) {

        console.log('========================================');
        console.log('[구매] === IAP 인앱 구매 시작 ===');
        console.log('========================================');
        console.log('[구매] 상품 ID:', item.sku);
        console.log('[구매] 사용자 번호:', memberId);
        console.log('[구매] 플랫폼:', Platform.OS);

        if (!iapProduct) {
          console.log('[구매] IAP 제품 정보가 없습니다. 다시 가져오기...');
          await fetchIapProduct(item.sku);

          if (!iapProduct) {
            await showAlert(
              t('screens.shopBuy.alerts.error'),
              '인앱 구매 상품 정보를 가져올 수 없습니다.',
            );
            setIsPurchasing(false);
            return;
          }
        }

        console.log('[구매] IAP 제품 정보:', JSON.stringify(iapProduct, null, 2));

        console.log('[구매] IAP 구매 요청 중...');
        const purchase = await IAP.requestPurchase({
          request: {
            ios: { sku: item.sku },
            android: { skus: [item.sku] },
          },
          type: 'in-app',
        });

        console.log('========================================');
        console.log('[구매] ✅ IAP 구매 완료!');
        console.log('========================================');
        console.log('[구매] 구매 응답:', JSON.stringify(purchase, null, 2));

        const purchaseDataArray = Array.isArray(purchase) ? purchase : [purchase];

        const apiPayload = {
          memberId: memberId,
          productId: item.sku,
          platform: Platform.OS as 'android' | 'ios',
          purchaseData: purchaseDataArray,
          purchaseTime: new Date().toISOString(),
          item: item.item?.toString() || '', 
        };

        console.log('[구매] 서버로 구매 데이터 전송 중...');
        console.log('[구매] API 페이로드:', JSON.stringify(apiPayload, null, 2));

        const apiResponse = await sendInAppPurchase(apiPayload, navigate);

        console.log('[구매] API 응답:', JSON.stringify(apiResponse, null, 2));

        if (apiResponse.status === 'success') {

          const savedCount = apiResponse.data?.savedCount ?? 0;
          const responseData = apiResponse.data as { savedCount?: number; saved?: boolean; reason?: string } | undefined;
          const isSaved = responseData?.saved !== false; 

          if (savedCount > 0 || isSaved) {

            console.log('[구매] ✅ 구매 완료 및 서버 저장 성공');
            navigate(ROUTES.shopSuccess);
          } else {

            console.log('[구매] ⚠️ 구매 데이터가 저장되지 않음:', apiResponse.data?.reason);
            await showAlert(
              '구매 확인 필요',
              '결제가 완료되지 않았습니다. 다시 시도해주세요.',
              [{ text: '확인' }],
            );

          }
        } else {
          console.log('[구매] ⚠️ 서버 전송 실패:', apiResponse.message);
          await showAlert(
            '서버 오류',
            apiResponse.message || '서버 전송 중 오류가 발생했습니다.',
            [{ text: '확인' }],
          );

        }

        setIsPurchasing(false);
        return;
      }

      console.log('[구매] === XRUN 구매 시작 ===');
      const totalAmount = item.totalPrice?.coin || 0;
      console.log('[구매] 필요한 총 금액:', totalAmount);

      console.log('[구매] 1단계: 사용자 잔액 확인 중...');
      const currentBalance = userBalance !== null ? userBalance : await checkUserBalance(memberId);
      console.log('[구매] 현재 잔액:', currentBalance);
      console.log('[구매] 필요한 금액:', totalAmount);

      if (currentBalance < totalAmount) {
        console.log('[구매] ❌ 잔액 부족');
        await showAlert(
          t('screens.shopBuy.alerts.insufficientBalanceTitle'),
          t('screens.shopBuy.alerts.insufficientBalanceMessage', {
            currentBalance: formatXrunAmount(currentBalance),
            requiredAmount: formatXrunAmount(totalAmount),
          }),
          [{ text: t('screens.shopBuy.confirm') }],
        );
        setIsPurchasing(false);
        return;
      }

      console.log('[구매] ✅ 잔액 충분, 구매 진행 중...');

      console.log('[구매] 2단계: purchaseXrunItem 호출 중...');
      const purchaseResult = await purchaseXrunItem(
        memberId,
        parseInt(item.item?.toString() || '0'),
        totalAmount.toString(),
        navigate,
      );

      console.log('[구매] 구매 결과:', purchaseResult);

      if (purchaseResult && purchaseResult.status === 'success' && purchaseResult.code === 200) {

        console.log('[구매] ✅ 구매 성공');

        await checkUserBalance(memberId);

        navigate(ROUTES.shopSuccess);
      } else {
        throw new Error(purchaseResult?.message || '구매 실패');
      }
    } catch (error: any) {
      console.error('[구매] === 구매 오류 ===');
      console.error('[구매] 구매 오류:', error);
      console.error('[구매] 오류 메시지:', error?.message);
      console.error('[구매] 오류 코드:', error?.code);

      if (error?.code === 'E_USER_CANCELLED' || error?.message?.includes('cancel')) {
        console.log('[구매] 사용자가 구매를 취소했습니다.');

      } else {
        await showAlert(
          t('screens.shopBuy.alerts.purchaseFailed'),
          error.message || t('screens.shopBuy.alerts.purchaseFailedMessage'),
          [{ text: t('screens.shopBuy.confirm') }],
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!selectedShopItem) {
    return null;
  }

  const item = (selectedShopItem as unknown) as ShopItemData & {
    totalPrice?: { coin?: number; gtkrPrice?: number };
    price?: { won?: string; coin?: number };
    charge?: { won?: number; coin?: number };
    image?: ImageSourcePropType;
  };

  const imageSource: ImageSourcePropType = item.image || require('../../assets/xrun-horizontal-logo.png');

  const hasSku = item.sku && item.sku.trim() !== '';

  const priceKRW = item.priceKRW || '0';
  const priceXrun = item.price?.coin || item.priceXrun || 0;
  const chargeKRW = item.charge?.won || 0;
  const chargeXrun = item.charge?.coin || 0;
  const totalXrun = item.totalPrice?.coin || 0;
  const totalGtkrPrice = item.totalPrice?.gtkrPrice || totalXrun;

  const isInsufficientBalance = !hasSku && userBalance !== null && userBalance < totalXrun;

  const isIapNotReady = hasSku && (isLoadingIap || !iapProduct || !!iapError);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.shop.title')} onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.detailCard}>
          <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
          <Text style={styles.itemTitle}>{item.title || ''}</Text>

          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {item.website && (
            <TouchableOpacity onPress={() => Linking.openURL(item.website).catch(() => { })}>
              <Text style={styles.link}>{item.website}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.priceContainer}>
            {hasSku ? (

              <>
                <View style={styles.row}>
                  <Text style={styles.label}>{t('screens.shopBuy.price')}</Text>
                  <Text style={[styles.value, iapError && styles.errorValue]}>
                    {isLoadingIap ? (
                      'Loading...'
                    ) : iapProduct ? (
                      iapProduct.localizedPrice || iapProduct.price || formatCurrency(priceKRW, 'KRW')
                    ) : iapError ? (
                      '구매 불가'
                    ) : (
                      formatCurrency(priceKRW, 'KRW')
                    )}
                  </Text>
                </View>
                {

}
                {}
                {iapError && !isLoadingIap && (
                  <View style={styles.iapErrorContainer}>
                    <Text style={styles.iapErrorIcon}>⚠️</Text>
                    <Text style={styles.iapErrorText}>{iapError}</Text>
                  </View>
                )}
              </>
            ) : (

              <>
                <View style={styles.row}>
                  <Text style={styles.label}>{t('screens.shopBuy.price')}</Text>
                  <Text style={styles.value}>
                    {formatCurrency(priceKRW, 'KRW')} / {formatXrunAmount(priceXrun)} XRUN
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>{t('screens.shopBuy.fee')}</Text>
                  <Text style={styles.value}>
                    {formatCurrency(chargeKRW, 'KRW')} / {formatXrunAmount(chargeXrun)} XRUN
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={[styles.label, styles.totalLabel]}>{t('screens.shopBuy.total')}</Text>
                  <Text style={[styles.value, styles.totalValue]}>
                    {formatXrunAmount(totalGtkrPrice)} XRUN
                  </Text>
                </View>

                <View style={styles.balanceInfo}>
                  <View style={styles.row}>
                    <Text style={styles.label}>{t('screens.shopBuy.myBalance')}</Text>
                    <Text
                      style={[
                        styles.value,
                        isInsufficientBalance ? styles.insufficientBalance : styles.sufficientBalance,
                      ]}
                    >
                      {isLoadingBalance ? (
                        t('screens.shopBuy.checking')
                      ) : userBalance !== null ? (
                        formatXrunAmount(userBalance) + ' XRUN'
                      ) : (
                        t('screens.shopBuy.checkFailed')
                      )}
                    </Text>
                  </View>
                  {isInsufficientBalance && (
                    <Text style={styles.insufficientBalanceText}>
                      {t('screens.shopBuy.insufficientBalance')}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={goBack}
            disabled={isPurchasing}
          >
            <Text style={styles.cancelText}>{t('screens.shopBuy.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (isPurchasing || isInsufficientBalance || isIapNotReady) && styles.disabledButton,
            ]}
            onPress={handlePurchase}
            disabled={isPurchasing || isInsufficientBalance || Boolean(isIapNotReady)}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : isLoadingIap ? (
              <Text style={styles.primaryText}>Loading...</Text>
            ) : (
              <Text style={styles.primaryText}>{t('screens.shopBuy.payment')}</Text>
            )}
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  detailCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    backgroundColor: '#fefefe',
    padding: 24,
    marginBottom: 32,
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
    marginBottom: 6,
  },
  description: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  link: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#007aff',
    marginBottom: 30,
  },
  priceContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#78828a',
  },
  value: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#111111',
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e6ed',
    marginVertical: 12,
  },
  totalLabel: {
    color: '#111111',
    fontFamily: 'Roboto-Bold',
  },
  totalValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: FONTS.size.mmedium,
  },
  balanceInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E3E7EC',
    paddingTop: 10,
    marginTop: 10,
  },
  sufficientBalance: {
    color: '#28a745',
  },
  insufficientBalance: {
    color: '#dc3545',
  },
  insufficientBalanceText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.buttonSecondary,
  },
  primaryButton: {
    backgroundColor: COLORS.buttonPrimary,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelText: {
    color: '#000000',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },

  iapInfoContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  iapInfoText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#007aff',
    textAlign: 'center',
  },

  iapErrorContainer: {
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iapErrorIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  iapErrorText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#dc3545',
    flex: 1,
  },
  errorValue: {
    color: '#dc3545',
  },
});
