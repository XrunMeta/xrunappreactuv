import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_19b633, v_4623af, v_f2c756, v_cf9c33, v_07a341, v_39a996, v_326be8 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_20035e } from '../types';
import { v_54d016, v_9c9f1b, v_d751d6 } from '../services';
import { v_89f939, v_35c0e0 } from '../utils';
import { v_1bfbd0, v_a61db3, v_843035 } from '../constants';
import * as v_759f4d from 'ssuyxdbb';

export const v_1a0a02 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { selectedShopItem: v_dfe883 } = v_700ef9();
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_bc3e72, v_a14a8c] = v_5ab095<number | null>(null);
  const [v_d4bdc8, v_72727b] = v_5ab095(false);
  const [v_8dbb06, v_a6df16] = v_5ab095(true);

  const [v_0243db, v_a568ec] = v_5ab095<any>(null);
  const [v_7712f3, v_9bf98f] = v_5ab095(false);
  const [v_b9c849, v_9f981c] = v_5ab095<string | null>(null);

  const v_06e3b4 = (v_f63e09): string => {
    const v_0ad8c5 = typeof v_f63e09 === 'string' ? Number(v_f63e09) : v_f63e09;
    if (!Number.isFinite(v_0ad8c5)) return '0.0000';
    return v_0ad8c5.toFixed(4);
  };

  v_c4deb2(() => {
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
        console.error('[구매] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_a018be = v_de06a3(async (v_d6dce2) => {
    try {
      v_a6df16(true);
      const v_43c42e = await v_54d016(v_d6dce2, v_9b57fc);

      if (v_43c42e && v_43c42e.status === 'success' && v_43c42e.code === 200 && v_43c42e.data?.realtimeBalance) {
        const v_c88e9b = parseFloat(v_43c42e.data.realtimeBalance.balance);
        v_a14a8c(v_c88e9b);
        console.log('[구매] 사용자 잔액 조회 성공:', v_c88e9b);
        return v_c88e9b;
      } else {
        console.log('[구매] 잔액 조회 실패:', v_43c42e);
        v_a14a8c(null);
        return 0;
      }
    } catch (v_5e9bfe) {
      console.error('[구매] 잔액 조회 오류:', v_5e9bfe);
      v_a14a8c(null);
      return 0;
    } finally {
      v_a6df16(false);
    }
  }, [v_9b57fc]);

  v_c4deb2(() => {
    if (v_717992) {
      v_a018be(v_717992);
    }
  }, [v_717992, v_a018be]);

  const v_645e19 = v_de06a3(async (v_399dbd) => {
    if (!v_399dbd || v_399dbd.trim() === '') {
      v_a568ec(null);
      return;
    }

    try {
      v_9bf98f(true);
      v_9f981c(null);
      console.log('[구매] IAP 제품 정보 가져오기:', v_399dbd);

      try {
        await v_759f4d.initConnection();
        console.log('[구매] IAP 연결 성공');
      } catch (v_6a1a16) {
        console.error('[구매] IAP 연결 실패:', v_6a1a16);
        v_9f981c('인앱 구매 서비스에 연결할 수 없습니다.');
        v_a568ec(null);
        return;
      }

      const v_67dde1 = await v_759f4d.fetchProducts({
        skus: [v_399dbd],
        type: 'in-app',
      });

      console.log('[구매] IAP 제품 정보 응답:', JSON.stringify(v_67dde1, null, 2));

      if (v_67dde1 && v_67dde1.length > 0) {
        v_a568ec(v_67dde1[0]);
        v_9f981c(null);
        console.log('[구매] IAP 제품 설정 완료:', v_67dde1[0]);
      } else {
        console.log('[구매] IAP 제품을 찾을 수 없음:', v_399dbd);
        v_a568ec(null);
        v_9f981c('이 상품은 현재 구매할 수 없습니다.');
      }
    } catch (v_5e9bfe) {
      console.error('[구매] IAP 제품 정보 가져오기 오류:', v_5e9bfe);
      v_a568ec(null);
      v_9f981c(v_5e9bfe?.message || '상품 정보를 가져올 수 없습니다.');
    } finally {
      v_9bf98f(false);
    }
  }, []);

  v_c4deb2(() => {
    const v_8c0b26 = v_dfe883 as unknown as v_20035e;
    if (v_8c0b26?.sku && v_8c0b26.sku.trim() !== '') {
      v_645e19(v_8c0b26.sku);
    }
  }, [v_dfe883, v_645e19]);

  v_c4deb2(() => {
    if (!v_dfe883) {
      console.log('[구매] 선택된 아이템이 없습니다.');
      v_c7ac57();
    }
  }, [v_dfe883, v_c7ac57]);

  const v_dfaad1 = async () => {
    if (!v_dfe883 || !v_717992) {
      await v_889fad(v_8d41d7('screens.shopBuy.alerts.error'), v_8d41d7('screens.shopBuy.alerts.cannotPurchase'));
      return;
    }

    if (v_d4bdc8) {
      console.log('[구매] 이미 구매 진행 중입니다.');
      return;
    }

    v_72727b(true);

    try {
      const v_8c0b26 = (v_dfe883 as unknown) as v_20035e & { totalPrice?: { coin?: number } };
      const v_d6cf14 = v_8c0b26.sku && v_8c0b26.sku.trim() !== '';

      if (v_d6cf14) {

        console.log('========================================');
        console.log('[구매] === IAP 인앱 구매 시작 ===');
        console.log('========================================');
        console.log('[구매] 상품 ID:', v_8c0b26.sku);
        console.log('[구매] 사용자 번호:', v_717992);
        console.log('[구매] 플랫폼:', v_326be8.OS);

        if (!v_0243db) {
          console.log('[구매] IAP 제품 정보가 없습니다. 다시 가져오기...');
          await v_645e19(v_8c0b26.sku);

          if (!v_0243db) {
            await v_889fad(
              v_8d41d7('screens.shopBuy.alerts.error'),
              '인앱 구매 상품 정보를 가져올 수 없습니다.',
            );
            v_72727b(false);
            return;
          }
        }

        console.log('[구매] IAP 제품 정보:', JSON.stringify(v_0243db, null, 2));

        console.log('[구매] IAP 구매 요청 중...');
        const v_54e15b = await v_759f4d.requestPurchase({
          request: {
            ios: { sku: v_8c0b26.sku },
            android: { skus: [v_8c0b26.sku] },
          },
          type: 'in-app',
        });

        console.log('========================================');
        console.log('[구매] ✅ IAP 구매 완료!');
        console.log('========================================');
        console.log('[구매] 구매 응답:', JSON.stringify(v_54e15b, null, 2));

        const v_f908f2 = Array.isArray(v_54e15b) ? v_54e15b : [v_54e15b];

        const v_201434 = {
          memberId: v_717992,
          productId: v_8c0b26.sku,
          platform: v_326be8.OS as 'android' | 'ios',
          purchaseData: v_f908f2,
          purchaseTime: new Date().toISOString(),
          item: v_8c0b26.item?.toString() || '', 
        };

        console.log('[구매] 서버로 구매 데이터 전송 중...');
        console.log('[구매] API 페이로드:', JSON.stringify(v_201434, null, 2));

        const v_8a7529 = await v_d751d6(v_201434, v_9b57fc);

        console.log('[구매] API 응답:', JSON.stringify(v_8a7529, null, 2));

        if (v_8a7529.status === 'success') {

          const v_e65a1f = v_8a7529.data?.savedCount ?? 0;
          const v_f637a4 = v_8a7529.data as { savedCount?: number; saved?: boolean; reason?: string } | undefined;
          const v_2d1262 = v_f637a4?.saved !== false; 

          if (v_e65a1f > 0 || v_2d1262) {

            console.log('[구매] ✅ 구매 완료 및 서버 저장 성공');
            v_9b57fc(v_ce4741.shopSuccess);
          } else {

            console.log('[구매] ⚠️ 구매 데이터가 저장되지 않음:', v_8a7529.data?.reason);
            await v_889fad(
              '구매 확인 필요',
              '결제가 완료되지 않았습니다. 다시 시도해주세요.',
              [{ text: '확인' }],
            );

          }
        } else {
          console.log('[구매] ⚠️ 서버 전송 실패:', v_8a7529.message);
          await v_889fad(
            '서버 오류',
            v_8a7529.message || '서버 전송 중 오류가 발생했습니다.',
            [{ text: '확인' }],
          );

        }

        v_72727b(false);
        return;
      }

      console.log('[구매] === XRUN 구매 시작 ===');
      const v_2c49ad = v_8c0b26.totalPrice?.coin || 0;
      console.log('[구매] 필요한 총 금액:', v_2c49ad);

      console.log('[구매] 1단계: 사용자 잔액 확인 중...');
      const v_a5e3b7 = v_bc3e72 !== null ? v_bc3e72 : await v_a018be(v_717992);
      console.log('[구매] 현재 잔액:', v_a5e3b7);
      console.log('[구매] 필요한 금액:', v_2c49ad);

      if (v_a5e3b7 < v_2c49ad) {
        console.log('[구매] ❌ 잔액 부족');
        await v_889fad(
          v_8d41d7('screens.shopBuy.alerts.insufficientBalanceTitle'),
          v_8d41d7('screens.shopBuy.alerts.insufficientBalanceMessage', {
            currentBalance: v_06e3b4(v_a5e3b7),
            requiredAmount: v_06e3b4(v_2c49ad),
          }),
          [{ text: v_8d41d7('screens.shopBuy.confirm') }],
        );
        v_72727b(false);
        return;
      }

      console.log('[구매] ✅ 잔액 충분, 구매 진행 중...');

      console.log('[구매] 2단계: purchaseXrunItem 호출 중...');
      const v_4cb6df = await v_9c9f1b(
        v_717992,
        parseInt(v_8c0b26.item?.toString() || '0'),
        v_2c49ad.toString(),
        v_9b57fc,
      );

      console.log('[구매] 구매 결과:', v_4cb6df);

      if (v_4cb6df && v_4cb6df.status === 'success' && v_4cb6df.code === 200) {

        console.log('[구매] ✅ 구매 성공');

        await v_a018be(v_717992);

        v_9b57fc(v_ce4741.shopSuccess);
      } else {
        throw new Error(v_4cb6df?.message || '구매 실패');
      }
    } catch (v_5e9bfe) {
      console.error('[구매] === 구매 오류 ===');
      console.error('[구매] 구매 오류:', v_5e9bfe);
      console.error('[구매] 오류 메시지:', v_5e9bfe?.message);
      console.error('[구매] 오류 코드:', v_5e9bfe?.code);

      if (v_5e9bfe?.code === 'E_USER_CANCELLED' || v_5e9bfe?.message?.includes('cancel')) {
        console.log('[구매] 사용자가 구매를 취소했습니다.');

      } else {
        await v_889fad(
          v_8d41d7('screens.shopBuy.alerts.purchaseFailed'),
          v_5e9bfe.message || v_8d41d7('screens.shopBuy.alerts.purchaseFailedMessage'),
          [{ text: v_8d41d7('screens.shopBuy.confirm') }],
        );
      }
    } finally {
      v_72727b(false);
    }
  };

  if (!v_dfe883) {
    return null;
  }

  const v_8c0b26 = (v_dfe883 as unknown) as v_20035e & {
    totalPrice?: { coin?: number; gtkrPrice?: number };
    price?: { won?: string; coin?: number };
    charge?: { won?: number; coin?: number };
    image?: v_07a341;
  };

  const imageSource: v_07a341 = v_8c0b26.image || require('../../assets/xrun-horizontal-logo.png');

  const v_d6cf14 = v_8c0b26.sku && v_8c0b26.sku.trim() !== '';

  const v_1c86a8 = v_8c0b26.priceKRW || '0';
  const v_318e8b = v_8c0b26.price?.coin || v_8c0b26.priceXrun || 0;
  const v_63e5c7 = v_8c0b26.charge?.won || 0;
  const v_cd7bfc = v_8c0b26.charge?.coin || 0;
  const v_284b46 = v_8c0b26.totalPrice?.coin || 0;

  const v_1ee1c8 = !v_d6cf14 && v_bc3e72 !== null && v_bc3e72 < v_284b46;

  const v_decd65 = v_d6cf14 && (v_7712f3 || !v_0243db || !!v_b9c849);

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.shop.title')} onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <View style={v_d81136.detailCard}>
          <Image source={v_c322f7} style={v_d81136.itemImage} resizeMode="contain" />
          <Text style={v_d81136.itemTitle}>{v_8c0b26.title || ''}</Text>

          {v_8c0b26.description && (
            <Text style={v_d81136.description}>{v_8c0b26.description}</Text>
          )}

          {v_8c0b26.website && (
            <TouchableOpacity onPress={() => v_f2c756.openURL(v_8c0b26.website).catch(() => { })}>
              <Text style={v_d81136.link}>{v_8c0b26.website}</Text>
            </TouchableOpacity>
          )}

          <View style={v_d81136.priceContainer}>
            {v_d6cf14 ? (

              <>
                <View style={v_d81136.row}>
                  <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.price')}</Text>
                  <Text style={[v_d81136.value, v_b9c849 && v_d81136.errorValue]}>
                    {v_7712f3 ? (
                      'Loading...'
                    ) : v_0243db ? (
                      v_0243db.localizedPrice || v_0243db.price || v_89f939(v_1c86a8, 'KRW')
                    ) : v_b9c849 ? (
                      '구매 불가'
                    ) : (
                      v_89f939(v_1c86a8, 'KRW')
                    )}
                  </Text>
                </View>
                {

}
                {}
                {v_b9c849 && !v_7712f3 && (
                  <View style={v_d81136.iapErrorContainer}>
                    <Text style={v_d81136.iapErrorIcon}>⚠️</Text>
                    <Text style={v_d81136.iapErrorText}>{v_b9c849}</Text>
                  </View>
                )}
              </>
            ) : (

              <>
                <View style={v_d81136.row}>
                  <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.price')}</Text>
                  <Text style={v_d81136.value}>
                    {v_89f939(v_1c86a8, 'KRW')} / {v_06e3b4(v_318e8b)} XRUN
                  </Text>
                </View>

                <View style={v_d81136.row}>
                  <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.fee')}</Text>
                  <Text style={v_d81136.value}>
                    {v_89f939(v_63e5c7, 'KRW')} / {v_06e3b4(v_cd7bfc)} XRUN
                  </Text>
                </View>

                <View style={v_d81136.divider} />

                <View style={v_d81136.row}>
                  <Text style={[v_d81136.label, v_d81136.totalLabel]}>{v_8d41d7('screens.shopBuy.total')}</Text>
                  <Text style={[v_d81136.value, v_d81136.totalValue]}>
                    {v_06e3b4(v_284b46)} XRUN
                  </Text>
                </View>

                <View style={v_d81136.balanceInfo}>
                  <View style={v_d81136.row}>
                    <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.myBalance')}</Text>
                    <Text
                      style={[
                        v_d81136.value,
                        v_1ee1c8 ? v_d81136.insufficientBalance : v_d81136.sufficientBalance,
                      ]}
                    >
                      {v_8dbb06 ? (
                        v_8d41d7('screens.shopBuy.checking')
                      ) : v_bc3e72 !== null ? (
                        v_06e3b4(v_bc3e72) + ' XRUN'
                      ) : (
                        v_8d41d7('screens.shopBuy.checkFailed')
                      )}
                    </Text>
                  </View>
                  {v_1ee1c8 && (
                    <Text style={v_d81136.insufficientBalanceText}>
                      {v_8d41d7('screens.shopBuy.insufficientBalance')}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        <View style={v_d81136.actions}>
          <TouchableOpacity
            style={[v_d81136.button, v_d81136.cancelButton]}
            onPress={v_c7ac57}
            disabled={v_d4bdc8}
          >
            <Text style={v_d81136.cancelText}>{v_8d41d7('screens.shopBuy.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              v_d81136.button,
              v_d81136.primaryButton,
              (v_d4bdc8 || v_1ee1c8 || v_decd65) && v_d81136.disabledButton,
            ]}
            onPress={v_dfaad1}
            disabled={v_d4bdc8 || v_1ee1c8 || Boolean(v_decd65)}
          >
            {v_d4bdc8 ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : v_7712f3 ? (
              <Text style={v_d81136.primaryText}>Loading...</Text>
            ) : (
              <Text style={v_d81136.primaryText}>{v_8d41d7('screens.shopBuy.payment')}</Text>
            )}
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
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
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
    marginBottom: 6,
  },
  description: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  link: {
    fontSize: v_843035.size.medium,
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
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#78828a',
  },
  value: {
    fontSize: v_843035.size.medium,
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
    fontSize: v_843035.size.mmedium,
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
    fontSize: v_843035.size.small,
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
    backgroundColor: '#c1c1c1',
  },
  primaryButton: {
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelText: {
    color: '#666666',
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryText: {
    color: '#fff',
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },

  iapInfoContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  iapInfoText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#007aff',
    textAlign: 'center',
  },

  iapErrorContainer: {
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iapErrorIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  iapErrorText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#dc3545',
    flex: 1,
  },
  errorValue: {
    color: '#dc3545',
  },
});
