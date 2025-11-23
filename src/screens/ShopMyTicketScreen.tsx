import v_a3453e from 'bapkr';
import { v_3094a2, v_472849, v_122070, v_79c4f2 } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_729608, v_b34ce5, v_2cf4d9 } from '../components';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_745d71 } from '../types';

const MY_TICKETS: v_745d71[] = [
  {
    id: 'good-neighbors',
    title: '굿네이버스 후원하기',
    priceLabel: '2,000 KRW',
    detailPrice: '20,000 KRW / 200 XRUN',
    detailTotal: '1 개',
    image: require('../../assets/images/icon_shop.png'),
  },
  {
    id: 'polygon-ticket',
    title: 'Polygon 전송티켓',
    priceLabel: '2,000 KRW',
    detailPrice: '20,000 KRW / 200 XRUN',
    detailTotal: '2 개',
    image: require('../../assets/xrun-horizontal-logo.png'),
  },
];

export const v_052a8a = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { setSelectedShopItem: v_d0fbad } = v_700ef9();

  const v_c411e0 = (v_3b402b) => {
    if (v_3b402b === 'ticket') {
      v_9b57fc(v_ce4741.shopTicket);
    }
  };

  const v_6121dc = (item: v_745d71) => {
    v_d0fbad(v_8c0b26);
    v_9b57fc(v_ce4741.shopTicketDetail);
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Shop" />
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


          {v_550416.map((v_8c0b26) => (
            <ShopItemCard
              key={v_8c0b26.id}
              title={v_8c0b26.title}
              priceLabel={v_8c0b26.priceLabel}
              imageSource={v_8c0b26.image}
              quantityLabel={v_8c0b26.detailTotal}
              onPress={() => v_6121dc(v_8c0b26)}
            />
          ))}
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


