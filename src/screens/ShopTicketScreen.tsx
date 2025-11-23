import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ImageSourcePropType } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Header, SegmentedControl, ShopItemCard } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ShopItem } from '../types';

const TICKET_ITEMS: ShopItem[] = [
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

const MY_TICKETS = [
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

export const ShopTicketScreen = () => {
  const [tab, setTab] = useState<'ticket' | 'myTicket'>('ticket');
  const { navigate } = useAppNavigation();
  const { setSelectedShopItem } = useAppContext();

  const segmentedOptions = useMemo(
    () => [
      { label: 'Ticket', value: 'ticket' },
      { label: 'My Ticket', value: 'myTicket' },
    ] as const,
    [],
  );

  const handleTabChange = (value: typeof segmentedOptions[number]['value']) => {
    setTab(value);
    if (value === 'myTicket') {
      navigate(ROUTES.shopMyTicket);
    }
  };

  const handleSelectItem = (item: ShopItem) => {
    setSelectedShopItem(item);
    navigate(ROUTES.shopBuy);
  };

  const renderCard = (
    title: string,
    price: string,
    imageSource: ImageSourcePropType,
    options?: { quantityLabel?: string; shopItem?: ShopItem },
  ) => (
    <ShopItemCard
      key={title}
      title={title}
      priceLabel={price}
      imageSource={imageSource}
      quantityLabel={options?.quantityLabel}
      onPress={options?.shopItem ? () => handleSelectItem(options.shopItem!) : undefined}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Shop" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <SegmentedControl
          options={segmentedOptions}
          value={tab}
          onChange={handleTabChange}
          containerStyle={styles.segmented}
        />

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#bcbec4" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#bcbec4"
          />
        </View>

        {tab === 'ticket'
          ? TICKET_ITEMS.map((item) =>
              renderCard(item.title, item.priceLabel, item.image, { shopItem: item }),
            )
          : MY_TICKETS.map((item) =>
              renderCard(item.title, item.priceLabel, item.image, {
                quantityLabel: item.quantityLabel,
              }),
            )}
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


