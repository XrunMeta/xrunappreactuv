import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요 엑스런 어플</Text>
      <Button title="Get Started" onPress={() => console.log('Pressed')} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

