import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation } from '../navigation';

export const MyInfoCloseMembershipScreen = () => {
  const { goBack } = useAppNavigation();
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleSubmit = () => {
    if (!password.trim()) {
      Alert.alert('비밀번호 입력', '회원 탈퇴를 위해 비밀번호를 입력해주세요.');
      return;
    }
    Alert.alert('신청 완료', '회원 탈퇴 요청이 접수되었습니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Close Membership" onBackPress={goBack} showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <FormField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            rightAccessory={
              <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
                <Feather name={secure ? 'eye-off' : 'eye'} size={20} color="#b3b6be" />
              </TouchableOpacity>
            }
          />
          <Text style={styles.helperText}>
            *For safe account management,{'\n'}you are receiving a password when you leave
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Confirm"
            fullWidth
            onPress={handleSubmit}
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
    backgroundColor: COLORS.background,
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
  helperText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 15,
    color: '#747474',
    fontFamily: 'Roboto-Regular',
  },
  bottomSection: {
    ...COMMON_STYLES.bottomSection,
  },
  primaryButton: {
    width: '100%',
  },
});


