import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_19b633, v_4623af, v_f2c756, v_cf9c33, v_07a341, v_39a996 } from 'rcmrninabrnb';
import { v_570c34 } from '../components';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_20035e } from '../types';
import { v_54d016, v_9c9f1b } from '../services';
import { v_89f939, v_35c0e0 } from '../utils';
import { v_1bfbd0, v_a61db3 } from '../constants';

export const v_1a0a02 = () => {
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const { selectedShopItem: v_dfe883 } = v_700ef9();
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_bc3e72, v_a14a8c] = v_5ab095<number | null>(null);
  const [v_d4bdc8, v_72727b] = v_5ab095(false);
  const [v_8dbb06, v_a6df16] = v_5ab095(true);

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

        await v_889fad(v_8d41d7('screens.shopBuy.alerts.notification'), v_8d41d7('screens.shopBuy.alerts.inAppPurchaseComingSoon'));
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
            currentBalance: v_35c0e0(v_a5e3b7),
            requiredAmount: v_35c0e0(v_2c49ad),
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
      await v_889fad(
        v_8d41d7('screens.shopBuy.alerts.purchaseFailed'),
        v_5e9bfe.message || v_8d41d7('screens.shopBuy.alerts.purchaseFailedMessage'),
        [{ text: v_8d41d7('screens.shopBuy.confirm') }],
      );
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
  const v_6a3b90 = v_8c0b26.totalPrice?.gtkrPrice || v_284b46;

  const v_1ee1c8 = v_bc3e72 !== null && v_bc3e72 < v_284b46;

  return (
    <View style={v_d81136.container}>
      <Header title={v_8d41d7('screens.shop.title')} onBackPress={v_c7ac57} showBackButton />
      <SafeScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
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

              <View style={v_d81136.row}>
                <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.price')}</Text>
                <Text style={v_d81136.value}>{v_8d41d7('screens.shopBuy.inAppPurchaseComingSoon')}</Text>
              </View>
            ) : (

              <>
                <View style={v_d81136.row}>
                  <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.price')}</Text>
                  <Text style={v_d81136.value}>
                    {v_89f939(v_1c86a8, 'KRW')} / {v_35c0e0(v_318e8b)} XRUN
                  </Text>
                </View>

                <View style={v_d81136.row}>
                  <Text style={v_d81136.label}>{v_8d41d7('screens.shopBuy.fee')}</Text>
                  <Text style={v_d81136.value}>
                    {v_89f939(v_63e5c7, 'KRW')} / {v_35c0e0(v_cd7bfc)} XRUN
                  </Text>
                </View>

                <View style={v_d81136.divider} />

                <View style={v_d81136.row}>
                  <Text style={[v_d81136.label, v_d81136.totalLabel]}>{v_8d41d7('screens.shopBuy.total')}</Text>
                  <Text style={[v_d81136.value, v_d81136.totalValue]}>
                    {v_35c0e0(v_6a3b90)} XRUN
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
                        v_35c0e0(v_bc3e72) + ' XRUN'
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
              (v_d4bdc8 || v_1ee1c8) && v_d81136.disabledButton,
            ]}
            onPress={v_dfaad1}
            disabled={v_d4bdc8 || v_1ee1c8}
          >
            {v_d4bdc8 ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={v_d81136.primaryText}>{v_8d41d7('screens.shopBuy.payment')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  scrollContent: {
    ...v_a61db3.scrollContent,
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
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  link: {
    fontSize: 16,
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
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#78828a',
  },
  value: {
    fontSize: 16,
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
    fontSize: 18,
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
    fontSize: 12,
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
    backgroundColor: '#747474',
  },
  primaryButton: {
    backgroundColor: '#020406',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
});
