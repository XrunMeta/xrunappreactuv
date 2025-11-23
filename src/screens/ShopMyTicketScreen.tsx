import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Header, SegmentedControl, ShopItemCard } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ShopItem } from '../types';

const MY_TICKETS: ShopItem[] = [
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

export const ShopMyTicketScreen = () => {
  const { navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();

  const handleSegmentChange = (value: 'ticket' | 'myTicket') => {
    if (value === 'ticket') {
      navigate(ROUTES.shopTicket);
    }
  };

  const handleSelect = (item: ShopItem) => {
    setSelectedShopItem(item);
    navigate(ROUTES.shopTicketDetail);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Shop" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <SegmentedControl
            options={[
              { label: 'Ticket', value: 'ticket' },
              { label: 'My Ticket', value: 'myTicket' },
            ]}
            value="myTicket"
            onChange={handleSegmentChange}
            containerStyle={styles.segmented}
          />

          <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#bcbec4" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#bcbec4"
              style={styles.searchInput}
            />
          </View>


          {MY_TICKETS.map((item) => (
            <ShopItemCard
              key={item.id}
              title={item.title}
              priceLabel={item.priceLabel}
              imageSource={item.image}
              quantityLabel={item.detailTotal}
              onPress={() => handleSelect(item)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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


