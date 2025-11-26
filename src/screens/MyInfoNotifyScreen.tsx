import v_a3453e, { v_5ab095, v_c4deb2, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_19b633,
  v_472849,
  v_122070,
  v_cf9c33,
  v_4623af,
  v_79c4f2,
  v_f2c756,
  v_e767d1,
  v_326be8,
  v_39a996,
  v_6c4f62,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_729608 } from '../components';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';
import {
  v_ab08d0,
  v_26e528,
  v_1fc3f6,
  v_3e4cca,
} from '../services';
import { v_d9bc70, v_dbf3ef } from '../types';

const v_144b19 = require('../../assets/thumb_event.png');
const v_436552 = require('../../assets/chat-xrun.png');
const v_01b6c9 = require('../../assets/chat-user.png');

const v_e065e5 = (v_a86996): string => {
  try {
    const v_8dffde = new Date(v_a86996);
    const v_0eaaff = v_8dffde.getFullYear();
    const v_033a94 = String(v_8dffde.getMonth() + 1).padStart(2, '0');
    const v_087ffc = String(v_8dffde.getDate()).padStart(2, '0');
    return `${v_0eaaff}. ${v_033a94}. ${v_087ffc}`;
  } catch {
    return v_a86996;
  }
};

const v_9f6fdd = (v_a86996): string => {
  try {
    const v_8dffde = new Date(v_a86996);
    const v_033a94 = String(v_8dffde.getMonth() + 1).padStart(2, '0');
    const v_087ffc = String(v_8dffde.getDate()).padStart(2, '0');
    const v_12ebc1 = String(v_8dffde.getHours()).padStart(2, '0');
    const v_ef3543 = String(v_8dffde.getMinutes()).padStart(2, '0');
    return `${v_033a94}-${v_087ffc} | ${v_12ebc1}:${v_ef3543}`;
  } catch {
    return v_a86996;
  }
};

const v_23be95 = (notifications: v_d9bc70[]) => {
  const grouped: { [key: string]: v_d9bc70[] } = {};

  v_b9c00c.forEach((v_b9faeb) => {
    const v_76f3cc = v_e065e5(v_b9faeb.datetime);
    if (!v_4d79ca[v_76f3cc]) {
      v_4d79ca[v_76f3cc] = [];
    }
    v_4d79ca[v_76f3cc].push(v_b9faeb);
  });

  Object.keys(v_4d79ca).forEach((v_76f3cc) => {
    v_4d79ca[v_76f3cc].sort((v_779914, v_148ff6) => {
      return new Date(v_779914.datetime).getTime() - new Date(v_148ff6.datetime).getTime();
    });
  });

  return v_4d79ca;
};

