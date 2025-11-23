import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';

const eventImage = require('../../assets/thumb_event.png');
const chatXrun = require('../../assets/chat-xrun.png');
const chatUser = require('../../assets/chat-user.png');

export const MyInfoNotifyScreen = () => {
  const { goBack } = useAppNavigation();
  const [question, setQuestion] = useState('');

  const handleSend = () => {
    if (!question.trim()) {
      Alert.alert('메시지 입력', '보낼 내용을 입력해주세요.');
      return;
    }
    Alert.alert('전송 완료', '문의가 전송되었습니다.');
    setQuestion('');
  };

  const openEventLink = () => {
    Linking.openURL('https://xrun.run').catch(() => {
      Alert.alert('링크 오류', '현재 페이지를 열 수 없어요.');
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Notify" onBackPress={goBack} showBackButton />
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messageWrapper}>
          <Image source={chatXrun} style={styles.avatar} />
          <View style={styles.messageCard}>
            <Image source={eventImage} style={styles.heroImage} />
            <Text style={styles.badge}>CLUBX EVENT</Text>
            <Text style={styles.description}>
              Play Beta version, explore and review, get 5000 XRUN
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={openEventLink}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Take Closer Look</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timestamp}>2024-09-27 | 02:16</Text>
        </View>

        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>2024. 09. 28</Text>
        </View>

        <View style={styles.replyWrapper}>
          <View style={styles.replyRow}>
            <View style={styles.replyBubble}>
              <Text style={styles.replyText}>CLUBX EVENT</Text>
            </View>
            <Image source={chatUser} style={styles.userAvatar} />
          </View>
          <Text style={styles.replyTimestamp}>2024-09-28 | 02:20</Text>
        </View>
      </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor="#7d7e83"
              value={question}
              onChangeText={setQuestion}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 24,
  },
  messageWrapper: {
    position: 'relative',
    paddingLeft: 34,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  heroImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  badge: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#000',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
  },
  ctaButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  timestamp: {
    marginTop: 8,
    fontSize: 10,
    color: '#7d7e83',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
  },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(51,57,91,0.1)',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  dateChipText: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  replyWrapper: {
    alignItems: 'flex-end',
    gap: 6,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  replyBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  replyText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  userAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignSelf: 'center',
  },
  replyTimestamp: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    paddingRight: 34,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#edeced',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#2a2727',
  },
  sendButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

