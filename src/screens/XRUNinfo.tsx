import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeScrollView } from '../components';
import { Header } from '../components';
import { COMMON_STYLES, FONTS, COLORS } from '../constants';
import { getProductList } from '../services/giftishowBiz';
import type { GiftishowProductItem } from '../services/giftishowBiz';
import type { GiftishowProductListResponse } from '../services/giftishowBiz';

export const XRUNinfoScreen = () => {
  const { t } = useTranslation();
  const [productList, setProductList] = useState<GiftishowProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGiftishowData = useCallback(async () => {
    setError(null);
    try {
      const productRes = await getProductList().catch((e) => ({ list: [], resultMsg: e?.message } as GiftishowProductListResponse));
      const productListData = productRes as GiftishowProductListResponse;
      setProductList(Array.isArray(productListData.list) ? productListData.list : []);

      if (!Array.isArray(productListData.list) || productListData.list.length === 0) {
        const msg = productListData.resultMsg;
        if (msg && String(msg).trim()) setError(String(msg).trim());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '기프티쇼 비즈 연동 오류');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadGiftishowData().finally(() => setLoading(false));
  }, [loadGiftishowData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadGiftishowData().finally(() => setRefreshing(false));
  }, [loadGiftishowData]);

  return (
    <View style={styles.container}>
      <Header title="XRUN" />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.buttonPrimary]} />
        }
      >
        {}
        {

}

        {}
        {}

        {}
        {

}

        {}
        {

}

        {}
        <View style={styles.giftishowSection}>
          <Text style={styles.giftishowSectionTitle}>{t('screens.xrunInfo.giftishowTitle')}</Text>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} style={styles.giftishowLoader} />
          ) : (
            <>
              {error ? <Text style={styles.giftishowError}>{error}</Text> : null}
              {productList.length > 0 ? (
                <View style={styles.giftishowList}>
                  <Text style={styles.giftishowListTitle}>{t('screens.xrunInfo.productsCoupons')}</Text>
                  {productList.slice(0, 20).map((item, i) => (
                    <View key={item.id ?? `item-${i}`} style={styles.giftishowListItemRow}>
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={styles.giftishowListItemImg} resizeMode="cover" />
                      ) : (
                        <View style={[styles.giftishowListItemImg, styles.giftishowListItemImgPlaceholder]} />
                      )}
                      <View style={styles.giftishowListItemBody}>
                        <Text style={styles.giftishowListItemName} numberOfLines={2}>{item.name ?? item.id ?? '-'}</Text>
                        <Text style={styles.giftishowListItemPrice}>
                          {item.price != null ? `${Number(item.price).toLocaleString()}원` : '-'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          )}
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
    flexGrow: 1,
    ...COMMON_STYLES.scrollContent,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 113,
    height: 115,
  },
  title: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
  homepageLink: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  homepageLinkText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  giftishowSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  giftishowSectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 12,
  },
  giftishowLoader: {
    marginVertical: 12,
  },
  giftishowError: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#c62828',
    marginTop: 8,
  },
  giftishowList: {
    marginTop: 16,
  },
  giftishowListTitle: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 8,
  },
  giftishowListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  giftishowListItemImg: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  giftishowListItemImgPlaceholder: {
    backgroundColor: '#e0e0e0',
  },
  giftishowListItemBody: {
    flex: 1,
    marginLeft: 12,
  },
  giftishowListItemName: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 4,
  },
  giftishowListItemPrice: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
});

