import v_a3453e, { v_5ab095 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_cf9c33,
  v_4623af,
  v_79c4f2,
  v_f2c756,
  v_03e392,
  v_e767d1,
  v_326be8,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';

const v_144b19 = require('../../assets/thumb_event.png');
const v_436552 = require('../../assets/chat-xrun.png');
const v_01b6c9 = require('../../assets/chat-user.png');

export const v_386af2 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const [v_180423, v_8f2787] = v_5ab095('');

  const v_465869 = () => {
    if (!v_180423.trim()) {
      v_03e392.alert('메시지 입력', '보낼 내용을 입력해주세요.');
      return;
    }
    v_03e392.alert('전송 완료', '문의가 전송되었습니다.');
    v_8f2787('');
  };

  const v_71b103 = () => {
    v_f2c756.openURL('https://xrun.run').catch(() => {
      v_03e392.alert('링크 오류', '현재 페이지를 열 수 없어요.');
    });
  };

  return (
    <KeyboardAvoidingView
      style={v_d81136.flex}
      behavior={v_326be8.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={v_326be8.OS === 'ios' ? 90 : 0}
    >
      <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="Notify" onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        style={v_d81136.list}
        contentContainerStyle={v_d81136.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.messageWrapper}>
          <Image source={v_436552} style={v_d81136.avatar} />
          <View style={v_d81136.messageCard}>
            <Image source={v_144b19} style={v_d81136.heroImage} />
            <Text style={v_d81136.badge}>CLUBX EVENT</Text>
            <Text style={v_d81136.description}>
              Play Beta version, explore and review, get 5000 XRUN
            </Text>
            <TouchableOpacity
              style={v_d81136.ctaButton}
              onPress={v_71b103}
              activeOpacity={0.85}
            >
              <Text style={v_d81136.ctaText}>Take Closer Look</Text>
            </TouchableOpacity>
          </View>
          <Text style={v_d81136.timestamp}>2024-09-27 | 02:16</Text>
        </View>

        <View style={v_d81136.dateChip}>
          <Text style={v_d81136.dateChipText}>2024. 09. 28</Text>
        </View>

        <View style={v_d81136.replyWrapper}>
          <View style={v_d81136.replyRow}>
            <View style={v_d81136.replyBubble}>
              <Text style={v_d81136.replyText}>CLUBX EVENT</Text>
            </View>
            <Image source={v_01b6c9} style={v_d81136.userAvatar} />
          </View>
          <Text style={v_d81136.replyTimestamp}>2024-09-28 | 02:20</Text>
        </View>
      </ScrollView>

        <View style={v_d81136.inputBar}>
          <View style={v_d81136.inputWrapper}>
            <TextInput
              style={v_d81136.input}
              placeholder="Type your question..."
              placeholderTextColor="#7d7e83"
              value={v_180423}
              onChangeText={v_8f2787}
            />
          </View>
          <TouchableOpacity style={v_d81136.sendButton} onPress={v_465869} activeOpacity={0.8}>
            <Text style={v_d81136.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const v_d81136 = v_472849.create({
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

