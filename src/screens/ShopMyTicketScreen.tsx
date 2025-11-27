import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_79c4f2, v_39a996, v_19b633 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608, v_b34ce5, v_2cf4d9, v_c2fdd1 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_745d71 } from '../types';
import { v_97ad19 } from '../services';
import { v_029bad } from '../types';
import { v_858bfa } from '../utils/imageCache';
import { v_1bfbd0 } from '../constants';

const v_c59b9f = (item: v_029bad, v_a56041, v_8d41d7): v_745d71 => {

  const v_c322f7 = require('../../assets/images/icon_shop.png');

  const v_63f02c = v_8c0b26.status === 10306 ? v_8d41d7('screens.shopMyTicket.available') : v_8d41d7('screens.shopMyTicket.used');

  const v_080197 = v_8c0b26.storage ? String(v_8c0b26.storage) : null;
  const v_2deff5 = v_8c0b26.txID ? String(v_8c0b26.txID) : null;
  const v_3b701b = String(v_8c0b26.item);

  const v_6c35f6 = v_080197 
    ? `storage_${v_080197}_idx_${v_a56041}` 
    : v_2deff5 
    ? `txID_${v_2deff5}_item_${v_3b701b}_idx_${v_a56041}` 
    : `item_${v_3b701b}_idx_${v_a56041}`;

  return {

    ...v_8c0b26,

    id: v_6c35f6,
    title: v_8c0b26.title || '',
    priceLabel: '', 
    detailTotal: v_63f02c,
    image: v_c322f7,
  } as v_745d71 & v_029bad;
};

