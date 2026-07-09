

import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_aa7413, v_4623af, v_122070 } from 'rcmrninabrnb';
import { v_25515d, v_dec439 } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_1bfbd0, v_843035 } from '../constants';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export const AppleEmailGuideModal: v_a3453e.FC<Props> = ({ visible: v_cf55be, onDismiss: v_1b97a8 }) => {
  const { t: v_8d41d7 } = v_772971();

  const v_7f2e65 = async () => {
    await v_e84827.setItem('appleEmailGuideShown', 'true');
    v_1b97a8();
  };

  const v_eb271c = [
    { icon: 'settings-outline' as const, lib: 'ionicons', label: '설정 앱' },
    { icon: 'person-circle-outline' as const, lib: 'ionicons', label: 'Apple 계정' },
    { icon: 'logo-apple' as const, lib: 'ionicons', label: 'Apple로 로그인' },
    { icon: 'star' as const, lib: 'feather', label: 'XRUN', highlight: true },
  ];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={v_cf55be}
      onRequestClose={v_7f2e65}
    >
      <View style={v_d81136.overlay}>
        <View style={v_d81136.card}>
          <TouchableOpacity style={v_d81136.closeIcon} onPress={v_7f2e65}>
            <Feather name="x" size={22} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={v_d81136.title}>
            {v_8d41d7('screens.myInfo.appleEmailGuide.title') || '가상 이메일 확인 방법'}
          </Text>
          <Text style={v_d81136.subtitle}>
            {v_8d41d7('screens.myInfo.appleEmailGuide.subtitle')
              || 'Apple 로그인 시 발급된 가상 이메일 (@privaterelay.appleid.com) 은 아래 경로에서 확인할 수 있어요.'}
          </Text>

          <ScrollView contentContainerStyle={v_d81136.stepsWrap} showsVerticalScrollIndicator={false}>
            {v_eb271c.map((v_729796, v_e86ad8) => (
              <React.Fragment key={v_e86ad8}>
                <View style={[v_d81136.stepBox, v_729796.highlight && v_d81136.stepBoxHighlight]}>
                  <View style={[v_d81136.stepIconWrap, v_729796.highlight && v_d81136.stepIconWrapHighlight]}>
                    {v_729796.lib === 'ionicons' ? (
                      <Ionicons name={v_729796.icon as any} size={22} color={v_729796.highlight ? '#fff' : '#374151'} />
                    ) : (
                      <Feather name={v_729796.icon as any} size={20} color={v_729796.highlight ? '#fff' : '#374151'} />
                    )}
                  </View>
                  <Text style={[v_d81136.stepLabel, v_729796.highlight && v_d81136.stepLabelHighlight]}>
                    {v_729796.label}
                  </Text>
                </View>
                {v_e86ad8 < v_eb271c.length - 1 && (
                  <View style={v_d81136.arrowWrap}>
                    <Feather name="chevron-down" size={20} color="#9ca3af" />
                  </View>
                )}
              </React.Fragment>
            ))}
          </ScrollView>

          <Text style={v_d81136.footNote}>
            {v_8d41d7('screens.myInfo.appleEmailGuide.footNote')
              || '해당 경로에서 XRUN 항목을 탭하면 발급된 이메일 주소를 볼 수 있습니다.'}
          </Text>

          <TouchableOpacity style={v_d81136.confirmButton} onPress={v_7f2e65}>
            <Text style={v_d81136.confirmText}>
              {v_8d41d7('screens.myInfo.appleEmailGuide.confirm') || '확인'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const v_d81136 = v_472849.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    maxHeight: '85%',
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  stepsWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 220,
  },
  stepBoxHighlight: {
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIconWrapHighlight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#1f2937',
  },
  stepLabelHighlight: {
    color: '#ffffff',
  },
  arrowWrap: {
    paddingVertical: 4,
  },
  footNote: {
    fontSize: v_843035.size.small,
    fontFamily: 'Roboto-Regular',
    color: '#6b7280',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  confirmButton: {
    backgroundColor: v_1bfbd0.buttonPrimary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
  },
});
