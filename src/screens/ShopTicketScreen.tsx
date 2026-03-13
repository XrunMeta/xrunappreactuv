import v_a3453e, { v_5ab095, v_df9f57, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_79c4f2, v_07a341, v_39a996, v_19b633, v_326be8, v_4623af } from 'rcmrninabrnb';
import { v_570c34, v_556baf } from '../components';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_b34ce5, v_2cf4d9, v_4c7b5d } from '../components';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_745d71 } from '../types';
import { v_dd87bc, v_81c40d, v_d751d6, v_fb2e96, v_f5b61a } from '../services';
import { v_20035e } from '../types';
import { v_35c0e0, v_d7e45e, v_89f939 } from '../utils';
import { v_858bfa } from '../utils/imageCache';
import { v_1bfbd0, v_a61db3, v_9b1a04, v_843035 } from '../constants';
import * as v_759f4d from 'ssuyxdbb';

const v_3e6a6a = (
  item: v_20035e,
  v_beea9d,
): v_745d71 & v_20035e => {
  const v_1c86a8 = v_8c0b26.priceKRW || '0';
  const v_111d20 = parseFloat(v_1c86a8.replace(/,/g, ''));

  const v_c73c26 = typeof v_8c0b26.isxrunbuy === 'object' ? v_8c0b26.isxrunbuy?.data || 0 : v_8c0b26.isxrunbuy || 0;

  const v_4c0bd7 = typeof v_8c0b26.gpkrprice === 'object' ? v_8c0b26.gpkrprice?.data || 0 : v_8c0b26.gpkrprice || 0;

  const v_5f1527 = typeof v_8c0b26.gtkrPrice === 'object' ? v_8c0b26.gtkrPrice?.data || 0 : v_8c0b26.gtkrPrice || 0;

  let v_dab82f;
  let v_cd7bfc;
  let v_216aa2;
  let v_63e5c7;

  if (v_c73c26 == 1) {

    const v_12ec35 = v_beea9d || v_4c0bd7 || 1;
    v_dab82f = v_111d20 / v_12ec35;
    v_cd7bfc = v_dab82f * 0.05;
    v_216aa2 = v_dab82f + v_cd7bfc;
    v_63e5c7 = v_111d20 * 0.05;
  } else {

    const v_318e8b = v_8c0b26.priceXrun || '0';
    const v_f6ef52 = parseFloat(v_318e8b.replace(/,/g, ''));
    const v_77a34e = Math.ceil(v_f6ef52);

    v_dab82f = v_77a34e;
    v_cd7bfc = v_77a34e * 0.05;
    v_216aa2 = v_77a34e + v_cd7bfc;
    v_63e5c7 = v_111d20 * 0.05;
  }

  const v_c322f7 = require('../../assets/xrun-horizontal-logo.png');

  const v_399dbd = v_8c0b26.sku?.trim() ?? '';
  const v_cb677f = Boolean(v_399dbd !== '' && !v_399dbd.startsWith('TRANSFER'));

  if (v_c73c26 == 1) {
    const v_12ec35 = v_beea9d || v_4c0bd7 || 1;
    console.log('[상점] XRUN 구매 아이템 계산:', {
      priceKRW: v_1c86a8,
      priceKRWNum: v_111d20,
      gopaxPriceToUse: v_12ec35,
      basePriceXrun: v_dab82f,
      chargeXrun: v_cd7bfc,
      totalPriceXrun: v_216aa2,
    });
  } else {
    const v_318e8b = v_8c0b26.priceXrun || '0';
    const v_f6ef52 = parseFloat(v_318e8b.replace(/,/g, ''));
    const v_77a34e = Math.ceil(v_f6ef52);
    console.log('[상점] 일반 아이템 계산:', {
      priceKRW: v_1c86a8,
      priceKRWNum: v_111d20,
      priceXrun: v_318e8b,
      priceXrunNum: v_f6ef52,
      priceXrunRounded: v_77a34e,
      chargeXrun: v_cd7bfc,
      totalPriceXrun: v_216aa2,
    });
  }

  return {
    id: String(v_8c0b26.item),
    priceLabel: v_cb677f ? 'Loading...' : v_1c86a8, 
    detailPrice: `${v_1c86a8} / ${v_35c0e0(v_dab82f)} XRUN`,
    detailFee: `${v_d7e45e(v_63e5c7)} / ${v_35c0e0(v_cd7bfc)} XRUN`,
    detailTotal: `${v_35c0e0(v_216aa2)} XRUN`,

    ...v_8c0b26,

    title: v_8c0b26.title || '',
    image: v_c322f7,
    priceXrun: String(v_dab82f), 
    isxrunbuy: v_c73c26,
    gpkrprice: v_4c0bd7,
    gtkrPrice: v_5f1527,
    gpkChargePrice: v_cd7bfc,
    price: {
      won: v_8c0b26.priceKRW,
      wonSymbol: 'KRW',
      coin: v_dab82f,
      coinSymbol: 'XRUN',
    },
    charge: {
      won: v_63e5c7,
      wonSymbol: 'KRW',
      coin: v_cd7bfc,
      coinSymbol: 'XRUN',
    },
    totalPrice: {
      coin: v_216aa2,
      coinSymbol: 'XRUN',
      gtkrPrice: v_5f1527,
    },
  } as v_745d71 & v_20035e;
};

