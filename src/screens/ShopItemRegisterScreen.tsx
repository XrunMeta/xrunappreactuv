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

import ImageCropPicker from 'react-native-image-crop-picker';
import { SafeView, Header } from '../components';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppNavigation } from '../navigation';
import { useAlertDialog } from '../context';
import { COLORS, COMMON_STYLES, SIZES, FONTS } from '../constants';
import { getXRUNGopaxPrice, createItemFromApp, createAxiosInstance, deleteShopItem } from '../services';
import { CreateItemFromAppRequest } from '../types';
import { getEnv } from '../utils/env';
import { cashingimages } from '../utils/imageCache';

export const ShopItemRegisterScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { showAlert } = useAlertDialog();
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
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(null);
  const [isLoadingCurrentImage, setIsLoadingCurrentImage] = useState<boolean>(false);
  const [editSdk, setEditSdk] = useState<string | null>(null);

  const [generatedSdk, setGeneratedSdk] = useState<string>('');

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

            const fmtNum = (v: any): string => {
              const n = Number(v);
              if (!isFinite(n)) return String(v);
              return n.toFixed(4).replace(/\.?0+$/, '');
            };
            if (editItem.priceKRW) setPriceKRW(fmtNum(editItem.priceKRW));
            else if (editItem.price) setPriceKRW(fmtNum(editItem.price));
            if (editItem.priceXrun) setPriceXrun(fmtNum(editItem.priceXrun));
            if (editItem.description) setDescription(editItem.description);
            if (editItem.maxpurchase) setMaxpurchase(editItem.maxpurchase.toString());

              if (editItem.image || editItem.thumbnail) {
                const existingImageFileId = editItem.thumbnail || editItem.image;
                if (existingImageFileId) {
                  setImageFileId(existingImageFileId);
                  console.log('[상품 등록] 수정 모드 - 기존 이미지 파일 ID:', existingImageFileId);
                }
              }

              if (editItem.sdk) {
                setEditSdk(editItem.sdk);
                console.log('[상품 등록] 수정 모드 - 기존 SDK:', editItem.sdk);
              }

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

  const loadCurrentImage = useCallback(async (fileId: number | null) => {
    if (!fileId) {
      setCurrentImageBase64(null);
      return;
    }

    try {
      setIsLoadingCurrentImage(true);
      const fileIdStr = String(fileId);
      console.log(`[상품 등록] 기존 이미지 로드 시도: ${fileIdStr}`);

      const cachedImage = await cashingimages.getCachedImage(fileIdStr);
      if (cachedImage) {
        console.log(`[상품 등록] ✅ 기존 이미지 ${fileIdStr}가 캐시에서 발견됨`);
        setCurrentImageBase64(cachedImage);
        setIsLoadingCurrentImage(false);
        return;
      }

      console.log(`[상품 등록] ⚠️ 기존 이미지 ${fileIdStr}가 캐시에 없음, 다운로드 시도...`);
      const downloadSuccess = await cashingimages.downloadAndCacheImage(fileIdStr);

      if (downloadSuccess) {
        const newCachedImage = await cashingimages.getCachedImage(fileIdStr);
        if (newCachedImage) {
          console.log(`[상품 등록] ✅ 기존 이미지 ${fileIdStr}가 다운로드 후 성공적으로 가져옴`);
          setCurrentImageBase64(newCachedImage);
        } else {
          console.log(`[상품 등록] ❌ 기존 이미지 ${fileIdStr} 다운로드 후 캐시에서 가져오기 실패`);
        }
      } else {
        console.log(`[상품 등록] ❌ 기존 이미지 ${fileIdStr} 다운로드 실패`);
      }
    } catch (error) {
      console.error('[상품 등록] 기존 이미지 로드 오류:', error);
    } finally {
      setIsLoadingCurrentImage(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && imageFileId && !imageUri) {

      loadCurrentImage(imageFileId);
    } else if (imageUri) {

      setCurrentImageBase64(null);
    }
  }, [isEditMode, imageFileId, imageUri, loadCurrentImage]);

  const generateSDK = useCallback((): string => {
    if (!userEmail) return '';
    const localPart = userEmail.split('@')[0] || '';
    if (localPart.length < 2) return '';
    const emailPrefix = localPart.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    return `${emailPrefix}${randomNum}`;
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail || isEditMode) return;
    if (generatedSdk) return; 
    const newSdk = generateSDK();
    if (newSdk) setGeneratedSdk(newSdk);
  }, [userEmail, isEditMode, generatedSdk, generateSDK]);

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

      const cropped = await ImageCropPicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperToolbarTitle: '상품 이미지 자르기',
        cropperChooseText: '선택',
        cropperCancelText: '취소',
        compressImageQuality: 0.9,
        mediaType: 'photo',
        showCropFrame: true,
        showCropGuidelines: true,
        avoidEmptySpaceAroundImage: true,

      });

      console.log('[상품 등록] 자르기 완료:', cropped.path);
      setIsUploadingImage(true);

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        cropped.path,
        [{ resize: { width: 250 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('[상품 등록] 이미지 리사이즈 완료:', manipulatedImage.uri);

      setImageUri(manipulatedImage.uri);
      void ImagePicker; 

      console.log('[상품 등록] 이미지 업로드 시작');
      const uploadResult = await uploadImage(manipulatedImage.uri);

      if (uploadResult) {
        setImageFileId(uploadResult);
        console.log('[상품 등록] 이미지 업로드 완료, 파일 ID:', uploadResult);
      } else {
        Alert.alert(
          t('screens.shopItemRegister.alerts.uploadFailed'),
          t('screens.shopItemRegister.alerts.uploadFailedMessage')
        );
        setImageUri(null);
        setImageFileId(null);
      }
    } catch (error: any) {

      const msg = String(error?.message ?? '');
      const code = String(error?.code ?? '');
      if (code === 'E_PICKER_CANCELLED' || /cancel/i.test(msg)) {
        console.log('[상품 등록] 이미지 선택 취소');
        return;
      }
      console.error('[상품 등록] 이미지 선택/업로드 오류:', error);
      const errorMessage = msg || t('screens.shopItemRegister.alerts.imageProcessingError');
      Alert.alert(t('screens.shopItemRegister.alerts.error'), errorMessage);
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

      let fileUri = uri;
      if (uri.startsWith('file://')) {

        fileUri = uri;
      }

      formData.append('file', {
        uri: fileUri,
        type: type,
        name: finalFilename,
      } as any);

      console.log('[상품 등록] ========== 이미지 업로드 시작 (axios 사용) ==========');
      console.log('[상품 등록] filename:', finalFilename);
      console.log('[상품 등록] uri:', fileUri);
      console.log('[상품 등록] platform:', Platform.OS);
      console.log('[상품 등록] originalUri:', uri);

      const axiosInstance = createAxiosInstance(navigate);

      console.log('[상품 등록] axios 요청 시작...');

      const response = await axiosInstance.post('/uploadFile', formData, {
        headers: {
          'Accept': 'application/json',

        },
        transformRequest: [], 
        timeout: 60000, 
      });

      console.log('[상품 등록] ========== axios 응답 수신 ==========');
      console.log('[상품 등록] 응답 상태:', response.status);
      console.log('[상품 등록] 응답 데이터:', response.data);

      if (response.data) {
        const dataArr = response.data.data;
        if ((response.data.success || response.data.status === 'success') && Array.isArray(dataArr) && dataArr.length > 0) {
          const item = dataArr[0];

          const fileId = typeof item === 'object' && item.fileId ? item.fileId : item;
          console.log('[상품 등록] 이미지 업로드 성공, 파일 ID:', fileId);
          return fileId;
        }
      }

      console.warn('[상품 등록] 이미지 업로드 응답 형식 오류:', response.data);
      return null;
    } catch (error: any) {
      console.error('[상품 등록] 이미지 업로드 실패:', error);

      if (error.message === 'Network Error' || (error.request && error.request.status === 0)) {
        console.error('[상품 등록] 네트워크 연결 오류 - 서버에 연결할 수 없습니다.');
        console.error('[상품 등록] 가능한 원인:');
        console.error('[상품 등록]   - 네트워크 연결이 끊어졌습니다');
        console.error('[상품 등록]   - 서버가 응답하지 않습니다');
        console.error('[상품 등록]   - 타임아웃이 발생했습니다');
        console.error('[상품 등록]   - CORS 또는 보안 정책 문제일 수 있습니다');
      } else if (error.response) {
        console.error('[상품 등록] 서버 응답:', error.response.data);
        console.error('[상품 등록] 서버 상태:', error.response.status);
        console.error('[상품 등록] 서버 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('[상품 등록] 요청 전송 실패:', error.request);
      } else {
        console.error('[상품 등록] 오류 메시지:', error.message);
      }

      if (error.stack) {
        console.error('[상품 등록] 오류 스택:', error.stack);
      }

      return null;
    }
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.productNameRequired'));
      return;
    }

    if (trimmedTitle.length > 20) {
      await showAlert(t('screens.shopItemRegister.alerts.error') || '오류', '상품명은 20자 이내로 입력해주세요.');
      return;
    }
    if (trimmedDesc.length > 500) {
      await showAlert(t('screens.shopItemRegister.alerts.error') || '오류', '설명은 500자 이내로 입력해주세요.');
      return;
    }

    if (/(.)\1{4,}/.test(trimmedTitle) || /(.)\1{4,}/.test(trimmedDesc)) {
      await showAlert(t('screens.shopItemRegister.alerts.error') || '오류', '의미 없는 반복 문자가 포함되어 있습니다. 다시 작성해주세요.');
      return;
    }

    if (/^[ㄱ-㆏\s]+$/.test(trimmedTitle)) {
      await showAlert(t('screens.shopItemRegister.alerts.error') || '오류', '상품명이 올바르지 않습니다.');
      return;
    }

    if (!memberId) {
      await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.userInfoLoadFailed'));
      return;
    }

    const finalPriceXrun = parseFloat(priceXrun) || 0;
    if (finalPriceXrun <= 0) {
      await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.priceXrunRequired'));
      return;
    }

    const finalPriceKRW = gopaxPrice > 0 ? Math.round(finalPriceXrun * gopaxPrice) : 0;

    let sdk: string | undefined;
    if (isEditMode) {
      if (editSdk) {
        sdk = editSdk;
      } else {
        await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.sdkNotFound'));
        return;
      }
    } else {

      sdk = generatedSdk;
      if (!sdk) {
        await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.sdkGenerateFailed'));
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
        sdk: sdk, 
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

        await showAlert(
          t('screens.shopItemRegister.alerts.success'),
          isEditMode ? t('screens.shopItemRegister.alerts.productUpdated') : t('screens.shopItemRegister.alerts.productRegistered'),
        );
        goBack();
      } else {
        await showAlert(
          t('screens.shopItemRegister.alerts.error'),
          response.message || (isEditMode ? t('screens.shopItemRegister.alerts.editFailed') : t('screens.shopItemRegister.alerts.registerFailed')),
        );
      }
    } catch (error) {
      console.error('[상품 등록] 오류:', error);
      await showAlert(t('screens.shopItemRegister.alerts.error'), t('screens.shopItemRegister.alerts.errorDuringRegister'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!editItemId || !memberId || !isEditMode) {
      return;
    }

    try {

      const result = await showAlert(
        t('screens.myinfoShopSales.deleteConfirm'),
        t('screens.myinfoShopSales.deleteConfirmMessage'),
        [
          {
            text: t('screens.myinfoShopSales.cancel'),
            style: 'cancel',
          },
          {
            text: t('screens.myinfoShopSales.delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                setIsSubmitting(true);
                const response = await deleteShopItem(memberId, editItemId, navigate);

                if (response.status === 'success') {
                  await showAlert('알림', t('screens.myinfoShopSales.deleteSuccess'));

                  goBack();
                } else {
                  await showAlert(
                    '알림',
                    t('screens.myinfoShopSales.deleteFailed'),
                  );
                }
              } catch (error) {
                console.error('[상품 등록] 상품 삭제 오류:', error);
                await showAlert(
                  '알림',
                  t('screens.myinfoShopSales.deleteFailed'),
                );
              } finally {
                setIsSubmitting(false);
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('[상품 등록] 삭제 확인 다이얼로그 오류:', error);
    }
  };

  const renderHeaderRight = () => null;

  if (isLoading) {
    return (
      <SafeView style={styles.container}>
        <Header 
          title={isEditMode ? t('screens.shopItemRegister.editTitle') : t('screens.shopItemRegister.title')} 
          onBackPress={goBack}
          rightComponent={renderHeaderRight()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.container} backgroundColor="#F8FAFC">
      <Header 
        title={isEditMode ? t('screens.shopItemRegister.editTitle') : t('screens.shopItemRegister.title')} 
        onBackPress={goBack}
        rightComponent={renderHeaderRight()}
      />
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
            <Text style={styles.label}>{t('screens.shopItemRegister.labelProductName')} *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={t('screens.shopItemRegister.placeholders.productName')}
              placeholderTextColor="#999"
              maxLength={20}
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>{t('screens.shopItemRegister.description')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('screens.shopItemRegister.placeholders.description')}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>{t('screens.shopItemRegister.labelPrice')} *</Text>
            <TextInput
              style={styles.input}
              value={priceXrun}
              onChangeText={setPriceXrun}
              placeholder={t('screens.shopItemRegister.pricePlaceholder')}
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.label}>{t('screens.shopItemRegister.maxPurchaseQty')}</Text>
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
            <Text style={styles.label}>{t('screens.shopItemRegister.labelIconImage')}</Text>
            <View style={styles.imageContainer}>
              {}
              <TouchableOpacity
                style={[styles.imageUploadButton, isUploadingImage && styles.imageUploadButtonDisabled]}
                onPress={handleImagePicker}
                disabled={isUploadingImage}
                activeOpacity={0.7}
              >
                {isUploadingImage ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                    <Text style={styles.uploadingText}>{t('screens.shopItemRegister.uploadingText')}</Text>
                  </View>
                ) : imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>{t('screens.shopItemRegister.imageSelect')}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {}
              {isEditMode && !imageUri && (
                <View style={styles.currentImageContainer}>
                  {isLoadingCurrentImage ? (
                    <View style={styles.currentImageLoader}>
                      <ActivityIndicator size="small" color={COLORS.buttonPrimary} />
                      <Text style={styles.currentImageLoaderText}>{t('common.messages.loading')}</Text>
                    </View>
                  ) : currentImageBase64 ? (
                    <>
                      <Text style={styles.currentImageLabel}>{t('screens.shopItemRegister.currentImage')}</Text>
                      <Image
                        source={{ uri: `data:image/png;base64,${currentImageBase64}` }}
                        style={styles.currentImagePreview}
                      />
                    </>
                  ) : imageFileId ? (
                    <>
                      <Text style={styles.currentImageLabel}>{t('screens.shopItemRegister.currentImage')}</Text>
                      <Image
                        source={{ uri: `https://oth-path-gw.example.invalid/files/${imageFileId}?raw=1` }}
                        style={styles.currentImagePreview}
                      />
                    </>
                  ) : null}
                </View>
              )}
            </View>
            {imageUri && !isUploadingImage && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  setImageUri(null);

                  if (!isEditMode) {
                    setImageFileId(null);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.removeImageText}>{t('screens.shopItemRegister.removeImage')}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.helperText}>
              {t('screens.shopItemRegister.helperImageResize')}
            </Text>
            {isUploadingImage && (
              <Text style={[styles.helperText, styles.uploadingHelperText]}>
                {t('screens.shopItemRegister.helperImageUploading')}
              </Text>
            )}
          </View>

          {}
          {!isEditMode && (
            <View style={styles.section}>
              <Text style={styles.label}>{t('screens.shopItemRegister.labelProductCode')}</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={generatedSdk}
                editable={false}
                placeholder={t('screens.shopItemRegister.placeholders.autoGenerated')}
                placeholderTextColor="#999"
              />
              {}
            </View>
          )}

          {}
          {isEditMode ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: SIZES.large }}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { flex: 1, marginTop: 0 },
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>{t('screens.shopItemRegister.editButton')}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { flex: 1, marginTop: 0, backgroundColor: '#ef4444' },
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleDeleteItem}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.submitButtonText}>{t('screens.myinfoShopSales.delete') || '삭제하기'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{t('screens.shopItemRegister.registerButton')}</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerDeleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  headerDeleteButtonText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
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
  imageContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  currentImageContainer: {
    alignItems: 'center',
    gap: 8,
  },
  currentImageLabel: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  currentImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currentImageLoader: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  currentImageLoaderText: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
});

