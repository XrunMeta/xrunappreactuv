import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  PanResponder,
  FlatList,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import BigNumber from 'bignumber.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton, SafeScrollView, SafeView, AddressInfoItem } from '../components';
import { COLORS, COMMON_STYLES, FONTS, SIZES } from '../constants';
import { ROUTES, useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { useAlertDialog } from '../context/AlertDialogContext';
import { getMemberLimits, getXRUNGopaxPrice, getCryptoPricesInKRW } from '../services';

interface AddressBookItem {
  id: string;
  name: string;
  address: string;
  network: string;
  networkColor?: string;
  createdAt: number;
}

interface NetworkOption {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  image?: ImageSourcePropType;
  color?: string;
}

const NETWORK_OPTIONS: NetworkOption[] = [
  { value: 'Polygon', label: 'Polygon', image: require('../../assets/icon_polyganscan.png'), color: '#8247E5' },
  { value: 'Ethereum', label: 'Ethereum', icon: 'diamond-outline', color: '#627EEA' },
];

const NetworkIcon = ({ option, size = 20, color = COLORS.headerText }: { option: NetworkOption; size?: number; color?: string }) => {
  if (option.image) {
    return <Image source={option.image} style={{ width: size, height: size }} resizeMode="contain" />;
  }
  if (option.icon) {
    return <Ionicons name={option.icon} size={size} color={color} />;
  }
  return null;
};

const STORAGE_KEY = 'wallet_address_book';

export const WalletSendScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { walletSendAddress, setWalletSendAddress, resetWalletSendAddress, setWalletSendAmount, selectedWalletAsset } = useAppContext();
  const { showAlert } = useAlertDialog();
  const [sendAmount, setSendAmount] = useState('0');
  const [receiverAddress, setReceiverAddress] = useState('');
  const amountInputRef = useRef<TextInput>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [addressBook, setAddressBook] = useState<AddressBookItem[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AddressBookItem | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalAddress, setModalAddress] = useState('');
  const [modalNetwork, setModalNetwork] = useState('Polygon');
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const swipeAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const [openSwipeableId, setOpenSwipeableId] = useState<string | null>(null);

  const [memberId, setMemberId] = useState<string | null>(null);
  const [memberLimit, setMemberLimit] = useState<number | null>(null);

  const [gopaxPrice, setGopaxPrice] = useState<number>(0); 
  const [cryptoPrices, setCryptoPrices] = useState<{
    POL?: { price_krw: number };
    ETH?: { price_krw: number };
  } | null>(null); 

  const formatNumberWithCommas = useCallback((value: string): string => {

    const cleanValue = value.replace(/[^\d.]/g, '');

    const parts = cleanValue.split('.');
    let integerPart = parts[0] || '';
    const decimalPart = parts.length > 1 ? parts[1] : '';

    if (integerPart.length > 1) {
      integerPart = integerPart.replace(/^0+/, '') || '0';
    }

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts.length > 1) {
      return `${integerPart}.${decimalPart}`;
    }
    return integerPart;
  }, []);

  const removeCommas = useCallback((value: string): string => {
    return value.replace(/,/g, '');
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    const formatted = formatNumberWithCommas(text);
    setSendAmount(formatted);
  }, [formatNumberWithCommas]);

  const prevAddressRef = useRef<string>('');

  useEffect(() => {
    const address = receiverAddress;

    if (address === prevAddressRef.current) {
      return;
    }
    prevAddressRef.current = address;

    if (!address || address.trim().length === 0) {
      setAddressError(null);
      return;
    }

    if (!address.startsWith('0x')) {
      setAddressError(t('screens.walletSend.errors.invalidAddress'));

      showAlert(t('screens.walletSend.alerts.invalidAddress'), t('screens.walletSend.errors.invalidAddress'));
    } else {
      setAddressError(null);
    }
  }, [receiverAddress, t, showAlert]);

  useEffect(() => {
    setSendAmount('0');
    setReceiverAddress('');
    setAddressError(null);
    prevAddressRef.current = '';
    amountInputRef.current?.blur();
  }, []);

  useEffect(() => {
    loadAddressBook();
  }, []);

  useEffect(() => {
    if (walletSendAddress && walletSendAddress.trim() && showEditModal) {
      setModalAddress(walletSendAddress);
      resetWalletSendAddress();
    }
  }, [walletSendAddress, showEditModal, resetWalletSendAddress]);

  useEffect(() => {
    if (walletSendAddress && walletSendAddress.trim() && !showEditModal) {
      setReceiverAddress(walletSendAddress);
      resetWalletSendAddress(); 
    }
  }, [walletSendAddress, showEditModal, resetWalletSendAddress]);

  const loadAddressBook = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const addresses: AddressBookItem[] = JSON.parse(stored);

        const addressesWithColors = addresses.map((item) => ({
          ...item,
          networkColor: NETWORK_OPTIONS.find(n => n.value === item.network)?.color || COLORS.primary,
        }));
        setAddressBook(addressesWithColors);

        addressesWithColors.forEach((item) => {
          if (!swipeAnimations.current[item.id]) {
            swipeAnimations.current[item.id] = new Animated.Value(0);
          }
        });
      }
    } catch (error) {
      console.error('[주소록] 로드 실패:', error);
    }
  }, []);

  useEffect(() => {
    if (!selectedWalletAsset) {
      goBack();
    }
  }, [selectedWalletAsset, goBack]);

  useEffect(() => {
    const fetchGopaxPrice = async () => {
      try {
        const result = await getXRUNGopaxPrice(navigate);
        if (result.status === 'success' && result.data) {
          const price = result.data.gopaxPrice || 0;
          setGopaxPrice(price);
          console.log('[WalletSend] 고팍스 가격 가져오기 성공:', price);
        } else {
          console.log('[WalletSend] 고팍스 가격 가져오기 실패:', result.message);
          setGopaxPrice(0);
        }
      } catch (error) {
        console.error('[WalletSend] 고팍스 가격 가져오기 오류:', error);
        setGopaxPrice(0);
      }
    };

    fetchGopaxPrice();
  }, [navigate]);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const result = await getCryptoPricesInKRW(navigate);
        if (result.status === 'success' && result.data) {
          setCryptoPrices(result.data);
          console.log('[WalletSend] 암호화폐 가격 가져오기 성공:', result.data);
        } else {
          console.log('[WalletSend] 암호화폐 가격 가져오기 실패:', result.message);
          setCryptoPrices(null);
        }
      } catch (error) {
        console.error('[WalletSend] 암호화폐 가격 가져오기 오류:', error);
        setCryptoPrices(null);
      }
    };

    fetchCryptoPrices();
  }, [navigate]);

  useEffect(() => {
    const loadUserDataAndLimits = async () => {
      try {

        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            const member = String(userData.member);
            setMemberId(member);

            if (selectedWalletAsset?.currency) {
              try {
                const response = await getMemberLimits(member, navigate);
                if (response?.status === 'success' && response?.data && Array.isArray(response.data)) {

                  const matchedLimit = response.data.find(
                    (item: { currency: number; limitTransferPolXrun?: number; limitTransfer?: number }) =>
                      item.currency === selectedWalletAsset.currency
                  );

                  if (matchedLimit) {

                    const limit = matchedLimit.limitTransferPolXrun || matchedLimit.limitTransfer;
                    if (limit !== undefined) {
                      setMemberLimit(limit);
                    }
                  }
                }
              } catch (error) {
                console.error('[회원 한도 조회] API 호출 실패:', error);

              }
            }
          }
        }
      } catch (error) {
        console.error('[회원 한도] 사용자 정보 로드 실패:', error);
      }
    };

    if (selectedWalletAsset) {
      loadUserDataAndLimits();
    }
  }, [selectedWalletAsset, navigate]);

  const handleBackPress = () => {
    setSendAmount('0');
    setReceiverAddress('');
    setAddressError(null);
    prevAddressRef.current = '';
    goBack();
  };

  const handleScanPress = () => {
    navigate(ROUTES.walletQrScan);
  };

  const handleClearReceiverAddress = useCallback(() => {
    setReceiverAddress('');
    setAddressError(null);
    prevAddressRef.current = '';
    resetWalletSendAddress();
  }, [resetWalletSendAddress]);

  const handlePastePress = () => {
    navigate(ROUTES.addWalletAddress);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setModalName('');
    setModalAddress('');
    setModalNetwork('Polygon');
  };

  const handleSaveAddress = useCallback(async () => {
    if (!modalName.trim()) {
      await showAlert('오류', '이름을 입력해주세요.');
      return;
    }

    if (!modalAddress.trim()) {
      await showAlert('오류', '주소를 입력해주세요.');
      return;
    }

    if (!modalAddress.trim().match(/^0x[a-fA-F0-9]{40}$/)) {
      await showAlert('오류', '유효한 주소를 입력해주세요. (0x로 시작하는 42자)');
      return;
    }

    setIsSaving(true);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existingAddresses: AddressBookItem[] = stored ? JSON.parse(stored) : [];

      if (editingItem) {

        const updatedAddresses = existingAddresses.map((item) =>
          item.id === editingItem.id
            ? {
              ...item,
              name: modalName.trim(),
              address: modalAddress.trim(),
              network: modalNetwork,
            }
            : item
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
        await showAlert('성공', '주소가 수정되었습니다.');
      } else {

        const newItem: AddressBookItem = {
          id: Date.now().toString(),
          name: modalName.trim(),
          address: modalAddress.trim(),
          network: modalNetwork,
          createdAt: Date.now(),
        };
        const updatedAddresses = [...existingAddresses, newItem];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
        await showAlert('성공', '주소가 추가되었습니다.');
      }

      loadAddressBook();
      handleCloseModal();
    } catch (error) {
      console.error('[주소록] 저장 실패:', error);
      await showAlert('오류', '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [modalName, modalAddress, modalNetwork, editingItem, showAlert, loadAddressBook]);

  const handleDeleteAddress = useCallback(async (itemId: string) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existingAddresses: AddressBookItem[] = stored ? JSON.parse(stored) : [];
      const updatedAddresses = existingAddresses.filter((item) => item.id !== itemId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));

      delete swipeAnimations.current[itemId];

      loadAddressBook();
      await showAlert('성공', '주소가 삭제되었습니다.');
    } catch (error) {
      console.error('[주소록] 삭제 실패:', error);
      await showAlert('오류', '삭제에 실패했습니다.');
    }
  }, [showAlert, loadAddressBook]);

  const handleEditAddress = useCallback((item: AddressBookItem) => {
    setEditingItem(item);
    setModalName(item.name);
    setModalAddress(item.address);
    setModalNetwork(item.network);
    setShowEditModal(true);

    if (swipeAnimations.current[item.id]) {
      Animated.spring(swipeAnimations.current[item.id], {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const handleQrScanFromModal = useCallback(() => {
    navigate(ROUTES.walletQrScan);
  }, [navigate]);

  const handleAmountFocus = () => {
    if (sendAmount === '0') {
      setSendAmount('');
    } else if (sendAmount && amountInputRef.current) {

      setTimeout(() => {
        amountInputRef.current?.setNativeProps({
          selection: { start: sendAmount.length, end: sendAmount.length },
        });
      }, 0);
    }
  };

  const handleAmountBlur = () => {

    if (!sendAmount || sendAmount === '') {
      setSendAmount('0');
    }
  };
  const handleAvailableBalancePress = () => {
    setSendAmount(selectedWalletAsset?.amount || '0');
  };

  const isConfirmEnabled = useMemo(() => {

    const hasAddress = receiverAddress && receiverAddress.trim().length > 0;
    const isValidAddress = receiverAddress?.startsWith('0x');
    if (!hasAddress || !isValidAddress) {
      return false;
    }

    const cleanAmount = removeCommas(sendAmount);
    const amount = new BigNumber(cleanAmount || '0');
    if (amount.lte(0)) {
      return false;
    }

    const balance = new BigNumber(selectedWalletAsset?.amount || '0');
    if (amount.gt(balance)) {
      return false;
    }

    if (memberLimit !== null) {
      const limitAmount = new BigNumber(memberLimit);
      if (amount.gt(limitAmount)) {
        return false;
      }
    }

    return true;
  }, [receiverAddress, sendAmount, selectedWalletAsset?.amount, memberLimit, removeCommas]);

  const handleConfirm = async () => {
    const cleanAmount = removeCommas(sendAmount);
    const trimmedAddress = receiverAddress.trim();
    if (!trimmedAddress) {
      await showAlert(t('screens.walletSend.alerts.addressRequired'), t('screens.walletSend.errors.addressRequired'));
      return;
    }

    if (!trimmedAddress.startsWith('0x')) {
      await showAlert(t('screens.walletSend.alerts.invalidAddress'), t('screens.walletSend.errors.invalidAddress'));
      return;
    }
    if (!cleanAmount || new BigNumber(cleanAmount || '0').lte(0)) {
      await showAlert(t('screens.walletSend.alerts.amountRequired'), t('screens.walletSend.errors.amountRequired'));
      return;
    }

    const balance = new BigNumber(selectedWalletAsset?.amount || '0');
    const amount = new BigNumber(cleanAmount || '0');
    if (amount.gt(balance)) {
      await showAlert(t('screens.walletSend.alerts.insufficientBalance'), t('screens.walletSend.errors.insufficientBalance'));
      return;
    }

    setWalletSendAddress(trimmedAddress);
    setWalletSendAmount(cleanAmount);
    navigate(ROUTES.walletEstimate);
  };

  if (!selectedWalletAsset) {
    return null;
  }

  return (
    <SafeView style={styles.container} showBottomBackground={true}>
      <StatusBar style="dark" />
      <Header title={t('screens.walletSend.title')} onBackPress={handleBackPress} showBackButton />

      <View style={styles.contentContainer}>
        <Text style={styles.amountLabel}>{t('screens.walletSend.amount')}</Text>
        <View style={styles.amountContainer}>
          <View style={styles.amountSection}>
            <TextInput
              ref={amountInputRef}
              style={styles.amountInput}
              value={sendAmount}
              onChangeText={handleAmountChange}
              onFocus={handleAmountFocus}
              onBlur={handleAmountBlur}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="center"
              placeholder="0"
              placeholderTextColor="#c0c0c0"
              cursorColor="#10192d"
              selectionColor="#10192d"
              caretHidden={false}
            />
          </View>

          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{selectedWalletAsset.symbol || selectedWalletAsset.name}</Text>
          </View>
        </View>
        <View style={styles.helperContainer}>
          <Text style={styles.helperAmount}>
            {(() => {
              const cleanAmount = removeCommas(sendAmount);
              const amount = new BigNumber(cleanAmount || '0');
              if (amount.gt(0)) {
                let price = 0;
                const currency = selectedWalletAsset?.currency;

                if (currency === 1 || currency === 18) {

                  price = gopaxPrice;
                } else if (currency === 16) {

                  price = cryptoPrices?.POL?.price_krw || 0;
                } else if (currency === 2) {

                  price = cryptoPrices?.ETH?.price_krw || 0;
                }

                if (price > 0) {
                  const krwAmount = amount.multipliedBy(price);
                  return krwAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
              }
              return '0';
            })()}
          </Text>
          <Text style={styles.helperText}>KRW</Text>
        </View>
        {}
        <TouchableOpacity onPress={handleAvailableBalancePress} activeOpacity={0.7} style={styles.availableBalanceContainer}>
          <Text style={styles.availableBalanceLabel}>{t('screens.walletSend.availableBalance')}</Text>
          <Text style={styles.availableBalanceValue}>{selectedWalletAsset.amount}</Text>
          {memberLimit !== null && (
            <>
              <Text style={styles.availableBalanceToken}> {selectedWalletAsset.symbol || selectedWalletAsset.name} {t('screens.walletSend.input')}</Text>
            </>
          )}
          {}
        </TouchableOpacity>

        <FormField
          label={t('screens.walletSend.receiverAddress')}
          labelRightAccessory={
            <TouchableOpacity
              onPress={handleClearReceiverAddress}
              activeOpacity={0.7}
              disabled={!receiverAddress || receiverAddress.trim().length === 0}
            >
              <Text
                style={[
                  styles.clearAddressLink,
                  (!receiverAddress || receiverAddress.trim().length === 0) && styles.clearAddressLinkDisabled,
                ]}
              >
                {t('screens.walletSend.clearAddress')}
              </Text>
            </TouchableOpacity>
          }
          placeholder={t('screens.walletSend.receiverAddressPlaceholder')}
          value={receiverAddress}
          onChangeText={setReceiverAddress}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.formField}
          rightAccessory={
            <>
              {}
              <TouchableOpacity
                onPress={handleScanPress}
                activeOpacity={0.7}
                style={styles.qrButton}
              >
                <Ionicons name="qr-code-outline" size={22} color={COLORS.headerText} />
              </TouchableOpacity>
            </>
          }
        />
        {}
        {addressError && (
          <Text style={styles.addressErrorText}>{addressError}</Text>
        )}
        <View style={styles.addressListSection}>
          <View style={styles.webViewContainer}>
            {}
            <View style={styles.addressListTitleContainer}>
              <Text style={styles.addressListTitle}>{t('screens.walletSend.addressBook')}</Text>
              <Text style={styles.addressSwipeHint}>{t('screens.walletSend.swipeHint')}</Text>
            </View>
            {}
            <TouchableOpacity onPress={handlePastePress} activeOpacity={0.7} style={styles.addAddressButton}>
              <Ionicons name="add" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.addressListContainer}>
            {addressBook.length === 0 ? (
              <View style={styles.emptyAddressContainer}>
                <Text style={styles.emptyAddressText}>{t('screens.walletSend.noAddresses')}</Text>
              </View>
            ) : (
              <SafeScrollView
                showsVerticalScrollIndicator={false}
                showBottomBackground={false}
                backgroundColor='transparent'
                autoAdjustKeyboardPadding={true}
                onScrollBeginDrag={() => {

                  if (openSwipeableId) {
                    Animated.spring(swipeAnimations.current[openSwipeableId], {
                      toValue: 0,
                      useNativeDriver: true,
                    }).start();
                    setOpenSwipeableId(null);
                  }
                }}
              >
                {}
                {addressBook.map((item) => {

                  if (!swipeAnimations.current[item.id]) {
                    swipeAnimations.current[item.id] = new Animated.Value(0);
                  }

                  const panResponder = PanResponder.create({
                    onStartShouldSetPanResponder: () => false,
                    onMoveShouldSetPanResponder: (_, gestureState) => {

                      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
                    },
                    onPanResponderGrant: () => {

                      if (openSwipeableId && openSwipeableId !== item.id) {
                        Animated.spring(swipeAnimations.current[openSwipeableId], {
                          toValue: 0,
                          useNativeDriver: true,
                        }).start();
                        setOpenSwipeableId(null);
                      }
                    },
                    onPanResponderMove: (_, gestureState) => {

                      if (gestureState.dx < 0) {
                        swipeAnimations.current[item.id].setValue(Math.max(gestureState.dx, -120));
                      } else if (gestureState.dx > 0 && openSwipeableId === item.id) {

                        swipeAnimations.current[item.id].setValue(Math.min(gestureState.dx - 120, 0));
                      }
                    },
                    onPanResponderRelease: (_, gestureState) => {
                      if (gestureState.dx < -60) {

                        Animated.spring(swipeAnimations.current[item.id], {
                          toValue: -120,
                          useNativeDriver: true,
                        }).start();
                        setOpenSwipeableId(item.id);
                      } else {

                        Animated.spring(swipeAnimations.current[item.id], {
                          toValue: 0,
                          useNativeDriver: true,
                        }).start();
                        setOpenSwipeableId(null);
                      }
                    },
                  });

                  const translateX = swipeAnimations.current[item.id];

                  return (
                    <View key={item.id} style={styles.swipeableContainer}>
                      {}
                      <View style={styles.swipeableActions}>
                        <TouchableOpacity
                          style={[styles.swipeableButton, styles.editButton]}
                          onPress={() => handleEditAddress(item)}
                        >
                          <Ionicons name="pencil-outline" size={20} color="#ffffff" />
                          <Text style={styles.swipeableButtonText}>수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.swipeableButton, styles.deleteButton]}
                          onPress={() => handleDeleteAddress(item.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color="#ffffff" />
                          <Text style={styles.swipeableButtonText}>삭제</Text>
                        </TouchableOpacity>
                      </View>

                      {}
                      <Animated.View
                        style={[
                          styles.swipeableContent,
                          {
                            transform: [{ translateX }],
                          },
                        ]}
                        {...panResponder.panHandlers}
                      >
                        <AddressInfoItem
                          symbol={selectedWalletAsset.symbol}
                          address={item.address}
                          network={item.network}
                          networkColor={item.networkColor}
                          name={item.name}
                          onPress={() => {
                            setReceiverAddress(item.address);

                            if (openSwipeableId === item.id) {
                              Animated.spring(swipeAnimations.current[item.id], {
                                toValue: 0,
                                useNativeDriver: true,
                              }).start();
                              setOpenSwipeableId(null);
                            }
                          }}
                        />
                      </Animated.View>
                    </View>
                  );
                })}
              </SafeScrollView>
            )}
          </View>
        </View>
        <View style={[COMMON_STYLES.bottomSection, styles.bottomSection]}>
          <PrimaryButton
            title={t('screens.walletSend.confirm')}
            fullWidth
            onPress={handleConfirm}
            disabled={!isConfirmEnabled}
          />
        </View>
      </View>

      {}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? '주소 수정' : '주소 추가'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={COLORS.headerText} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>이름</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.headerText} style={styles.modalInputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="이름을 입력하세요"
                    placeholderTextColor="#999"
                    value={modalName}
                    onChangeText={setModalName}
                  />
                </View>
              </View>

              {}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>네트워크</Text>
                <TouchableOpacity
                  style={styles.modalSelectContainer}
                  onPress={() => setShowNetworkPicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalInputIcon}>
                    <NetworkIcon option={NETWORK_OPTIONS.find(n => n.value === modalNetwork) || NETWORK_OPTIONS[0]} size={20} color={COLORS.headerText} />
                  </View>
                  <Text style={styles.modalSelectText}>
                    {NETWORK_OPTIONS.find(n => n.value === modalNetwork)?.label || 'Polygon'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.headerText} />
                </TouchableOpacity>
              </View>

              {}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>주소</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="wallet-outline" size={20} color={COLORS.headerText} style={styles.modalInputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="주소를 입력하세요"
                    placeholderTextColor="#999"
                    value={modalAddress}
                    onChangeText={setModalAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.modalQrButton}
                    onPress={handleQrScanFromModal}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="qr-code-outline" size={22} color={COLORS.headerText} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {}
            <View style={styles.modalButtonContainer}>
              <PrimaryButton
                title={isSaving ? '저장 중...' : editingItem ? '수정' : '저장'}
                onPress={handleSaveAddress}
                disabled={isSaving}
                fullWidth
              />
            </View>
          </View>
        </View>

        {}
        <Modal
          visible={showNetworkPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNetworkPicker(false)}
        >
          <TouchableOpacity
            style={styles.networkModalOverlay}
            activeOpacity={1}
            onPress={() => setShowNetworkPicker(false)}
          >
            <View style={styles.networkModalContent}>
              <Text style={styles.networkModalTitle}>네트워크 선택</Text>
              <FlatList
                data={NETWORK_OPTIONS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.networkOptionItem,
                      modalNetwork === item.value && styles.networkOptionItemActive,
                    ]}
                    onPress={() => {
                      setModalNetwork(item.value);
                      setShowNetworkPicker(false);
                    }}
                  >
                    <NetworkIcon
                      option={item}
                      size={20}
                      color={modalNetwork === item.value ? COLORS.primary : COLORS.headerText}
                    />
                    <Text
                      style={[
                        styles.networkOptionText,
                        modalNetwork === item.value && styles.networkOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {modalNetwork === item.value && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </Modal>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,

  },
  contentContainer: {
    flexGrow: 1,
    ...COMMON_STYLES.contentContainer,
    paddingBottom: 0,
  },

  amountSection: {
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: SIZES.small,
    gap: SIZES.small,
  },
  amountLabel: {
    fontSize: FONTS.size.medium,
    lineHeight: 24,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
    textAlign: 'center',
  },
  amountInput: {
    fontSize: FONTS.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperAmount: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  helperText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
  },
  availableBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xsmall,
    marginBottom: SIZES.small,
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eef0f5',
    marginTop: SIZES.small,
  },
  availableBalanceLabel: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  availableBalanceValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  availableBalanceNotice: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  availableBalanceToken: {
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#8e9bae',
  },
  tokenBadge: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    fontSize: FONTS.size.large,
    alignContent: 'center',
  },
  tokenBadgeText: {
    fontSize: FONTS.size.large,
    lineHeight: 24,
    fontFamily: 'Roboto-SemiBold',
    color: COLORS.headerText,
  },
  formField: {
    width: '100%',
  },
  clearAddressLink: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: COLORS.buttonPrimary,
    textDecorationLine: 'underline',
  },
  clearAddressLinkDisabled: {
    color: 'rgba(52, 58, 90, 0.35)',
    textDecorationLine: 'none',
  },
  addressErrorText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#E53935',
    marginTop: 4,
    marginLeft: 4,
  },
  qrButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  addressListSection: {
    flexGrow: 1,
    marginTop: SIZES.small,
  },
  webViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  addressListTitleContainer: {
    flexDirection: 'column',
  },
  addressListTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
  },
  addressSwipeHint: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
    textAlign: 'center',
  },
  addressListContainer: {
    flexGrow: 1,
  },
  emptyAddressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xlarge,
  },
  emptyAddressText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
    textAlign: 'center',
  },
  addAddressButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.small,
  },
  bottomSection: {
    ...COMMON_STYLES.bottomButtonContainer,
  },
  swipeableContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  swipeableActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    paddingVertical: 8,
  },
  swipeableButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 3,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  swipeableButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
    marginTop: 3,
  },
  swipeableContent: {
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e7ec',
  },
  modalTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalInputGroup: {
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.large,
  },
  modalInputLabel: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e7ec',
    paddingHorizontal: SIZES.medium,
  },
  modalInputIcon: {
    marginRight: SIZES.small,
  },
  modalInput: {
    flex: 1,
    paddingVertical: SIZES.medium,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: COLORS.text,
  },
  modalQrButton: {
    padding: SIZES.small,
    marginLeft: SIZES.small,
  },
  modalSelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e7ec',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
  },
  modalSelectText: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: COLORS.text,
  },
  modalButtonContainer: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.small,
  },
  networkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkModalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: SIZES.medium,
    maxHeight: 300,
  },
  networkModalTitle: {
    fontSize: FONTS.size.large,
    fontFamily: 'Roboto-Bold',
    color: COLORS.headerText,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  networkOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    borderRadius: 12,
    gap: SIZES.small,
  },
  networkOptionItemActive: {
    backgroundColor: '#f0f4ff',
  },
  networkOptionText: {
    flex: 1,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  networkOptionTextActive: {
    color: COLORS.primary,
  },
});

