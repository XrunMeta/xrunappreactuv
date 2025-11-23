import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation } from '../navigation';

export const MyInfoReferralScreen = () => {
  const { goBack } = useAppNavigation();
  const [email, setEmail] = useState('');

  const handleConfirm = () => {
    if (!email.trim()) {
      Alert.alert('이메일 입력', '새 레퍼럴 이메일을 입력해주세요.');
      return;
    }
    Alert.alert('신청 완료', '레퍼럴 변경 요청이 전송되었습니다.');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="레퍼럴 수정" onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.sectionLabel}>현재 레퍼럴</Text>
          <View style={styles.card}>
            <Text style={styles.cardName}>WWWWWW</Text>
            <Text style={styles.cardEmail}>w****w@ww.www</Text>
          </View>

          <FormField
            label="새 레퍼럴 이메일"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="새 레퍼럴 이메일을 입력해주세요."
          />
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Confirm"
            fullWidth
            onPress={handleConfirm}
            style={styles.primaryButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#2a2727',
    marginBottom: 12,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 32,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardName: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#33395b',
    marginBottom: 6,
  },
  cardEmail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#bababa',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});


