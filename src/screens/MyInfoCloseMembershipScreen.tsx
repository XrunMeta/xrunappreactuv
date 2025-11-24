import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, FormField, PrimaryButton } from '../components';
import { COLORS, COMMON_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { closeMembership } from '../services';

export const MyInfoCloseMembershipScreen = () => {
  const { goBack, navigate } = useAppNavigation();
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {

    if (!password.trim()) {
      Alert.alert('비밀번호 입력', '회원 탈퇴를 위해 비밀번호를 입력해주세요.');
      return;
    }

    Alert.alert(
      '회원 탈퇴',
      '정말 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const userDataStr = await AsyncStorage.getItem('userData');
              if (!userDataStr) {
                Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
                setIsSubmitting(false);
                return;
              }

              const userData = JSON.parse(userDataStr);
              const member = userData.member;

              if (!member) {
                Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
                setIsSubmitting(false);
                return;
              }

              const success = await closeMembership(
                member,
                password,
                '',
                0,
                navigate,
              );

              if (!success) {
                Alert.alert('탈퇴 실패', '회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
                setIsSubmitting(false);
                return;
              }

              navigate(ROUTES.myInfoCloseMembershipSuccess);
            } catch (error) {
              console.error('[회원 탈퇴] 탈퇴 처리 중 오류:', error);
              Alert.alert('오류', '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
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
            title={isSubmitting ? '처리 중...' : 'Confirm'}
            fullWidth
            onPress={handleSubmit}
            style={styles.primaryButton}
            disabled={isSubmitting}
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

