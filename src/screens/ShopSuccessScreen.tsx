import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components';
import { useAppNavigation, ROUTES } from '../navigation';

const LOGO = require('../../assets/xrun-horizontal-logo.png');

export const ShopSuccessScreen = () => {
  const { goBack, navigate } = useAppNavigation();

  const handleConfirm = () => {
    goBack(); 
    goBack(); 
    navigate(ROUTES.shopMyTicket);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Shop" showBackButton={false} />
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.message}>결제가 완료되었습니다</Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  logo: {
    width: 88,
    height: 28,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
});

