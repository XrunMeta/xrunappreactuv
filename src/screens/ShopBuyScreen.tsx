import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { SafeScrollView } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { ShopItemData } from '../types';
import { getUserBalance, purchaseXrunItem } from '../services';
import { formatCurrency, formatXrunAmount } from '../utils';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';

export const ShopBuyScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const { selectedShopItem } = useAppContext();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

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

        await showAlert(t('screens.shopBuy.alerts.notification'), t('screens.shopBuy.alerts.inAppPurchaseComingSoon'));
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
      await showAlert(
        t('screens.shopBuy.alerts.purchaseFailed'),
        error.message || t('screens.shopBuy.alerts.purchaseFailedMessage'),
        [{ text: t('screens.shopBuy.confirm') }],
      );
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

  const isInsufficientBalance = userBalance !== null && userBalance < totalXrun;

  return (
    <View style={styles.container}>
      <Header title={t('screens.shop.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

              <View style={styles.row}>
                <Text style={styles.label}>{t('screens.shopBuy.price')}</Text>
                <Text style={styles.value}>{t('screens.shopBuy.inAppPurchaseComingSoon')}</Text>
              </View>
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
              (isPurchasing || isInsufficientBalance) && styles.disabledButton,
            ]}
            onPress={handlePurchase}
            disabled={isPurchasing || isInsufficientBalance}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryText}>{t('screens.shopBuy.payment')}</Text>
            )}
          </TouchableOpacity>
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
    backgroundColor: '#747474',
  },
  primaryButton: {
    backgroundColor: '#020406',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryText: {
    color: '#fff',
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
});
