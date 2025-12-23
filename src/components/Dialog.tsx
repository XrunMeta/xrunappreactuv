import v_a3453e from 'bapkr';
import {
  v_aa7413,
  v_3094a2,
  v_19b633,
  v_4623af,
  v_472849,
  v_7e4944,
  v_961e77,
} from 'rcmrninabrnb';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_843035 } from '../constants';

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: v_7e4944;
  disabled?: boolean;
};

interface DialogProps {
  visible: boolean;
  title: string;
  children?: v_a3453e.ReactNode;
  actions?: DialogAction[];
  onClose?: () => void;
  containerStyle?: v_961e77<v_7e4944>;
}

export const Dialog: v_a3453e.FC<DialogProps> = ({
  visible: v_cf55be,
  title: v_9f1622,
  children: v_21f619,
  actions: v_dd943a = [],
  onClose: v_0890f8,
  containerStyle: v_4affe9,
}) => {
  return (
    <Modal transparent animationType="fade" visible={v_cf55be} onRequestClose={v_0890f8 || (() => {})}>
      <View style={v_d81136.overlay}>
        <View style={[v_d81136.card, v_4affe9]}>
          <View style={v_d81136.header}>
            {v_0890f8 ? (
              <>
                <View style={v_d81136.closePlaceholder} />
                <Text style={v_d81136.title}>{v_9f1622}</Text>
                <TouchableOpacity onPress={v_0890f8} hitSlop={v_f72698} style={v_d81136.close}>
                  <Ionicons name="close" size={18} color="#747474" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={v_d81136.title}>{v_9f1622}</Text>
            )}
          </View>

          <View style={v_d81136.divider} />

          <View style={v_d81136.body}>{v_21f619}</View>

          {v_dd943a.length > 0 ? (
            <View style={v_d81136.actions}>
              {v_dd943a.map((v_9b064f) => (
                <TouchableOpacity
                  key={v_9b064f.label}
                  style={[
                    v_d81136.actionButton,
                    v_9b064f.variant === 'primary' ? v_d81136.primaryButton : v_d81136.secondaryButton,
                    v_9b064f.disabled && v_d81136.disabledButton,
                    v_9b064f.style,
                  ]}
                  onPress={v_9b064f.disabled ? undefined : v_9b064f.onPress}
                  activeOpacity={v_9b064f.disabled ? 1 : 0.9}
                  disabled={v_9b064f.disabled}
                >
                  <Text
                    style={[
                      v_d81136.actionLabel,
                      v_9b064f.variant === 'primary' ? v_d81136.primaryLabel : v_d81136.secondaryLabel,
                      v_9b064f.disabled && v_d81136.disabledLabel,
                    ]}
                  >
                    {v_9b064f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
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
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  title: {
    flex: 1,
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: '#121212',
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
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
    paddingVertical: 12,
    minHeight: 60,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#DEDEDE',
  },
  primaryButton: {
    backgroundColor: '#FFDC04',
  },
  actionLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-SemiBold',
  },
  primaryLabel: {
    color: '#000000',
  },
  secondaryLabel: {
    color: '#000000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledLabel: {
    opacity: 0.7,
  },
});


