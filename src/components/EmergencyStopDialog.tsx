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
import { v_772971 } from 'jmpfvteuuztnp';
import { v_a0daa8 } from '../navigation';
import { v_ce4741 } from '../navigation';
import { v_843035 } from '../constants';
import { v_5401ae } from '../testIDs';

interface EmergencyStopDialogProps {
  visible: boolean;
  message: string;
  link?: string;
  onClose?: () => void;

  linkButtonText?: string;
}

export const EmergencyStopDialog: v_a3453e.FC<EmergencyStopDialogProps> = ({
  visible: v_cf55be,
  message: v_a8cd21,
  link: v_8dbe00,
  onClose: v_0890f8,
  linkButtonText: v_1038af,
}) => {
  const { t: v_8d41d7 } = v_772971();
  const { navigate: v_9b57fc } = v_a0daa8();
  const v_8d1ab0 = v_1038af ?? v_8d41d7('common.emergencyStop.viewDetails');

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
      visible={v_cf55be}
      animationType="slide"
      onRequestClose={() => { }} 
      presentationStyle="fullScreen"
    >
      <View style={v_d81136.container}>
        <View style={v_d81136.header}>
          <Text style={v_d81136.title}>{v_8d41d7('common.emergencyStop.title')}</Text>
        </View>

        <View style={v_d81136.divider} />

        <View style={v_d81136.body}>
          <View style={v_d81136.iconContainer}>
            <Ionicons name="warning" size={64} color="#FF6B6B" />
          </View>
          <Text style={v_d81136.message}>{v_a8cd21}</Text>
          {v_8dbe00 && (
            <TouchableOpacity testID={v_5401ae.emergencyStopDialog.link}
              style={v_d81136.linkButton}
              onPress={v_4c3e84}
              activeOpacity={0.7}
            >
              <Text style={v_d81136.linkText}>{v_8d1ab0}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4c4e55" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
  },
  divider: {
    height: v_472849.hairlineWidth,
    backgroundColor: '#e4e4e4',
    marginBottom: 32,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginBottom: 32,
  },
  message: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  linkText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#4c4e55',
  },
});

