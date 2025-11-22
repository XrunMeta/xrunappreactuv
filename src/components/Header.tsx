import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_472849, v_700696 } from 'rcmrninabrnb';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';

const { width: v_8e4fb6 } = v_700696.get('window');

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

const v_238728 = () => (
  <View style={v_d81136.iconContainer}>
    <Text style={v_d81136.iconText}>‹</Text>
  </View>
);

export const Header: v_a3453e.FC<HeaderProps> = ({
  title: v_9f1622,
  onBackPress: v_f442f6,
  showBackButton: v_9c4d53 = true,
}) => {
  const { goBack: v_c7ac57, canGoBack: v_7e32fb } = v_a0daa8();
  const v_e2510f = v_9c4d53 && v_7e32fb;
  const v_648e0d = v_f442f6 ?? (v_7e32fb ? v_c7ac57 : undefined);

  const v_91b7e0 = () =>
    v_e2510f ? (
      <TouchableOpacity
        style={v_d81136.backButton}
        onPress={v_648e0d}
        activeOpacity={0.7}
        disabled={!v_648e0d}
      >
        <BackIcon />
      </TouchableOpacity>
    ) : (
      <View style={v_d81136.backButtonPlaceholder} />
    );

  return (
    <View style={v_d81136.container}>
      <View style={v_d81136.content}>
        {v_91b7e0()}
        <View style={v_d81136.titleWrapper} pointerEvents="none">
          <Text style={v_d81136.title}>{v_9f1622}</Text>
        </View>
        <View style={v_d81136.backButtonPlaceholder} />
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    height: 92,
    width: v_8e4fb6,
    paddingTop: 30,
    backgroundColor: v_1bfbd0.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.09,
    shadowRadius: 3,
    elevation: 3, 
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    height: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
    color: v_1bfbd0.headerText,
    fontWeight: '300',
    lineHeight: 24,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Bold', 
    textAlign: 'center',
  },
});

