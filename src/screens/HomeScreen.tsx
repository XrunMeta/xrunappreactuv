import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Button } from '../components';
import { FONTS } from '../constants';

export const HomeScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.home.title')}</Text>
      <Button title={t('screens.home.getStartedButton')} onPress={() => console.log('Pressed')} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: FONTS.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

