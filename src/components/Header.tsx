import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_472849, v_700696 } from 'rcmrninabrnb';
import { v_1bfbd0 } from '../constants';

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
  return (
    <View style={v_d81136.container}>
      <View style={v_d81136.content}>
        {v_9c4d53 && (
          <TouchableOpacity
            style={v_d81136.backButton}
            onPress={v_f442f6}
            activeOpacity={0.7}
          >
            <BackIcon />
          </TouchableOpacity>
        )}
        <Text style={v_d81136.title}>{v_9f1622}</Text>
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
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: v_1bfbd0.headerIconBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: v_1bfbd0.headerText,
    fontFamily: 'Roboto-Bold', 
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

