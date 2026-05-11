import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_19b633, v_4623af, v_472849, v_cf9c33, v_326be8, v_e45a99 } from 'rcmrninabrnb';
import { v_e0068c } from 'vvfgtwbmdpbnvhtfbtbgudicfmpscw';
import { v_1bfbd0, v_843035 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_85f2c8, v_3ca33e } from '../services';

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
  const { width: v_06db8f } = v_e45a99();
  const v_033e14 = v_e0068c();
  const { navigate: v_9b57fc } = v_a0daa8();

  const [v_9e28f7, v_603c21] = v_5ab095(false);

  v_c4deb2(() => {
    const v_b7726a = async () => {
      try {
        if (v_326be8.OS === 'ios') {
          const v_5297fb = await v_85f2c8(v_9b57fc);
          v_603c21(v_5297fb);
        } else {
          const v_4e84ea = await v_3ca33e(v_9b57fc);
          v_603c21(v_4e84ea);
        }
      } catch (v_5e9bfe) {
        console.error('[BottomNavigationBar] 지갑 표시 상태 오류:', v_5e9bfe);
        v_603c21(false);
      }
    };
    v_b7726a();
    const v_ad1d65 = setInterval(v_b7726a, 30000);
    return () => clearInterval(v_ad1d65);
  }, [v_9b57fc]);

  let v_be97ff = null;
  try {
    v_be97ff = require('../../assets/images/icon_xrun_black.png');
  } catch (v_37eab7) {}
  const v_79cf3d = v_4622b9.map(v_8c0b26 => {
    if (v_8c0b26.id === 'wallet') {
      return {
        ...v_8c0b26,
        label: v_9e28f7 ? v_8c0b26.label : 'XRUN',
        icon: v_9e28f7 ? v_8c0b26.icon : v_be97ff,
      };
    }
    return v_8c0b26;
  });

  const v_8e442f = (v_6e55b1) => {
    if (v_6e55b1 === 'wallet') {
      if (v_9e28f7) {
        v_9b57fc(v_ce4741.wallet);
      } else {
        v_9b57fc(v_ce4741.xrunInfo);
      }
      return;
    }
    v_659a80?.(v_6e55b1);
  };

  const v_f4f953 = v_06db8f < 360 ? 92 : v_06db8f < 400 ? 98 : 104;

  const v_dabc6e = v_06db8f < 360 ? 4 : v_06db8f < 400 ? 6 : 4;

  const v_734fdc = Math.max(v_dabc6e, v_033e14.left);
  const v_ad18a8 = Math.max(v_dabc6e, v_033e14.right);

  const v_921fc1 = (v_389afb) => v_79cf3d.find((v_ebec57) => v_ebec57.id === v_389afb);

  const v_7ab0f6 = v_06db8f - v_734fdc - v_ad18a8;

  const v_fb4fea = v_326be8.OS === 'ios' ? 14 : 10;
  const v_3f7eb3 = v_f4f953 + v_fb4fea;
  const v_a1f81c = Math.max(40, (v_7ab0f6 - v_3f7eb3) / 4);

  const v_48897b = v_ac1d22 === 'Map'
    ? (v_4eff08 || v_f968cc)
    : (v_f968cc || v_4eff08);

  const v_ba3e9e = v_ac1d22 === 'Camera'
    ? (v_88efd0 || v_5c635f)
    : (v_5c635f || v_88efd0);

  const v_eebe9d = () => {
    return (
      <>
        {}
        <TouchableOpacity
          style={[
            v_d81136.centerButton,
            v_ac1d22 === 'Map' && v_d81136.centerButtonActive,
          ]}
          onPress={() => v_d52709?.('Map')}
          activeOpacity={0.7}>
          {v_48897b ? (
            <Image
              source={v_48897b}
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
          {v_ba3e9e ? (
            <Image
              source={v_ba3e9e}
              resizeMode="contain"
              style={v_d81136.centerIcon}
            />
          ) : (
            <View style={v_d81136.iconPlaceholder} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const v_9eb59f = (v_8c0b26) => {
    if (v_8c0b26.id === 'map' || v_8c0b26.id === 'camera') {
      return null;
    }

    const v_26dce6 = v_8ccd46 === v_8c0b26.id;
    const v_c1dd95 = v_8c0b26.icon;
    const v_2457bf = v_8c0b26.id === 'xplay';

    return (
      <TouchableOpacity
        style={[v_d81136.navItem, v_2457bf && v_d81136.navItemXplayNudge]}
        onPress={() => v_8e442f(v_8c0b26.id)}
        activeOpacity={0.7}>
        <View style={[v_d81136.iconContainer, v_2457bf && v_d81136.iconContainerXplayNudge]}>
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
          style={[
            v_d81136.label,
            v_26dce6 && v_d81136.labelActive,
            {
              fontSize: v_06db8f < 360 ? 11 : 13,
              ...(v_326be8.OS === 'android' ? { includeFontPadding: false } : {}),
            },
          ]}
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
        <View
          style={[
            v_d81136.content,
            {
              paddingLeft: v_734fdc,
              paddingRight: v_ad18a8,
            },
          ]}>
          <View style={v_d81136.navRowInner}>
            {(['xplay', 'shop'] as const).map((v_389afb) => {
              const v_8c0b26 = v_921fc1(v_389afb);
              return v_8c0b26 ? (
                <View key={v_389afb} style={[v_d81136.navColumn, { width: v_a1f81c }]}>
                  {v_9eb59f(v_8c0b26)}
                </View>
              ) : null;
            })}
            <View style={[v_d81136.navColumnCenter, { width: v_3f7eb3 }]}>
              <View style={[v_d81136.centerButtonContainer, { width: v_f4f953 }]}>
                {v_eebe9d()}
              </View>
            </View>
            {(['wallet', 'info'] as const).map((v_389afb) => {
              const v_8c0b26 = v_921fc1(v_389afb);
              return v_8c0b26 ? (
                <View key={v_389afb} style={[v_d81136.navColumn, { width: v_a1f81c }]}>
                  {v_9eb59f(v_8c0b26)}
                </View>
              ) : null;
            })}
          </View>
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
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 20,
    minHeight: 80,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  navRowInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    overflow: 'visible',
  },
  navColumn: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  navColumnCenter: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  navItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },

  navItemXplayNudge: {
    paddingVertical: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconContainerXplayNudge: {
    marginBottom: 3,
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
    fontSize: v_843035.size.small,
    fontWeight: '500',
    color: '#4C4E55',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
    letterSpacing: 0.06,
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
    alignSelf: 'center',
    flexShrink: 1,
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