export const v_38326c = () => {
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_11083e, v_94ee83] = v_5ab095<'ticket' | 'myTicket' | 'xplay'>('ticket');
  const { navigate: v_9b57fc } = v_a0daa8();
  const { setSelectedShopItem: v_d0fbad } = v_700ef9();
  const [v_b1c029, v_9a4b0a] = v_5ab095<(v_745d71 & v_20035e)[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_beea9d, v_0d9a89] = v_5ab095<number>(0);
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_f9a2c9, v_01b387] = v_5ab095<Record<string, string>>({}); 
  const [v_5d756f, v_a563de] = v_5ab095<string>(''); 
  const [v_61d92f, v_f10880] = v_5ab095<boolean>(false); 

  const [v_6cb0a1, v_019be3] = v_5ab095<Record<string, any>>({});
  const [v_c1f1a5, v_1c3217] = v_5ab095(false);

  const [v_19c59c, v_97ae62] = v_5ab095<number | null>(null);
  const [v_e0d4f2, v_3ef6af] = v_5ab095(false);
  const [v_476f9f, v_fcfc38] = v_5ab095(false);

  v_c4deb2(() => {

    const v_dede3e = async () => {
      try {
        await v_759f4d.initConnection();
        console.log('[상점] IAP 연결 초기화 성공');
      } catch (v_5e9bfe) {
        console.error('[상점] IAP 연결 초기화 실패:', v_5e9bfe);
      }
    };
    v_dede3e();

    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(String(v_ef7306.member));
          }
        }
      } catch (v_5e9bfe) {
        console.error('[상점] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_faf1cb = v_de06a3(async () => {
    try {
      const v_43c42e = await v_dd87bc(v_9b57fc);
      if (v_43c42e.status === 'success' && v_43c42e.data) {
        const v_6bbb57 = v_43c42e.data.gopaxPrice || 0;
        v_0d9a89(v_6bbb57);
        console.log('[상점] 고팍스 가격 가져오기 성공:', v_6bbb57);
        return v_6bbb57;
      } else {
        console.log('[상점] 고팍스 가격 가져오기 실패:', v_43c42e.message);
        v_0d9a89(0);
        return 0;
      }
    } catch (v_5e9bfe) {
      console.log('[상점] 고팍스 가격 가져오기 오류:', v_5e9bfe);
      v_0d9a89(0);
      return 0;
    }
  }, [v_9b57fc]);

  const v_a7da97 = v_de06a3(async (items: v_20035e[]) => {
    const v_e49fc7 = {};

    for (const v_8c0b26 of v_4622b9) {

      const v_373157 = v_8c0b26.thumbnail || v_8c0b26.image;

      if (v_373157) {
        const v_bb51e2 = String(v_373157);
        console.log(`[상점] 파일 ID로 이미지 로드 시도: ${v_bb51e2}`);

        try {

          const v_415a10 = await v_858bfa.getCachedImage(v_bb51e2);
          if (v_415a10) {
            console.log(`[상점] ✅ 이미지 ${v_bb51e2}가 캐시에서 발견됨 (유효성 검증 통과)`);
            v_e49fc7[String(v_8c0b26.item)] = v_415a10;
          } else {

            console.log(`[상점] ⚠️ 이미지 ${v_bb51e2}가 캐시에 없거나 유효하지 않음, 다운로드 시도...`);

            const v_49774a = await v_858bfa.isCached(v_bb51e2);
            if (v_49774a) {
              console.log(`[상점] 🔄 유효하지 않은 캐시 감지, 재다운로드 진행...`);
            }

            const v_65903b = await v_858bfa.downloadAndCacheImage(
              v_bb51e2,
            );

            if (v_65903b) {
              console.log(`[상점] ✅ 다운로드 성공, 캐시에서 다시 가져오기 시도...`);
              const v_132a3d = await v_858bfa.getCachedImage(v_bb51e2);
              if (v_132a3d) {
                console.log(`[상점] ✅ 이미지 ${v_bb51e2}가 다운로드 후 성공적으로 가져옴`);
                v_e49fc7[String(v_8c0b26.item)] = v_132a3d;
              } else {
                console.log(`[상점] ❌ 다운로드 후 이미지 ${v_bb51e2} 가져오기 실패 (유효성 검증 실패)`);
              }
            } else {
              console.log(`[상점] ❌ ${v_bb51e2} 다운로드 실패`);
            }
          }
        } catch (v_5e9bfe) {
          console.error(`[상점] ❌ 아이템 ${v_8c0b26.item}의 이미지 로드 오류:`, v_5e9bfe);
        }
      } else {
        console.log(`[상점] ⚠️ 아이템 ${v_8c0b26.item}에 이미지 또는 썸네일 ID가 없음`);
      }
    }

    console.log('[상점] === loadItemImages 요약 ===');
    console.log('[상점] 처리된 총 아이템 수:', v_4622b9.length);
    console.log('[상점] 성공적으로 캐시된 이미지 수:', Object.keys(v_e49fc7).length);
    console.log('[상점] 캐시된 아이템들:', Object.keys(v_e49fc7));

    Object.keys(v_e49fc7).forEach((v_6e55b1) => {
      const v_14a7eb = v_e49fc7[v_6e55b1];
      console.log(`[상점] 아이템 ${v_6e55b1} 이미지 데이터 길이: ${v_14a7eb?.length || 0}자`);
    });

    console.log('[상점] === loadItemImages 끝 ===');

    v_01b387(v_e49fc7);
  }, [v_9b57fc]);

  const v_2cfb06 = v_de06a3((items: v_20035e[]): string[] => {
    const v_72edf9 = [];
    v_4622b9.forEach((v_8c0b26) => {

      const v_399dbd = v_8c0b26.sku?.trim() ?? '';
      if (v_399dbd !== '' && !v_399dbd.startsWith('TRANSFER') && !v_72edf9.includes(v_399dbd)) {
        v_72edf9.push(v_399dbd);
      }
    });
    console.log('[상점] 추출된 SKU 목록:', v_72edf9);
    return v_72edf9;
  }, []);

  const v_8305f6 = v_de06a3(async (v_72edf9) => {
    try {
      if (!v_72edf9 || v_72edf9.length === 0) {
        console.log('[상점] IAP SKU가 없습니다.');
        return;
      }

      v_1c3217(true);
      console.log('[상점] IAP 제품 정보 가져오기 시작:', v_72edf9);

      const v_74a563 = await v_759f4d.fetchProducts({
        skus: v_72edf9,
        type: 'in-app',
      });

      console.log('[상점] IAP 제품 정보 응답:', JSON.stringify(v_74a563, null, 2));

      if (v_74a563 && v_74a563.length > 0) {

        const v_e3bbd8 = {};
        v_74a563.forEach((v_01bee9) => {
          const v_9af408 = v_01bee9.productId || v_01bee9.id;
          if (v_9af408) {
            v_e3bbd8[v_9af408] = v_01bee9;
            console.log(`[상점] IAP 제품 추가: ${v_9af408}`, {
              price: v_01bee9.price || v_01bee9.localizedPrice,
              title: v_01bee9.title || v_01bee9.name,
            });
          }
        });
        v_019be3(v_e3bbd8);
        console.log('[상점] IAP 제품 맵 설정 완료:', Object.keys(v_e3bbd8));
      }
    } catch (v_5e9bfe) {
      console.error('[상점] IAP 제품 정보 가져오기 오류:', v_5e9bfe);
    } finally {
      v_1c3217(false);
    }
  }, []);

  const v_977746 = v_de06a3(async (v_5c15b4) => {
    if (!v_717992) return;

    try {
      v_34a50a(true);
      const v_14df59 = v_5c15b4 || v_beea9d || 0;

      console.log('[상점] === 상점 아이템 가져오기 시작 ===');
      const v_43c42e = await v_81c40d(v_717992, v_9b57fc);

      if (v_43c42e && v_43c42e.status === 'success' && v_43c42e.data) {
        console.log('[상점] API 응답 성공, 받은 아이템 수:', v_43c42e.data.length);

        const v_1b7132 = v_43c42e.data.map((v_8c0b26) => {
          console.log(`[상점] === 아이템 ${v_8c0b26.item} 변환 중 ===`);
          console.log('[상점] 원본 아이템 데이터:', {
            item: v_8c0b26.item,
            title: v_8c0b26.title,
            image: v_8c0b26.image,
            thumbnail: v_8c0b26.thumbnail,
            priceKRW: v_8c0b26.priceKRW,
            priceXrun: v_8c0b26.priceXrun,
            isxrunbuy: v_8c0b26.isxrunbuy,
            gpkrprice: v_8c0b26.gpkrprice,
            sku: v_8c0b26.sku,
          });

          if (v_14df59 === 0) {
            v_faf1cb();
          }
          return v_3e6a6a(v_8c0b26, v_14df59 || v_beea9d);
        });

        v_9a4b0a(v_1b7132);
        console.log('[상점] 변환된 아이템 수:', v_1b7132.length);

        const v_c32bfd = v_2cfb06(v_43c42e.data);
        if (v_c32bfd.length > 0) {
          console.log('[상점] SKU에 대한 IAP 제품 가져오기:', v_c32bfd);
          await v_8305f6(v_c32bfd);
        } else {
          console.log('[상점] 상점 아이템에서 IAP SKU를 찾을 수 없음');
        }

        await v_a7da97(v_43c42e.data);
      } else {
        console.log('[상점] 상점 아이템 가져오기 실패:', v_43c42e);
        await v_889fad(v_8d41d7('screens.shopBuy.alerts.error'), v_8d41d7('screens.shopBuy.alerts.loadShopItemsFailed'));
        v_9a4b0a([]);
      }
    } catch (v_5e9bfe) {
      console.error('[상점] 상점 아이템 가져오기 오류:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.shopBuy.alerts.error'), v_8d41d7('screens.shopBuy.alerts.loadShopItemsFailed'));
      v_9a4b0a([]);
    } finally {
      v_34a50a(false);
    }
  }, [v_717992, v_beea9d, v_9b57fc, v_faf1cb, v_a7da97, v_2cfb06, v_8305f6]);

  v_c4deb2(() => {
    const v_5c29ab = async () => {
      if (!v_717992) return;

      const v_6bbb57 = await v_faf1cb();

      await v_977746(v_6bbb57);
    };

    if (v_717992) {
      v_5c29ab();
    }
  }, [v_717992, v_faf1cb, v_977746]);

  const v_1c4d31 = v_df9f57(
    () => [
      { label: 'Ticket', value: 'ticket' },
      { label: 'My Ticket', value: 'myTicket' },
      { label: 'Xplay', value: 'xplay' },
    ] as const,
    [],
  );

  const v_42b5ed = (value: typeof v_1c4d31[number]['value']) => {
    v_94ee83(v_3b402b);
    if (v_3b402b === 'myTicket') {
      v_9b57fc(v_ce4741.shopMyTicket);
    }
  };

  v_c4deb2(() => {
    if (v_11083e !== 'xplay' || !v_717992) return;
    let v_2008a4 = false;
    const v_1f93ed = async () => {
      v_3ef6af(true);
      v_97ae62(null);
      try {
        const v_43c42e = await v_fb2e96(v_717992, v_9b57fc);
        if (!v_2008a4) {
          v_97ae62(v_43c42e.current_p_balance);
        }
      } catch (v_9e86fd) {
        if (!v_2008a4) {
          v_97ae62(0);
          console.error('[Xplay] 포인트 잔액 조회 실패:', v_9e86fd);
        }
      } finally {
        if (!v_2008a4) v_3ef6af(false);
      }
    };
    v_1f93ed();
    return () => { v_2008a4 = true; };
  }, [v_11083e, v_717992, v_9b57fc]);

  const v_5f9181 = v_de06a3(async () => {
    if (!v_717992 || v_476f9f) return;
    const v_275ccd = v_19c59c ?? 0;
    if (v_275ccd < 10) {
      v_889fad(v_8d41d7('screens.shopBuy.alerts.insufficientBalanceTitle'), v_8d41d7('screens.shopBuy.alerts.insufficientPointsMessage'), [{ text: v_8d41d7('screens.shopBuy.confirm') }]);
      return;
    }
    v_fcfc38(true);
    try {
      const v_acc763 = `member_${v_717992}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const v_43c42e = await v_f5b61a(
        { snuid: v_717992, order_id: v_acc763, item_name: '테스트 결제 10P', spent_amount: 10 },
        v_9b57fc,
      );
      v_97ae62(v_43c42e.remaining_balance);
      v_889fad(v_8d41d7('screens.shopBuy.alerts.testPaymentComplete'), v_8d41d7('screens.shopBuy.alerts.testPaymentBalance', { balance: v_43c42e.remaining_balance.toLocaleString() }), [{ text: v_8d41d7('screens.shopBuy.confirm') }]);
    } catch (v_9e86fd) {
      console.error('[Xplay] 테스트 결제 실패:', v_9e86fd);
      v_889fad(v_8d41d7('screens.shopBuy.alerts.paymentFailed'), v_9e86fd instanceof Error ? v_9e86fd.message : v_8d41d7('screens.shopBuy.alerts.pointUseFailed'), [{ text: v_8d41d7('screens.shopBuy.confirm') }]);
    } finally {
      v_fcfc38(false);
    }
  }, [v_717992, v_19c59c, v_476f9f, v_9b57fc, v_889fad]);

  const v_c0e000 = v_de06a3((v_399dbd): string | null => {
    const v_01bee9 = v_6cb0a1[v_399dbd];
    if (v_01bee9) {

      return v_01bee9.localizedPrice || v_01bee9.price || null;
    }
    return null;
  }, [v_6cb0a1]);

  const v_8051fd = v_de06a3((v_399dbd): boolean => {
    return !!v_6cb0a1[v_399dbd];
  }, [v_6cb0a1]);

  const v_cac1cc = (item: v_745d71 & v_20035e) => {
    v_d0fbad(v_8c0b26);
    v_9b57fc(v_ce4741.shopBuy);
  };

  const v_973c3e = v_df9f57(() => {
    if (!v_5d756f.trim()) {
      return v_b1c029;
    }

    const v_7c5791 = v_5d756f.toLowerCase().trim();
    return v_b1c029.filter((v_8c0b26) => {
      const v_9f1622 = (v_8c0b26.title || '').toLowerCase();
      const v_6856a9 = ((v_8c0b26 as any)?.description || '').toLowerCase();

      return v_9f1622.includes(v_7c5791) || v_6856a9.includes(v_7c5791);
    });
  }, [v_b1c029, v_5d756f]);

  const v_719647 = (
    v_9f1622,
    v_6bbb57,
    imageSource: v_07a341,
    options?: { quantityLabel?: string; shopItem?: v_745d71 },
  ) => (
    <ShopItemCard
      key={v_9f1622}
      title={v_9f1622}
      priceLabel={v_6bbb57}
      imageSource={v_c322f7}
      quantityLabel={v_b36f96?.quantityLabel}
      onPress={v_b36f96?.shopItem ? () => v_cac1cc(v_b36f96.shopItem as v_745d71 & v_20035e) : undefined}
    />
  );

  return (
    <SafeView style={v_d81136.container} backgroundColor='#F8FAFC'>
      <Header
        title={v_8d41d7('screens.shop.title')}
        rightComponent={
          <TouchableOpacity
            onPress={() => v_f10880(!v_61d92f)}
            activeOpacity={0.7}
            style={v_d81136.searchButton}
          >
            <Feather name="search" size={20} color={v_1bfbd0.headerText} />
          </TouchableOpacity>
        }
      />
      {v_683210 ? (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      ) : (
        <>
          <View style={v_d81136.contentContainer} >

            <SegmentedControl
              options={v_1c4d31}
              value={v_11083e}
              onChange={v_42b5ed}
              containerStyle={v_d81136.segmented}
              hideIndicator={true}
            />

            {v_61d92f && (
              <View style={v_d81136.searchBar}>
                <Feather name="search" size={18} color="#0296f2" />
                <TextInput
                  style={v_d81136.searchInput}
                  placeholder={v_8d41d7('screens.shop.searchPlaceholder')}
                  placeholderTextColor="#bcbec4"
                  value={v_5d756f}
                  onChangeText={v_a563de}
                />
              </View>
            )}
            <SafeScrollView showsVerticalScrollIndicator={false} showBottomBackground={false} backgroundColor='transparent'>
              {v_11083e === 'xplay'
                ? (
                    <View style={v_d81136.xplayContainer}>
                      {v_e0d4f2
                        ? (
                            <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} style={v_d81136.xplayLoader} />
                          )
                        : (
                            <Text style={v_d81136.xplayBalanceLabel}>
                              {v_8d41d7('screens.shop.pointsBalance', '포인트 잔액')}: {v_19c59c !== null ? v_19c59c.toLocaleString() : '-'}
                            </Text>
                          )}
                      <TouchableOpacity
                        style={[v_d81136.xplayTestButton, (v_e0d4f2 || v_476f9f || (v_19c59c !== null && v_19c59c < 10)) && v_d81136.xplayTestButtonDisabled]}
                        onPress={v_5f9181}
                        disabled={v_e0d4f2 || v_476f9f || (v_19c59c !== null && v_19c59c < 10)}
                      >
                        {v_476f9f ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={v_d81136.xplayTestButtonText}>결제하기 10 (테스트)</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )
                : v_11083e === 'ticket' && v_973c3e.length > 0
                ? v_973c3e.map((v_8c0b26) => {

                  const v_63070e = v_f9a2c9[v_8c0b26.id];
                  let imageSource: v_07a341;

                  if (v_63070e) {

                    if (v_63070e && v_63070e.length > 100) {
                      v_c322f7 = { uri: `data:image/png;base64,${v_63070e}` };
                      console.log(`[상점] 아이템 ${v_8c0b26.id} base64 이미지 사용 (길이: ${v_63070e.length})`);
                    } else {
                      console.warn(`[상점] ⚠️ 아이템 ${v_8c0b26.id}의 base64 데이터가 유효하지 않음 (길이: ${v_63070e?.length || 0}), 기본 이미지 사용`);
                      v_c322f7 = v_8c0b26.image;
                    }
                  } else {
                    console.log(`[상점] 아이템 ${v_8c0b26.id} 캐시된 이미지 없음, 기본 이미지 사용`);
                    v_c322f7 = v_8c0b26.image;
                  }

                  const v_399dbd = (v_8c0b26.sku ?? '').trim();
                  const v_cb677f = Boolean(v_399dbd !== '' && !v_399dbd.startsWith('TRANSFER'));
                  const v_817eee = v_cb677f ? v_c0e000(v_399dbd) : null;
                  const v_e48882 = v_cb677f && v_8051fd(v_399dbd);

                  let v_e72b09;
                  if (v_cb677f) {
                    if (v_e48882 && v_817eee) {
                      v_e72b09 = v_817eee; 
                    } else if (v_c1f1a5) {
                      v_e72b09 = 'Loading...'; 
                    } else {
                      v_e72b09 = v_89f939(v_8c0b26.priceKRW || '0', 'KRW'); 
                    }
                  } else {
                    v_e72b09 = v_89f939(v_8c0b26.priceKRW || '0', 'KRW');
                  }

                  return v_719647(v_8c0b26.title, v_e72b09, v_c322f7, { shopItem: v_8c0b26 });
                })
                : v_11083e === 'ticket' && v_973c3e.length === 0
                  ? (
                    <View style={v_d81136.emptyContainer}>
                      <Text style={v_d81136.emptyText}>
                        {v_5d756f.trim()
                          ? 'No search results'
                          : '구매 가능한 아이템이 없습니다.'
                        }
                      </Text>
                    </View>
                  )
                  : null}
            </SafeScrollView>
          </View>

          {}
          <View style={v_d81136.taboolaContainer}>
            <TaboolaBanner placementType="shop" />
          </View>
        </>
      )}
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  contentContainer: {
    flex: 1,
    ...v_a61db3.contentContainer,
    paddingBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmented: {
    marginBottom: v_9b1a04.large,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ededed',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    shadowColor: '#182b78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#1a2e35',
  },
  xplayContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  xplayLoader: {
    marginVertical: 8,
  },
  xplayBalanceLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  xplayTestButton: {
    marginTop: 16,
    backgroundColor: v_1bfbd0.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  xplayTestButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  xplayTestButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#fff',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  taboolaContainer: {
    borderWidth: 2,
    borderColor: '#ededed',
    marginTop: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
