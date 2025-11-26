import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppContext } from '../context';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAlertDialog } from '../context/AlertDialogContext';
import { PurchasedItemData } from '../types';
import { getXrunPurchasedItems, deleteXrunPurchasedItem } from '../services';
import { getEnv } from '../utils/env';
import { COLORS } from '../constants';

export const ShopTicketDetailScreen = () => {
  const { selectedShopItem } = useAppContext();
  const { navigate } = useAppNavigation();
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const qrCodeRef = useRef<any>(null);

  const [memberId, setMemberId] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<PurchasedItemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const storageId = String((selectedShopItem as any)?.storage || ticketData?.storage || '');
  const txID = (selectedShopItem as any)?.txID;
  const ticketNumber = txID || (selectedShopItem as any)?.transaction || '';

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
        console.error('[티켓 상세] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const fetchTicketData = async () => {
    if (!memberId || !storageId) return;

    try {
      setIsLoading(true);
      const result = await getXrunPurchasedItems(memberId);

      if (result && result.status === 'success' && result.data) {

        const targetItem = result.data.find(item => String(item.storage) === String(storageId));
        if (targetItem) {
          setTicketData(targetItem);
          console.log('[티켓 상세] 티켓 데이터 새로고침 완료:', targetItem);
        } else {
          console.log('[티켓 상세] 해당 storageId와 일치하는 아이템을 찾을 수 없습니다:', storageId);
          console.log('[티켓 상세] 디버깅 - storageId 타입:', typeof storageId, '값:', storageId);
          console.log('[티켓 상세] 디버깅 - 첫 번째 아이템 storage 타입:', typeof result.data[0]?.storage, '값:', result.data[0]?.storage);
        }
      }
    } catch (error) {
      console.error('[티켓 상세] 티켓 데이터 새로고침 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!memberId || !storageId) return;

    fetchTicketData();

    const interval = setInterval(() => {
      console.log('[티켓 상세] === 10초마다 티켓 데이터 새로고침 ===');
      fetchTicketData();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [memberId, storageId]);

  const base64Encode = (str: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;

      const bitmap = (a << 16) | (b << 8) | c;

      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
    }

    return result;
  };

  const generateQRCodeValue = (): string => {

    const currentTicketNumber = ticketData?.txID || ticketData?.txid || ticketData?.transaction || txID || ticketNumber;

    if (!storageId) {
      return currentTicketNumber || '';
    }

    const encodedStorageId = base64Encode(storageId.toString());
    const env = getEnv();
    const baseUrl = env.GATEWAY_NODEJS.replace('/oth-path', '');
    const apiUrl = `${baseUrl}/page/allreave/${encodedStorageId}`;

    console.log('[티켓 상세] === QR 코드 주소 생성 ===');
    console.log('[티켓 상세] 원본 storageId:', storageId);
    console.log('[티켓 상세] storageId 타입:', typeof storageId);
    console.log('[티켓 상세] base64 인코딩된 storageId:', encodedStorageId);
    console.log('[티켓 상세] 생성된 QR 코드 주소:', apiUrl);

    const testDecode = (() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let i = 0;

      const str = encodedStorageId.replace(/=+$/, '');

      while (i < str.length) {
        const encoded1 = chars.indexOf(str.charAt(i++));
        const encoded2 = chars.indexOf(str.charAt(i++));
        const encoded3 = chars.indexOf(str.charAt(i++));
        const encoded4 = chars.indexOf(str.charAt(i++));

        const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

        result += String.fromCharCode((bitmap >> 16) & 255);
        if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
        if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
      }

      return result;
    })();

    console.log('[티켓 상세] base64 디코딩 테스트 결과:', testDecode);
    console.log('[티켓 상세] ========================');

    return apiUrl;
  };

  const qrCodeValue = generateQRCodeValue();
  const currentStatus = ticketData?.status || (selectedShopItem as any)?.status;

  const isAvailable = currentStatus == 10306 || currentStatus === 10306;

  console.log('[티켓 상세] === 상태 확인 ===');
  console.log('[티켓 상세] currentStatus:', currentStatus);
  console.log('[티켓 상세] currentStatus 타입:', typeof currentStatus);
  console.log('[티켓 상세] currentStatus == 10307:', currentStatus == 10307);
  console.log('[티켓 상세] currentStatus === 10307:', currentStatus === 10307);
  console.log('[티켓 상세] isAvailable:', isAvailable);
  console.log('[티켓 상세] ticketData?.status:', ticketData?.status);
  console.log('[티켓 상세] selectedShopItem?.status:', (selectedShopItem as any)?.status);
  console.log('[티켓 상세] ================');

  const handleCopyTicketNumber = async () => {
    const currentTicketNumber = ticketData?.txID || ticketData?.txid || ticketData?.transaction || txID || ticketNumber;

    if (!currentTicketNumber) {
      await showAlert('오류', '복사할 티켓 번호가 없습니다.');
      return;
    }

    await Clipboard.setStringAsync(currentTicketNumber);
    await showAlert('복사됨', '티켓 번호가 클립보드에 복사되었습니다.');
  };

  const handleShareQR = async () => {
    const valueToShare = qrCodeValue;
    if (!valueToShare) {
      await showAlert('오류', '공유할 QR 코드가 없습니다.');
      return;
    }

    try {

      qrCodeRef.current?.toDataURL(async (dataURL: string) => {
        try {

          const shareMessage = `티켓 번호: ${ticketNumber}\nQR 코드 URL: ${valueToShare}`;

          await Share.share({
            message: shareMessage,
            title: '티켓 QR 코드',
          });
        } catch (shareError) {
          console.error('[티켓 상세] QR 공유 오류:', shareError);

          try {
            await Share.share({
              message: `티켓 QR 코드: ${valueToShare}`,
              title: '티켓 QR 코드',
            });
          } catch (fallbackError) {
            console.error('[티켓 상세] QR 공유 대안 실패:', fallbackError);
            await showAlert('오류', 'QR 코드 공유에 실패했습니다.');
          }
        }
      });
    } catch (error) {
      console.error('[티켓 상세] QR 공유 오류:', error);

      try {
        await Share.share({
          message: `티켓 QR 코드: ${qrCodeValue}`,
          title: '티켓 QR 코드',
        });
      } catch (fallbackError) {
        await showAlert('오류', 'QR 코드 공유에 실패했습니다.');
      }
    }
  };

  const confirmDelete = async () => {
    const currentStorageId = String(ticketData?.storage || storageId || '');

    console.log('[티켓 상세] === 삭제 확인 ===');
    console.log('[티켓 상세] memberId:', memberId);
    console.log('[티켓 상세] storageId (원본):', storageId);
    console.log('[티켓 상세] ticketData?.storage:', ticketData?.storage);
    console.log('[티켓 상세] currentStorageId (최종):', currentStorageId);
    console.log('[티켓 상세] ================');

    if (!memberId || !currentStorageId) {
      await showAlert('오류', `삭제할 수 없습니다. 필요한 정보가 없습니다.\nmemberId: ${memberId || '없음'}\nstorageId: ${currentStorageId || '없음'}`);
      return;
    }

    await showAlert('삭제', '티켓을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        onPress: async () => {
          try {
            setIsLoading(true);
            console.log('[티켓 상세] === 티켓 삭제 시작 ===');
            console.log('[티켓 상세] memberId:', memberId);
            console.log('[티켓 상세] storageId:', currentStorageId);
            console.log('[티켓 상세] storageId 타입:', typeof currentStorageId);

            const result = await deleteXrunPurchasedItem(memberId, currentStorageId);

            console.log('[티켓 상세] 삭제 API 응답:', result);

            if (result.status === 'success') {
              console.log('[티켓 상세] 삭제 성공');
              await showAlert('삭제 완료', '티켓이 삭제되었습니다.', [
                {
                  text: '확인',
                  onPress: () => {

                    navigate(ROUTES.shopMyTicket);
                  },
                },
              ]);
            } else {
              console.log('[티켓 상세] 삭제 실패:', result.message);
              await showAlert('삭제 실패', result.message || '티켓 삭제에 실패했습니다.');
            }
          } catch (error: any) {
            console.error('[티켓 상세] === 티켓 삭제 오류 ===');
            console.error('[티켓 상세] 오류 타입:', error?.constructor?.name);
            console.error('[티켓 상세] 오류 메시지:', error?.message);
            console.error('[티켓 상세] 오류 전체:', error);
            if (error?.response) {
              console.error('[티켓 상세] 응답 상태:', error.response.status);
              console.error('[티켓 상세] 응답 데이터:', error.response.data);
            }
            console.error('[티켓 상세] ====================');
            await showAlert('오류', `티켓 삭제 중 오류가 발생했습니다.\n${error?.message || '알 수 없는 오류'}`);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const currentTicketNumber = ticketData?.txID || ticketData?.txid || ticketData?.transaction || txID || ticketNumber;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('screens.shopTicketDetail.title')} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {}
          <View style={styles.qrWrapper}>
            <View
              style={[
                styles.qrBorder,
                {
                  opacity: isAvailable ? 1 : 0.3,
                  borderColor: '#DEDEDE',
                },
              ]}>
              {qrCodeValue ? (
                <QRCode
                  value={String(qrCodeValue)}
                  size={150}
                  color={isAvailable ? '#000' : '#999999'}
                  backgroundColor="#FFFFFF"
                  getRef={(c) => (qrCodeRef.current = c)}
                />
              ) : (
                <Text style={styles.errorText}>QR 코드를 생성할 수 없습니다</Text>
              )}
            </View>
          </View>

          <Text style={styles.itemTitle}>{selectedShopItem?.title ?? '티켓'}</Text>

          {}
          <View style={styles.ticketFieldContainer}>
            <View style={styles.ticketFieldHeader}>
              <Text style={styles.ticketFieldLabel}>
                Ticket Number
              </Text>
              <Text
                style={[
                  styles.ticketFieldStatus,
                  {
                    color: isAvailable ? '#3391D0' : '#707070',
                  },
                ]}>
                {isAvailable ? 'Available' : 'Redeemed'}
              </Text>
            </View>
            <View style={styles.ticketFieldBox}>
              <Text style={styles.ticketFieldNumber}>
                {currentTicketNumber || 'No Ticket Available'}
              </Text>
            </View>
          </View>

          {isLoading && (
            <ActivityIndicator size="small" color={COLORS.buttonPrimary} style={{ marginBottom: 16 }} />
          )}
        </View>
      </ScrollView>

      {}
      <View style={styles.actionButtonsContainer}>
        {isAvailable ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.copyButton]}
              onPress={handleCopyTicketNumber}
              disabled={!qrCodeValue}>
              <Text style={styles.actionButtonText}>Copy Ticket Number</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShareQR}
              disabled={!qrCodeValue}>
              <Text style={styles.shareButtonText}>Share QR Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={confirmDelete}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 120, 
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrBorder: {
    padding: 30,
    borderRadius: 32,
    borderColor: '#DEDEDE',
    borderWidth: 10,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#111',
    marginBottom: 12,
  },

  ticketFieldContainer: {
    marginTop: 30,
    paddingHorizontal: 0, 
    width: '100%', 
  },
  ticketFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0, 
    marginBottom: 5, 
  },
  ticketFieldLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 0, 
    fontWeight: '500',
  },
  ticketFieldStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  ticketFieldBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%', 
    marginTop: 0, 
  },
  ticketFieldNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },

  actionButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#343A5A',
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#FFDC04',
  },
  deleteButton: {
    backgroundColor: '#343A5A',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
