import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, ShopItemCard } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';

export const ShopBuyScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const { selectedShopItem } = useAppContext();
  const item =
    selectedShopItem ??
    ({
      title: '굿네이버스 후원하기',
      priceLabel: '2,000 KRW',
      detailPrice: '20,000 KRW / 200 XRUN',
      detailFee: '1,000 KRW / 10 XRUN',
      detailTotal: '2,010 XRUN',
      image: require('../../assets/logo-goodNeighbors.png'),
    } as const);

  const openLink = () => {
    Linking.openURL('https://www.goodneighbors.kr/').catch(() => {});
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Shop" onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>

          <View style={styles.detailCard}>
            <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
            <Text style={styles.itemTitle}>Good Neighbors Donation</Text>
            <TouchableOpacity onPress={openLink}>
              <Text style={styles.link}>https:
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.value}>{item.detailPrice}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fee</Text>
              <Text style={styles.value}>{item.detailFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={[styles.label, styles.totalLabel]}>Total</Text>
              <Text style={[styles.value, styles.totalValue]}>{item.detailTotal}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={goBack}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigate(ROUTES.shopSuccess)}
            >
              <Text style={styles.primaryText}>Pay</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  itemCard: {
    marginBottom: 24,
  },
  detailCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e3e9ed',
    backgroundColor: '#fefefe',
    padding: 24,
    marginBottom: 32,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#111111',
    marginBottom: 6,
  },
  link: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#007aff',
    marginBottom: 30,
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
    marginBottom: 30,
  },
  totalLabel: {
    color: '#111111',
  },
  totalValue: {
    fontFamily: 'Roboto-Bold',
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
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
});

