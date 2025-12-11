import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMembersLevelInfo } from '../services';

interface LevelNotificationProps {
  navigation?: any;
}

export const LevelNotification: React.FC<LevelNotificationProps> = ({ navigation }) => {
  const [notifitext, setNotifitext] = useState<string | null>('Loading...');

  useEffect(() => {
    const loadUserLevelInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          console.log('[LevelNotification] userData가 없습니다. 레벨 정보 조회 건너뛰기');
          return;
        }

        const parsedUserData = JSON.parse(userData);
        const member = parsedUserData?.member;
        if (!member) {
          console.log('[LevelNotification] userData에 member가 없습니다. 레벨 정보 조회 건너뛰기');
          return;
        }

        console.log('[LevelNotification] 사용자 레벨 정보 조회 시작:', member);
        const response = await getMembersLevelInfo(Number(member), navigation);

        if (response && response.status === 'success' && response.data && response.data.lv !== undefined) {
          const level = response.data.lv;
          setNotifitext(`${level}Level`);
          console.log('[LevelNotification] 사용자 레벨 정보 업데이트 완료:', `${level}Level`);
        } else {
          console.warn('[LevelNotification] 레벨 정보 응답 형식이 올바르지 않습니다:', response);
        }
      } catch (error) {
        console.error('[LevelNotification] 사용자 레벨 정보 조회 실패:', error);

      }
    };

    loadUserLevelInfo();
  }, [navigation]); 

  if (!notifitext) {
    return null;
  }

  return (
    <View style={styles.notificationTextContainer}>
      <Text style={styles.notificationText}>{notifitext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationTextContainer: {
    position: 'absolute',
    top: 65,
    left: 10,
    right: 0,
    width: Dimensions.get('window').width / 4,
    height: 28,
    paddingVertical: 2,
    backgroundColor: 'rgb(255, 255, 255)',
    zIndex: 9999, 
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  notificationText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
