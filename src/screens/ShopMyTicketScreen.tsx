import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header, SegmentedControl, ShopItemCard, Dialog } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ShopItem } from '../types';
import { getXrunPurchasedItems } from '../services';
import { PurchasedItemData } from '../types';
import { cashingimages } from '../utils/imageCache';
import { COLORS } from '../constants';

const transformPurchasedItem = (item: PurchasedItemData, index: number, t: any): ShopItem => {

  const imageSource = require('../../assets/images/icon_shop.png');

  const quantityLabel = item.status === 10307 ? t('screens.shopMyTicket.available') : t('screens.shopMyTicket.used');

  const uniqueId = item.txID 
    ? `${item.item}_${item.txID}_${index}` 
    : `${item.item}_${index}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: uniqueId,
    title: item.title || '',
    priceLabel: '', 
    detailTotal: quantityLabel,
    image: imageSource,

    ...item,
  } as ShopItem & PurchasedItemData;
};

export const ShopMyTicketScreen = () => {
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { setSelectedShopItem } = useAppContext();
  const [purchasedItems, setPurchasedItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [itemImages, setItemImages] = useState<Record<string, string>>({}); 
  const [transferTicketDialog, setTransferTicketDialog] = useState<{
    visible: boolean;
    title: string;
    description: string;
  }>({
    visible: false,
    title: '',
    description: '',
  });

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

  const loadPurchasedItemImages = useCallback(async (items: PurchasedItemData[]) => {
    const imageCache: Record<string, string> = {};

    for (const item of items) {

      const imageFileId = item.icon || item.image;

      if (imageFileId && (typeof imageFileId === 'number' || (typeof imageFileId === 'string' && !imageFileId.startsWith('http')))) {
        const fileIdStr = String(imageFileId);
        const itemKey = `${item.item}_${item.txID || 'no-tx'}`;

        console.log(`[상점] 구매 아이템 파일 ID로 이미지 로드 시도: ${fileIdStr}`);

        try {

          const cachedImage = await cashingimages.getCachedImage(fileIdStr);
          if (cachedImage) {
            console.log(`[상점] ✅ 구매 아이템 이미지 ${fileIdStr}가 캐시에서 발견됨`);
            imageCache[itemKey] = cachedImage;
          } else {
            console.log(`[상점] ❌ 구매 아이템 이미지 ${fileIdStr}가 캐시에 없음, 다운로드 시도...`);

            const downloadSuccess = await cashingimages.downloadAndCacheImage(
              fileIdStr,
            );

            if (downloadSuccess) {
              const newCachedImage = await cashingimages.getCachedImage(fileIdStr);
              if (newCachedImage) {
                console.log(`[상점] ✅ 구매 아이템 이미지 ${fileIdStr}가 다운로드 후 성공적으로 가져옴`);
                imageCache[itemKey] = newCachedImage;
              }
            }
          }
        } catch (error) {
          console.error(`[상점] ❌ 구매 아이템 ${item.item}의 이미지 로드 오류:`, error);
        }
      }
    }

    setItemImages(imageCache);
  }, [navigate]);

  const fetchPurchasedItems = useCallback(async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      console.log('[상점] 구매한 아이템 가져오기 시작');
      const result = await getXrunPurchasedItems(memberId, navigate);

      if (result && result.status === 'success' && result.data) {
        console.log('[상점] 구매 아이템 API 응답 성공, 받은 아이템 수:', result.data.length);

        const transformedItems = result.data.map((item, index) => transformPurchasedItem(item, index, t));

        setPurchasedItems(transformedItems);
        console.log('[상점] 변환된 구매 아이템 수:', transformedItems.length);

        await loadPurchasedItemImages(result.data);
      } else {
        console.log('[상점] 구매 아이템 가져오기 실패:', result);
        setPurchasedItems([]);
      }
    } catch (error) {
      console.error('[상점] 구매 아이템 가져오기 오류:', error);
      setPurchasedItems([]);
    } finally {
      setLoading(false);
    }
  }, [memberId, navigate, loadPurchasedItemImages]);

  useEffect(() => {
    if (memberId) {
      fetchPurchasedItems();
    }
  }, [memberId, fetchPurchasedItems]);

  const handleSegmentChange = (value: 'ticket' | 'myTicket') => {
    if (value === 'ticket') {
      navigate(ROUTES.shopTicket);
    }
  };

  const isTransferTicket = (item: ShopItem): boolean => {
    const itemId = (item as any)?.item;
    const title = item.title || '';

    return itemId === 1 || 
      title.includes('전송권') || 
      title.includes('Transfer ticket') ||
      title.toLowerCase().includes('transfer');
  };

  const handleSelect = (item: ShopItem) => {

    if (isTransferTicket(item)) {

      const description = (item as any)?.description || '';
      setTransferTicketDialog({
        visible: true,
        title: item.title || '전송권',
        description: description || '티켓 구매시 최소 3회이상의 폴 리곤네트워크 전송(외부지갑) 이 가능하게 됩니다. Withdraw the XRUN network to the Polygon network in your wallet.',
      });
    } else {

      setSelectedShopItem(item);
      navigate(ROUTES.shopTicketDetail);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.shop.title')} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.wrapper}>
            <SegmentedControl
              options={[
                { label: 'Ticket', value: 'ticket' },
                { label: 'My Ticket', value: 'myTicket' },
              ]}
              value="myTicket"
              onChange={handleSegmentChange}
              containerStyle={styles.segmented}
            />

            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#bcbec4" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#bcbec4"
                style={styles.searchInput}
              />
            </View>

            {purchasedItems.length > 0 ? (
              purchasedItems.map((item) => {

                const itemKey = `${(item as any).item}_${(item as any).txID || 'no-tx'}`;
                const itemImage = itemImages[itemKey];
                const imageSource = itemImage
                  ? { uri: `data:image/png;base64,${itemImage}` }
                  : item.image;

                return (
                  <ShopItemCard
                    key={item.id}
                    title={item.title}
                    priceLabel={item.priceLabel}
                    imageSource={imageSource}
                    quantityLabel={item.detailTotal}
                    onPress={() => handleSelect(item)}
                  />
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>구매한 아이템이 없습니다.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {}
      <Dialog
        visible={transferTicketDialog.visible}
        title={transferTicketDialog.title}
        onClose={() => setTransferTicketDialog({ ...transferTicketDialog, visible: false })}
        actions={[
          {
            label: t('screens.shopMyTicket.confirm'),
            onPress: () => setTransferTicketDialog({ ...transferTicketDialog, visible: false }),
            variant: 'primary',
          },
        ]}>
        <Text style={styles.dialogText}>{transferTicketDialog.description}</Text>
      </Dialog>
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
  dialogText: {
    fontSize: 16,
    color: '#121212',
    lineHeight: 24,
    textAlign: 'left',
  },
});
