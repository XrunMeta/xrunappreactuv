import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_472849, v_700696 } from 'rcmrninabrnb';
import { v_1bfbd0 } from '../constants';

const { width: v_8e4fb6 } = v_700696.get('window');

interface BottomNavItem {
  id: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  activeItemId?: string;
  onItemPress?: (itemId: string) => void;
}

export const BottomNavigationBar: v_a3453e.FC<BottomNavigationBarProps> = ({
  items: v_4622b9,
  activeItemId: v_8ccd46,
  onItemPress: v_659a80,
}) => {

  const v_6d2a86 = () => {
    const v_2e3fba = v_8e4fb6 * 0.04; 
    const v_46d0e7 = 8;
    const v_382137 = 20;
    return Math.max(v_46d0e7, Math.min(v_382137, v_2e3fba));
  };

  const v_397b6d = v_6d2a86();

  const v_eebe9d = (v_8c0b26) => {
    if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {
      return (
        <TouchableOpacity
          key={v_8c0b26.id}
          style={[v_d81136.centerItemContainer, { paddingHorizontal: v_397b6d }]}
          onPress={() => v_659a80?.(v_8c0b26.id)}
          activeOpacity={0.7}
        >
          <View style={v_d81136.centerItemWrapper}>
            <View style={v_d81136.mapIconContainer}>
              <View style={v_d81136.mapIconCircle}>
                {}
                <View style={v_d81136.mapIcon} />
              </View>
            </View>
            <View style={v_d81136.cameraIconContainer}>
              <View style={v_d81136.cameraIconCircle}>
                {}
                <View style={v_d81136.cameraIcon} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const v_9eb59f = (v_8c0b26) => {
    if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {
      return null;
    }

    const v_26dce6 = v_8ccd46 === v_8c0b26.id;

    return (
      <TouchableOpacity
        key={v_8c0b26.id}
        style={[v_d81136.navItem, { paddingHorizontal: v_397b6d }]}
        onPress={() => v_659a80?.(v_8c0b26.id)}
        activeOpacity={0.7}
      >
        <View style={v_d81136.iconContainer}>
          {}
          <View style={[v_d81136.iconPlaceholder, v_26dce6 && v_d81136.iconPlaceholderActive]} />
        </View>
        <Text style={[v_d81136.label, v_26dce6 && v_d81136.labelActive]}>{v_8c0b26.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={v_d81136.container}>
      {}
      <View style={v_d81136.topSection} />
      {}
      <View style={v_d81136.bottomSection}>
        <View style={v_d81136.content}>
          {v_4622b9.map((v_8c0b26) => {
            if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {
              return v_eebe9d(v_8c0b26);
            }
            return v_9eb59f(v_8c0b26);
          })}
        </View>
      </View>
      {}
      <View style={v_d81136.homeIndicator}>
        <View style={v_d81136.homeIndicatorBar} />
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  topSection: {
    height: 32,
    backgroundColor: '#EFF4F5',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    minHeight: 104,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4C4E55',
  },
  iconPlaceholderActive: {
    borderColor: v_1bfbd0.buttonPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4C4E55',
    textAlign: 'center',
    letterSpacing: 0.06,
  },
  labelActive: {
    color: v_1bfbd0.buttonPrimary,
  },
  centerItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  centerItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconContainer: {
    marginRight: 4,
  },
  mapIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: v_1bfbd0.buttonSecondary, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  cameraIconContainer: {
    marginLeft: 4,
  },
  cameraIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#33395B', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  homeIndicator: {
    height: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
    backgroundColor: '#FFFFFF',
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: v_1bfbd0.headerText,
  },
});

