import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_472849, v_700696, v_cf9c33, v_326be8 } from 'rcmrninabrnb';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_85f2c8 } from '../services';

const { width: v_8e4fb6 } = v_700696.get('window');

let v_4eff08 = null;
let v_f968cc = null;
let v_88efd0 = null;
let v_5c635f = null;

try {
  v_4eff08 = require('../../assets/images/icon_map.png');
} catch (v_9e86fd) {
  console.warn('icon_map.png not found');
}

try {
  v_f968cc = require('../../assets/images/icon_map_white.png');
} catch (v_9e86fd) {
  console.warn('icon_map_white.png not found');
}

try {
  v_88efd0 = require('../../assets/images/icon_camera.png');
} catch (v_9e86fd) {
  console.warn('icon_camera.png not found');
}

try {
  v_5c635f = require('../../assets/images/icon_camera_white.png');
} catch (v_9e86fd) {
  console.warn('icon_camera_white.png not found');
}

interface BottomNavItem {
  id: string;
  label: string;
  icon?: any;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  activeItemId?: string;
  activeTab?: 'Map' | 'Camera';
  onItemPress?: (itemId: string) => void;
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const BottomNavigationBar: v_a3453e.FC<BottomNavigationBarProps> = ({
  items: v_4622b9,
  activeItemId: v_8ccd46,
  activeTab: v_ac1d22 = 'Map',
  onItemPress: v_659a80,
  onTabChange: v_d52709,
}) => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const [v_9e28f7, v_603c21] = v_5ab095(v_326be8.OS === 'android');

  v_c4deb2(() => {
    const v_54e447 = new AbortController();

    const v_da5e9c = async () => {
      if (v_326be8.OS === 'ios') {
        try {
          const v_5297fb = await v_85f2c8(v_9b57fc);
          v_603c21(v_5297fb);
        } catch (v_5e9bfe) {
          console.error('지갑 표시 상태 가져오기 오류:', v_5e9bfe);
          v_603c21(false);
        }
      } else {
        v_603c21(true); 
      }
    };

    v_da5e9c();

    return () => {
      v_54e447.abort();
    };
  }, [v_9b57fc]);

  const v_79cf3d = v_4622b9.map(v_8c0b26 => {
    if (v_8c0b26.id === 'wallet') {

      let v_be97ff = null;
      try {
        v_be97ff = require('../../assets/images/icon_xrun_black.png');
      } catch (v_9e86fd) {
        console.warn('icon_xrun_black.png not found');
      }

      return {
        ...v_8c0b26,
        label: v_9e28f7 
          ? v_8c0b26.label 
          : 'XRUN',
        icon: v_9e28f7
          ? v_8c0b26.icon
          : v_be97ff,
      };
    }
    return v_8c0b26;
  });

  const v_8e442f = (v_6e55b1) => {
    if (v_6e55b1 === 'wallet') {
      if (v_326be8.OS === 'android') {
        v_9b57fc(v_ce4741.wallet);
      } else if (v_326be8.OS === 'ios' && v_9e28f7) {
        v_9b57fc(v_ce4741.wallet);
      } else {

        v_9b57fc(v_ce4741.xrunInfo);
      }
      return;
    }

    v_659a80?.(v_6e55b1);
  };

  const v_6d2a86 = () => {
    const v_2e3fba = v_8e4fb6 * 0.04; 
    const v_46d0e7 = 8;
    const v_382137 = 20;
    return Math.max(v_46d0e7, Math.min(v_382137, v_2e3fba));
  };

  const v_397b6d = v_6d2a86();

  const v_eebe9d = () => {

    return (
      <View
        style={v_d81136.centerButtonContainer}>
        {}
        <TouchableOpacity
          style={[
            v_d81136.centerButton,
            v_ac1d22 === 'Map' && v_d81136.centerButtonActive,
          ]}
          onPress={() => v_d52709?.('Map')}
          activeOpacity={0.7}>
          {v_4eff08 && v_f968cc ? (
            <Image
              source={v_ac1d22 === 'Map' ? v_4eff08 : v_f968cc}
              resizeMode="contain"
              style={v_d81136.centerIcon}
            />
          ) : (
            <View style={v_d81136.iconPlaceholder} />
          )}
        </TouchableOpacity>

        {}
        <TouchableOpacity
          style={[
            v_d81136.centerButton,
            v_ac1d22 === 'Camera' && v_d81136.centerButtonActive,
          ]}
          onPress={() => v_d52709?.('Camera')}
          activeOpacity={0.7}>
          {v_88efd0 && v_5c635f ? (
            <Image
              source={v_ac1d22 === 'Camera' ? v_88efd0 : v_5c635f}
              resizeMode="contain"
              style={v_d81136.centerIcon}
            />
          ) : (
            <View style={v_d81136.iconPlaceholder} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const v_9eb59f = (v_8c0b26) => {
    if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {
      return null;
    }

    const v_26dce6 = v_8ccd46 === v_8c0b26.id;

    const v_c1dd95 = v_8c0b26.icon;

    return (
      <TouchableOpacity
        key={v_8c0b26.id}
        style={v_d81136.navItem}
        onPress={() => v_8e442f(v_8c0b26.id)}
        activeOpacity={0.7}>
        <View style={v_d81136.iconContainer}>
          {v_c1dd95 ? (
            <Image
              source={v_c1dd95}
              resizeMode="contain"
              style={v_d81136.navIcon}
            />
          ) : (
            <View style={[v_d81136.iconPlaceholder, v_26dce6 && v_d81136.iconPlaceholderActive]} />
          )}
        </View>
        <Text 
          style={[v_d81136.label, v_26dce6 && v_d81136.labelActive]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {v_8c0b26.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={v_d81136.container}>
      {}
      <View style={v_d81136.bottomSection}>
        <View style={v_d81136.content}>
          {v_79cf3d.map((v_8c0b26, v_a56041) => {
            if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {

              return <React.Fragment key="center-buttons">{v_eebe9d()}</React.Fragment>;
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
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    minHeight: 104,
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
    paddingVertical: 5,
    flexShrink: 0,
    paddingHorizontal: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 20,
    height: 20,
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
    maxWidth: '100%',
    overflow: 'hidden',
  },
  labelActive: {
    color: v_1bfbd0.buttonPrimary,
  },
  centerButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#343a59',
    borderRadius: 50,
    height: 50,
    width: 100,
    marginHorizontal: -5,
    alignSelf: 'center',
    flexShrink: 0,
    ...v_326be8.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  centerButtonActive: {
    backgroundColor: '#ffdc04',
    borderRadius: 50,
  },
  centerIcon: {
    width: 20,
    height: 20,
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