export const v_052a8a = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { setSelectedShopItem: v_d0fbad } = v_700ef9();
  const [v_2aaa7b, v_769e54] = v_5ab095<v_745d71[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_717992, v_9d6aeb] = v_5ab095<string | null>(null);
  const [v_f9a2c9, v_01b387] = v_5ab095<Record<string, string>>({}); 
  const [v_be52bc, v_0e7cbf] = v_5ab095<{
    visible: boolean;
    title: string;
    description: string;
  }>({
    visible: false,
    title: '',
    description: '',
  });

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
        console.error('[상점] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_27d3b9 = v_de06a3(async (items: v_029bad[]) => {
    const v_e49fc7 = {};

    for (const v_8c0b26 of v_4622b9) {

      const v_373157 = v_8c0b26.icon || v_8c0b26.image;

      if (v_373157 && (typeof v_373157 === 'number' || (typeof v_373157 === 'string' && !v_373157.startsWith('http')))) {
        const v_bb51e2 = String(v_373157);
        const v_28895b = `${v_8c0b26.item}_${v_8c0b26.txID || 'no-tx'}`;

        console.log(`[상점] 구매 아이템 파일 ID로 이미지 로드 시도: ${v_bb51e2}`);

        try {

          const v_415a10 = await v_858bfa.getCachedImage(v_bb51e2);
          if (v_415a10) {
            console.log(`[상점] ✅ 구매 아이템 이미지 ${v_bb51e2}가 캐시에서 발견됨`);
            v_e49fc7[v_28895b] = v_415a10;
          } else {
            console.log(`[상점] ❌ 구매 아이템 이미지 ${v_bb51e2}가 캐시에 없음, 다운로드 시도...`);

            const v_65903b = await v_858bfa.downloadAndCacheImage(
              v_bb51e2,
            );

            if (v_65903b) {
              const v_132a3d = await v_858bfa.getCachedImage(v_bb51e2);
              if (v_132a3d) {
                console.log(`[상점] ✅ 구매 아이템 이미지 ${v_bb51e2}가 다운로드 후 성공적으로 가져옴`);
                v_e49fc7[v_28895b] = v_132a3d;
              }
            }
          }
        } catch (v_5e9bfe) {
          console.error(`[상점] ❌ 구매 아이템 ${v_8c0b26.item}의 이미지 로드 오류:`, v_5e9bfe);
        }
      }
    }

    v_01b387(v_e49fc7);
  }, [v_9b57fc]);

  const v_3a0ab0 = v_de06a3(async () => {
    if (!v_717992) return;

    try {
      v_34a50a(true);
      console.log('[상점] 구매한 아이템 가져오기 시작');
      const v_43c42e = await v_97ad19(v_717992, v_9b57fc);

      if (v_43c42e && v_43c42e.status === 'success' && v_43c42e.data) {
        console.log('[상점] 구매 아이템 API 응답 성공, 받은 아이템 수:', v_43c42e.data.length);

        const v_1b7132 = v_43c42e.data.map((v_8c0b26, v_a56041) => v_c59b9f(v_8c0b26, v_a56041, v_8d41d7));

        v_769e54(v_1b7132);
        console.log('[상점] 변환된 구매 아이템 수:', v_1b7132.length);

        await v_27d3b9(v_43c42e.data);
      } else {
        console.log('[상점] 구매 아이템 가져오기 실패:', v_43c42e);
        v_769e54([]);
      }
    } catch (v_5e9bfe) {
      console.error('[상점] 구매 아이템 가져오기 오류:', v_5e9bfe);
      v_769e54([]);
    } finally {
      v_34a50a(false);
    }
  }, [v_717992, v_9b57fc, v_27d3b9]);

  v_c4deb2(() => {
    if (v_717992) {
      v_3a0ab0();
    }
  }, [v_717992, v_3a0ab0]);

  const v_c411e0 = (v_3b402b) => {
    if (v_3b402b === 'ticket') {
      v_9b57fc(v_ce4741.shopTicket);
    }
  };

  const v_21c862 = (item: v_745d71): boolean => {
    const v_6e55b1 = (v_8c0b26 as any)?.item;
    const v_9f1622 = v_8c0b26.title || '';

    return v_6e55b1 === 1 || 
      v_9f1622.includes('전송권') || 
      v_9f1622.includes('Transfer ticket') ||
      v_9f1622.toLowerCase().includes('transfer');
  };

  const v_6121dc = (item: v_745d71) => {

    if (v_21c862(v_8c0b26)) {

      const v_6856a9 = (v_8c0b26 as any)?.description || '';
      v_0e7cbf({
        visible: true,
        title: v_8c0b26.title || v_8d41d7('screens.shopMyTicket.transferTicket'),
        description: v_6856a9 || v_8d41d7('screens.shopMyTicket.transferTicketDescription'),
      });
    } else {

      v_d0fbad(v_8c0b26);
      v_9b57fc(v_ce4741.shopTicketDetail);
    }
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.shop.title')} />
      {v_683210 ? (
        <View style={v_d81136.loadingContainer}>
          <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={v_d81136.wrapper}>
            <SegmentedControl
              options={[
                { label: 'Ticket', value: 'ticket' },
                { label: 'My Ticket', value: 'myTicket' },
              ]}
              value="myTicket"
              onChange={v_c411e0}
              containerStyle={v_d81136.segmented}
            />

            <View style={v_d81136.searchBar}>
              <Feather name="search" size={18} color="#bcbec4" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#bcbec4"
                style={v_d81136.searchInput}
              />
            </View>

            {v_2aaa7b.length > 0 ? (
              v_2aaa7b.map((v_8c0b26) => {

                const v_28895b = `${(v_8c0b26 as any).item}_${(v_8c0b26 as any).txID || 'no-tx'}`;
                const v_63070e = v_f9a2c9[v_28895b];
                const v_c322f7 = v_63070e
                  ? { uri: `data:image/png;base64,${v_63070e}` }
                  : v_8c0b26.image;

                const v_60f39b = (v_8c0b26 as any).status;
                const v_ca637d = v_60f39b === 10306 ? '#3391D0' : '#707070';

                return (
                  <ShopItemCard
                    key={v_8c0b26.id}
                    title={v_8c0b26.title}
                    priceLabel={v_8c0b26.priceLabel}
                    imageSource={v_c322f7}
                    quantityLabel={v_8c0b26.detailTotal}
                    quantityColor={v_ca637d}
                    onPress={() => v_6121dc(v_8c0b26)}
                  />
                );
              })
            ) : (
              <View style={v_d81136.emptyContainer}>
                <Text style={v_d81136.emptyText}>{v_8d41d7('screens.shopMyTicket.noPurchasedItems')}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {}
      <Dialog
        visible={v_be52bc.visible}
        title={v_be52bc.title}
        onClose={() => v_0e7cbf({ ...v_be52bc, visible: false })}
        actions={[
          {
            label: v_8d41d7('screens.shopMyTicket.confirm'),
            onPress: () => v_0e7cbf({ ...v_be52bc, visible: false }),
            variant: 'primary',
          },
        ]}>
        <Text style={v_d81136.dialogText}>{v_be52bc.description}</Text>
      </Dialog>
    </View>
  );
};

const v_d81136 = v_472849.create({
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
