import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_cf9c33, v_39a996, v_6c4f62 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_570c34 } from '../components';
import { v_729608 } from '../components';
import { v_a61db3, v_843035, v_1bfbd0 } from '../constants';
import { v_25c73c } from '../services/giftishowBiz';
import type { v_d62ea7 } from '../services/giftishowBiz';
import type { v_a9b423 } from '../services/giftishowBiz';

export const v_f7bdb9 = () => {
  const { t: v_8d41d7 } = v_772971();
  const [v_fb2f0d, v_0f2e2b] = v_5ab095<v_d62ea7[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(false);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_5e9bfe, v_3a7d09] = v_5ab095<string | null>(null);

  const v_e1c77a = v_de06a3(async () => {
    v_3a7d09(null);
    try {
      const v_b09d89 = await v_25c73c().catch((v_9e86fd) => ({ list: [], resultMsg: v_9e86fd?.message } as v_a9b423));
      const v_d83fa2 = v_b09d89 as v_a9b423;
      v_0f2e2b(Array.isArray(v_d83fa2.list) ? v_d83fa2.list : []);

      if (!Array.isArray(v_d83fa2.list) || v_d83fa2.list.length === 0) {
        const v_badeaf = v_d83fa2.resultMsg;
        if (v_badeaf && String(v_badeaf).trim()) v_3a7d09(String(v_badeaf).trim());
      }
    } catch (v_9e86fd) {
      v_3a7d09(v_9e86fd instanceof Error ? v_9e86fd.message : '기프티쇼 비즈 연동 오류');
    }
  }, []);

  v_c4deb2(() => {
    v_34a50a(true);
    v_e1c77a().finally(() => v_34a50a(false));
  }, [v_e1c77a]);

  const v_d5345f = v_de06a3(() => {
    v_575aad(true);
    v_e1c77a().finally(() => v_575aad(false));
  }, [v_e1c77a]);

  return (
    <View style={v_d81136.container}>
      <Header title="XRUN" />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} colors={[v_1bfbd0.buttonPrimary]} />
        }
      >
        {}
        {

}

        {}
        {}

        {}
        {

}

        {}
        {

}

        {}
        <View style={v_d81136.giftishowSection}>
          <Text style={v_d81136.giftishowSectionTitle}>{v_8d41d7('screens.xrunInfo.giftishowTitle')}</Text>
          {v_683210 && !v_612e9f ? (
            <ActivityIndicator size="small" color={v_1bfbd0.buttonPrimary} style={v_d81136.giftishowLoader} />
          ) : (
            <>
              {v_5e9bfe ? <Text style={v_d81136.giftishowError}>{v_5e9bfe}</Text> : null}
              {v_fb2f0d.length > 0 ? (
                <View style={v_d81136.giftishowList}>
                  <Text style={v_d81136.giftishowListTitle}>{v_8d41d7('screens.xrunInfo.productsCoupons')}</Text>
                  {v_fb2f0d.slice(0, 20).map((v_8c0b26, v_ebec57) => (
                    <View key={v_8c0b26.id ?? `item-${v_ebec57}`} style={v_d81136.giftishowListItemRow}>
                      {v_8c0b26.imageUrl ? (
                        <Image source={{ uri: v_8c0b26.imageUrl }} style={v_d81136.giftishowListItemImg} resizeMode="cover" />
                      ) : (
                        <View style={[v_d81136.giftishowListItemImg, v_d81136.giftishowListItemImgPlaceholder]} />
                      )}
                      <View style={v_d81136.giftishowListItemBody}>
                        <Text style={v_d81136.giftishowListItemName} numberOfLines={2}>{v_8c0b26.name ?? v_8c0b26.id ?? '-'}</Text>
                        <Text style={v_d81136.giftishowListItemPrice}>
                          {v_8c0b26.price != null ? `${Number(v_8c0b26.price).toLocaleString()}원` : '-'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          )}
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
    flexGrow: 1,
    ...v_a61db3.scrollContent,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 113,
    height: 115,
  },
  title: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 24,
    color: '#121212',
    textAlign: 'left',
  },
  homepageLink: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  homepageLinkText: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  giftishowSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  giftishowSectionTitle: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 12,
  },
  giftishowLoader: {
    marginVertical: 12,
  },
  giftishowError: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#c62828',
    marginTop: 8,
  },
  giftishowList: {
    marginTop: 16,
  },
  giftishowListTitle: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 8,
  },
  giftishowListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  giftishowListItemImg: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  giftishowListItemImgPlaceholder: {
    backgroundColor: '#e0e0e0',
  },
  giftishowListItemBody: {
    flex: 1,
    marginLeft: 12,
  },
  giftishowListItemName: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
    marginBottom: 4,
  },
  giftishowListItemPrice: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
});

