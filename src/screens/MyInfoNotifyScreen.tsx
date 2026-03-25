import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, SafeScrollView, SafeView } from '../components';
import { useAlertDialog } from '../context/AlertDialogContext';
import { COLORS, SIZES, FONTS } from '../constants';
import { useAppNavigation } from '../navigation';
import {
  getNotificationList,
  sendNotificationMessage,
  deleteNotificationMessage,
  deleteAllNotifications,
} from '../services';
import { NotificationItem, NotificationType } from '../types';
import { cashingimages } from '../utils/imageCache';
import { getEnv } from '../utils/env';

const eventImage = require('../../assets/thumb_event.png');
const chatXrun = require('../../assets/chat-xrun.png');
const chatUser = require('../../assets/chat-user.png');

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  } catch {
    return dateString;
  }
};

const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} | ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

const groupNotificationsByDate = (notifications: NotificationItem[]) => {
  const grouped: { [key: string]: NotificationItem[] } = {};

  notifications.forEach((notification) => {
    const dateKey = formatDate(notification.datetime);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(notification);
  });

  Object.keys(grouped).forEach((dateKey) => {
    grouped[dateKey].sort((a, b) => {
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
    });
  });

  return grouped;
};

export const MyInfoNotifyScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const shouldAutoScroll = useRef(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const baselineAndroidInset = useRef(insets.bottom || 0);
  const safeInsetBottom = insets.bottom || 0;
  const [notificationImages, setNotificationImages] = useState<Record<number, string | null>>({}); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMemberId(userData.member);
          }
        }
      } catch (error) {
        console.error('[알림] 사용자 정보 로드 실패:', error);
      }
    };
    loadUserData();
  }, []);

  const getImageUrlFromFileId = useCallback((fileId: string | number | null): string | null => {
    if (!fileId) return null;
    try {
      const env = getEnv();
      const fileIdStr = String(fileId);

      const apiUrl = env.USE_WORKERS_API === 'true' ? env.GATEWAY_WORKERS : env.GATEWAY_NODEJS;
      let baseUrl = apiUrl.replace('/oth-path', '');
      return `${baseUrl}/files/${fileIdStr}`;
    } catch (error) {
      console.error('[알림] 이미지 URL 생성 실패:', error);
      return null;
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      const response = await getNotificationList(memberId, 0, navigate);

      if (response && response.data) {
        setNotifications(response.data);

        const imageLoadPromises = response.data
          .filter((notif: NotificationItem) => notif.image_file_id)
          .map(async (notif: NotificationItem) => {
            try {
              const fileId = notif.image_file_id!;

              const cachedImage = await cashingimages.getCachedImage(fileId);
              if (cachedImage) {
                setNotificationImages(prev => ({
                  ...prev,
                  [notif.board]: `data:image/jpeg;base64,${cachedImage}`,
                }));
                return;
              }

              const downloadSuccess = await cashingimages.downloadAndCacheImage(fileId);
              if (downloadSuccess) {
                const newCachedImage = await cashingimages.getCachedImage(fileId);
                if (newCachedImage) {
                  setNotificationImages(prev => ({
                    ...prev,
                    [notif.board]: `data:image/jpeg;base64,${newCachedImage}`,
                  }));
                }
              }
            } catch (error) {
              console.error(`[알림] 이미지 ${notif.image_file_id} 로드 실패:`, error);
            }
          });

        Promise.all(imageLoadPromises).catch((error) => {
          console.error('[알림] 이미지 로드 중 오류:', error);
        });
      }
    } catch (error) {
      console.error('[알림] 알림 목록 조회 실패:', error);
      await showAlert(t('screens.myInfoNotify.alerts.error'), t('screens.myInfoNotify.alerts.loadFailed'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [memberId, navigate, t, getImageUrlFromFileId]);

  useEffect(() => {
    if (memberId) {
      shouldAutoScroll.current = true; 
      loadNotifications();

      AsyncStorage.setItem('lastNotificationCheckTime', new Date().toISOString())
        .catch((error) => {
          console.error('[알림] 마지막 확인 시간 저장 실패:', error);
        });
    }
  }, [memberId, loadNotifications]);

  const handleContentSizeChange = useCallback(() => {
    if (scrollViewRef.current && notifications.length > 0 && shouldAutoScroll.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [notifications.length]);

  const handleScrollBeginDrag = useCallback(() => {
    shouldAutoScroll.current = false;
  }, []);

  const handleSend = async () => {
    if (!question.trim()) {
      await showAlert(t('screens.myInfoNotify.alerts.messageInput'), t('screens.myInfoNotify.alerts.messageRequired'));
      return;
    }

    if (!memberId) {
      await showAlert(t('screens.myInfoNotify.alerts.error'), t('screens.myInfoNotify.alerts.userDataNotFound'));
      return;
    }

    try {
      setSending(true);
      shouldAutoScroll.current = true; 
      const messageText = question.trim();
      await sendNotificationMessage(memberId, messageText, false, navigate);
      await showAlert(t('screens.myInfoNotify.alerts.sendSuccess'), t('screens.myInfoNotify.alerts.sendSuccessMessage'));
      setQuestion('');

      const newMessage: NotificationItem = {
        board: Date.now(), 
        title: messageText,
        type: 9303, 
        datetime: new Date().toISOString(),
        contents: null,
        image_file_id: null,
        guid: null,
        datebegin: null,
        dateends: null,
      };
      setNotifications(prev => [...prev, newMessage]);

      loadNotifications().catch(error => {
        console.error('[알림] 메시지 전송 후 동기화 실패:', error);
      });
    } catch (error) {
      console.error('[알림] 메시지 전송 실패:', error);
      await showAlert(t('screens.myInfoNotify.alerts.error'), t('screens.myInfoNotify.alerts.sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  const handleDelete = async (board: number) => {
    if (!memberId) return;

    await showAlert(
      t('screens.myInfoNotify.alerts.deleteConfirm'),
      t('screens.myInfoNotify.alerts.deleteMessage'),
      [
        { text: t('screens.myInfoNotify.alerts.cancel'), style: 'cancel' },
        {
          text: t('screens.myInfoNotify.alerts.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotificationMessage(memberId, board, false, navigate);

              setNotifications(prev => prev.filter(notif => notif.board !== board));
            } catch (error) {
              console.error('[알림] 메시지 삭제 실패:', error);
              await showAlert(t('screens.myInfoNotify.alerts.error'), t('screens.myInfoNotify.alerts.deleteFailed'));
            }
          },
        },
      ],
    );
  };

  const handleDeleteAll = async () => {
    if (!memberId) return;

    await showAlert(
      t('screens.myInfoNotify.alerts.deleteAllConfirm'),
      t('screens.myInfoNotify.alerts.deleteAllMessage'),
      [
        { text: t('screens.myInfoNotify.alerts.cancel'), style: 'cancel' },
        {
          text: t('screens.myInfoNotify.alerts.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllNotifications(memberId, navigate);

              setNotifications(prev => prev.filter(notif => notif.type !== 9303));
            } catch (error) {
              console.error('[알림] 전체 삭제 실패:', error);
              await showAlert(t('screens.myInfoNotify.alerts.error'), t('screens.myInfoNotify.alerts.deleteAllFailed'));
            }
          },
        },
      ],
    );
  };

  const openLink = async (url: string | null) => {
    if (!url) return;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      Linking.openURL(url).catch(async () => {
        await showAlert(t('screens.myInfoNotify.alerts.linkError'), t('screens.myInfoNotify.alerts.linkErrorMessage'));
      });
    } else {

      console.log('[알림] 앱 내부 라우트:', url);
    }
  };

  const renderNotification = (notification: NotificationItem, index: number) => {
    const isUserMessage = notification.type === 9303;
    const isEvent = notification.type === 9302;
    const isNotice = notification.type === 9301;

    const cachedImage = notificationImages[notification.board];
    const imageUri = cachedImage 
      ? cachedImage 
      : (notification.image_file_id ? getImageUrlFromFileId(notification.image_file_id) : null);

    if (isUserMessage) {

      return (
        <View key={`notification-${notification.board}-${index}`} style={styles.replyWrapper}>
          <View style={styles.replyRow}>
            <TouchableOpacity
              style={styles.replyBubble}
              onLongPress={() => handleDelete(notification.board)}
              activeOpacity={0.8}
            >
              <Text style={styles.replyText}>{notification.title}</Text>
            </TouchableOpacity>
            {}
          </View>
          <Text style={styles.replyTimestamp}>{formatTime(notification.datetime)}</Text>
        </View>
      );
    }

    return (
      <View key={`notification-${notification.board}-${index}`} style={styles.messageWrapper}>
        <Image source={chatXrun} style={styles.avatar} />
        <View style={styles.messageCard}>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
          )}
          <Text style={styles.badge}>{notification.title}</Text>
          {}
          {notification.contents !== null && notification.type !== 9303 && (
            <View>
              <Text
                style={styles.description}
                numberOfLines={isNotice ? 3 : undefined}
                ellipsizeMode="tail"
              >
                {notification.contents}
              </Text>
              {isEvent && notification.datebegin && notification.dateends && (
                <Text style={styles.eventDate}>
                  {formatDate(notification.datebegin)} ~ {formatDate(notification.dateends)}
                </Text>
              )}
              {}
              {}
              {isNotice && (
                <TouchableOpacity
                  style={[styles.ctaButton, styles.ctaButtonWithMargin]}
                  onPress={async () => {
                    const url = `https://oth-path-app.example.invalid/oth-path?id=${notification.board}`;
                    Linking.openURL(url).catch(async () => {
                      await showAlert(t('screens.myInfoNotify.alerts.linkError'), t('screens.myInfoNotify.alerts.linkErrorMessage'));
                    });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ctaText}>{t('screens.myInfoNotify.viewDetails')}</Text>
                </TouchableOpacity>
              )}
              {}
              {isEvent && notification.guid !== '' && notification.guid !== null && (
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => openLink(notification.guid)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ctaText}>{t('screens.myInfoNotify.goToEvent')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>{formatTime(notification.datetime)}</Text>
      </View>
    );
  };

  const renderGroupedNotifications = () => {
    const grouped = groupNotificationsByDate(notifications);
    const dates = Object.keys(grouped).sort((a, b) => {

      const dateA = new Date(a.replace(/\. /g, '-').replace(/\./g, ''));
      const dateB = new Date(b.replace(/\. /g, '-').replace(/\./g, ''));
      return dateA.getTime() - dateB.getTime();
    });

    return dates.map((date, dateIndex) => (
      <View key={`date-${date}`}>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{date}</Text>
        </View>
        {grouped[date].map((notification, index) => renderNotification(notification, index))}
      </View>
    ));
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    if (!isKeyboardVisible && safeInsetBottom >= 0 && safeInsetBottom <= 80) {
      baselineAndroidInset.current = Math.min(safeInsetBottom, 56);
    }
  }, [safeInsetBottom, isKeyboardVisible]);

  return (
    <SafeView>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled={Platform.OS === 'ios' ? true : isKeyboardVisible}
      >
        <View style={styles.container}>
          <StatusBar style="dark" />
          <Header
            title={t('screens.myInfoNotify.title')}
            onBackPress={goBack}
            showBackButton
            rightComponent={
              notifications.length > 0 ? (
                <TouchableOpacity
                  onPress={handleDeleteAll}
                  activeOpacity={0.7}
                  style={styles.deleteAllButton}
                >
                  <Text style={styles.deleteAllText}>{t('screens.myInfoNotify.deleteAll')}</Text>
                </TouchableOpacity>
              ) : undefined
            }
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
            </View>
          ) : (
            <SafeScrollView
              ref={scrollViewRef}
              style={styles.list}
              backgroundColor={'#f2f2f7'}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={handleContentSizeChange}
              onScrollBeginDrag={handleScrollBeginDrag}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              showBottomBackground={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('screens.myInfoNotify.emptyMessage')}</Text>
                </View>
              ) : (
                renderGroupedNotifications()
              )}
            </SafeScrollView>
          )}

          <View style={styles.inputBar}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t('screens.myInfoNotify.placeholder')}
                placeholderTextColor="#7d7e83"
                value={question}
                onChangeText={setQuestion}
                editable={!sending}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>{t('screens.myInfoNotify.sendButton')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView >
    </SafeView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.small,
    paddingTop: 24,
    paddingBottom: 0,
    gap: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  messageWrapper: {
    position: 'relative',
    paddingLeft: 34,
    marginBottom: 16,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  heroImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  badge: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Bold',
    color: '#000',
  },
  description: {
    fontSize: FONTS.size.ssmall,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
  },
  eventDate: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonWithMargin: {
    marginTop: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Bold',
  },
  timestamp: {
    marginTop: 8,
    fontSize: FONTS.size.xxsmall,
    color: '#7d7e83',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
  },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(51,57,91,0.1)',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 4,
    marginBottom: 12,
  },
  dateChipText: {
    fontSize: FONTS.size.xxsmall,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  replyWrapper: {
    alignSelf: 'flex-end',
    gap: 6,
    marginBottom: 16,
    maxWidth: '95%',
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  replyBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  replyText: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#10192d',
  },

  replyTimestamp: {
    fontSize: FONTS.size.xxsmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    paddingRight: 0,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#edeced',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#2a2727',
    minHeight: 24,
    maxHeight: 24,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 60,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
  },
  deleteAllButton: {
    paddingRight: 16,
  },
  deleteAllText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#ff3b30',
  },
});

