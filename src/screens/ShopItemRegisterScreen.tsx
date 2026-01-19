import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { SafeView, Header } from '../components';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppNavigation } from '../navigation';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { getXRUNGopaxPrice, createItemFromApp, createAxiosInstance } from '../services';
import { CreateItemFromAppRequest } from '../types';
import { getEnv } from '../utils/env';

export const ShopItemRegisterScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [gopaxPrice, setGopaxPrice] = useState<number>(0);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priceKRW, setPriceKRW] = useState<string>('');
  const [priceXrun, setPriceXrun] = useState<string>('');
  const [maxpurchase, setMaxpurchase] = useState<string>('1');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.member) {
            setMemberId(String(userData.member));
          }
          if (userData.email) {
            setUserEmail(userData.email);
          }
        }

        const editItemStr = await AsyncStorage.getItem('editShopItem');
        if (editItemStr) {
          try {
            const editItem = JSON.parse(editItemStr);
            if (editItem.isEditMode && editItem.item) {
              setIsEditMode(true);
              setEditItemId(editItem.item);
            if (editItem.title) setTitle(editItem.title);
            if (editItem.price) setPriceKRW(editItem.price.toString());
            if (editItem.priceXrun) setPriceXrun(editItem.priceXrun.toString());
            if (editItem.description) setDescription(editItem.description);
            if (editItem.maxpurchase) setMaxpurchase(editItem.maxpurchase.toString());

              await AsyncStorage.removeItem('editShopItem');
            }
          } catch (error) {
            console.error('[상품 등록] 수정 모드 데이터 로드 실패:', error);
          }
        }
      } catch (error) {
        console.error('[상품 등록] 사용자 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadGopaxPrice = async () => {
      try {
        const result = await getXRUNGopaxPrice();
        if (result.status === 'success' && result.data?.gopaxPrice) {
          setGopaxPrice(result.data.gopaxPrice);
        }
      } catch (error) {
        console.error('[상품 등록] Gopax 가격 로드 실패:', error);
      }
    };
    loadGopaxPrice();
  }, []);

  const generateSDK = useCallback((): string => {
    if (!userEmail || userEmail.length < 2) {
      return '';
    }
    const emailPrefix = userEmail.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    return `${emailPrefix}${randomNum}`;
  }, [userEmail]);

  const handlePriceKRWChange = (value: string) => {
    setPriceKRW(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && gopaxPrice > 0) {
      const xrun = Math.ceil(numValue / gopaxPrice);
      setPriceXrun(xrun.toString());
    } else {
      setPriceXrun('');
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
      const asset = result.assets[0];
      setIsUploadingImage(true);

      console.log('[상품 등록] 이미지 리사이즈 시작');
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 64, height: 64 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('[상품 등록] 이미지 리사이즈 완료:', manipulatedImage.uri);

      setImageUri(manipulatedImage.uri);

      console.log('[상품 등록] 이미지 업로드 시작');
      const uploadResult = await uploadImage(manipulatedImage.uri);

      if (uploadResult) {
        setImageFileId(uploadResult);
        console.log('[상품 등록] 이미지 업로드 완료, 파일 ID:', uploadResult);
      } else {
        Alert.alert(
          '업로드 실패', 
          '이미지 업로드에 실패했습니다.\n네트워크 연결을 확인하거나 다시 시도해주세요.'
        );
        setImageUri(null);
        setImageFileId(null);
      }
    } catch (error: any) {
      console.error('[상품 등록] 이미지 선택/업로드 오류:', error);
      const errorMessage = error?.message || '이미지 처리 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
      setImageUri(null);
      setImageFileId(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadImage = async (uri: string): Promise<number | null> => {
    try {
      const formData = new FormData();

      const filename = uri.split('/').pop() || 'image.jpg';

      const type = 'image/jpeg';
      const finalFilename = filename.endsWith('.jpg') || filename.endsWith('.jpeg') 
        ? filename 
        : `${filename.split('.')[0] || 'image'}.jpg`;

      formData.append('file', {
        uri: uri, 
        type: type,
        name: finalFilename,
      } as any);

      console.log('[상품 등록] 이미지 업로드 시작:', { 
        filename: finalFilename
      });

      const axiosInstance = createAxiosInstance(navigate);

      const response = await axiosInstance.post('/uploadFile', formData, {
        headers: {
          'Accept': 'application/json',

        },
        timeout: 30000, 
      });

      console.log('[상품 등록] 이미지 업로드 응답:', response.data);

      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        const fileId = response.data.data[0];
        console.log('[상품 등록] 이미지 업로드 성공, 파일 ID:', fileId);
        return fileId;
      }

      console.warn('[상품 등록] 이미지 업로드 응답 형식 오류:', response.data);
      return null;
    } catch (error: any) {
      console.error('[상품 등록] 이미지 업로드 실패:', error);
      if (error.response) {
        console.error('[상품 등록] 서버 응답:', error.response.data);
        console.error('[상품 등록] 서버 상태:', error.response.status);
      } else if (error.request) {
        console.error('[상품 등록] 요청 전송 실패:', error.request);
      } else {
        console.error('[상품 등록] 오류 메시지:', error.message);
      }
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('오류', '상품명을 입력해주세요.');
      return;
    }

    if (!memberId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    const finalPriceKRW = parseFloat(priceKRW) || 0;
    const finalPriceXrun = parseFloat(priceXrun) || 0;

    if (finalPriceKRW <= 0 && finalPriceXrun <= 0) {
      Alert.alert('오류', '가격을 입력해주세요.');
      return;
    }

    if (finalPriceKRW <= 0) {
      Alert.alert('오류', 'KRW 가격을 입력해주세요.');
      return;
    }

    if (finalPriceXrun <= 0) {
      Alert.alert('오류', 'XRUN 가격을 입력해주세요.');
      return;
    }

    let sdk: string | undefined;
    if (!isEditMode) {
      sdk = generateSDK();
      if (!sdk) {
        Alert.alert('오류', 'SDK를 생성할 수 없습니다. 이메일 정보를 확인해주세요.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const request: CreateItemFromAppRequest = {
        shopmember: memberId,
        title: title.trim(),
        description: description.trim(),
        price: 0, 
        priceKRW: finalPriceKRW,
        priceXrun: finalPriceXrun,
        ...(sdk ? { sdk: sdk } : {}), 
        unit: 'Item',
        maxpurchase: parseInt(maxpurchase) || 1,
        type: 'package', 
        isInapp: 0, 
        isxrunbuy: 1, 
        image: imageFileId || undefined,
        ...(isEditMode && editItemId ? { item: editItemId } : {}), 
      };

      const response = await createItemFromApp(request);

      if (response.status === 'success') {
        Alert.alert('성공', isEditMode ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.', [
          {
            text: '확인',
            onPress: () => goBack(),
          },
        ]);
      } else {
        Alert.alert('오류', response.message || (isEditMode ? '상품 수정에 실패했습니다.' : '상품 등록에 실패했습니다.'));
      }
    } catch (error) {
      console.error('[상품 등록] 오류:', error);
      Alert.alert('오류', '상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeView style={styles.container}>
        <Header title={isEditMode ? '상품 수정' : t('screens.shopItemRegister.title')} onBackPress={goBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.container} backgroundColor="#F8FAFC">
      <Header title={isEditMode ? '상품 수정' : t('screens.shopItemRegister.title')} onBackPress={goBack} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {}
          <View style={styles.section}>
            <Text style={styles.label}>상품명 *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="상품명을 입력하세요"
              placeholderTextColor="#999"
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>설명</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="상품 설명을 입력하세요"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>가격 (KRW) *</Text>
            <TextInput
              style={styles.input}
              value={priceKRW}
              onChangeText={handlePriceKRWChange}
              placeholder="KRW 가격을 입력하세요"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
            {priceXrun && (
              <Text style={styles.calculatedPrice}>
                XRUN: {parseInt(priceXrun).toLocaleString('ko-KR')} XRUN
              </Text>
            )}
            {gopaxPrice > 0 && (
              <Text style={styles.gopaxInfo}>
                현재 XRUN 가격: {gopaxPrice.toLocaleString('ko-KR')}원
              </Text>
            )}
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>최대 구매 수량</Text>
            <TextInput
              style={styles.input}
              value={maxpurchase}
              onChangeText={setMaxpurchase}
              placeholder="1"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>아이콘 이미지 (64x64)</Text>
            <TouchableOpacity
              style={[styles.imageUploadButton, isUploadingImage && styles.imageUploadButtonDisabled]}
              onPress={handleImagePicker}
              disabled={isUploadingImage}
              activeOpacity={0.7}
            >
              {isUploadingImage ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                  <Text style={styles.uploadingText}>업로드 중...</Text>
                </View>
              ) : imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>이미지 선택</Text>
                </View>
              )}
            </TouchableOpacity>
            {imageUri && !isUploadingImage && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  setImageUri(null);
                  setImageFileId(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.removeImageText}>이미지 제거</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.helperText}>
              이미지는 64x64 픽셀로 자동 리사이즈됩니다
            </Text>
            {isUploadingImage && (
              <Text style={[styles.helperText, styles.uploadingHelperText]}>
                이미지를 업로드하고 있습니다. 잠시만 기다려주세요...
              </Text>
            )}
          </View>

          {}
          {!isEditMode && (
            <View style={styles.section}>
              <Text style={styles.label}>SDK</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={generateSDK()}
                editable={false}
                placeholder="자동 생성됩니다"
                placeholderTextColor="#999"
              />
              <Text style={styles.helperText}>
                이메일 앞 2자리 + 6자리 숫자로 자동 생성됩니다
              </Text>
            </View>
          )}

          {}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{isEditMode ? '수정하기' : '등록하기'}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.xlarge,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    marginBottom: SIZES.small,
  },
  label: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SIZES.small,
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  helperText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
    marginTop: 4,
  },
  priceTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTypeButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  priceTypeButtonActive: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.buttonPrimary,
  },
  priceTypeText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  priceTypeTextActive: {
    color: '#fff',
  },
  calculatedPrice: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginTop: 8,
  },
  gopaxInfo: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 8,
    paddingVertical: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  imageUploadButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    alignSelf: 'center',
  },
  imageUploadButtonDisabled: {
    opacity: 0.6,
    borderColor: COLORS.buttonPrimary,
  },
  uploadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: COLORS.buttonPrimary,
    marginTop: 4,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
  uploadingHelperText: {
    color: COLORS.buttonPrimary,
    fontFamily: 'Roboto-Medium',
  },
  removeImageButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeImageText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#E53935',
  },
});

