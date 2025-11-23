import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { Header } from '../components';
import { Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '../context';

export const ShopTicketDetailScreen = () => {
  const { selectedShopItem } = useAppContext();
  const ticketNumber = '1231258081';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(ticketNumber);
  };

  const handleShare = async () => {
    await Share.share({ message: `티켓 번호: ${ticketNumber}` });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Tiket Detail" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.qrWrapper}>
            <View style={styles.qrBorder}>
              <Feather name="grid" size={56} color="#343a5a" />
            </View>
          </View>

          <Text style={styles.itemTitle}>{selectedShopItem?.title ?? '티켓'}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tiket Number</Text>
            <Text style={styles.status}>Available</Text>
          </View>
          <View style={styles.ticketBox}>
            <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          </View>

          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleCopy}>
            <Text style={styles.primaryText}>Copy Tiket Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
            <Text style={styles.shareText}>Share QR</Text>
          </TouchableOpacity>
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
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#111',
    marginBottom: 12,
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
  qrWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrBorder: {
    width: 247,
    height: 247,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#111',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#3391d0',
  },
  ticketBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e6ed',
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  ticketNumber: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#707070',
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#343a5a',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  shareButton: {
    backgroundColor: '#ffdc04',
  },
  shareText: {
    color: '#1a2e35',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
});


