import v_a3453e from 'bapkr';
import {
  v_aa7413,
  v_3094a2,
  v_19b633,
  v_4623af,
  v_472849,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_843035, v_1bfbd0 } from '../constants';
import { v_4503ee } from '../services/versionCheck';

interface VersionUpdateDialogProps {
  visible: boolean;
  onClose?: () => void;
  latestVersion?: string;
  showLaterButton?: boolean; 
}

export const VersionUpdateDialog: v_a3453e.FC<VersionUpdateDialogProps> = ({
  visible: v_cf55be,
  onClose: v_0890f8,
  latestVersion: v_14feb2,
  showLaterButton: v_ff746b = true, 
}) => {
  const { t: v_8d41d7 } = v_772971();

  const v_02f61c = async () => {
    await v_4503ee();

  };

  const v_fbeebe = () => {
    if (v_0890f8) {
      v_0890f8();
    }
  };

  return (
    <Modal
      visible={v_cf55be}
      transparent
      animationType="fade"
      onRequestClose={v_ff746b ? v_fbeebe : undefined}
    >
      <View style={v_d81136.overlay}>
        <View style={v_d81136.container}>
          <View style={v_d81136.header}>
            <View style={v_d81136.iconContainer}>
              <Ionicons name="cloud-download-outline" size={48} color={v_1bfbd0.buttonPrimary} />
            </View>
            <Text style={v_d81136.title}>
              {v_8d41d7('common.versionUpdate.title')}
            </Text>
            {v_14feb2 && (
              <Text style={v_d81136.versionText}>
                {v_8d41d7('common.versionUpdate.latestVersion')}: {v_14feb2}
              </Text>
            )}
          </View>

          <View style={v_d81136.body}>
            <Text style={v_d81136.message}>
              {v_8d41d7('common.versionUpdate.message')}
            </Text>
          </View>

          <View style={v_d81136.actions}>
            {v_ff746b && (
              <TouchableOpacity
                style={[v_d81136.button, v_d81136.secondaryButton]}
                onPress={v_fbeebe}
                activeOpacity={0.7}
              >
                <Text style={[v_d81136.buttonText, v_d81136.secondaryButtonText]}>
                  {v_8d41d7('common.versionUpdate.later')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[v_d81136.button, v_d81136.primaryButton, !v_ff746b && v_d81136.fullWidthButton]}
              onPress={v_02f61c}
              activeOpacity={0.7}
            >
              <Text style={[v_d81136.buttonText, v_d81136.primaryButtonText]}>
                {v_8d41d7('common.versionUpdate.update')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const v_d81136 = v_472849.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: v_843035.size.xlarge,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#747474',
    textAlign: 'center',
  },
  body: {
    marginBottom: 24,
  },
  message: {
    fontSize: v_843035.size.mmedium,
    fontFamily: 'Roboto-Regular',
    color: '#4c4e55',
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  secondaryButton: {
    backgroundColor: '#F8F8F8',
  },
  buttonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#4c4e55',
  },
});
