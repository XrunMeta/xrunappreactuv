import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_4623af,
  v_122070,
  v_e767d1,
  v_326be8,
  v_39a996,
  v_03e392,
  v_cf9c33,
} from 'rcmrninabrnb';
import * as v_d05ab5 from 'khtmgrssvfqqjmzoc';
import * as v_3c288d from 'bxoplsnixpmvnirxbbkstg';
import { v_556baf, v_729608 } from '../components';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_a0daa8 } from '../navigation';
import { v_4b1173 } from '../context';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import { v_dd87bc, v_5027e2, v_7488d5, v_d33616 } from '../services';
import { v_8b0d2e } from '../types';
import { v_e4a763 } from '../utils/env';
import { v_858bfa } from '../utils/imageCache';

export const v_680bee = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_cd31a8, v_deef62] = v_5ab095<boolean>(false);
  const [v_88dca2, v_e33ec0] = v_5ab095<boolean>(false);
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_f4fb5e, v_d9bcc7] = v_5ab095<string>('');
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0);

  const [v_1b9174, v_b655bf] = v_5ab095<boolean>(false);
  const [v_7b46e6, v_94539c] = v_5ab095<string | null>(null);
  const [v_9f1622, v_73c0df] = v_5ab095<string>('');
  const [v_6856a9, v_b7e174] = v_5ab095<string>('');
  const [v_1c86a8, v_1eb7da] = v_5ab095<string>('');
  const [v_318e8b, v_5f29a4] = v_5ab095<string>('');
  const [v_e0f1a6, v_a06ef2] = v_5ab095<string>('1');
  const [v_ee89db, v_3456cd] = v_5ab095<string | null>(null);
  const [v_373157, v_6f0c3f] = v_5ab095<number | null>(null);
  const [v_894371, v_395d5b] = v_5ab095<boolean>(false);
  const [v_d4cc36, v_069367] = v_5ab095<string | null>(null);
  const [v_4d0f89, v_698ad3] = v_5ab095<boolean>(false);
  const [v_6d6ad9, v_56ef48] = v_5ab095<string | null>(null);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        v_deef62(true);
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(String(v_ef7306.member));
          }
          if (v_ef7306.email) {
            v_d9bcc7(v_ef7306.email);
          }
        }

        const v_438052 = await v_e84827.getItem('editShopItem');
        if (v_438052) {
          try {
            const v_4a9819 = JSON.parse(v_438052);
            if (v_4a9819.isEditMode && v_4a9819.item) {
              v_b655bf(true);
              v_94539c(v_4a9819.item);
            if (v_4a9819.title) v_73c0df(v_4a9819.title);
            if (v_4a9819.price) v_1eb7da(v_4a9819.price.toString());
            if (v_4a9819.priceXrun) v_5f29a4(v_4a9819.priceXrun.toString());
            if (v_4a9819.description) v_b7e174(v_4a9819.description);
            if (v_4a9819.maxpurchase) v_a06ef2(v_4a9819.maxpurchase.toString());

              if (v_4a9819.image || v_4a9819.thumbnail) {
                const v_53229e = v_4a9819.thumbnail || v_4a9819.image;
                if (v_53229e) {
                  v_6f0c3f(v_53229e);
                  console.log('[상품 등록] 수정 모드 - 기존 이미지 파일 ID:', v_53229e);
                }
              }

              if (v_4a9819.sdk) {
                v_56ef48(v_4a9819.sdk);
                console.log('[상품 등록] 수정 모드 - 기존 SDK:', v_4a9819.sdk);
              }

              await v_e84827.removeItem('editShopItem');
            }
          } catch (v_5e9bfe) {
            console.error('[상품 등록] 수정 모드 데이터 로드 실패:', v_5e9bfe);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[상품 등록] 사용자 정보 로드 실패:', v_5e9bfe);
      } finally {
        v_deef62(false);
      }
    };
    v_0e1f49();
  }, []);

  v_c4deb2(() => {
    const v_a16454 = async () => {
      try {
        const v_43c42e = await v_dd87bc();
        if (v_43c42e.status === 'success' && v_43c42e.data?.gopaxPrice) {
          v_0d9a89(v_43c42e.data.gopaxPrice);
        }
      } catch (v_5e9bfe) {
        console.error('[상품 등록] Gopax 가격 로드 실패:', v_5e9bfe);
      }
    };
    v_a16454();
  }, []);

  const v_0fc63a = v_de06a3(async (v_433c46) => {
    if (!v_433c46) {
      v_069367(null);
      return;
    }

    try {
      v_698ad3(true);
      const v_bb51e2 = String(v_433c46);
      console.log(`[상품 등록] 기존 이미지 로드 시도: ${v_bb51e2}`);

      const v_415a10 = await v_858bfa.getCachedImage(v_bb51e2);
      if (v_415a10) {
        console.log(`[상품 등록] ✅ 기존 이미지 ${v_bb51e2}가 캐시에서 발견됨`);
        v_069367(v_415a10);
        v_698ad3(false);
        return;
      }

      console.log(`[상품 등록] ⚠️ 기존 이미지 ${v_bb51e2}가 캐시에 없음, 다운로드 시도...`);
      const v_65903b = await v_858bfa.downloadAndCacheImage(v_bb51e2);

      if (v_65903b) {
        const v_132a3d = await v_858bfa.getCachedImage(v_bb51e2);
        if (v_132a3d) {
          console.log(`[상품 등록] ✅ 기존 이미지 ${v_bb51e2}가 다운로드 후 성공적으로 가져옴`);
          v_069367(v_132a3d);
        } else {
          console.log(`[상품 등록] ❌ 기존 이미지 ${v_bb51e2} 다운로드 후 캐시에서 가져오기 실패`);
        }
      } else {
        console.log(`[상품 등록] ❌ 기존 이미지 ${v_bb51e2} 다운로드 실패`);
      }
    } catch (v_5e9bfe) {
      console.error('[상품 등록] 기존 이미지 로드 오류:', v_5e9bfe);
    } finally {
      v_698ad3(false);
    }
  }, []);

  v_c4deb2(() => {
    if (v_1b9174 && v_373157 && !v_ee89db) {

      v_0fc63a(v_373157);
    } else if (v_ee89db) {

      v_069367(null);
    }
  }, [v_1b9174, v_373157, v_ee89db, v_0fc63a]);

  const v_071275 = v_de06a3((): string => {
    if (!v_f4fb5e || v_f4fb5e.length < 2) {
      return '';
    }
    const v_cc65d6 = v_f4fb5e.substring(0, 2).toUpperCase();
    const v_70e169 = Math.floor(100000 + Math.random() * 900000); 
    return `${v_cc65d6}${v_70e169}`;
  }, [v_f4fb5e]);

  const v_0ef408 = (v_3b402b) => {
    v_1eb7da(v_3b402b);
    const v_549ed3 = parseFloat(v_3b402b);
    if (!isNaN(v_549ed3) && v_549ed3 > 0 && v_beea9d > 0) {
      const v_76be17 = Math.ceil(v_549ed3 / v_beea9d);
      v_5f29a4(v_76be17.toString());
    } else {
      v_5f29a4('');
    }
  };

  const v_85f2b3 = async () => {
    try {
      const { status: v_d308b5 } = await v_d05ab5.requestMediaLibraryPermissionsAsync();
      if (v_d308b5 !== 'granted') {
        v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.permissionRequired'), v_8d41d7('screens.shopItemRegister.alerts.permissionMessage'));
        return;
      }
      const v_43c42e = await v_d05ab5.launchImageLibraryAsync({
        mediaTypes: v_d05ab5.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (v_43c42e.canceled || !v_43c42e.assets || v_43c42e.assets.length === 0) {
        return;
      }
      const v_b76cd8 = v_43c42e.assets[0];
      v_395d5b(true);

      console.log('[상품 등록] 이미지 리사이즈 시작');
      const v_8f957a = await v_3c288d.manipulateAsync(
        v_b76cd8.uri,
        [{ resize: { width: 250 } }], 
        { compress: 0.8, format: v_3c288d.SaveFormat.JPEG }
      );
      console.log('[상품 등록] 이미지 리사이즈 완료:', v_8f957a.uri);

      v_3456cd(v_8f957a.uri);

      console.log('[상품 등록] 이미지 업로드 시작');
      const v_aea053 = await v_8db246(v_8f957a.uri);

      if (v_aea053) {
        v_6f0c3f(v_aea053);
        console.log('[상품 등록] 이미지 업로드 완료, 파일 ID:', v_aea053);
      } else {
        v_03e392.alert(
          v_8d41d7('screens.shopItemRegister.alerts.uploadFailed'),
          v_8d41d7('screens.shopItemRegister.alerts.uploadFailedMessage')
        );
        v_3456cd(null);
        v_6f0c3f(null);
      }
    } catch (v_5e9bfe) {
      console.error('[상품 등록] 이미지 선택/업로드 오류:', v_5e9bfe);
      const v_1744b9 = v_5e9bfe?.message || v_8d41d7('screens.shopItemRegister.alerts.imageProcessingError');
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_1744b9);
      v_3456cd(null);
      v_6f0c3f(null);
    } finally {
      v_395d5b(false);
    }
  };

  const v_8db246 = async (v_cd1446): Promise<number | null> => {
    try {
      const v_2e7cbb = new FormData();

      const v_c424ac = v_cd1446.split('/').pop() || 'image.jpg';

      const v_3b27d9 = 'image/jpeg';
      const v_f0b8ff = v_c424ac.endsWith('.jpg') || v_c424ac.endsWith('.jpeg') 
        ? v_c424ac 
        : `${v_c424ac.split('.')[0] || 'image'}.jpg`;

      let v_0c2fb2 = v_cd1446;
      if (v_cd1446.startsWith('file://')) {

        v_0c2fb2 = v_cd1446;
      }

      v_2e7cbb.append('file', {
        uri: v_0c2fb2,
        type: v_3b27d9,
        name: v_f0b8ff,
      } as any);

      console.log('[상품 등록] ========== 이미지 업로드 시작 (axios 사용) ==========');
      console.log('[상품 등록] filename:', v_f0b8ff);
      console.log('[상품 등록] uri:', v_0c2fb2);
      console.log('[상품 등록] platform:', v_326be8.OS);
      console.log('[상품 등록] originalUri:', v_cd1446);

      const v_9f42a4 = v_7488d5(v_9b57fc);

      console.log('[상품 등록] axios 요청 시작...');

      const v_3393e3 = await v_9f42a4.post('/uploadFile', v_2e7cbb, {
        headers: {
          'Accept': 'application/json',

        },
        transformRequest: [], 
        timeout: 60000, 
      });

      console.log('[상품 등록] ========== axios 응답 수신 ==========');
      console.log('[상품 등록] 응답 상태:', v_3393e3.status);
      console.log('[상품 등록] 응답 데이터:', v_3393e3.data);

      if (v_3393e3.data) {

        if (v_3393e3.data.success && v_3393e3.data.data && Array.isArray(v_3393e3.data.data) && v_3393e3.data.data.length > 0) {
          const v_433c46 = v_3393e3.data.data[0];
          console.log('[상품 등록] 이미지 업로드 성공, 파일 ID:', v_433c46);
          return v_433c46;
        }

        if (v_3393e3.data.status === 'success' && v_3393e3.data.data && Array.isArray(v_3393e3.data.data) && v_3393e3.data.data.length > 0) {
          const v_433c46 = v_3393e3.data.data[0];
          console.log('[상품 등록] 이미지 업로드 성공, 파일 ID:', v_433c46);
          return v_433c46;
        }
      }

      console.warn('[상품 등록] 이미지 업로드 응답 형식 오류:', v_3393e3.data);
      return null;
    } catch (v_5e9bfe) {
      console.error('[상품 등록] 이미지 업로드 실패:', v_5e9bfe);

      if (v_5e9bfe.message === 'Network Error' || (v_5e9bfe.request && v_5e9bfe.request.status === 0)) {
        console.error('[상품 등록] 네트워크 연결 오류 - 서버에 연결할 수 없습니다.');
        console.error('[상품 등록] 가능한 원인:');
        console.error('[상품 등록]   - 네트워크 연결이 끊어졌습니다');
        console.error('[상품 등록]   - 서버가 응답하지 않습니다');
        console.error('[상품 등록]   - 타임아웃이 발생했습니다');
        console.error('[상품 등록]   - CORS 또는 보안 정책 문제일 수 있습니다');
      } else if (v_5e9bfe.response) {
        console.error('[상품 등록] 서버 응답:', v_5e9bfe.response.data);
        console.error('[상품 등록] 서버 상태:', v_5e9bfe.response.status);
        console.error('[상품 등록] 서버 헤더:', v_5e9bfe.response.headers);
      } else if (v_5e9bfe.request) {
        console.error('[상품 등록] 요청 전송 실패:', v_5e9bfe.request);
      } else {
        console.error('[상품 등록] 오류 메시지:', v_5e9bfe.message);
      }

      if (v_5e9bfe.stack) {
        console.error('[상품 등록] 오류 스택:', v_5e9bfe.stack);
      }

      return null;
    }
  };

  const v_585b02 = async () => {
    if (!v_9f1622.trim()) {
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.productNameRequired'));
      return;
    }

    if (!v_717992) {
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.userInfoLoadFailed'));
      return;
    }

    const v_d55c14 = parseFloat(v_1c86a8) || 0;
    const v_e921e1 = parseFloat(v_318e8b) || 0;

    if (v_d55c14 <= 0 && v_e921e1 <= 0) {
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.priceRequired'));
      return;
    }

    if (v_d55c14 <= 0) {
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.priceKRWRequired'));
      return;
    }

    if (v_e921e1 <= 0) {
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.priceXrunRequired'));
      return;
    }

    let v_2b9521;
    if (v_1b9174) {
      if (v_6d6ad9) {
        v_2b9521 = v_6d6ad9;
      } else {
        v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.sdkNotFound'));
        return;
      }
    } else {
      v_2b9521 = v_071275();
      if (!v_2b9521) {
        v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.sdkGenerateFailed'));
        return;
      }
    }

    v_e33ec0(true);

    try {
      const request: v_8b0d2e = {
        shopmember: v_717992,
        title: v_9f1622.trim(),
        description: v_6856a9.trim(),
        price: 0, 
        priceKRW: v_d55c14,
        priceXrun: v_e921e1,
        sdk: v_2b9521, 
        unit: 'Item',
        maxpurchase: parseInt(v_e0f1a6) || 1,
        type: 'package', 
        isInapp: 0, 
        isxrunbuy: 1, 
        image: v_373157 || undefined,
        ...(v_1b9174 && v_7b46e6 ? { item: v_7b46e6 } : {}), 
      };

      const v_3393e3 = await v_5027e2(v_576f5a);

      if (v_3393e3.status === 'success') {
        v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.success'), v_1b9174 ? v_8d41d7('screens.shopItemRegister.alerts.productUpdated') : v_8d41d7('screens.shopItemRegister.alerts.productRegistered'), [
          {
            text: '확인',
            onPress: () => v_c7ac57(),
          },
        ]);
      } else {
        v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_3393e3.message || (v_1b9174 ? v_8d41d7('screens.shopItemRegister.alerts.editFailed') : v_8d41d7('screens.shopItemRegister.alerts.registerFailed')));
      }
    } catch (v_5e9bfe) {
      console.error('[상품 등록] 오류:', v_5e9bfe);
      v_03e392.alert(v_8d41d7('screens.shopItemRegister.alerts.error'), v_8d41d7('screens.shopItemRegister.alerts.errorDuringRegister'));
    } finally {
      v_e33ec0(false);
    }
  };

  const v_328f7c = async () => {
    if (!v_7b46e6 || !v_717992 || !v_1b9174) {
      return;
    }

    try {

      const v_43c42e = await v_889fad(
        v_8d41d7('screens.myinfoShopSales.deleteConfirm'),
        v_8d41d7('screens.myinfoShopSales.deleteConfirmMessage'),
        [
          {
            text: v_8d41d7('screens.myinfoShopSales.cancel'),
            style: 'cancel',
          },
          {
            text: v_8d41d7('screens.myinfoShopSales.delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                v_e33ec0(true);
                const v_3393e3 = await v_d33616(v_717992, v_7b46e6, v_9b57fc);

                if (v_3393e3.status === 'success' && v_3393e3.data.affectedRows > 0) {
                  await v_889fad(v_8d41d7('screens.myinfoShopSales.deleteSuccess'));

                  v_c7ac57();
                } else {
                  await v_889fad(
                    v_8d41d7('screens.myinfoShopSales.deleteFailed'),
                    v_3393e3.message || v_8d41d7('screens.myinfoShopSales.deleteFailed'),
                  );
                }
              } catch (v_5e9bfe) {
                console.error('[상품 등록] 상품 삭제 오류:', v_5e9bfe);
                await v_889fad(
                  v_8d41d7('screens.myinfoShopSales.deleteFailed'),
                  v_5e9bfe instanceof Error ? v_5e9bfe.message : v_8d41d7('screens.myinfoShopSales.deleteFailed'),
                );
              } finally {
                v_e33ec0(false);
              }
            },
          },
        ],
      );
    } catch (v_5e9bfe) {
      console.error('[상품 등록] 삭제 확인 다이얼로그 오류:', v_5e9bfe);
    }
  };

  const v_a37640 = () => {
    if (!v_1b9174) {
      return null;
    }

    return (
      <TouchableOpacity
        style={v_d81136.headerDeleteButton}
        onPress={v_328f7c}
        activeOpacity={0.7}
        disabled={v_88dca2}
      >
        <Text style={v_d81136.headerDeleteButtonText}>{v_8d41d7('screens.myinfoShopSales.delete')}</Text>
      </TouchableOpacity>
    );
  };

  if (v_cd31a8) {
    return (
      <SafeView style={v_d81136.container}>
        <Header 
          title={v_1b9174 ? v_8d41d7('screens.shopItemRegister.editTitle') : v_8d41d7('screens.shopItemRegister.title')} 
          onBackPress={v_c7ac57}
          rightComponent={v_a37640()}
        />
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView style={v_d81136.container} backgroundColor="#F8FAFC">
      <Header 
        title={v_1b9174 ? v_8d41d7('screens.shopItemRegister.editTitle') : v_8d41d7('screens.shopItemRegister.title')} 
        onBackPress={v_c7ac57}
        rightComponent={v_a37640()}
      />
      <KeyboardAvoidingView
        style={v_d81136.keyboardView}
        behavior={v_326be8.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={v_326be8.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={v_d81136.scrollView}
          contentContainerStyle={v_d81136.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {}
          <View style={v_d81136.section}>
            <Text style={v_d81136.label}>상품명 *</Text>
            <TextInput
              style={v_d81136.input}
              value={v_9f1622}
              onChangeText={v_73c0df}
              placeholder={v_8d41d7('screens.shopItemRegister.placeholders.productName')}
              placeholderTextColor="#999"
            />
          </View>

          {}
          <View style={v_d81136.section}>
            <Text style={v_d81136.label}>{v_8d41d7('screens.shopItemRegister.description')}</Text>
            <TextInput
              style={[v_d81136.input, v_d81136.textArea]}
              value={v_6856a9}
              onChangeText={v_b7e174}
              placeholder={v_8d41d7('screens.shopItemRegister.placeholders.description')}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          {}
          <View style={v_d81136.section}>
            <Text style={v_d81136.label}>가격 (KRW) *</Text>
            <TextInput
              style={v_d81136.input}
              value={v_1c86a8}
              onChangeText={v_0ef408}
              placeholder="KRW 가격을 입력하세요"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
            {v_318e8b && (
              <Text style={v_d81136.calculatedPrice}>
                XRUN: {parseInt(v_318e8b).toLocaleString('ko-KR')} XRUN
              </Text>
            )}
            {v_beea9d > 0 && (
              <Text style={v_d81136.gopaxInfo}>
                현재 XRUN 가격: {v_beea9d.toLocaleString('ko-KR')}원
              </Text>
            )}
          </View>

          {}
          <View style={v_d81136.section}>
            <Text style={v_d81136.label}>{v_8d41d7('screens.shopItemRegister.maxPurchaseQty')}</Text>
            <TextInput
              style={v_d81136.input}
              value={v_e0f1a6}
              onChangeText={v_a06ef2}
              placeholder="1"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          {}
          <View style={v_d81136.section}>
            <Text style={v_d81136.label}>아이콘 이미지 (가로 250px)</Text>
            <View style={v_d81136.imageContainer}>
              {}
              <TouchableOpacity
                style={[v_d81136.imageUploadButton, v_894371 && v_d81136.imageUploadButtonDisabled]}
                onPress={v_85f2b3}
                disabled={v_894371}
                activeOpacity={0.7}
              >
                {v_894371 ? (
                  <View style={v_d81136.uploadingContainer}>
                    <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                    <Text style={v_d81136.uploadingText}>업로드 중...</Text>
                  </View>
                ) : v_ee89db ? (
                  <Image source={{ uri: v_ee89db }} style={v_d81136.imagePreview} />
                ) : (
                  <View style={v_d81136.imagePlaceholder}>
                    <Text style={v_d81136.imagePlaceholderText}>{v_8d41d7('screens.shopItemRegister.imageSelect')}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {}
              {v_1b9174 && !v_ee89db && (
                <View style={v_d81136.currentImageContainer}>
                  {v_4d0f89 ? (
                    <View style={v_d81136.currentImageLoader}>
                      <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} />
                      <Text style={v_d81136.currentImageLoaderText}>로딩 중...</Text>
                    </View>
                  ) : v_d4cc36 ? (
                    <>
                      <Text style={v_d81136.currentImageLabel}>{v_8d41d7('screens.shopItemRegister.currentImage')}</Text>
                      <Image
                        source={{ uri: `data:image/png;base64,${v_d4cc36}` }}
                        style={v_d81136.currentImagePreview}
                      />
                    </>
                  ) : null}
                </View>
              )}
            </View>
            {v_ee89db && !v_894371 && (
              <TouchableOpacity
                style={v_d81136.removeImageButton}
                onPress={() => {
                  v_3456cd(null);

                  if (!v_1b9174) {
                    v_6f0c3f(null);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.removeImageText}>{v_8d41d7('screens.shopItemRegister.removeImage')}</Text>
              </TouchableOpacity>
            )}
            <Text style={v_d81136.helperText}>
              이미지는 가로 250px 기준으로 자동 리사이즈됩니다
            </Text>
            {v_894371 && (
              <Text style={[v_d81136.helperText, v_d81136.uploadingHelperText]}>
                이미지를 업로드하고 있습니다. 잠시만 기다려주세요...
              </Text>
            )}
          </View>

          {}
          {!v_1b9174 && (
            <View style={v_d81136.section}>
              <Text style={v_d81136.label}>SDK</Text>
              <TextInput
                style={[v_d81136.input, v_d81136.readOnlyInput]}
                value={v_071275()}
                editable={false}
                placeholder={v_8d41d7('screens.shopItemRegister.placeholders.autoGenerated')}
                placeholderTextColor="#999"
              />
              <Text style={v_d81136.helperText}>
                이메일 앞 2자리 + 6자리 숫자로 자동 생성됩니다
              </Text>
            </View>
          )}

          {}
          <TouchableOpacity
            style={[v_d81136.submitButton, v_88dca2 && v_d81136.submitButtonDisabled]}
            onPress={v_585b02}
            disabled={v_88dca2}
            activeOpacity={0.7}
          >
            {v_88dca2 ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={v_d81136.submitButtonText}>{v_1b9174 ? v_8d41d7('screens.shopItemRegister.editButton') : v_8d41d7('screens.shopItemRegister.registerButton')}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
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
    fontSize: v_843035.size.small,
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
    padding: v_9b1a04.medium,
    paddingBottom: v_9b1a04.xlarge,
  },
  section: {
    marginBottom: v_9b1a04.large,
  },
  sectionTitle: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    marginBottom: v_9b1a04.small,
  },
  label: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: v_9b1a04.medium,
    paddingVertical: v_9b1a04.small,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: v_9b1a04.small,
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  helperText: {
    fontSize: v_843035.size.small,
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
    paddingVertical: v_9b1a04.small,
    paddingHorizontal: v_9b1a04.medium,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  priceTypeButtonActive: {
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderColor: v_1bfbd0.buttonPrimary,
  },
  priceTypeText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  priceTypeTextActive: {
    color: '#fff',
  },
  calculatedPrice: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginTop: 8,
  },
  gopaxInfo: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderRadius: 8,
    paddingVertical: v_9b1a04.medium,
    alignItems: 'center',
    marginTop: v_9b1a04.large,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: v_843035.size.medium,
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
    borderColor: v_1bfbd0.buttonPrimary,
  },
  uploadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.buttonPrimary,
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
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
  uploadingHelperText: {
    color: v_1bfbd0.buttonPrimary,
    fontFamily: 'Roboto-Medium',
  },
  removeImageButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeImageText: {
    fontSize: v_843035.size.small,
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
    fontSize: v_843035.size.small,
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
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
});

