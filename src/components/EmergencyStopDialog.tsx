import v_a3453e from 'bapkr';
import {
  v_aa7413,
  v_3094a2,
  v_19b633,
  v_4623af,
  v_472849,
  v_f2c756,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_a0daa8 } from '../navigation';
import { v_ce4741 } from '../navigation';

interface EmergencyStopDialogProps {
  visible: boolean;
  message: string;
  link?: string;
  onClose?: () => void;
}

export const EmergencyStopDialog: v_a3453e.FC<EmergencyStopDialogProps> = ({
  visible: v_cf55be,
  message: v_a8cd21,
  link: v_8dbe00,
  onClose: v_0890f8,
}) => {
  const { navigate: v_9b57fc } = v_a0daa8();

  const v_4c3e84 = () => {
    if (!v_8dbe00) return;

    if (v_8dbe00.startsWith('http://') || v_8dbe00.startsWith('https://')) {
      v_f2c756.openURL(v_8dbe00).catch((v_49263d) => {
        console.error('Failed to open URL:', v_49263d);
      });
    } else {

      const v_4c3f81 = Object.keys(v_ce4741) as Array<keyof typeof v_ce4741>;
      const v_c7daf6 = v_4c3f81.find((v_b24339) => v_ce4741[v_b24339] === v_8dbe00);

      if (v_c7daf6) {
        v_9b57fc(v_ce4741[v_c7daf6]);
      } else {
        console.warn('Unknown route:', v_8dbe00);
      }
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={v_cf55be}
      onRequestClose={v_0890f8}
    >
      <View style={v_d81136.overlay}>
        <View style={v_d81136.card}>
          <View style={v_d81136.header}>
            <Text style={v_d81136.title}>긴급 안내</Text>
            {v_0890f8 ? (
              <TouchableOpacity
                onPress={v_0890f8}
                hitSlop={v_f72698}
                style={v_d81136.close}
              >
                <Ionicons name="close" size={18} color="#747474" />
              </TouchableOpacity>
            ) : (
              <View style={v_d81136.closePlaceholder} />
            )}
          </View>

          <View style={v_d81136.divider} />

          <View style={v_d81136.body}>
            <Text style={v_d81136.message}>{v_a8cd21}</Text>
            {v_8dbe00 && (
              <TouchableOpacity
                style={v_d81136.linkButton}
                onPress={v_4c3e84}
                activeOpacity={0.7}
              >
                <Text style={v_d81136.linkText}>자세히 보기</Text>
                <Ionicons name="chevron-forward" size={16} color="#4c4e55" />
              </TouchableOpacity>
            )}
          </View>

          {v_0890f8 && (
            <View style={v_d81136.actions}>
              <TouchableOpacity
                style={[v_d81136.actionButton, v_d81136.primaryButton]}
                onPress={v_0890f8}
                activeOpacity={0.9}
              >
                <Text style={[v_d81136.actionLabel, v_d81136.primaryLabel]}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const v_f72698 = { top: 8, bottom: 8, left: 8, right: 8 };

const v_d81136 = v_472849.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 25, 45, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 6.5,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
    width: 32,
    height: 32,
  },
  divider: {
    height: v_472849.hairlineWidth,
    backgroundColor: '#e4e4e4',
  },
  body: {
    paddingVertical: 20,
    minHeight: 100,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 24,
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#4c4e55',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFDC04',
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryLabel: {
    color: '#000000',
  },
});