export const v_386af2 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_180423, v_8f2787] = v_5ab095('');
  const [v_b9c00c, v_0965ee] = v_5ab095<v_d9bc70[]>([]);
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_612e9f, v_575aad] = v_5ab095(false);
  const [v_5e23ec, v_10837f] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);

  v_c4deb2(() => {
    const v_0e1f49 = async () => {
      try {
        const v_f24fd5 = await v_e84827.getItem('userData');
        if (v_f24fd5) {
          const v_ef7306 = JSON.parse(v_f24fd5);
          if (v_ef7306.member) {
            v_9d6aeb(v_ef7306.member);
          }
        }
      } catch (v_5e9bfe) {
        console.error('[알림] 사용자 정보 로드 실패:', v_5e9bfe);
      }
    };
    v_0e1f49();
  }, []);

  const v_496106 = v_de06a3(async () => {
    if (!v_717992) return;

    try {
      v_34a50a(true);
      const v_3393e3 = await v_ab08d0(v_717992, 0, v_9b57fc);

      if (v_3393e3 && v_3393e3.data) {
        v_0965ee(v_3393e3.data);
      }
    } catch (v_5e9bfe) {
      console.error('[알림] 알림 목록 조회 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.error'), v_8d41d7('screens.myInfoNotify.alerts.loadFailed'));
    } finally {
      v_34a50a(false);
      v_575aad(false);
    }
  }, [v_717992, v_9b57fc, v_8d41d7]);

  v_c4deb2(() => {
    if (v_717992) {
      v_496106();
    }
  }, [v_717992, v_496106]);

  const v_d5345f = v_de06a3(() => {
    v_575aad(true);
    v_496106();
  }, [v_496106]);

  const v_465869 = async () => {
    if (!v_180423.trim()) {
      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.messageInput'), v_8d41d7('screens.myInfoNotify.alerts.messageRequired'));
      return;
    }

    if (!v_717992) {
      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.error'), v_8d41d7('screens.myInfoNotify.alerts.userDataNotFound'));
      return;
    }

    try {
      v_10837f(true);
      await v_26e528(v_717992, v_180423.trim(), false, v_9b57fc);
      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.sendSuccess'), v_8d41d7('screens.myInfoNotify.alerts.sendSuccessMessage'));
      v_8f2787('');

      await v_496106();
    } catch (v_5e9bfe) {
      console.error('[알림] 메시지 전송 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.error'), v_8d41d7('screens.myInfoNotify.alerts.sendFailed'));
    } finally {
      v_10837f(false);
    }
  };

  const v_57fac2 = async (v_10046b) => {
    if (!v_717992) return;

    await v_889fad(
      v_8d41d7('screens.myInfoNotify.alerts.deleteConfirm'),
      v_8d41d7('screens.myInfoNotify.alerts.deleteMessage'),
      [
        { text: v_8d41d7('screens.myInfoNotify.alerts.cancel'), style: 'cancel' },
        {
          text: v_8d41d7('screens.myInfoNotify.alerts.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await v_1fc3f6(v_717992, v_10046b, false, v_9b57fc);

              await v_496106();
            } catch (v_5e9bfe) {
              console.error('[알림] 메시지 삭제 실패:', v_5e9bfe);
              await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.error'), v_8d41d7('screens.myInfoNotify.alerts.deleteFailed'));
            }
          },
        },
      ],
    );
  };

  const v_30a30f = async () => {
    if (!v_717992) return;

    await v_889fad(
      v_8d41d7('screens.myInfoNotify.alerts.deleteAllConfirm'),
      v_8d41d7('screens.myInfoNotify.alerts.deleteAllMessage'),
      [
        { text: v_8d41d7('screens.myInfoNotify.alerts.cancel'), style: 'cancel' },
        {
          text: v_8d41d7('screens.myInfoNotify.alerts.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await v_3e4cca(v_717992, v_9b57fc);

              await v_496106();
            } catch (v_5e9bfe) {
              console.error('[알림] 전체 삭제 실패:', v_5e9bfe);
              await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.error'), v_8d41d7('screens.myInfoNotify.alerts.deleteAllFailed'));
            }
          },
        },
      ],
    );
  };

  const v_0a2feb = async (v_f71b56) => {
    if (!v_f71b56) return;

    if (v_f71b56.startsWith('http://') || v_f71b56.startsWith('https://')) {
      v_f2c756.openURL(v_f71b56).catch(async () => {
        await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.linkError'), v_8d41d7('screens.myInfoNotify.alerts.linkErrorMessage'));
      });
    } else {

      console.log('[알림] 앱 내부 라우트:', v_f71b56);
    }
  };

  const v_8172ec = (notification: v_d9bc70, v_a56041) => {
    const v_7b6eb8 = v_b9faeb.type === 9303;
    const v_fc7457 = v_b9faeb.type === 9302;
    const v_d37866 = v_b9faeb.type === 9301;

    const v_ee89db = v_b9faeb.image
      ? `data:image/jpeg;base64,${v_b9faeb.image}`
      : null;

    if (v_7b6eb8) {

      return (
        <View key={`notification-${v_b9faeb.board}-${v_a56041}`} style={v_d81136.replyWrapper}>
          <View style={v_d81136.replyRow}>
            <TouchableOpacity
              style={v_d81136.replyBubble}
              onLongPress={() => v_57fac2(v_b9faeb.board)}
              activeOpacity={0.8}
            >
              <Text style={v_d81136.replyText}>{v_b9faeb.title}</Text>
            </TouchableOpacity>
            <Image source={v_01b6c9} style={v_d81136.userAvatar} />
          </View>
          <Text style={v_d81136.replyTimestamp}>{v_9f6fdd(v_b9faeb.datetime)}</Text>
        </View>
      );
    }

    return (
      <View key={`notification-${v_b9faeb.board}-${v_a56041}`} style={v_d81136.messageWrapper}>
        <Image source={v_436552} style={v_d81136.avatar} />
        <View style={v_d81136.messageCard}>
          {v_ee89db && (
            <Image source={{ uri: v_ee89db }} style={v_d81136.heroImage} resizeMode="cover" />
          )}
          <Text style={v_d81136.badge}>{v_b9faeb.title}</Text>
          {}
          {v_b9faeb.contents !== null && v_b9faeb.type !== 9303 && (
            <View>
              <Text 
                style={v_d81136.description}
                numberOfLines={v_d37866 ? 3 : undefined}
                ellipsizeMode="tail"
              >
                {v_b9faeb.contents}
              </Text>
              {v_fc7457 && v_b9faeb.datebegin && v_b9faeb.dateends && (
                <Text style={v_d81136.eventDate}>
                  {v_e065e5(v_b9faeb.datebegin)} ~ {v_e065e5(v_b9faeb.dateends)}
                </Text>
              )}
              {}
              {}
              {v_d37866 && (
                  <TouchableOpacity
                  style={[v_d81136.ctaButton, v_d81136.ctaButtonWithMargin]}
                  onPress={async () => {
                    const v_f71b56 = `https://oth-path-51a04e.example.invalid/oth-path?id=${v_b9faeb.board}`;
                    v_f2c756.openURL(v_f71b56).catch(async () => {
                      await v_889fad(v_8d41d7('screens.myInfoNotify.alerts.linkError'), v_8d41d7('screens.myInfoNotify.alerts.linkErrorMessage'));
                    });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={v_d81136.ctaText}>{v_8d41d7('screens.myInfoNotify.viewDetails')}</Text>
                </TouchableOpacity>
              )}
              {}
              {v_fc7457 && v_b9faeb.guid !== '' && v_b9faeb.guid !== null && (
                <TouchableOpacity
                  style={v_d81136.ctaButton}
                  onPress={() => v_0a2feb(v_b9faeb.guid)}
                  activeOpacity={0.85}
                >
                  <Text style={v_d81136.ctaText}>{v_8d41d7('screens.myInfoNotify.goToEvent')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <Text style={v_d81136.timestamp}>{v_9f6fdd(v_b9faeb.datetime)}</Text>
      </View>
    );
  };

  const v_718f6b = () => {
    const v_4d79ca = v_23be95(v_b9c00c);
    const v_00b42c = Object.keys(v_4d79ca).sort((v_779914, v_148ff6) => {

      const v_65b903 = new Date(v_779914.replace(/\. /g, '-').replace(/\./g, ''));
      const v_9803ee = new Date(v_148ff6.replace(/\. /g, '-').replace(/\./g, ''));
      return v_65b903.getTime() - v_9803ee.getTime();
    });

    return v_00b42c.map((v_8dffde, v_d6c7a8) => (
      <View key={`date-${v_8dffde}`}>
        <View style={v_d81136.dateChip}>
          <Text style={v_d81136.dateChipText}>{v_8dffde}</Text>
        </View>
        {v_4d79ca[v_8dffde].map((v_b9faeb, v_a56041) => v_8172ec(v_b9faeb, v_a56041))}
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView
      style={v_d81136.flex}
      behavior={v_326be8.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={v_326be8.OS === 'ios' ? 0 : 0}
    >
      <View style={v_d81136.container}>
        <StatusBar style="dark" />
        <Header
          title={v_8d41d7('screens.myInfoNotify.title')}
          onBackPress={v_c7ac57}
          showBackButton
          rightComponent={
            v_b9c00c.length > 0 ? (
              <TouchableOpacity
                onPress={v_30a30f}
                activeOpacity={0.7}
                style={v_d81136.deleteAllButton}
              >
                <Text style={v_d81136.deleteAllText}>{v_8d41d7('screens.myInfoNotify.deleteAll')}</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
        {v_683210 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
          </View>
        ) : (
          <ScrollView
            style={v_d81136.list}
            contentContainerStyle={v_d81136.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={v_612e9f} onRefresh={v_d5345f} />
            }
          >
            {v_b9c00c.length === 0 ? (
              <View style={v_d81136.emptyContainer}>
                <Text style={v_d81136.emptyText}>{v_8d41d7('screens.myInfoNotify.emptyMessage')}</Text>
              </View>
            ) : (
              v_718f6b()
            )}
          </ScrollView>
        )}

        <View style={v_d81136.inputBar}>
          <View style={v_d81136.inputWrapper}>
            <TextInput
              style={v_d81136.input}
              placeholder={v_8d41d7('screens.myInfoNotify.placeholder')}
              placeholderTextColor="#7d7e83"
              value={v_180423}
              onChangeText={v_8f2787}
              editable={!v_5e23ec}
            />
          </View>
          <TouchableOpacity
            style={[v_d81136.sendButton, v_5e23ec && v_d81136.sendButtonDisabled]}
            onPress={v_465869}
            activeOpacity={0.8}
            disabled={v_5e23ec}
          >
            {v_5e23ec ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={v_d81136.sendButtonText}>{v_8d41d7('screens.myInfoNotify.sendButton')}</Text>
            )}
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
    paddingBottom: 0,
    gap: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
  },
  messageWrapper: {
    position: 'relative',
    paddingLeft: 34,
    marginBottom: 16,
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
  eventDate: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#7d7e83',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonWithMargin: {
    marginTop: 12,
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
    marginBottom: 12,
  },
  dateChipText: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  replyWrapper: {
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 16,
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
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#2a2727',
    minHeight: 24,
    maxHeight: 24,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    backgroundColor: '#33395b',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  deleteAllButton: {
    paddingRight: 16,
  },
  deleteAllText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#ff3b30',
  },
});

