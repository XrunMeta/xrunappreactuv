import v_a3453e, { v_5ab095, v_df9f57 } from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_79c4f2, v_07a341 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_b34ce5, v_2cf4d9 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_745d71 } from '../types';

const TICKET_ITEMS: v_745d71[] = [
  {
    id: 'polygon-ticket',
    title: 'Polygon 전송티켓',
    priceLabel: '2,000 KRW',
    detailPrice: '20,000 KRW / 200 XRUN',
    detailFee: '1,000 KRW / 10 XRUN',
    detailTotal: '2,010 XRUN',
    image: require('../../assets/xrun-horizontal-logo.png'),
  },
  {
    id: 'good-neighbors',
    title: '굿네이버스 후원하기',
    priceLabel: '2,000 KRW',
    detailPrice: '20,000 KRW / 200 XRUN',
    detailFee: '1,000 KRW / 10 XRUN',
    detailTotal: '2,010 XRUN',
    image: require('../../assets/logo-goodNeighbors.png'),
  },
];

const v_550416 = [
  {
    id: 'my-donation',
    title: '굿네이버스 후원하기',
    priceLabel: '2,000 KRW',
    quantityLabel: '1 개',
    image: require('../../assets/images/icon_shop.png'),
  },
  {
    id: 'my-polygon',
    title: 'Polygon 전송티켓',
    priceLabel: '2,000 KRW',
    quantityLabel: '3 개',
    image: require('../../assets/xrun-horizontal-logo.png'),
  },
];

export const v_38326c = () => {
  const [v_11083e, v_94ee83] = v_5ab095<'ticket' | 'myTicket'>('ticket');
  const { navigate: v_9b57fc } = v_a0daa8();
  const { setSelectedShopItem: v_d0fbad } = v_700ef9();

  const v_1c4d31 = v_df9f57(
    () => [
      { label: 'Ticket', value: 'ticket' },
      { label: 'My Ticket', value: 'myTicket' },
    ] as const,
    [],
  );

  const v_42b5ed = (value: typeof v_1c4d31[number]['value']) => {
    v_94ee83(v_3b402b);
    if (v_3b402b === 'myTicket') {
      v_9b57fc(v_ce4741.shopMyTicket);
    }
  };

  const v_cac1cc = (item: v_745d71) => {
    v_d0fbad(v_8c0b26);
    v_9b57fc(v_ce4741.shopBuy);
  };

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
      onPress={v_b36f96?.shopItem ? () => v_cac1cc(v_b36f96.shopItem!) : undefined}
    />
  );

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Shop" />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.wrapper}>
          <SegmentedControl
          options={v_1c4d31}
          value={v_11083e}
          onChange={v_42b5ed}
          containerStyle={v_d81136.segmented}
        />

        <View style={v_d81136.searchBar}>
          <Feather name="search" size={18} color="#bcbec4" />
          <TextInput
            style={v_d81136.searchInput}
            placeholder="Search"
            placeholderTextColor="#bcbec4"
          />
        </View>

        {v_11083e === 'ticket'
          ? v_b2985a.map((v_8c0b26) =>
              v_719647(v_8c0b26.title, v_8c0b26.priceLabel, v_8c0b26.image, { shopItem: v_8c0b26 }),
            )
          : v_550416.map((v_8c0b26) =>
              v_719647(v_8c0b26.title, v_8c0b26.priceLabel, v_8c0b26.image, {
                quantityLabel: v_8c0b26.quantityLabel,
              }),
            )}
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
});


