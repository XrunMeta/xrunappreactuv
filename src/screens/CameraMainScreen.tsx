import v_a3453e, { v_c4deb2, v_5ab095, v_e662ae, v_de06a3, v_df9f57 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_700696,
  v_cf9c33,
  v_19b633,
  v_4623af,
  v_09d0e5,
  v_a2349e,
  v_cdbae1,
  v_6b5698,
  v_aa7413,
  v_326be8,
  v_f2c756,
  v_122070,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_78ceb7, v_d4f1cc } from 'mbgbsytfgyr';
import * as v_8a44cb from 'zryrlwvgokjhz';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_f4e704, v_66b9cc, v_c2fdd1, v_89c10a } from '../components';
import { v_843035 } from '../constants';
import { v_60c7c3, v_f71847 } from '../types';
import { v_f84ef5, v_5d7ca4, v_563153, v_a7ab3c, v_71d37e, v_07f367, v_1c4683, v_aa7dc1, v_318c45, v_38f5f4, v_8cba1e, v_e3e9a7, v_5e0191 } from '../services';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_287831 } from './ShowNapAdScreen';
import { v_540580 } from './ShowPockAdScreen';
import { v_cba33f } from '../utils';
import { v_f3de6d } from '../utils/napApiUtils';
import { v_2694e4 } from 'ahewcyoxtiosvtfuluxp';
import { v_25515d } from 'zvyjokvuouwvifyzks';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

const v_4ac6a7 = [
  { spotID: 1, x: 0, y: 0 },
  { spotID: 2, x: -100, y: 50 },
  { spotID: 3, x: 100, y: 50 },
  { spotID: 4, x: -50, y: 150 },
  { spotID: 5, x: 50, y: 150 },
];

const v_69ee00 = (v_3b402b, v_4f2c9c): number => {
  return v_3b402b + (Math.random() * (v_4f2c9c * 2) - v_4f2c9c);
};

interface TokenComponentProps {
  token: v_60c7c3;
  onPress: () => void;
  animationRefs: v_a3453e.MutableRefObject<Map<number, v_a3453e.MutableRefObject<v_a2349e.CompositeAnimation | null>>>;
  appState: string;
  rageProgress: number;
  isRageMode: boolean;
  rageColor: string;
  calculateScaleBasedOnDistance: (distance: number) => number;
  isCompleted?: boolean;
}

const TokenComponent: v_a3453e.FC<TokenComponentProps> = ({
  token: v_21cc31,
  onPress: v_719eed,
  animationRefs: v_5b4d76,
  appState: v_94a194,
  rageProgress: v_95eb72,
  isRageMode: v_a5ed76,
  rageColor: v_269c04,
  calculateScaleBasedOnDistance: v_c4aeea,
  isCompleted: v_2be890 = false,
}) => {
  const v_4da25a = v_e662ae(new v_a2349e.ValueXY({ x: 0, y: 0 })).current;
  const v_e28e12 = v_e662ae(new v_a2349e.Value(0)).current;
  const v_f2d721 = v_e662ae(new v_a2349e.Value(1)).current;
  const v_004f29 = v_e662ae<v_a2349e.CompositeAnimation | null>(null);
  const v_fd0a18 = v_e662ae(true);

  const v_926d1c = v_21cc31.distance || 0;
  const v_ec1ad7 = Math.max(40, Math.min(200, v_926d1c * 4 + 40));

  const v_fef1e8 = v_de06a3(() => {
    if (!v_fd0a18.current) {
      return;
    }

    if (v_004f29.current) {
      v_004f29.current.stop();
    }

    const v_62e721 = [
      v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
      v_cdbae1.bezier(0.42, 0, 0.58, 1),
      v_cdbae1.bezier(0.5, 0, 0.75, 0.9),
      v_cdbae1.bezier(0.15, 0.85, 0.85, 0.15),
      v_cdbae1.bezier(0.68, -0.55, 0.27, 1.55),
    ];

    const v_04d9bc = Math.random() * (3000 - 2000) + 2000;

    v_004f29.current = v_a2349e.sequence([
      v_a2349e.timing(v_4da25a, {
        toValue: {
          x: v_69ee00(v_4ac6a7[v_21cc31.spotID - 1]?.x || 0, 70),
          y: v_69ee00(v_4ac6a7[v_21cc31.spotID - 1]?.y || 0, 200),
        },
        duration: 300,
        easing: v_62e721[0],
        useNativeDriver: true,
      }),
      v_a2349e.delay(v_04d9bc),
    ]);

    v_004f29.current.start(() => {
      if (v_fd0a18.current) {
        v_fef1e8();
      }
    });
  }, [v_21cc31.spotID, v_4da25a]);

  const v_9305dc = v_de06a3(() => {
    if (!v_fd0a18.current) {
      return;
    }

    const v_1fec52 = Math.random() < 0.5 ? -1 : 1;
    const v_5163df = 400 * v_1fec52;
    const v_ec9ad9 = v_21cc31.spotID - 1;
    const v_c5ac8b = v_4ac6a7[v_ec9ad9] || v_4ac6a7[0];

    v_a2349e.parallel([
      v_a2349e.timing(v_4da25a, {
        toValue: {
          x: v_c5ac8b.x + v_5163df,
          y: v_c5ac8b.y - 200,
        },
        duration: 1,
        easing: v_cdbae1.circle,
        useNativeDriver: true,
      }),
      v_a2349e.timing(v_e28e12, {
        toValue: 1,
        duration: 200,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (v_fd0a18.current) {
        v_fef1e8();
        setTimeout(() => {
          if (v_fd0a18.current) {
            v_941ea0();
          }
        }, 300000); 
      }
    });
  }, [v_21cc31.spotID, v_4da25a, v_e28e12, v_fef1e8]);

  const v_941ea0 = v_de06a3(() => {
    if (!v_fd0a18.current) {
      return;
    }

    if (v_004f29.current) {
      v_004f29.current.stop();
    }

    const v_1fec52 = Math.random() < 0.5 ? -1 : 1;
    const v_5163df = 400 * v_1fec52;
    const v_ec9ad9 = v_21cc31.spotID - 1;
    const v_c5ac8b = v_4ac6a7[v_ec9ad9] || v_4ac6a7[0];

    v_a2349e.parallel([
      v_a2349e.timing(v_4da25a, {
        toValue: {
          x: v_c5ac8b.x + v_5163df,
          y: v_c5ac8b.y,
        },
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        if (v_fd0a18.current) {
          v_9305dc();
        }
      }, 100);
    });
  }, [v_21cc31.spotID, v_4da25a, v_9305dc]);

  v_c4deb2(() => {
    v_5b4d76.current.set(v_21cc31.spotID, v_004f29);
    return () => {
      v_5b4d76.current.delete(v_21cc31.spotID);
    };
  }, [v_21cc31.spotID, v_5b4d76]);

  v_c4deb2(() => {
    if (v_94a194 === 'active') {
      v_fd0a18.current = true;
      if (v_004f29.current) {
        v_fef1e8();
      }
    } else if (v_94a194.match(/inactive|background/)) {
      v_fd0a18.current = false;
      if (v_004f29.current) {
        v_004f29.current.stop();
      }
    }
  }, [v_94a194, v_fef1e8]);

  v_c4deb2(() => {
    v_4da25a.setValue({
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
    });

    const v_d620a9 = Math.max(100, 300 - v_95eb72 * 2);
    v_a2349e.loop(
      v_a2349e.sequence([
        v_a2349e.timing(v_f2d721, {
          toValue: v_a5ed76 ? 0.2 : 0,
          duration: v_d620a9,
          easing: v_cdbae1.linear,
          useNativeDriver: true,
        }),
        v_a2349e.timing(v_f2d721, {
          toValue: 1,
          duration: v_d620a9 * 0.8,
          easing: v_cdbae1.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    v_9305dc();
  }, [v_9305dc, v_4da25a, v_f2d721, v_95eb72, v_a5ed76]);

  const v_ec9ad9 = v_21cc31.spotID - 1;
  const v_c5ac8b = v_4ac6a7[v_ec9ad9] || v_4ac6a7[0];

  return (
    <Animated.View
      style={[
        v_d81136.tokenSpot,
        {
          opacity: v_e28e12,
          transform: [
            {
              translateX: v_4da25a.x.interpolate({
                inputRange: [-200, 200],
                outputRange: [-200, 200],
              }),
            },
            {
              translateY: v_4da25a.y.interpolate({
                inputRange: [-200, 200],
                outputRange: [-200, 200],
              }),
            },
          ],
        },
      ]}>
      {}
      <View
        style={{
          position: 'absolute',
          bottom: -v_ec1ad7 + 47,
          left: '50%',
          marginLeft: -0.5,
          width: 2,
          height: v_ec1ad7,
          backgroundColor: 'white',
          opacity: 0.8,
          zIndex: -1,
          pointerEvents: 'none', 
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -v_ec1ad7 + 47,
          left: '50%',
          marginLeft: -4,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'white',
          opacity: 0.9,
          zIndex: -1,
          pointerEvents: 'none', 
        }}
      />

      <TouchableOpacity
        onPress={v_719eed}
        disabled={false}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} 
        pressRetentionOffset={{ top: 20, bottom: 20, left: 20, right: 20 }} 
        style={[
          v_d81136.tokenButtonContainer,
          {
            transform: [
              { scale: v_c4aeea(v_926d1c) },
            ],
            opacity: 1, 
          },
        ]}
        activeOpacity={0.7}>
        <View
          style={[
            v_d81136.tokenButton,
            {
              backgroundColor: v_a5ed76 ? '#1E40AF' : '#161d2d',
              borderColor: '#E5E5E5',
              shadowColor: v_a5ed76 ? '#3B82F6' : '#FCD34D',
              shadowOpacity: v_a5ed76 ? 0.8 : 0.5,
              shadowRadius: v_a5ed76 ? 10 : 5,
              elevation: v_a5ed76 ? 15 : 8,
            },
          ]}>
          {}
            <View 
              pointerEvents="none" 
              style={{ 
                position: 'absolute', 
                width: 100, 
                height: 100, 
                top: v_a5ed76 ? -90 : -80,
                left: '50%',
                marginLeft: -50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.Image
                source={
                  v_a5ed76
                    ? require('../../assets/images/icon_catch_rage.png')
                    : require('../../assets/images/icon_catch.png')
                }
                style={[
                  v_d81136.blinkImage,
                  {
                    opacity: v_f2d721,
                  },
                  { position: 'relative', top: 0 }, 
                ]}
              />
            </View>
          {v_ed24ee && (
            <Image
              source={v_ed24ee}
              style={[
                v_d81136.tokenIcon,
                { marginTop: 3 },
                v_a5ed76 && { tintColor: v_269c04 },
              ]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={v_d81136.tokenPriceText}>
              {(() => {

                const v_6bbb57 = v_21cc31?.xrunPrice || 0;
                const v_123554 = parseFloat(String(v_6bbb57));

                return isNaN(v_123554) ? '0.00' : v_123554.toFixed(2);
              })()}
            </Text>
            <Text style={v_d81136.tokenDistanceText}>
              {v_21cc31?.distance ? parseFloat(String(v_21cc31.distance)).toFixed(1) + 'm' : '0.0m'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

let v_8daafe = null;
let v_e96568 = null;
let v_622956 = null;
let v_ee9562 = null;
let v_b636c9 = null;
let v_16772f = null;

try {
  v_8daafe = require('../../assets/images/icon_wallet.png');
} catch (v_9e86fd) {
  console.warn('icon_wallet.png not found');
}

try {
  v_e96568 = require('../../assets/images/icon_shop.png');
} catch (v_9e86fd) {
  console.warn('icon_shop.png not found');
}

try {
  v_622956 = require('../../assets/images/icon_xplay.png');
} catch (v_9e86fd) {
  console.warn('icon_xplay.png not found');
}

try {
  v_ee9562 = require('../../assets/images/icon_xrun_black.png');
} catch (v_9e86fd) {
  console.warn('icon_xrun_black.png not found');
}

try {
  v_b636c9 = require('../../assets/images/icon_user.png');
} catch (v_9e86fd) {
  console.warn('icon_user.png not found');
}

try {
  v_16772f = require('../../assets/images/locationpin2.png');
} catch (v_9e86fd) {
  console.warn('locationpin2.png not found');
}

let v_ed24ee = null;
let v_f0b2c0 = null;

try {
  v_ed24ee = require('../../assets/images/icon_xrun_white.png');
} catch (v_9e86fd) {
  console.warn('icon_xrun_white.png not found');
}

try {
  v_f0b2c0 = require('../../assets/images/icon_catch.png');
} catch (v_9e86fd) {
  console.warn('icon_catch.png not found');
}

let v_5dede3 = null;

try {
  v_5dede3 = require('../../assets/xrun-horizontal-logo.png');
  console.log('✅ [CameraMainScreen] 상단 로고 이미지 로드 성공');
} catch (v_9e86fd) {
  console.warn('❌ [CameraMainScreen] xrun-horizontal-logo.png not found:', v_9e86fd);
}

interface CameraMainScreenProps {
  activeTab?: 'Map' | 'Camera';
  onTabChange?: (tab: 'Map' | 'Camera') => void;
}

export const CameraMainScreen: v_a3453e.FC<CameraMainScreenProps> = ({
  activeTab: v_ac1d22 = 'Camera',
  onTabChange: v_d52709,
}) => {
  const { navigate: v_9b57fc, reset: v_487a25 } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const { advertisementParams: v_d0b6d4, setAdvertisementParams: v_d48a26 } = v_700ef9();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_d1a6bb, v_1e66f0] = v_d4f1cc();

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);
  const [v_04cb77, v_96a9ed] = v_5ab095<v_60c7c3 | null>(null);

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(20)).current;

  const [v_fa7c50, v_219124] = v_5ab095(false);

  const [v_3b0ada, v_bde9a1] = v_5ab095(false);
  const [v_b2dceb, v_e60eaf] = v_5ab095('');
  const [v_6ced96, v_cb400d] = v_5ab095('');
  const [v_fc9bd6, v_8aeec2] = v_5ab095(false);

  const v_62078f = v_e662ae<v_60c7c3 | null>(null);
  const v_63031f = v_e662ae<any>(null);

  const [v_ef86b6, v_8ce112] = v_5ab095<v_60c7c3[]>([]);
  const [v_b9ce93, v_7bb835] = v_5ab095<any[]>([]);
  const [v_f6025a, v_42ebfb] = v_5ab095<{ [key: string]: any }>({});
  const [v_683210, v_34a50a] = v_5ab095(true);
  const [v_1f3d99, v_7d7b3a] = v_5ab095(0);
  const [v_94a194, v_3fff8d] = v_5ab095(v_6b5698.currentState);

  v_c4deb2(() => {
    if (!v_fa7c50) {

      console.log('📱 [CameraMainScreen] 모달이 닫혔습니다. 포커스 확인 중...');
      console.log('📊 [CameraMainScreen] 현재 상태:', {
        showAdModal: v_fa7c50,
        activeTab: v_ac1d22,
        loading: v_683210,
        tokensCount: v_ef86b6?.length ?? 0,
        appState: v_94a194,
      });

      v_6a4dcd(false);
      v_96a9ed(null);

      const v_4b24d2 = v_326be8.OS === 'ios' ? 500 : 100;

      const v_3894d5 = setTimeout(() => {
        console.log('✅ [CameraMainScreen] 포커스 확인 완료');
        console.log('📊 [CameraMainScreen] AppState:', v_6b5698.currentState);

        if (v_326be8.OS === 'ios') {
          console.log('🔄 [CameraMainScreen] iOS 강제 복원 시작');

          v_7d7b3a(v_ba2215 => v_ba2215 + 1);

          const v_5b44a3 = v_6b5698.currentState;
          if (v_5b44a3 !== 'active') {
            console.log('⚠️ [CameraMainScreen] AppState가 active가 아닙니다:', v_5b44a3);
          }

        }
      }, v_4b24d2);

      return () => {
        clearTimeout(v_3894d5);
      };
    }
  }, [v_fa7c50, v_ac1d22, v_683210, v_ef86b6, v_94a194]);

  const v_a96760 = v_e662ae(0);
  const v_253a77 = 5;

  const [v_95eb72, v_6c06ae] = v_5ab095(0);
  const [v_a5ed76, v_27c4b9] = v_5ab095(false);
  const v_269c04 = '#60A5FA'; 

  const [v_def1ae, v_643c94] = v_5ab095(false);
  const [v_2610e9, v_12be53] = v_5ab095<'male' | 'female'>('male');
  const [v_10adc9, v_8d44be] = v_5ab095<'10' | '20' | '30' | '40' | '50+'>('10');
  const [v_46602a, v_2af968] = v_5ab095(false);
  const [v_717992, v_9d6aeb] = v_5ab095<number | null>(null);

  const v_055140 = v_de06a3(async () => {
    try {
      const v_b962da = await v_e84827.getItem('rageProgress');
      const v_cc322d = await v_e84827.getItem('rageProgressLastUpdate');

      if (v_b962da !== null && v_cc322d !== null) {
        const v_dcebe9 = Date.now();
        const v_dcebf0 = parseInt(v_cc322d);
        const v_63a778 = v_dcebe9 - v_dcebf0;
        const v_04df92 = 24 * 60 * 60 * 1000; 

        if (v_63a778 > v_04df92) {
          console.log('More than 1 day passed, resetting rage progress');
          await v_f01347();
        } else {
          const v_a63fde = parseFloat(v_b962da);
          v_6c06ae(v_a63fde);
          v_27c4b9(v_a63fde >= 100);
          console.log(
            `Loaded rage progress: ${v_a63fde}% (last updated: ${new Date(
              v_dcebf0,
            ).toLocaleString()})`,
          );
        }
      } else {

        await v_f01347();
      }
    } catch (v_5e9bfe) {
      console.log('Error loading rage progress:', v_5e9bfe);
      await v_f01347();
    }
  }, []);

  const v_b1a861 = v_de06a3(async (v_a63fde) => {
    try {
      const v_dcebe9 = Date.now();
      await v_e84827.setItem('rageProgress', v_a63fde.toString());
      await v_e84827.setItem(
        'rageProgressLastUpdate',
        v_dcebe9.toString(),
      );
      console.log(
        `Saved rage progress: ${v_a63fde}% at ${new Date(
          v_dcebe9,
        ).toLocaleString()}`,
      );
    } catch (v_5e9bfe) {
      console.log('Error saving rage progress:', v_5e9bfe);
    }
  }, []);

  const v_f01347 = v_de06a3(async () => {
    try {
      const v_dcebe9 = Date.now();
      await v_e84827.setItem('rageProgress', '0');
      await v_e84827.setItem(
        'rageProgressLastUpdate',
        v_dcebe9.toString(),
      );
      v_6c06ae(0);
      v_27c4b9(false);
      console.log('Rage progress reset to 0');
    } catch (v_5e9bfe) {
      console.log('Error resetting rage progress:', v_5e9bfe);
    }
  }, []);

  const v_60469b = v_de06a3(async () => {
    try {
      await v_e84827.removeItem('rageProgress');
      await v_e84827.removeItem('rageProgressLastUpdate');
      v_6c06ae(0);
      v_27c4b9(false);
      console.log('Rage progress cleared on logout');
    } catch (v_5e9bfe) {
      console.log('Error clearing rage progress on logout:', v_5e9bfe);
    }
  }, []);

  const v_e1f9f9 = v_de06a3(async () => {
    try {
      const v_f73be6 = await v_e84827.getItem('userData');

      if (v_f73be6) {
        await v_055140();
      } else {

        await v_60469b();
      }
    } catch (v_5e9bfe) {
      console.log('Error checking user login status:', v_5e9bfe);
      await v_f01347();
    }
  }, [v_055140, v_f01347, v_60469b]);

  const v_5df454 = v_de06a3(async (v_f95211) => {
    const v_b08d9b = Math.min(100, Math.max(0, v_95eb72 + v_f95211));
    v_6c06ae(v_b08d9b);

    await v_b1a861(v_b08d9b);

    v_27c4b9(v_b08d9b >= 100);

    console.log(
      `Rage progress updated: ${v_b08d9b}% (${Math.floor(
        v_b08d9b / 2,
      )}/50 ads)`,
    );
  }, [v_95eb72, v_b1a861]);

  const v_a24f8a = v_de06a3(() => {
    console.log('🔥 RAGE MODE ACTIVATED! Double rewards enabled!');
    v_27c4b9(true);
  }, []);

  const v_0cc3d2 = v_de06a3(() => {
    console.log('Rage mode deactivated');
    v_27c4b9(false);
  }, []);

  const v_5b4d76 = v_e662ae<Map<number, v_a3453e.MutableRefObject<v_a2349e.CompositeAnimation | null>>>(new Map());

  const v_0b2c53 = v_e662ae(false);
  const v_ba482c = v_e662ae(false);
  const v_7c7dd0 = v_e662ae<Set<string>>(new Set<string>());

  const v_d097fe = v_e662ae<Set<string>>(new Set<string>());

  const v_c9b9cb = v_de06a3(async () => {
    try {
      const v_e2a6a6 = await v_e84827.getItem('cached_AD');
      console.log('📂 [CameraMainScreen] AsyncStorage raw cached_AD:', v_e2a6a6 ? '데이터 있음' : '데이터 없음(null)');

      if (v_e2a6a6) {
        const v_8decf8 = JSON.parse(v_e2a6a6);
        v_42ebfb(v_8decf8);

        const v_fa53ec = Object.keys(v_8decf8);
        console.log(`💾 [CameraMainScreen] 캐시된 광고 데이터 로드 완료: ${v_fa53ec.length}개`);
        console.log('📦 [CameraMainScreen] 전체 캐시 데이터:', JSON.stringify(v_8decf8, null, 2));

        return v_8decf8;
      } else {
        console.warn('⚠️ [CameraMainScreen] cached_AD가 비어있습니다 (null). Map 화면에서 저장이 안 되었거나 초기화되었습니다.');
      }
      return {};
    } catch (v_9e86fd) {
      console.error('❌ [CameraMainScreen] 캐시 로드 실패:', v_9e86fd);
      return {};
    }
  }, []);

  const v_8911b6 = v_de06a3(async (v_aa0917, v_9390e8) => {
    try {
      const v_53db14 = await v_e84827.getItem('cached_AD');
      const v_a28e77 = v_53db14 ? JSON.parse(v_53db14) : {};

      const v_36aafd = {
        ...v_a28e77,
        [v_aa0917]: v_9390e8,
      };

      await v_e84827.setItem('cached_AD', JSON.stringify(v_36aafd));
      console.log(`💾 [CameraMainScreen][saveCachedAd] 캐시 저장 성공: key=${v_aa0917}, 현재 총 키 수=${Object.keys(v_36aafd).length}`);

      v_42ebfb(v_36aafd);
    } catch (v_9e86fd) {
      console.error('❌ [CameraMainScreen] 캐시 저장 실패:', v_9e86fd);
    }
  }, []);

  const v_181e3e = v_e662ae<NodeJS.Timeout | null>(null);
  const v_a27ed2 = v_e662ae<NodeJS.Timeout | null>(null); 
  const v_6890b1 = v_e662ae(false); 

  const v_ac9fa2 = v_e662ae(false);

  v_c4deb2(() => {
    const v_35c1b7 = async () => {

      if (v_ac9fa2.current) {
        return;
      }

      if (v_d1a6bb === null) {
        return;
      }

      if (v_d1a6bb.granted) {
        console.log('카메라 권한이 이미 허용되어 있습니다.');
        v_ac9fa2.current = true;
        return;
      }

      console.log('카메라 권한 요청 중...');
      v_ac9fa2.current = true;
      const v_43c42e = await v_1e66f0();
      console.log('카메라 권한 요청 결과:', v_43c42e);

      if (!v_43c42e.granted) {

        await v_889fad(
          '카메라 권한 필요',
          '카메라를 사용하려면 카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
      }
    };

    v_35c1b7();
  }, [v_d1a6bb, v_1e66f0, v_889fad]);

  const v_0a6f80 = v_de06a3((v_8ac288, v_60d099) => {

    const v_3b73a5 = v_60d099 || v_f6025a;

    const v_88aee2 = v_8ac288.map(v_d5dda0 => {

      if (v_d5dda0.urlAD && v_d5dda0.urlAD !== '') return v_d5dda0;

      const v_b24339 = String(v_d5dda0.campid || '');
      const v_e2a6a6 = v_3b73a5[v_b24339]; 
      if (v_e2a6a6 && v_e2a6a6.urlAD) {
        return {
          ...v_d5dda0,
          urlAD: v_e2a6a6.urlAD,
          landing_url: v_e2a6a6.urlAD, 
          joindesc: v_e2a6a6.joindesc || v_d5dda0.joindesc,
          name: v_e2a6a6.name || v_d5dda0.name,
          xrunPrice: v_e2a6a6.xrunPrice || v_d5dda0.xrunPrice,
        };
      }
      return v_d5dda0;
    });

    const v_6385ff = v_88aee2.length;
    const v_289b73 = v_88aee2.filter((v_d5dda0) => {
      const v_aa0917 = String(v_d5dda0.campid || '');
      if (v_aa0917 && v_aa0917 !== '' && v_aa0917 !== 'undefined' && v_7c7dd0.current) {
        const v_2be890 = v_7c7dd0.current.has(v_aa0917);
        if (v_2be890) {
          return false;
        }
      }
      return true;
    });

    const v_d5c47b = v_289b73.length;
    const v_fa543d = new Set<string>();
    let v_6b5543 = 0;
    const v_5ab64a = v_289b73.filter((v_d5dda0) => {
      const v_aa0917 = String(v_d5dda0.campid || '');
      if (!v_aa0917 || v_aa0917 === '' || v_aa0917 === 'undefined') {
        return true; 
      }

      if (v_fa543d.has(v_aa0917)) {
        v_6b5543++;
        return false;
      }

      v_fa543d.add(v_aa0917);
      return true;
    });

    const v_908496 = v_5ab64a;

    if (v_908496.length === 0) {
      v_8ce112([]);
      return;
    }

    let v_2e375c = [];

    const v_f64b05 = v_253a77; 

    if (v_908496.length === 0) {
      v_8ce112([]);
      return;
    }

    for (let v_ebec57 = 0; v_ebec57 < v_f64b05; v_ebec57++) {
      const v_a56041 = (v_a96760.current + v_ebec57) % v_908496.length;
      v_2e375c.push(v_908496[v_a56041]);
    }

    v_a96760.current = (v_a96760.current + v_f64b05) % v_908496.length;

    const v_368ba7 = v_2e375c.map((v_9390e8, v_a56041) => {
      return { ...v_4ac6a7[v_a56041 % v_4ac6a7.length], ...v_9390e8 };
    });

    console.log('==========토큰 렌더링==========');
    console.log('');

    v_368ba7.forEach((v_21cc31, v_a56041) => {
      const v_7ec08d = v_21cc31.urlAD || '';
      const v_9a0e80 = v_7ec08d.length > 60 ? v_7ec08d.substring(0, 60) + '...' : v_7ec08d;

      console.log(`[${v_a56041 + 1}] 광고 상세 정보:`);
      console.log(`  - campid: ${v_21cc31.campid || 'N/A'}`);
      console.log(`  - name: ${v_21cc31.name || 'N/A'}`);
      console.log(`  - ad_company: ${v_21cc31.ad_company || 'N/A'}`);
      console.log(`  - priority: ${v_21cc31.priority || 'N/A'}`);
      console.log(`  - coins: ${v_21cc31.coins || '0'}`);
      console.log(`  - xrunPrice: ${v_21cc31.xrunPrice || '0'}`);
      console.log(`  - urlAD: ${v_9a0e80 || '없음'}`);
      console.log(`  - iconurl: ${v_21cc31.iconurl || '없음'}`);
      if (v_a56041 < v_368ba7.length - 1) {
        console.log('');
      }
    });

    console.log('');
    console.log('========== [getTopAd5] 광고 목록 출력 완료 ==========');

    v_8ce112(v_368ba7);
  }, [v_253a77, v_f6025a]);

  const v_c4c061 = v_de06a3(async (v_9d6a91 = false) => {

    if (v_0b2c53.current && !v_9d6a91) {
      return;
    }

    try {
      v_34a50a(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', v_9d6a91 ? '(강제 새로고침)' : '');

      const [v_ef7306, v_37eab7] = await Promise.all([
        v_e84827.getItem('userData'),
        v_e1f9f9(),
      ]);

      if (!v_ef7306) {
        console.log('userData가 없습니다.');
        v_34a50a(false);
        return;
      }

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';
      if (!v_660822) {
        console.log('userData에 member가 없습니다.');
        v_34a50a(false);
        return;
      }

      let v_7dd198 = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };

      const v_aa081f = (async () => {
        try {
          const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
          if (v_d308b5 === 'granted') {

          const v_f3d3c8 = 'lastGpsLocationForMapMove';
          const v_eaa10e = 'lastGpsLocationTimestamp';
          const v_8d9416 = 60 * 1000; 
          const v_f41f0d = 500; 

          const v_b464ed = (v_34b365, v_a36282, v_ed3911, v_5d858d): number => {
            const v_bef3bf = 6371000; 
            const v_32a354 = (v_ed3911 - v_34b365) * Math.PI / 180;
            const v_84b828 = (v_5d858d - v_a36282) * Math.PI / 180;
            const v_779914 =
              Math.sin(v_32a354 / 2) * Math.sin(v_32a354 / 2) +
              Math.cos(v_34b365 * Math.PI / 180) * Math.cos(v_ed3911 * Math.PI / 180) *
              Math.sin(v_84b828 / 2) * Math.sin(v_84b828 / 2);
            const v_3f4e2e = 2 * Math.atan2(Math.sqrt(v_779914), Math.sqrt(1 - v_779914));
            return v_bef3bf * v_3f4e2e;
          };

          const v_c34468 = v_326be8.OS === 'ios' ? v_8a44cb.Accuracy.Low : v_8a44cb.Accuracy.High;
          const v_4a8217 = await v_8a44cb.getCurrentPositionAsync({
            accuracy: v_c34468,
          });

          const v_746c3b = {
            latitude: v_4a8217.coords.latitude,
            longitude: v_4a8217.coords.longitude,
          };

          let v_264a98 = v_746c3b;
          try {

            const v_05f29b = await v_e84827.getItem(v_f3d3c8);
            const v_45b2c8 = await v_e84827.getItem(v_eaa10e);

            if (v_05f29b && v_45b2c8) {
              const v_3a14d6 = JSON.parse(v_05f29b);
              const v_932c48 = parseInt(v_45b2c8, 10);
              const v_5c2f9f = Date.now();
              const v_e56026 = v_5c2f9f - v_932c48;

              if (v_e56026 < v_8d9416) {

                const v_926d1c = v_b464ed(
                  v_746c3b.latitude,
                  v_746c3b.longitude,
                  v_3a14d6.latitude,
                  v_3a14d6.longitude
                );

                if (v_926d1c < v_f41f0d) {
                  v_264a98 = v_3a14d6;
                  console.log(`📍 [AR 화면 위치 재사용] 마지막 위치 사용 (${Math.floor(v_e56026 / 1000)}초 전, ${v_926d1c.toFixed(0)}m)`);
                } else {
                  console.log(`📍 [AR 화면 위치 재사용] 거리 초과 (${v_926d1c.toFixed(0)}m > ${v_f41f0d}m), 새 위치 사용`);
                }
              } else {
                console.log(`📍 [AR 화면 위치 재사용] 시간 초과 (${Math.floor(v_e56026 / 1000)}초 > ${v_8d9416 / 1000}초), 새 위치 사용`);
              }
            } else {
              console.log('📍 [AR 화면 위치 재사용] 저장된 위치 없음, 새 위치 사용');
            }
          } catch (v_df17d5) {
            console.error('📍 [AR 화면 위치 재사용] AsyncStorage 확인 실패:', v_df17d5);
          }

            await v_e84827.setItem(v_f3d3c8, JSON.stringify(v_264a98));
            await v_e84827.setItem(v_eaa10e, Date.now().toString());

            return {
              coords: {
                latitude: v_264a98.latitude,
                longitude: v_264a98.longitude,
              },
            };
          } else {
            console.log('📍 [AR 화면] 위치 권한이 없습니다. AR 화면에서는 거리 정보가 필요 없으므로 계속 진행합니다.');
          }
        } catch (v_cd6da1) {
          console.warn('📍 [AR 화면] 위치 정보 가져오기 실패 (계속 진행):', v_cd6da1);
        }
        return null;
      })();

      const v_70197b = !v_9d6a91;
      let v_e36b07 = await v_563153(undefined, !v_70197b, true);

      if (!v_e36b07 || !Array.isArray(v_e36b07) || v_e36b07.length === 0) {
        console.warn('[CameraMainScreen] TopAd5 데이터 없음');
        v_34a50a(false);
        return;
      }

      const v_003147 = v_e36b07.map((v_ddcfed, v_a56041) => ({
        advertisement: v_ddcfed.advertisement || v_ddcfed.adid || v_ddcfed.ad || String(v_ddcfed.campid || ''),
        campid: v_ddcfed.campid || '',
        name: v_ddcfed.name || '',
        iconurl: v_ddcfed.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
        joindesc: v_ddcfed.joindesc || '',
        xrunPrice: v_ddcfed.xrunPrice || 0,
        xrunprice: v_ddcfed.xrunPrice || 0,
        distance: 0, 
        urlAD: v_ddcfed.urlAD || '',
        ad_company: v_ddcfed.ad_company || '',
        coins: v_ddcfed.coins || '0',
        thumbnail: v_ddcfed.thumbnail || '',
        brandlogo: v_ddcfed.brandlogo || '',
        adthumbnail2: v_ddcfed.adthumbnail2 || '',
        symbolimg: v_ddcfed.symbolimg || '',
      }));

      if (v_003147 && v_003147.length > 0) {

        const v_3d87ed = v_003147.map((v_51b584) => {

          const v_8ec93d = v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || v_51b584.coins || 0;

          return {
            ...v_51b584, 
            iconurl: v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
            joindesc: v_51b584.joindesc || '',
            name: v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
            xrunprice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || v_51b584.coins || '',
            xrunPrice: v_8ec93d, 
            campid: v_51b584.campid || v_51b584.campId || '',

            advertisement: v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',
          };
        });

        let v_905ecb = new Set<string>();
        try {

          const v_96f338 = v_7c7dd0.current ? new Set(v_7c7dd0.current) : new Set<string>();

          v_905ecb = await v_318c45(v_660822, v_9b57fc);
          console.log(`[CameraMainScreen] 완료된 광고 목록: ${v_905ecb.size}개`);

          const v_b63d4a = new Set<string>();
          v_96f338.forEach(v_aa0917 => v_b63d4a.add(v_aa0917));
          v_905ecb.forEach(v_aa0917 => v_b63d4a.add(v_aa0917));

          v_7c7dd0.current = v_b63d4a;
          console.log(`[CameraMainScreen] 완료된 광고 목록 병합: 기존 ${v_96f338.size}개 + 새로 ${v_905ecb.size}개 = 총 ${v_b63d4a.size}개`);
        } catch (v_5e9bfe) {
          console.warn('[CameraMainScreen] 완료된 광고 목록 조회 실패 (무시):', v_5e9bfe);

          if (!v_7c7dd0.current) {
            v_7c7dd0.current = new Set<string>();
          }
        }

        const v_3ce376 = v_3d87ed;

        try {

          let v_ed29b7 = {};
          try {
            const v_2a04ed = await v_e84827.getItem('cached_AD');
            console.warn('📂 [CameraMainScreen][Direct] raw cached_AD:', v_2a04ed ? '데이터 있음' : 'NULL');
            if (v_2a04ed) {
              v_ed29b7 = JSON.parse(v_2a04ed);
              console.warn('📦 [CameraMainScreen][Direct] 파싱된 캐시 키 수:', Object.keys(v_ed29b7).length);
            }
          } catch (v_49263d) {
            console.error('❌ [CameraMainScreen][Direct] 캐시 직접 로드 실패:', v_49263d);
          }

          console.log('[CameraMainScreen API] 1단계: TopAd5 데이터 확인 시작');
          const v_92ed2d = await v_5d7ca4();

          if (!v_e36b07 || !Array.isArray(v_e36b07) || v_e36b07.length === 0) {
            console.warn('[CameraMainScreen API] TopAd5 API 호출 실패 또는 빈 배열. 저장된 데이터 사용 시도 (오래되었어도)');
            const v_fe7102 = await v_5d7ca4();
            if (v_fe7102 && Array.isArray(v_fe7102) && v_fe7102.length > 0) {
              v_e36b07 = v_fe7102;
            }
          }

          if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {
            console.warn('🚦 [CameraMainScreen API] TopAd5 조건 충족. 로직 진입. 개수:', v_e36b07.length);
            console.log('✅ [CameraMainScreen API] TopAd5 데이터 발견:', v_e36b07.length, '개');

            if (v_e36b07.length > 0) {
              const v_0db320 = v_e36b07[0];
              console.log('[CameraMainScreen API] 첫 번째 광고 urlAD 확인:', {
                campid: v_0db320?.campid,
                ad_company: v_0db320?.ad_company,
                urlAD: v_0db320?.urlAD || '없음',
                urlAD_type: typeof v_0db320?.urlAD,
                urlAD_length: v_0db320?.urlAD?.length || 0,
                allKeys: Object.keys(v_0db320 || {}),
              });
            }

            if (v_e36b07.length === 0) {
              console.warn('[CameraMainScreen] TopAd5 데이터가 없습니다.');
              v_e36b07 = null;
            }
          }

          if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {

            for (const v_ddcfed of v_e36b07) {
              if (v_ddcfed.campid && v_ddcfed.urlAD) {
                const v_7ac310 = String(v_ddcfed.campid);

                const v_f8368d = {
                  urlAD: v_ddcfed.urlAD,
                  joindesc: v_ddcfed.joindesc || '',
                  name: v_ddcfed.name || '',
                  xrunPrice: v_ddcfed.xrunPrice || 0
                };
                await v_8911b6(v_7ac310, v_f8368d);
                console.log(`💾 [CameraMainScreen API] TopAd5 데이터 캐시 저장 완료: ${v_7ac310}`);
              }
            }

            try {
              const v_0afcb8 = await v_e84827.getItem('cached_AD');
              if (v_0afcb8) {
                const v_78fdd6 = JSON.parse(v_0afcb8);
                Object.assign(v_ed29b7, v_78fdd6); 
                console.warn('🔄 [CameraMainScreen][Direct] 캐시 갱신 완료. 키 수:', Object.keys(v_ed29b7).length);
              }
            } catch (v_9e86fd) {
              console.error('❌ [CameraMainScreen][Direct] 캐시 갱신 로드 실패:', v_9e86fd);
            }
            console.log('🔄 [CameraMainScreen API] TopAd5 저장 후 캐시 객체 업데이트 완료');

            console.log('🔍 [CameraMainScreen API] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
              item: v_e36b07[0],
              hasUrlAD: !!v_e36b07[0].urlAD,
              urlAD_preview: v_e36b07[0].urlAD ? v_e36b07[0].urlAD.substring(0, 30) + '...' : 'MISSING'
            });

            const v_beddf3 = [...v_3ce376].sort((v_779914, v_148ff6) => {
              const v_1b0610 = parseFloat(String(v_779914.distance || 0));
              const v_161ea9 = parseFloat(String(v_148ff6.distance || 0));
              return v_1b0610 - v_161ea9; 
            });

            console.log('📊 [CameraMainScreen API] 거리 순 정렬 완료 (가까운 순서)');

            const v_dc4d18 = 5;
            const v_09cb96 = v_e36b07.length * v_dc4d18;

            const v_7864b3 = new Map<number, number>();

            const v_8ceeaa = v_beddf3.map((v_51b584, v_a56041) => {

              if (v_a56041 >= v_09cb96) {
                return v_51b584;
              }

              const v_ba7922 = v_a56041 % v_e36b07.length;
              const v_127b33 = v_e36b07[v_ba7922];

              const v_1a11a0 = (v_127b33?.campid !== undefined && v_127b33?.campid !== null) ? String(v_127b33.campid) : '';
              const v_aa0917 = v_1a11a0 || v_51b584.campid || v_51b584.campId || '';

              const v_4cda83 = v_1a11a0 || String(v_51b584.campid || v_51b584.campId || '');
              const v_0231a4 = v_ed29b7[v_4cda83];
              let v_eda183 = v_0231a4?.urlAD || v_127b33?.urlAD || v_127b33?.landing_url || v_51b584.urlAD || v_51b584.landing_url || '';

              if (v_eda183 === '없음') {
                v_eda183 = '';
              }

              if (!v_eda183 || v_eda183 === '') {
                console.log(`⚠️ [CameraMainScreen API] ${v_aa0917}는 urlAD가 없지만 매핑은 진행 (나중에 pre-fetch 예정)`);
                console.log(`🔍 [CameraMainScreen API] urlAD 확인 상세:`, {
                  cachedItem_urlAD: v_0231a4?.urlAD,
                  mappedAd_urlAD: v_127b33?.urlAD,
                  mappedAd_landing_url: v_127b33?.landing_url,
                  coin_urlAD: v_51b584.urlAD,
                  coin_landing_url: v_51b584.landing_url,
                });
              }

              if (v_aa0917) {
                const v_375fda = v_7864b3.get(v_aa0917) || 0;
                if (v_375fda >= v_dc4d18) {
                  return v_51b584;
                }
                v_7864b3.set(v_aa0917, v_375fda + 1);
              }

              console.log(`🔗 [CameraMainScreen API] 토큰 ${v_a56041} 매핑 상세:`, {
                adIndex: v_ba7922,
                adCompany: v_127b33?.ad_company,
                mappedAd_campid: v_127b33?.campid,
                mappedCampid: v_1a11a0,
                coin_campid: v_51b584.campid,
                final_campid: v_aa0917,
                mappedAd_urlAD: v_127b33?.urlAD || '없음',
                cachedItem_urlAD: v_0231a4?.urlAD || '없음',
                coin_urlAD: v_51b584.urlAD || '없음',
                finalUrlAD: v_eda183 || 'EMPTY',
                hasUrlAD: !!v_eda183,
              });

              if (v_0231a4) {
                console.log(`💾 [CameraMainScreen API] 매핑 중 캐시 데이터 발견: ${v_4cda83}`);
              }

              return {
                ...v_51b584,

                distance: Number(v_51b584.distance) || 0,

                name: v_0231a4?.name || v_127b33?.name || v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
                iconurl: v_127b33?.iconurl || v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_0231a4?.joindesc || v_127b33?.joindesc || v_51b584.joindesc || '',
                xrunPrice: v_0231a4?.xrunPrice || v_127b33?.xrunPrice || v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || v_51b584.coins || 0,
                xrunprice: v_0231a4?.xrunPrice || v_127b33?.xrunPrice || v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || v_51b584.coins || '',

                campid: (v_127b33?.campid !== undefined && v_127b33?.campid !== null) 
                  ? String(v_127b33.campid) 
                  : (v_51b584.campid || v_51b584.campId || ''),

                advertisement: v_127b33?.advertisement || v_127b33?.adid || v_127b33?.ad || (v_127b33?.campid ? String(v_127b33.campid) : '') || v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',

                urlAD: v_eda183 && v_eda183 !== '없음' ? v_eda183 : '', 
                landing_url: v_eda183 && v_eda183 !== '없음' ? v_eda183 : '', 
                thumbnail: v_127b33?.thumbnail || v_51b584.thumbnail,
                ad_company: v_127b33?.ad_company || v_51b584.ad_company,
                coins: v_127b33?.coins?.toString() || v_51b584.coins,
                brandlogo: v_127b33?.brandlogo || v_51b584.brandlogo,
                adthumbnail2: v_127b33?.adthumbnail2 || v_51b584.adthumbnail2,
                symbolimg: v_127b33?.symbolimg || v_51b584.symbolimg,
              };
            });

            console.log('✅ [CameraMainScreen API] TopAd5 매핑 완료:', v_8ceeaa.length, '개 토큰');

            v_7bb835(v_8ceeaa);

            if (v_a96760.current !== 0) {
              v_a96760.current = 0;
              console.log('🔄 [CameraMainScreen API] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');
            }

            try {
              v_0a6f80(v_8ceeaa, v_ed29b7);
            } catch (v_15a64b) {
              console.error('❌ [CameraMainScreen API] organizeData 실행 중 오류:', v_15a64b);
            }

            const v_1fddfe = async (v_a23604) => {

              if (v_ba482c.current) {
                console.log('🚫 [PreFetch] 이미 실행 중이라 중단됨');
                return;
              }
              v_ba482c.current = true;

              try {
                const v_e7f87b = await v_f3de6d();

                const v_e1c39d = v_e36b07.filter((v_ddcfed) => {
                  const v_b24339 = String(v_ddcfed.campid || '');

                  if (v_a23604[v_b24339] && v_a23604[v_b24339].urlAD) return false;

                  if (v_ddcfed.urlAD) return false;
                  return v_ddcfed.campid;
                });

                console.log(`🔍 [CameraMainScreen API] 고유 광고 pre-fetch 대상: ${v_e1c39d.length}개`);

                let v_0b94e1 = [...v_8ceeaa];

                let v_c34f94 = { ...v_a23604 };

                for (const v_ddcfed of v_e1c39d) {
                  try {

                    const v_7ac310 = String(v_ddcfed.campid || '');
                    const v_693775 = (v_ddcfed.ad_company || '').toLowerCase(); 

                    if (v_7ac310 && v_f6025a[v_7ac310] && v_f6025a[v_7ac310].urlAD) {

                      const v_0231a4 = v_f6025a[v_7ac310];

                      v_c34f94[v_7ac310] = v_0231a4;

                      v_0b94e1 = v_0b94e1.map(v_3f4e2e =>
                        (v_3f4e2e.campid === v_ddcfed.campid) ? {
                          ...v_3f4e2e,
                          urlAD: v_0231a4.urlAD,
                          landing_url: v_0231a4.urlAD,
                          joindesc: v_0231a4.joindesc || v_3f4e2e.joindesc,
                          name: v_0231a4.name || v_3f4e2e.name,
                          xrunPrice: v_0231a4.xrunPrice || v_3f4e2e.xrunPrice,
                        } : v_3f4e2e
                      );

                      continue;
                    }

                    let v_43c42e;

                    const v_6030b8 = v_ddcfed.ad_check_url;
                    let v_9cb87d = null;

                    if (v_6030b8) {
                      try {
                        const v_3393e3 = await fetch(v_6030b8);
                        const v_4e826f = await v_3393e3.json();

                        if (v_693775 === 'nas') {
                          const v_679b9e = typeof v_4e826f.result === 'string' ? parseInt(v_4e826f.result, 10) : v_4e826f.result;
                          if (v_679b9e === 200 && v_4e826f.lurl) {
                            v_9cb87d = {
                              urlAD: v_4e826f.lurl,
                              name: v_4e826f.name
                            };
                          }
                        } else if (v_693775 === 'pointclick') {
                          if (v_4e826f.result_code === 200 && v_4e826f.landing_url) {
                            v_9cb87d = {
                              urlAD: v_4e826f.landing_url,
                              name: v_4e826f.ad_name
                            };
                          }
                        }
                      } catch (v_da980a) {
                        console.error(`❌ [PreFetch] Fetch 오류:`, v_da980a);
                      }
                    }

                    if (v_9cb87d && v_9cb87d.urlAD) {

                      const v_4d73f0 = {
                        urlAD: v_9cb87d.urlAD,
                        joindesc: v_ddcfed.joindesc, 
                        name: v_9cb87d.name || v_ddcfed.name,
                        xrunPrice: v_ddcfed.xrunPrice
                      };

                      await v_8911b6(v_7ac310, v_4d73f0);

                      v_c34f94[v_7ac310] = v_4d73f0;

                      v_0b94e1 = v_0b94e1.map(v_3f4e2e =>
                        (v_3f4e2e.campid === v_ddcfed.campid) ? {
                          ...v_3f4e2e,
                          urlAD: v_4d73f0.urlAD,
                          landing_url: v_4d73f0.urlAD,
                          name: v_4d73f0.name || v_3f4e2e.name,
                        } : v_3f4e2e
                      );
                    }
                  } catch (v_9e86fd) {
                    console.log(`⚠️ [CameraMainScreen API] ${v_ddcfed.campid} pre-fetch 실패:`, v_9e86fd);
                  }
                } 

                v_7bb835(v_0b94e1);

                v_0a6f80(v_0b94e1, v_c34f94);

              } catch (v_49263d) {
                console.error('❌ [CameraMainScreen API] 백그라운드 pre-fetch 오류:', v_49263d);
              }
            };

            v_1fddfe(v_ed29b7).catch(v_9e86fd => console.error('❌ startPreFetch 호출 실패:', v_9e86fd));
          } else {
            console.log('⚠️ [CameraMainScreen API] TopAd5 데이터 없음, 기존 데이터 사용');

            v_7bb835(v_3d87ed);

            v_0a6f80(v_3d87ed);
          }
        } catch (v_b87cac) {
          console.error('❌ [CameraMainScreen API] TopAd5 데이터 가져오기 실패:', v_b87cac);
          console.log('⚠️ 기존 데이터 사용');

          v_7bb835(v_3d87ed);

          v_0a6f80(v_3d87ed);
        }
      } else {
        v_7bb835([]);
        v_8ce112([]);
      }

      v_0b2c53.current = true;

      if (v_70197b) {
        console.log(`[${v_326be8.OS} AR 화면] 캐시 사용 완료, 백그라운드에서 최신 데이터 업데이트 시작`);

        v_563153(undefined, true, true).then((v_c81f26) => {
          if (v_c81f26 && Array.isArray(v_c81f26) && v_c81f26.length > 0) {
            console.log(`[${v_326be8.OS} AR 화면] 백그라운드 업데이트 완료:`, v_c81f26.length, '개 광고');

            const v_1078ff = v_c81f26.map((v_ddcfed, v_a56041) => ({
              advertisement: v_ddcfed.advertisement || v_ddcfed.adid || v_ddcfed.ad || String(v_ddcfed.campid || ''),
              campid: v_ddcfed.campid || '',
              name: v_ddcfed.name || '',
              iconurl: v_ddcfed.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
              joindesc: v_ddcfed.joindesc || '',
              xrunPrice: v_ddcfed.xrunPrice || 0,
              xrunprice: v_ddcfed.xrunPrice || 0,
              distance: 0,
              urlAD: v_ddcfed.urlAD || '',
              ad_company: v_ddcfed.ad_company || '',
              coins: v_ddcfed.coins || '0',
              thumbnail: v_ddcfed.thumbnail || '',
              brandlogo: v_ddcfed.brandlogo || '',
              adthumbnail2: v_ddcfed.adthumbnail2 || '',
              symbolimg: v_ddcfed.symbolimg || '',
            }));

            if (v_1078ff && v_1078ff.length > 0) {
              const v_81bb16 = v_1078ff.map((v_51b584) => ({
                ...v_51b584,
                iconurl: v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_51b584.joindesc || '',
                name: v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
                xrunprice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || v_51b584.coins || '',
                xrunPrice: v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || v_51b584.coins || 0,
                campid: v_51b584.campid || v_51b584.campId || '',
                advertisement: v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',
              }));

              v_7bb835(v_81bb16);
              v_0a6f80(v_81bb16);
            }
          }
        }).catch((v_d2651d) => {
          console.warn(`[${v_326be8.OS} AR 화면] 백그라운드 업데이트 실패 (무시):`, v_d2651d);
        });
      }
    } catch (v_5e9bfe) {
      console.error('데이터 로딩 오류:', v_5e9bfe);
      v_8ce112([]);
    } finally {
      v_34a50a(false);
    }
  }, [v_9b57fc, v_0a6f80]);

  const v_c4aeea = v_de06a3((v_926d1c): number => {
    const v_c3ba76 = parseFloat(String(v_926d1c));
    const v_8e12cc = 0.9; 
    const v_41c162 = 1.0; 
    const v_94b920 = 30; 

    if (v_c3ba76 <= 0) return v_41c162;
    if (v_c3ba76 >= v_94b920) return v_8e12cc;

    return v_41c162 - (v_41c162 - v_8e12cc) * (v_c3ba76 / v_94b920);
  }, []);

  const v_24b08b = v_de06a3(() => {
    v_5b4d76.current.forEach((v_7c3b9b, v_a1106c) => {
      if (v_7c3b9b && v_7c3b9b.current) {
        v_7c3b9b.current.stop();
        console.log(`⏸️ 토큰 ${v_a1106c} 애니메이션 일시정지`);
      }
    });
  }, []);

  const v_0b240b = v_de06a3(() => {
    v_5b4d76.current.forEach((v_7c3b9b, v_a1106c) => {
      if (v_7c3b9b && v_7c3b9b.current) {

        console.log(`🔄 토큰 ${v_a1106c} 애니메이션 재시작 준비`);
      }
    });
  }, []);

  const v_9a790b = v_de06a3(async () => {
    try {
      const v_f24fd5 = await v_e84827.getItem('userData');
      if (!v_f24fd5) {
        console.log('[AR 화면] userData 없음 - 성별/연령대 검증 스킵');
        return; 
      }

      const v_ef7306 = JSON.parse(v_f24fd5);
      const v_660822 = v_ef7306.member;
      if (!v_660822) {
        console.log('[AR 화면] member ID 없음 - 성별/연령대 검증 스킵');
        return;
      }

      console.log('[AR 화면] 성별/연령대 검증 시작, member:', v_660822);
      v_9d6aeb(v_660822);
      const v_3393e3 = await v_a7ab3c(v_660822, v_9b57fc);

      console.log('[AR 화면] getMyPageUserInfo 응답:', {
        hasData: !!v_3393e3.data,
        dataLength: v_3393e3.data?.length,
        firstItem: v_3393e3.data?.[0],
      });

      const v_625c74 = v_3393e3.data?.[0];

      if (!v_625c74) {
        console.log('[AR 화면] 사용자 정보 없음 - 성별/연령대 검증 스킵');
        return;
      }

      console.log('[AR 화면] 사용자 정보:', {
        gender: v_625c74.gender,
        ages: v_625c74.ages,
        genderType: typeof v_625c74.gender,
        agesType: typeof v_625c74.ages,
      });

      const v_c3eac4 = typeof v_625c74.gender === 'string' ? parseInt(v_625c74.gender, 10) : (v_625c74.gender ?? 0);
      const v_6e272b = typeof v_625c74.ages === 'string' ? parseInt(v_625c74.ages, 10) : (v_625c74.ages ?? 0);

      console.log('[AR 화면] 성별/연령대 확인 결과:', {
        gender: v_c3eac4,
        ages: v_6e272b,
        genderOriginal: v_625c74.gender,
        agesOriginal: v_625c74.ages,
        shouldShowDialog: v_c3eac4 === 0 || v_6e272b === 0,
      });

      if (v_c3eac4 === 0 || v_6e272b === 0) {
        console.log('[AR 화면] 성별/연령대가 0 - Dialog 표시');

        v_12be53(v_c3eac4 === 0 ? 'male' : (v_c3eac4 === 2111 ? 'female' : 'male'));
        const v_c3889d = {
          2210: '10',
          2220: '20',
          2230: '30',
          2240: '40',
          2250: '50+',
        };

        v_8d44be(v_6e272b === 0 ? '10' : (v_c3889d[v_6e272b] || '10'));
        v_643c94(true);
        console.log('[AR 화면] Dialog 표시 완료, genderAgeDialogVisible:', true);
      } else {
        console.log('[AR 화면] 성별/연령대가 모두 설정됨 - Dialog 표시 안 함');
      }
    } catch (v_5e9bfe) {
      console.error('[AR 화면] 성별/연령대 확인 실패:', v_5e9bfe);
    }
  }, [v_9b57fc]);

  const v_8285e9 = v_de06a3(async () => {
    if (!v_717992 || !v_2610e9 || !v_10adc9) {
      await v_889fad(v_8d41d7('common.messages.error') || '오류', '성별과 연령대를 모두 선택해주세요.');
      return;
    }

    v_2af968(true);
    try {
      const v_d199d8 = v_2610e9 === 'male' ? 2110 : 2111;
      const v_c3889d = {
        '10': 2210,
        '20': 2220,
        '30': 2230,
        '40': 2240,
        '50+': 2250,
      };
      const v_2d2cbc = v_c3889d[v_10adc9] || 0;

      await Promise.all([
        v_71d37e(v_717992, v_d199d8, v_9b57fc),
        v_07f367(v_717992, v_2d2cbc, v_9b57fc),
      ]);

      v_643c94(false);
      await v_889fad(v_8d41d7('common.messages.success') || '성공', '성별과 연령대가 업데이트되었습니다.');
    } catch (v_5e9bfe) {
      console.error('[AR 화면] 성별/연령대 업데이트 실패:', v_5e9bfe);
      await v_889fad(v_8d41d7('common.messages.error') || '오류', '업데이트에 실패했습니다.');
    } finally {
      v_2af968(false);
    }
  }, [v_717992, v_2610e9, v_10adc9, v_9b57fc, v_889fad, v_8d41d7]);

  v_c4deb2(() => {
    const v_2ff7b8 = async () => {

      await v_e1f9f9();

      await v_9a790b();

      if (!v_0b2c53.current) {
        v_c4c061(false); 
      }
    };

    v_2ff7b8();
  }, []); 

  v_c4deb2(() => {
    const v_be4bb2 = async () => {
      try {
        const v_2a04ed = await v_e84827.getItem('cached_AD');
        console.warn('🕵️ [DEBUG] 마운트 시 cached_AD 직접 확인:', v_2a04ed ? '데이터 있음' : 'NULL');
        if (v_2a04ed) {
          console.warn('🕵️ [DEBUG] 캐시 내용:', v_2a04ed);
        }
      } catch (v_49263d) {
        console.error('🕵️ [DEBUG] 캐시 확인 실패:', v_49263d);
      }
    };
    v_be4bb2();
  }, []);

  v_c4deb2(() => {
    if (v_b9ce93 && v_b9ce93.length > 0) {

      v_e84827.getItem('cached_AD').then((v_c06630) => {
        if (v_c06630) {
          try {
            const v_78fdd6 = JSON.parse(v_c06630);
            v_0a6f80(v_b9ce93, v_78fdd6);
          } catch (v_9e86fd) {
            v_0a6f80(v_b9ce93);
          }
        } else {
          v_0a6f80(v_b9ce93);
        }
      }).catch(() => {
        v_0a6f80(v_b9ce93);
      });
    }
  }, [v_b9ce93, v_0a6f80]);

  const v_d00cdb = v_de06a3(async () => {
    try {
      console.log('[CameraMainScreen] 10분 주기: 최신 데이터 가져오기 시작');

      const v_ef7306 = await v_e84827.getItem('userData');
      if (!v_ef7306) {
        console.warn('[CameraMainScreen] 백그라운드: userData 없음');
        return;
      }
      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';
      if (!v_660822) {
        console.warn('[CameraMainScreen] 백그라운드: member 없음');
        return;
      }

      const [v_e36b07, v_905ecb] = await Promise.all([
        v_563153(v_9b57fc, true, true).catch(() => null), 
        v_318c45(v_660822, v_9b57fc).catch(() => new Set<string>()),
      ]);

      if (v_905ecb && v_905ecb.size > 0) {
        v_7c7dd0.current = v_905ecb;
        console.log(`[CameraMainScreen] 백그라운드: 완료된 광고 목록 업데이트: ${v_905ecb.size}개`);
      }

      if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {
        console.log('[CameraMainScreen] 백그라운드: TopAd5 데이터 가져옴 (캐시 또는 API):', v_e36b07.length, '개');

        if (v_e36b07.length > 0) {

          v_7bb835((v_e8cc2e) => {
            if (!v_e8cc2e || v_e8cc2e.length === 0) {
              return v_e8cc2e;
            }

            const v_beddf3 = [...v_e8cc2e].sort((v_779914, v_148ff6) => {
              const v_1b0610 = parseFloat(String(v_779914.distance || 0));
              const v_161ea9 = parseFloat(String(v_148ff6.distance || 0));
              return v_1b0610 - v_161ea9;
            });

            const v_dc4d18 = 5;
            const v_09cb96 = v_e36b07.length * v_dc4d18;
            const v_7864b3 = new Map<number, number>();

            const v_0b94e1 = v_beddf3.map((v_51b584, v_a56041) => {
              if (v_a56041 >= v_09cb96) {
                return v_51b584;
              }

              const v_ba7922 = v_a56041 % v_e36b07.length;
              const v_127b33 = v_e36b07[v_ba7922];
              const v_aa0917 = v_127b33?.campid;

              if (v_aa0917) {
                const v_375fda = v_7864b3.get(v_aa0917) || 0;
                if (v_375fda >= v_dc4d18) {
                  return v_51b584;
                }
                v_7864b3.set(v_aa0917, v_375fda + 1);
              }

              return {
                ...v_51b584,
                distance: Number(v_51b584.distance) || 0,
                name: v_127b33?.name || v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
                iconurl: v_127b33?.iconurl || v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_127b33?.joindesc || v_51b584.joindesc || '',
                xrunPrice: v_127b33?.xrunPrice || v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || v_51b584.coins || 0,
                xrunprice: v_127b33?.xrunPrice || v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || v_51b584.coins || '',
                campid: v_127b33?.campid || v_51b584.campid || v_51b584.campId || '',
                advertisement: v_127b33?.advertisement || v_127b33?.adid || v_127b33?.ad || (v_127b33?.campid ? String(v_127b33.campid) : '') || v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',
                thumbnail: v_127b33?.thumbnail || v_51b584.thumbnail,
                ad_company: v_127b33?.ad_company || v_51b584.ad_company,
                coins: v_127b33?.coins?.toString() || v_51b584.coins,
                brandlogo: v_127b33?.brandlogo || v_51b584.brandlogo,
                adthumbnail2: v_127b33?.adthumbnail2 || v_51b584.adthumbnail2,
                symbolimg: v_127b33?.symbolimg || v_51b584.symbolimg,
                urlAD: v_127b33?.urlAD || v_51b584.urlAD || '',
              };
            });

            v_a96760.current = 0;

            setTimeout(() => {
              v_0a6f80(v_0b94e1);
            }, 0);
            console.log('[CameraMainScreen] 백그라운드: 최신 데이터로 토큰 업데이트 완료');
            return v_0b94e1;
          });
        }
      }
    } catch (v_39d018) {
      console.warn('[CameraMainScreen] 백그라운드 업데이트 실패:', v_39d018);
    }
  }, [v_9b57fc, v_0a6f80]);

  v_c4deb2(() => {
    if (v_ac1d22 !== 'Camera') {
      return; 
    }

    console.log('⏰ [CameraMainScreen] 10분 주기 광고 목록 갱신 타이머 시작');
    const v_ad1d65 = setInterval(() => {
      console.log('⏰ 10분 경과 - 광고 목록 갱신 시작');
      v_d00cdb();
    }, 10 * 60 * 1000); 

    return () => {
      console.log('⏰ [CameraMainScreen] 10분 주기 광고 목록 갱신 타이머 정리');
      clearInterval(v_ad1d65);
    };
  }, [v_ac1d22, v_d00cdb]);

  v_c4deb2(() => {
    const v_7a424f = (nextAppState: typeof v_94a194) => {
      console.log('📱 AppState 변경:', v_94a194, '->', v_3b10d8);

      if (v_94a194.match(/inactive|background/) && v_3b10d8 === 'active') {

        console.log('🔄 앱 활성화 - 토큰 애니메이션 재시작');
        v_0b240b();

        if (v_ac1d22 === 'Camera') {
          const v_c4aa47 = async () => {
            try {

              const v_764826 = await v_e84827.getItem('shouldNavigateToCamera');
              if (v_764826 === 'true') {
                console.log('[CameraMainScreen] 광고보기 완료 감지 - 이미 AR 화면에 있음');
                await v_e84827.removeItem('shouldNavigateToCamera');
              }

              const v_172d56 = await v_e84827.getItem('shouldRefreshTopAd5');
              if (v_172d56 === 'true') {
                console.log('[CameraMainScreen] 광고보기 완료 감지 - TopAd5 및 토큰 데이터 새로고침');

                await v_e84827.removeItem('shouldRefreshTopAd5');

                const v_dc62a4 = await v_e84827.getItem('completedAdCampid');
                if (v_dc62a4) {
                  await v_e84827.removeItem('completedAdCampid');
                  console.log(`[CameraMainScreen] 완료된 광고 제거 및 대체 시작: ${v_dc62a4}`);

                  try {
                    const v_c06630 = await v_e84827.getItem('completedAdsCache');
                    if (v_c06630) {
                      const v_e2a6a6 = JSON.parse(v_c06630);
                      if (Array.isArray(v_e2a6a6)) {
                        v_7c7dd0.current = new Set(v_e2a6a6);
                        console.log(`[CameraMainScreen] completedAdsCache에서 로드: ${v_e2a6a6.length}개 (${v_dc62a4} 포함 여부: ${v_e2a6a6.includes(v_dc62a4)})`);
                      }
                    }
                  } catch (v_2bf859) {
                    console.warn('[CameraMainScreen] completedAdsCache 읽기 실패:', v_2bf859);
                  }

                  if (!v_7c7dd0.current) {
                    v_7c7dd0.current = new Set<string>();
                  }
                  if (!v_7c7dd0.current.has(v_dc62a4)) {
                    v_7c7dd0.current.add(v_dc62a4);
                    console.log(`[CameraMainScreen] completedAdsSetRef에 추가: ${v_dc62a4} (현재 크기: ${v_7c7dd0.current.size})`);
                  }

                  v_8ce112(v_93ce34 => [...v_93ce34]);

                  await v_8cba1e(v_dc62a4, v_9b57fc);
                }

                try {

                  const v_ef7306 = await v_e84827.getItem('userData');
                  if (v_ef7306) {
                    const v_ff39bc = JSON.parse(v_ef7306);
                    const v_660822 = v_ff39bc?.member;
                    if (v_660822) {

                      const v_905ecb = await v_318c45(v_660822, v_9b57fc, true);
                      v_7c7dd0.current = v_905ecb;
                      console.log(`[CameraMainScreen] 완료된 광고 목록 업데이트: ${v_905ecb.size}개`);

                      v_8ce112(v_93ce34 => [...v_93ce34]);
                    }
                  }

                  console.log('[CameraMainScreen] TopAd5 및 토큰 데이터 새로고침 시작');
                  await v_c4c061(true);
                  console.log('[CameraMainScreen] TopAd5 및 토큰 데이터 새로고침 완료');
                } catch (v_5e9bfe) {
                  console.error('[CameraMainScreen] TopAd5 새로고침 실패:', v_5e9bfe);
                }
              }
            } catch (v_5e9bfe) {
              console.error('[CameraMainScreen] 광고보기 완료 후 리프레시 실패:', v_5e9bfe);
            }
          };

          setTimeout(v_c4aa47, 500);
        }
      } else if (v_94a194 === 'active' && v_3b10d8.match(/inactive|background/)) {

        console.log('⏸️ 앱 비활성화 - 토큰 애니메이션 일시정지');
        v_24b08b();
      }

      v_3fff8d(v_3b10d8);
    };

    const v_269481 = v_6b5698.addEventListener('change', v_7a424f);

    return () => {
      v_269481?.remove();
    };
  }, [v_94a194, v_24b08b, v_0b240b, v_ac1d22, v_c4c061]);

  v_c4deb2(() => {
    const v_ca94a2 = setInterval(() => {
      v_7d7b3a(v_d83a4c => v_d83a4c + 1);
      console.log('🔄 [CameraMainScreen] 3분 경과 - 컴포넌트 리프레시 (refreshKey 증가)');
    }, 180000); 

    return () => clearInterval(v_ca94a2);
  }, []);

  v_c4deb2(() => {
    return () => {
      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }
    };
  }, []);

  v_c4deb2(() => {
    v_6890b1.current = false;
  }, [v_04cb77]);

  v_c4deb2(() => {
    return () => {
      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }

      if (v_a27ed2.current) {
        clearTimeout(v_a27ed2.current);
        v_a27ed2.current = null;
      }

      v_6890b1.current = false;
    };
  }, []); 

  v_c4deb2(() => {
    if (v_572bd3 && v_04cb77) {

      v_a2349e.timing(v_8f79f8, {
        toValue: 105, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    } else {

      v_a2349e.timing(v_8f79f8, {
        toValue: 100, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    }
  }, [v_572bd3, v_04cb77, v_8f79f8]);

  const v_6a213b = (v_6e55b1) => {
    console.log('Navigation item pressed:', v_6e55b1);

    switch (v_6e55b1) {
      case 'xplay':
        v_9b57fc(v_ce4741.xplayInfo);
        break;
      case 'xrun':
        v_9b57fc(v_ce4741.xrunInfo);
        break;
      case 'wallet':
        v_9b57fc(v_ce4741.wallet);
        break;
      case 'shop':
        v_9b57fc(v_ce4741.shop);
        break;
      case 'info':
        v_9b57fc(v_ce4741.myInfo);
        break;
      default:
        console.log('Unknown navigation item:', v_6e55b1);
    }
  };

  const v_42b5ed = (v_11083e) => {
    v_d52709?.(v_11083e);
  };

  const v_794bb0 = v_de06a3(async (token: v_60c7c3) => {
    try {

      const v_ef7306 = await v_e84827.getItem('userData');
      if (!v_ef7306) {
        return;
      }

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';

      if (!v_660822) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      const v_5a9c46 = v_21cc31.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', v_5a9c46);

      const v_5389c3 = v_21cc31.advertisement
        ? String(v_21cc31.advertisement)
        : (v_21cc31.coin ? String(v_21cc31.coin) : '');
      const v_aa0917 = v_21cc31.campid ? String(v_21cc31.campid) : '';

      if (!v_5389c3 || v_5389c3 === '' || v_5389c3 === 'undefined') {
        console.error('❌ advertisement가 유효하지 않습니다');
        return;
      }

      if (!v_aa0917 || v_aa0917 === '' || v_aa0917 === 'undefined') {
        console.error('❌ campid가 유효하지 않습니다');
        return;
      }

      let v_7ec08d = v_21cc31.urlAD || '';

      if (v_7ec08d === '없음') {
        v_7ec08d = '';
      }

      if (!v_7ec08d || v_7ec08d === '') {
        try {
          const v_b70733 = await v_5d7ca4();
          if (v_b70733 && Array.isArray(v_b70733)) {
            const v_d87210 = v_b70733.find(v_ddcfed => 
              v_ddcfed.campid === v_aa0917 || 
              String(v_ddcfed.campid) === String(v_aa0917) ||
              v_ddcfed.advertisement === v_5389c3 ||
              String(v_ddcfed.advertisement) === String(v_5389c3)
            );
            if (v_d87210) {
              v_7ec08d = v_d87210.urlAD || v_d87210.landing_url || '';

              if (v_7ec08d === '없음') {
                v_7ec08d = '';
              }
              if (v_7ec08d) {
                console.log(`✅ [showAdInModal] getStoredTopAd5에서 urlAD 찾음:`, v_7ec08d);
              }
            }
          }
        } catch (v_5e9bfe) {
          console.warn('[showAdInModal] getStoredTopAd5에서 urlAD 찾기 실패:', v_5e9bfe);
        }
      }

      if (!v_7ec08d || v_7ec08d === '') {
        console.error('❌ urlAD가 없습니다. WebView 모달을 표시할 수 없습니다.');
        v_cba33f('광고 URL을 찾을 수 없습니다.');
        return;
      }

      const v_75c344 = {
        member: v_660822,
        advertisement: v_5389c3,
        coin: v_21cc31.coin ? String(v_21cc31.coin) : '',
        campid: v_aa0917,
        joindesc: v_21cc31.joindesc || '',
        name: v_21cc31.name || 'XRUN coin',
        xrunPrice: v_21cc31.xrunPrice || 0,
        coinScreen: true,
        ad_company: v_5a9c46,
        urlAD: v_7ec08d && v_7ec08d !== '없음' ? v_7ec08d : '',
      };

      console.log('✅ showAdInModal 최종 파라미터:', JSON.stringify(v_75c344, null, 2));

      v_96a9ed(v_21cc31);

      v_d48a26(v_75c344);

      if (v_326be8.OS === 'ios') {

        v_9b57fc(v_ce4741.showWebView);
      } else {

        v_62078f.current = v_21cc31;
        v_63031f.current = v_75c344;

        v_e60eaf(v_7ec08d);
        v_cb400d(v_21cc31.name || '광고');
        v_8aeec2(false); 
        v_bde9a1(true);
      }

      (async () => {
        try {

          try {
            const v_ce5e26 = v_5a9c46 === 'pock' || v_5a9c46 === 'pointclick' || v_5a9c46 === 'POCK' ? 'pointclick' : 'nas';
            await v_38f5f4(
              parseInt(v_660822, 10),
              v_aa0917,
              v_ce5e26,
              v_9b57fc,
            );
          } catch (v_53d118) {
            if (v_53d118?.code !== 404 && !v_53d118?.message?.includes('404')) {
              console.warn('[WebView 모달] processAdReward 실패:', v_53d118);
            }
          }

          try {
            await v_8cba1e(v_aa0917, v_9b57fc);
          } catch (v_61e099) {
            console.warn('[WebView 모달] removeAdFromTopAd5 실패:', v_61e099);
          }

          await v_5e0191(v_aa0917);

          await v_e84827.setItem('isAdCompleted', 'true');
          await v_e84827.setItem('shouldRefreshTopAd5', 'true');
          await v_e84827.setItem('shouldNavigateToCamera', 'true');
          await v_e84827.setItem('completedAdCampid', v_aa0917);
        } catch (v_39d018) {
          console.warn('[WebView 모달] 리워드 처리 실패:', v_39d018);
        }
      })();
    } catch (v_5e9bfe) {
      console.error('❌ showAdInModal 오류:', v_5e9bfe);
    }
  }, [v_d48a26, v_9b57fc]);

  const v_3aa877 = v_de06a3(() => {
    console.log('[WebView] 닫기 버튼 클릭');
    v_bde9a1(false);
    v_e60eaf('');
    v_8aeec2(false); 
    v_cb400d('');
    v_6a4dcd(false);
    v_96a9ed(null);

    v_62078f.current = null;
    v_63031f.current = null;
  }, []);

  const v_d59c80 = v_de06a3(async () => {

    if (!v_d0b6d4 && !v_04cb77 && v_3b0ada) {

      if (v_62078f.current && v_63031f.current) {
        v_96a9ed(v_62078f.current);
        v_d48a26(v_63031f.current);

        setTimeout(() => {
          v_219124(true);
          console.log('✅ 광고 상세 모달 표시 완료 (ref 사용)');
        }, 100);
        return;
      }

      if (!v_b2dceb) {
        console.error('❌ webViewUrl도 없습니다.');
        v_cba33f('광고 정보를 찾을 수 없습니다.');
        return;
      }

      try {
        const v_b70733 = await v_5d7ca4();
        console.log(`[i 아이콘] 저장된 광고 개수: ${v_b70733?.length || 0}`);
        console.log(`[i 아이콘] 찾을 WebView URL: ${v_b2dceb}`);

        if (v_b70733 && Array.isArray(v_b70733)) {

          v_b70733.forEach((v_ddcfed, v_a56041) => {
            const v_33a490 = v_ddcfed.urlAD || v_ddcfed.landing_url || '';
            console.log(`[i 아이콘] 저장된 광고 ${v_a56041 + 1}:`, {
              campid: v_ddcfed.campid,
              urlAD: v_33a490,
              name: v_ddcfed.name,
            });
          });

          const v_b0445c = (v_f71b56): string => {
            try {
              const v_c029ba = new URL(v_f71b56);

              return `${v_c029ba.protocol}//${v_c029ba.host}${v_c029ba.pathname}`;
            } catch {

              return v_f71b56;
            }
          };

          let v_d87210 = v_b70733.find(v_ddcfed => 
            v_ddcfed.urlAD === v_b2dceb || v_ddcfed.landing_url === v_b2dceb
          );

          if (!v_d87210) {
            const v_08985f = v_b0445c(v_b2dceb);
            v_d87210 = v_b70733.find(v_ddcfed => {
              const v_33a490 = v_ddcfed.urlAD || v_ddcfed.landing_url || '';
              if (!v_33a490) return false;
              const v_01b828 = v_b0445c(v_33a490);
              return v_01b828 === v_08985f;
            });
          }

          if (!v_d87210) {
            const v_19ab2d = v_b2dceb.match(/https?:\/\/([^\/]+)/)?.[1];
            const v_3614a0 = v_b2dceb.match(/https?:\/\/[^\/]+(\/[^?]*)/)?.[1];

            if (v_19ab2d) {
              v_d87210 = v_b70733.find(v_ddcfed => {
                const v_33a490 = v_ddcfed.urlAD || v_ddcfed.landing_url || '';
                if (!v_33a490) return false;
                return v_33a490.includes(v_19ab2d) && 
                       (v_3614a0 ? v_33a490.includes(v_3614a0) : true);
              });
            }
          }

          if (v_d87210) {
            console.log('✅ WebView URL로 광고 정보 찾음:', v_d87210);

            const v_ef7306 = await v_e84827.getItem('userData');
            if (v_ef7306) {
              const v_ff39bc = JSON.parse(v_ef7306);
              const v_660822 = v_ff39bc?.member?.toString() || '';

              if (v_660822) {
                const v_75c344 = {
                  member: v_660822,
                  advertisement: v_d87210.advertisement || v_d87210.coin || '',
                  coin: v_d87210.coin || '',
                  campid: v_d87210.campid || '',
                  joindesc: v_d87210.joindesc || '',
                  name: v_d87210.name || v_6ced96 || 'XRUN coin',
                  xrunPrice: v_d87210.xrunPrice || 0,
                  coinScreen: true,
                  ad_company: v_d87210.ad_company || 'nas',
                  urlAD: v_b2dceb,
                };

                v_d48a26(v_75c344);
                console.log('✅ advertisementParams 재설정 완료');
              }
            }
          } else {
            console.error('❌ WebView URL로 광고 정보를 찾을 수 없습니다.');
            v_cba33f('광고 정보를 찾을 수 없습니다.');
            return;
          }
        }
      } catch (v_5e9bfe) {
        console.error('❌ 광고 정보 재구성 실패:', v_5e9bfe);
        v_cba33f('광고 정보를 찾을 수 없습니다.');
        return;
      }
    } else if (!v_d0b6d4 && !v_04cb77) {
      console.error('❌ i 아이콘 클릭 - advertisementParams와 selectedToken이 모두 없습니다.');
      v_cba33f('광고 정보를 찾을 수 없습니다.');
      return;
    }

    setTimeout(() => {
      v_219124(true);
      console.log('✅ 광고 상세 모달 표시 완료');
    }, 100);
  }, [v_fa7c50, v_3b0ada, v_d0b6d4, v_04cb77, v_b2dceb, v_6ced96, v_d48a26]);

  const v_917f22 = v_de06a3(async (token: v_60c7c3) => {
    try {

      const v_ef7306 = await v_e84827.getItem('userData');
      if (!v_ef7306) {
        console.log('userData가 없습니다.');
        return;
      }

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';

      if (!v_660822) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      const v_5389c3 = v_21cc31.advertisement
        ? String(v_21cc31.advertisement)
        : (v_21cc31.coin ? String(v_21cc31.coin) : '');
      const v_aa0917 = v_21cc31.campid ? String(v_21cc31.campid) : '';

      if (!v_5389c3 || v_5389c3 === '' || v_5389c3 === 'undefined') {
        console.error('❌ advertisement가 유효하지 않습니다:', {
          advertisement: v_5389c3,
          tokenAdvertisement: v_21cc31.advertisement,
          tokenCoin: v_21cc31.coin,
        });
        return;
      }

      if (!v_aa0917 || v_aa0917 === '' || v_aa0917 === 'undefined') {
        console.error('❌ campid가 유효하지 않습니다:', {
          campid: v_aa0917,
          tokenCampid: v_21cc31.campid,
          tokenSpotID: v_21cc31.spotID,
        });
        return;
      }

      const v_5a9c46 = v_21cc31.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', v_5a9c46);

      let v_7ec08d = v_21cc31.urlAD || '';

      if (v_7ec08d === '없음') {
        v_7ec08d = '';
      }

      if (!v_7ec08d || v_7ec08d === '') {
        try {
          const v_b70733 = await v_5d7ca4();
          if (v_b70733 && Array.isArray(v_b70733)) {
            const v_d87210 = v_b70733.find(v_ddcfed => 
              v_ddcfed.campid === v_aa0917 || 
              String(v_ddcfed.campid) === String(v_aa0917) ||
              v_ddcfed.advertisement === v_5389c3 ||
              String(v_ddcfed.advertisement) === String(v_5389c3)
            );
            if (v_d87210) {
              v_7ec08d = v_d87210.urlAD || v_d87210.landing_url || '';

              if (v_7ec08d === '없음') {
                v_7ec08d = '';
              }

            }
          }
        } catch (v_5e9bfe) {
          console.warn('[navigateToAd] getStoredTopAd5에서 urlAD 찾기 실패:', v_5e9bfe);
        }
      }

      if (!v_7ec08d || v_7ec08d === '') {
        console.error('❌ urlAD가 없습니다. WebView 모달을 표시할 수 없습니다.');
        return;
      }

      const v_75c344 = {
        member: v_660822,
        advertisement: v_5389c3,
        coin: v_21cc31.coin ? String(v_21cc31.coin) : '',
        campid: v_aa0917,
        joindesc: v_21cc31.joindesc || '',
        name: v_21cc31.name || 'XRUN coin',
        xrunPrice: v_21cc31.xrunPrice || 0,
        coinScreen: true,
        ad_company: v_5a9c46,
        urlAD: v_7ec08d && v_7ec08d !== '없음' ? v_7ec08d : '',
      };

      v_96a9ed(v_21cc31);

      v_d48a26(v_75c344);

      if (v_326be8.OS === 'ios') {

        v_9b57fc(v_ce4741.showWebView);
      } else {

        v_62078f.current = v_21cc31;
        v_63031f.current = v_75c344;

        v_e60eaf(v_7ec08d);
        v_cb400d(v_21cc31.name || '광고');
        v_bde9a1(true);
      }

      (async () => {
        try {

          try {
            const v_ce5e26 = v_5a9c46 === 'pock' || v_5a9c46 === 'pointclick' || v_5a9c46 === 'POCK' ? 'pointclick' : 'nas';
            await v_38f5f4(
              parseInt(v_660822, 10),
              v_aa0917,
              v_ce5e26,
              v_9b57fc,
            );
          } catch (v_53d118) {
            if (v_53d118?.code !== 404 && !v_53d118?.message?.includes('404')) {
              console.warn('[navigateToAd] processAdReward 실패:', v_53d118);
            }
          }

          try {
            await v_8cba1e(v_aa0917, v_9b57fc);
          } catch (v_61e099) {
            console.warn('[navigateToAd] removeAdFromTopAd5 실패:', v_61e099);
          }

          await v_5e0191(v_aa0917);

          await v_e84827.setItem('isAdCompleted', 'true');
          await v_e84827.setItem('shouldRefreshTopAd5', 'true');
          await v_e84827.setItem('shouldNavigateToCamera', 'true');
          await v_e84827.setItem('completedAdCampid', v_aa0917);
        } catch (v_39d018) {
          console.warn('[navigateToAd] 리워드 처리 실패:', v_39d018);
        }
      })();
    } catch (v_5e9bfe) {
      console.error('❌ navigateToAd 오류:', v_5e9bfe);
    }
  }, [v_d48a26, v_9b57fc]);

  v_c4deb2(() => {
    if (v_572bd3 && v_04cb77 && !v_6890b1.current) {

      const v_aa0917 = String(v_04cb77.campid || '');
      if (v_aa0917 && v_aa0917 !== '' && v_aa0917 !== 'undefined') {

        if (v_7c7dd0.current && v_7c7dd0.current.has(v_aa0917)) {
          return; 
        }
      }

      const currentToken: v_60c7c3 = {
        ...v_04cb77,
        advertisement: v_04cb77.advertisement,
        campid: v_04cb77.campid,
        coin: v_04cb77.coin,
        xrunPrice: v_04cb77.xrunPrice,
        name: v_04cb77.name,
        iconurl: v_04cb77.iconurl,
        joindesc: v_04cb77.joindesc,
        brand: v_04cb77.brand,
      };

      v_6890b1.current = true;
      v_181e3e.current = setTimeout(() => {
        v_917f22(v_191c8b);
      }, 3000); 
    } else {

      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }
      if (v_a27ed2.current) {
        clearTimeout(v_a27ed2.current);
        v_a27ed2.current = null;
      }
    }

    return () => {
      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }
      if (v_a27ed2.current) {
        clearTimeout(v_a27ed2.current);
        v_a27ed2.current = null;
      }
    };
  }, [v_572bd3, v_04cb77, v_917f22]);

  const v_eed806 = v_de06a3((token: v_60c7c3) => {

    if (v_181e3e.current) {
      clearTimeout(v_181e3e.current);
      v_181e3e.current = null;
    }
    if (v_a27ed2.current) {
      clearTimeout(v_a27ed2.current);
      v_a27ed2.current = null;
    }
    v_6890b1.current = false; 

    const tokenCopy: v_60c7c3 = {
      ...v_21cc31,
      advertisement: v_21cc31.advertisement,
      campid: v_21cc31.campid,
      coin: v_21cc31.coin,
      xrunPrice: v_21cc31.xrunPrice,
      name: v_21cc31.name,
      iconurl: v_21cc31.iconurl,
      joindesc: v_21cc31.joindesc,
      brand: v_21cc31.brand,
    };

    v_96a9ed(v_021ef9);
    v_6a4dcd(true); 

    v_a27ed2.current = setTimeout(() => {
      v_a27ed2.current = null; 
      v_794bb0(v_021ef9);
    }, 2000);
  }, [v_794bb0]);

  const v_fce460 = [
    { id: 'xplay', label: v_8d41d7('components.bottomNavigationBar.xplay'), icon: v_622956 },
    { id: 'xrun', label: v_8d41d7('components.bottomNavigationBar.xrun'), icon: v_ee9562 },
    { id: 'shop', label: v_8d41d7('components.bottomNavigationBar.shop'), icon: v_e96568 },
    { id: 'map', label: '' }, 
    { id: 'wallet', label: v_8d41d7('components.bottomNavigationBar.wallet'), icon: v_8daafe },
    { id: 'info', label: v_8d41d7('components.bottomNavigationBar.info'), icon: v_b636c9 },
  ];

  if (!v_d1a6bb) {

    return (
      <View style={v_d81136.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!v_d1a6bb.granted) {

    return (
      <View style={v_d81136.container}>
        <StatusBar style="light" />
        <View style={v_d81136.permissionContainer}>
          {}
        </View>
      </View>
    );
  }

  return (
    <View style={v_d81136.container}>
      <StatusBar style="light" />

      {}
      <LevelNotification navigation={v_9b57fc} />

      {}
      <View style={v_d81136.statusBar}>
        <View style={v_d81136.statusBarContent}>
          <View style={v_d81136.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={v_d81136.cameraContainer}>
        <CameraView
          style={v_d81136.camera}
          facing="back"
        >
          {

}
        </CameraView>

        {}
        {

}

        {}
        {

}
        {v_683210 ? (
          <View style={[v_d81136.tokenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>
        ) : (
          <View style={[v_d81136.tokenContainer, { bottom: v_572bd3 && v_04cb77 ? 200 : 110 }]}>
            {(() => {

              return v_ef86b6
                .sort((v_779914, v_148ff6) => (v_148ff6.distance || 0) - (v_779914.distance || 0)) 
                .map((v_21cc31) => {

                  const v_aa0917 = String(v_21cc31.campid || '');

                  const v_2be890 = v_aa0917 && v_aa0917 !== '' && v_aa0917 !== 'undefined' && v_7c7dd0.current
                    ? v_7c7dd0.current.has(v_aa0917) 
                    : false;

                  const v_d0be5e = () => {
                    console.log('🖱️ [TokenComponent] 토큰 클릭됨:', {
                      spotID: v_21cc31.spotID,
                      advertisement: v_21cc31.advertisement,
                      campid: v_21cc31.campid,
                      coin: v_21cc31.coin,
                      name: v_21cc31.name,
                      isCompleted: v_2be890,
                    });

                    v_eed806(v_21cc31);
                  };

                  const v_e149c8 = `token-${v_21cc31.spotID}-${v_aa0917}-${v_21cc31.coin || ''}`;

                  return (
                    <TokenComponent
                      key={v_e149c8}
                      token={v_21cc31}
                      onPress={v_d0be5e} 
                      animationRefs={v_5b4d76}
                      appState={v_94a194}
                      rageProgress={v_95eb72}
                      isRageMode={v_a5ed76}
                      rageColor={v_269c04}
                      calculateScaleBasedOnDistance={v_c4aeea}
                      isCompleted={v_2be890}
                    />
                  );
                });
            })()}
          </View>
        )}

        {}
        {

}
        {}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: v_8f79f8, 
              left: 0,
              right: 0,
              zIndex: 100, 
              pointerEvents: v_572bd3 ? 'box-none' : 'none', 
            },
          ]}>
          <Pressable
            onPress={() => {
              if (v_572bd3) {
                v_6a4dcd(false);

                if (v_181e3e.current) {
                  clearTimeout(v_181e3e.current);
                  v_181e3e.current = null;
                }
                if (v_a27ed2.current) {
                  clearTimeout(v_a27ed2.current);
                  v_a27ed2.current = null;
                }
                v_6890b1.current = false;
              }
            }}
            style={[
              {
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 0,
                paddingVertical: 0,
                borderTopStartRadius: 20,
                borderTopEndRadius: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                minHeight: v_572bd3 && v_04cb77 ? 100 : 35,
                maxHeight: v_572bd3 && v_04cb77 ? 150 : 35, 
              },
            ]}>
            {}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 8,
                paddingBottom: 0, 
              }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#D9D9D9',
                  borderRadius: 2,
                }}
              />
            </View>
            {}
            {v_572bd3 && v_04cb77 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingTop: 0,
                  paddingBottom: 12,
                  pointerEvents: 'box-none', 
                }}>
                {}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  {}
                  {!v_04cb77?.iconurl ||
                    v_04cb77?.iconurl.toString().trim() === '' ||
                    typeof v_04cb77?.iconurl !== 'string' ? (
                    v_ed24ee && (
                      <Image
                        source={v_ed24ee}
                        resizeMode="contain"
                        style={{
                          width: 44,
                          height: 44,
                          marginRight: 12,
                        }}
                      />
                    )
                  ) : (
                    <Image
                      source={{ uri: v_04cb77?.iconurl }}
                      resizeMode="contain"
                      style={{
                        width: 44,
                        height: 44,
                        marginRight: 12,
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: v_843035.size.medium,
                        color: '#4c4e55',
                        lineHeight: 24,
                        marginTop: 20,
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {!v_04cb77?.name ||
                        v_04cb77?.name.toString().trim() === ''
                        ? 'XRUN coin'
                        : v_04cb77?.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: v_843035.size.small,
                        color: '#4c4e55',
                        lineHeight: 15,
                        letterSpacing: 0.06,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {!v_04cb77?.joindesc ||
                        v_04cb77?.joindesc.toString().trim() === ''
                        ? 'XRUN으로 리워드를 획득하세요'
                        : v_04cb77?.joindesc}
                    </Text>
                  </View>
                </View>

                {}
                <TouchableOpacity
                  onPress={async () => {
                    console.log('=== View ad 버튼 클릭 ===');
                    console.log('현재 selectedToken:', JSON.stringify(v_04cb77, null, 2));

                    if (v_181e3e.current) {
                      clearTimeout(v_181e3e.current);
                      v_181e3e.current = null;
                    }
                    v_6890b1.current = true; 

                    if (v_04cb77) {
                      await v_794bb0(v_04cb77);
                    } else {
                      console.error('❌ View ad 버튼 - selectedToken이 없습니다!');
                    }
                  }}
                  style={{
                    backgroundColor: '#FFDC04',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginLeft: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: v_843035.size.msmall,
                      fontFamily: 'Roboto-Bold',
                      color: '#000000',
                    }}>
                    View ad
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {}
      {}
      <View style={{ zIndex: 4 }}>
        <BottomNavigationBar
          items={v_fce460}
          activeItemId="map"
          activeTab={v_ac1d22}
          onItemPress={v_6a213b}
          onTabChange={v_42b5ed}
        />
      </View>

      {}
      <Modal
        visible={v_3b0ada}
        animationType="slide"
        presentationStyle={v_326be8.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={v_3aa877}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' ,
            paddingBottom: v_326be8.OS === 'ios' ? 0 : 40,}}>
          {}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: v_326be8.OS === 'ios' ? 20 : 40,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            backgroundColor: '#fff',
          }}>
            {}
            <TouchableOpacity
              onPress={v_3aa877}
              style={{
                flex: 2,
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginLeft: 8,
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>

            {}
            <Text 
              style={{
                fontSize: 18,
                fontFamily: 'Roboto-Bold',
                color: '#000',
                flex: 8,
                textAlign: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"

            >
              {v_6ced96}
            </Text>

            {}
            <TouchableOpacity
              onPress={v_d59c80}
              style={{
                flex: 2,
                alignItems: 'flex-end',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Ionicons name="information-circle-outline" size={24} color="#388Dc8" />
            </TouchableOpacity>
          </View>

          {}
          {v_b2dceb && !v_fc9bd6 ? (
            <WebView
              key={v_b2dceb}
              source={{ uri: v_b2dceb }}
              style={{ flex: 1 }}
              injectedJavaScript={`
                (function() {
                  let currentUrl = window.location.href;
                  const checkUrl = function() {
                    if (window.location.href !== currentUrl) {
                      const newUrl = window.location.href;
                      currentUrl = newUrl;
                      if (newUrl.startsWith('market://')) {
                        try {
                          const idMatch = newUrl.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            console.log('[injectedJS] window.location market:// 감지, React Native에 알림:', packageId);
                            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'marketRedirect',
                                packageId: packageId
                              }));
                            }
                            const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                            window.location.href = playStoreUrl;
                            return;
                          }
                        } catch (error) {
                          console.error('[injectedJS] market:// 변환 실패:', error);
                        }
                      }
                    }
                  };

                  setInterval(checkUrl, 100);

                  function convertMarketLinks() {
                    const links = document.querySelectorAll('a[href]');
                    links.forEach(function(link) {
                      const href = link.getAttribute('href');
                      if (href && href.startsWith('market://')) {
                        try {
                          const idMatch = href.match(/[?&]id=([^&?#]+)/);
                          if (idMatch) {
                            const packageId = idMatch[1];
                            const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                            link.setAttribute('href', playStoreUrl);
                            console.log('[injectedJS] market://를 play.google.com으로 변환:', playStoreUrl);
                          }
                        } catch (error) {
                          console.error('[injectedJS] market:// 변환 실패:', error);
                        }
                      }
                    });
                  }

                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', convertMarketLinks);
                  } else {
                    convertMarketLinks();
                  }

                  const observer = new MutationObserver(function(mutations) {
                    convertMarketLinks();
                  });

                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });

                  document.addEventListener('click', function(e) {
                    let target = e.target;
                    while (target && target !== document.body) {
                      if (target.tagName === 'A' && target.href) {
                        const url = target.href;
                        if (url.startsWith('market://')) {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const idMatch = url.match(/[?&]id=([^&?#]+)/);
                            if (idMatch) {
                              const packageId = idMatch[1];
                              const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                              console.log('[injectedJS] market:// 클릭 가로채기, 변환:', playStoreUrl);
                              window.location.href = playStoreUrl;
                            }
                          } catch (error) {
                            console.error('[injectedJS] market:// 변환 실패:', error);
                          }
                          return false;
                        } else if (url.startsWith('intent://')) {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const intentIndex = url.indexOf('#Intent');
                            const urlParamStart = url.indexOf('url=');
                            if (urlParamStart !== -1) {
                              const urlValueStart = urlParamStart + 4;
                              const urlValueEnd = intentIndex !== -1 ? intentIndex : url.length;
                              let urlValue = url.substring(urlValueStart, urlValueEnd);
                              const nextParamIndex = urlValue.indexOf('&');
                              if (nextParamIndex !== -1) {
                                urlValue = urlValue.substring(0, nextParamIndex);
                              }
                              if (urlValue) {
                                let decodedUrl = decodeURIComponent(urlValue);
                                if (decodedUrl.includes('%')) {
                                  decodedUrl = decodeURIComponent(decodedUrl);
                                }
                                console.log('[injectedJS] intent://에서 url 파라미터 추출:', decodedUrl);
                                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                                  window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'intentUrl',
                                    url: decodedUrl
                                  }));
                                }
                                return false;
                              }
                            }
                            const idMatch = url.match(/[?&]id=([^&?#]+)/);
                            if (idMatch) {
                              const packageId = idMatch[1];
                              const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + packageId;
                              console.log('[injectedJS] intent://에서 id 추출, Play Store URL:', playStoreUrl);
                              window.location.href = playStoreUrl;
                            }
                          } catch (error) {
                            console.error('[injectedJS] intent:// 변환 실패:', error);
                          }
                          return false;
                        }
                      }
                      target = target.parentElement;
                    }
                  }, true);
                })();
                true;
              `}
              onMessage={(v_d48baf) => {
                try {
                  const v_9390e8 = JSON.parse(v_d48baf.nativeEvent.data);
                  if (v_9390e8.type === 'marketRedirect') {
                    const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_9390e8.packageId}`;
                    console.log('[WebView] onMessage에서 market:// 변환:', v_a1e9b4);
                    v_e60eaf(v_a1e9b4);
                  } else if (v_9390e8.type === 'intentUrl') {
                    console.log('[WebView] onMessage에서 intent:// url 파라미터:', v_9390e8.url);
                    v_f2c756.openURL(v_9390e8.url).catch((v_49263d) => {
                      console.error('[WebView] intent:// url 파라미터로 열기 실패:', v_49263d);
                    });
                  }
                } catch (v_5e9bfe) {

                }
              }}
              onNavigationStateChange={(v_b8df7f) => {
                console.log('[WebView] 네비게이션:', v_b8df7f.url);

                if (v_b8df7f.url && v_b8df7f.url.startsWith('market://')) {
                  try {
                    const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                    if (v_ae8a0a) {
                      const v_77de37 = v_ae8a0a[1];
                      const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                      console.log('[WebView] market://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                      v_e60eaf(v_a1e9b4);
                    }
                  } catch (v_5e9bfe) {
                    console.error('[WebView] market:// 변환 실패:', v_5e9bfe);
                  }
                } else if (v_b8df7f.url && v_b8df7f.url.startsWith('intent://')) {
                  try {

                    const v_d06213 = v_b8df7f.url.indexOf('#Intent');
                    const v_7339bb = v_b8df7f.url.indexOf('url=');
                    if (v_7339bb !== -1) {

                      const v_9e3b3e = v_7339bb + 4;

                      const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_b8df7f.url.length;

                      let v_08a4b2 = v_b8df7f.url.substring(v_9e3b3e, v_5dde79);
                      const v_3dfc26 = v_08a4b2.indexOf('&');
                      if (v_3dfc26 !== -1) {
                        v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                      }

                      if (v_08a4b2) {
                        let v_6a09e6 = v_08a4b2;
                        try {
                          v_6a09e6 = decodeURIComponent(v_08a4b2);

                          if (v_6a09e6.includes('%')) {
                            v_6a09e6 = decodeURIComponent(v_6a09e6);
                          }
                        } catch (v_9e86fd) {

                          v_6a09e6 = v_08a4b2;
                        }

                        console.log('[WebView] intent://에서 url 파라미터 추출 (onNavigationStateChange):', v_6a09e6);
                        v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                          console.error('[WebView] url 파라미터로 열기 실패:', v_49263d);

                          const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                          if (v_ae8a0a) {
                            const v_77de37 = v_ae8a0a[1];
                            const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                            console.log('[WebView] Play Store URL로 폴백:', v_a1e9b4);
                            v_e60eaf(v_a1e9b4);
                          }
                        });
                        return;
                      }
                    }

                    let v_77de37 = '';
                    const v_ae8a0a = v_b8df7f.url.match(/[?&]id=([^&?#]+)/);
                    if (v_ae8a0a) {
                      v_77de37 = v_ae8a0a[1];
                    } else {
                      const v_d555bc = v_b8df7f.url.match(/package=([^;]+)/);
                      if (v_d555bc) {
                        v_77de37 = v_d555bc[1];
                      }
                    }
                    if (v_77de37) {
                      const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                      console.log('[WebView] intent://를 play.google.com으로 변환 (onNavigationStateChange):', v_a1e9b4);
                      v_e60eaf(v_a1e9b4);
                    }
                  } catch (v_5e9bfe) {
                    console.error('[WebView] intent:// 변환 실패:', v_5e9bfe);
                  }
                }
              }}
              onShouldStartLoadWithRequest={(v_576f5a) => {
                const { url: v_f71b56 } = v_576f5a;
                console.log('[WebView] 네비게이션 요청:', v_f71b56);

                if (v_f71b56.startsWith('market://')) {
                  console.warn('[WebView] market:// 스킴 감지 - 백엔드에서 변환되어야 함:', v_f71b56);
                  return false; 
                }

                if (v_f71b56.startsWith('intent://')) {
                  console.log('[WebView] intent:// 스킴 감지:', v_f71b56);

                  try {

                    const v_d06213 = v_f71b56.indexOf('#Intent');
                    const v_7339bb = v_f71b56.indexOf('url=');
                    if (v_7339bb !== -1) {

                      const v_9e3b3e = v_7339bb + 4;

                      const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_f71b56.length;

                      let v_08a4b2 = v_f71b56.substring(v_9e3b3e, v_5dde79);
                      const v_3dfc26 = v_08a4b2.indexOf('&');
                      if (v_3dfc26 !== -1) {
                        v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                      }

                      if (v_08a4b2) {
                        let v_6a09e6 = v_08a4b2;
                        try {
                          v_6a09e6 = decodeURIComponent(v_08a4b2);

                          if (v_6a09e6.includes('%')) {
                            v_6a09e6 = decodeURIComponent(v_6a09e6);
                          }
                        } catch (v_9e86fd) {

                          v_6a09e6 = v_08a4b2;
                        }

                        console.log('[WebView] intent://에서 url 파라미터 추출:', v_6a09e6);

                        v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                          console.error('[WebView] url 파라미터로 열기 실패:', v_49263d);

                          const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                          if (v_ae8a0a) {
                            const v_77de37 = v_ae8a0a[1];
                            const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                            console.log('[WebView] Play Store URL로 폴백:', v_a1e9b4);
                            v_f2c756.openURL(v_a1e9b4).catch((v_033f7e) => {
                              console.error('[WebView] Play Store URL 열기 실패:', v_033f7e);
                            });
                          }
                        });

                        return false;
                      }
                    }

                    const v_98e017 = v_f71b56.match(/scheme=([^;]+)/);
                    const v_e6ce55 = v_f71b56.match(/intent:\/\/([^#]+)/);

                    if (v_98e017 && v_e6ce55) {
                      const v_bee33e = v_98e017[1];
                      const v_e11752 = v_e6ce55[1];
                      const v_de56d9 = `${v_bee33e}://${v_e11752}`;

                      console.log('[WebView] intent://를 일반 URL로 변환:', v_de56d9);

                      v_f2c756.openURL(v_de56d9).catch((v_49263d) => {
                        console.error('[WebView] 변환된 URL 열기 실패:', v_49263d);

                        v_f2c756.openURL(v_f71b56).catch((v_8cdda4) => {
                          console.error('[WebView] Intent URL 열기 실패:', v_8cdda4);
                        });
                      });

                      return false;
                    }

                    const v_d555bc = v_f71b56.match(/package=([^;]+)/);
                    if (v_d555bc) {
                      const v_548289 = v_d555bc[1];
                      const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_548289}`;
                      console.log('[WebView] package 파라미터로 Play Store URL 생성:', v_a1e9b4);

                      v_f2c756.openURL(v_a1e9b4).catch((v_49263d) => {
                        console.error('[WebView] Play Store URL 열기 실패:', v_49263d);

                        v_f2c756.openURL(v_f71b56).catch((v_8cdda4) => {
                          console.error('[WebView] Intent URL 열기 실패:', v_8cdda4);
                        });
                      });

                      return false;
                    }

                    console.log('[WebView] intent:// 파싱 실패, 원본 Intent URL로 열기 시도');
                    v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                      console.error('[WebView] Intent URL 열기 실패:', v_49263d);
                    });
                  } catch (v_5e9bfe) {
                    console.error('[WebView] intent:// 처리 중 오류:', v_5e9bfe);

                    v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                      console.error('[WebView] Intent URL 열기 실패:', v_49263d);
                    });
                  }

                  return false; 
                }

                if (v_f71b56.startsWith('whale://')) {
                  console.log('[WebView] whale:// 스킴 감지:', v_f71b56);

                  try {
                    const v_cd73e9 = v_f71b56.match(/url=([^&]+)/);
                    if (v_cd73e9) {
                      const v_6a09e6 = decodeURIComponent(v_cd73e9[1]);
                      console.log('[WebView] whale://에서 URL 추출:', v_6a09e6);

                      v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                        console.error('[WebView] 추출된 URL 열기 실패:', v_49263d);
                      });
                    } else {

                      v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                        console.error('[WebView] whale:// URL 열기 실패:', v_49263d);
                      });
                    }
                  } catch (v_5e9bfe) {
                    console.error('[WebView] whale:// 처리 중 오류:', v_5e9bfe);

                    v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                      console.error('[WebView] whale:// URL 열기 실패:', v_49263d);
                    });
                  }

                  return false; 
                }

                if (v_f71b56.startsWith('http://') || v_f71b56.startsWith('https://')) {
                  return true;
                }

                return false;
              }}
              renderError={(v_d22b54, v_7a5fef, v_49df87) => {

                return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
              }}
              onError={async (v_6f3a9d) => {
                const { nativeEvent: v_76b943 } = v_6f3a9d;
                console.error('WebView 오류:', v_76b943);

                if (v_76b943.code === -10 && v_76b943.url) {
                  const v_f71b56 = v_76b943.url;
                  console.log('[WebView] ERR_UNKNOWN_URL_SCHEME 감지:', v_f71b56);

                  if (v_f71b56.startsWith('intent://')) {
                    try {

                      const v_d06213 = v_f71b56.indexOf('#Intent');
                      const v_7339bb = v_f71b56.indexOf('url=');
                      if (v_7339bb !== -1) {
                        const v_9e3b3e = v_7339bb + 4;
                        const v_5dde79 = v_d06213 !== -1 ? v_d06213 : v_f71b56.length;
                        let v_08a4b2 = v_f71b56.substring(v_9e3b3e, v_5dde79);
                        const v_3dfc26 = v_08a4b2.indexOf('&');
                        if (v_3dfc26 !== -1) {
                          v_08a4b2 = v_08a4b2.substring(0, v_3dfc26);
                        }
                        if (v_08a4b2) {
                          let v_6a09e6 = v_08a4b2;
                          try {
                            v_6a09e6 = decodeURIComponent(v_08a4b2);
                            if (v_6a09e6.includes('%')) {
                              v_6a09e6 = decodeURIComponent(v_6a09e6);
                            }
                          } catch (v_9e86fd) {
                            v_6a09e6 = v_08a4b2;
                          }
                          console.log('[WebView] onError에서 intent:// url 파라미터 추출:', v_6a09e6);
                          v_f2c756.openURL(v_6a09e6).catch((v_49263d) => {
                            console.error('[WebView] intent:// url 파라미터로 열기 실패:', v_49263d);
                          });
                          return; 
                        }
                      }

                      const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        const v_77de37 = v_ae8a0a[1];
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] onError에서 intent:// id 추출, Play Store URL:', v_a1e9b4);
                        v_e60eaf(v_a1e9b4);
                        return; 
                      }
                    } catch (v_5e9bfe) {
                      console.error('[WebView] onError에서 intent:// 처리 실패:', v_5e9bfe);
                    }
                  } else if (v_f71b56.startsWith('market://')) {
                    try {
                      const v_ae8a0a = v_f71b56.match(/[?&]id=([^&?#]+)/);
                      if (v_ae8a0a) {
                        const v_77de37 = v_ae8a0a[1];
                        const v_a1e9b4 = `https://play.google.com/store/apps/details?id=${v_77de37}`;
                        console.log('[WebView] onError에서 market:// 변환:', v_a1e9b4);
                        v_e60eaf(v_a1e9b4);
                        return; 
                      }
                    } catch (v_5e9bfe) {
                      console.error('[WebView] onError에서 market:// 처리 실패:', v_5e9bfe);
                    }
                  }
                }

                v_8aeec2(true);

                if (v_326be8.OS === 'ios' && (v_76b943.code === -1022 || v_76b943.code === -1200)) {
                  const v_a4f1b0 = v_76b943.code === -1022 ? 'ATS' : 'TLS';
                  console.error(`[WebView] ${v_a4f1b0} 오류 감지 (${v_76b943.code}):`, v_76b943.url || v_b2dceb);

                  let v_f71b56 = v_76b943.url || v_b2dceb;

                  if (v_f71b56 && v_f71b56.startsWith('http://')) {
                    const v_3e273a = v_f71b56.replace('http://', 'https://');
                    console.log('[WebView] HTTP를 HTTPS로 변환 시도:', v_3e273a);

                    try {
                      v_8aeec2(false); 
                      v_e60eaf(v_3e273a);
                      return; 
                    } catch (v_5e9bfe) {
                      console.error('[WebView] HTTPS 변환 후 재시도 실패:', v_5e9bfe);
                      v_f71b56 = v_3e273a; 
                    }
                  }

                  if (v_f71b56) {
                    await v_889fad(
                      v_a4f1b0 === 'ATS' ? '보안 연결 오류' : '보안 연결 오류',
                      v_a4f1b0 === 'ATS' 
                        ? '이 페이지는 보안 연결(HTTPS)을 사용하지 않아 로드할 수 없습니다. 외부 브라우저로 열까요?'
                        : '이 페이지는 보안 연결을 사용할 수 없습니다. 외부 브라우저로 열까요?',
                      [
                        {
                          text: '취소',
                          style: 'cancel',
                          onPress: () => {

                            v_3aa877();
                          },
                        },
                        {
                          text: '외부 브라우저로 열기',
                          onPress: () => {
                            v_f2c756.openURL(v_f71b56).catch((v_49263d) => {
                              console.error('[WebView] 외부 브라우저 열기 실패:', v_49263d);
                            });

                            v_3aa877();
                          },
                        },
                      ],
                    );
                  }
                }
              }}
              onHttpError={(v_6f3a9d) => {
                const { nativeEvent: v_76b943 } = v_6f3a9d;
                console.error('WebView HTTP 오류:', v_76b943);
              }}
            />
          ) : null}
        </View>
      </Modal>

      {}
      <Modal
        visible={v_fa7c50}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {

          v_219124(false);
        }}
        onDismiss={() => {

          console.log('📱 [CameraMainScreen] 광고 상세 모달이 완전히 닫혔습니다 (onDismiss)');

          if (v_326be8.OS === 'ios') {
            console.log('🔄 [CameraMainScreen] onDismiss에서 iOS 복원 트리거');
            setTimeout(() => {
              v_7d7b3a(v_ba2215 => v_ba2215 + 1);
            }, 100);
          }
        }}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          {(() => {

            const v_5a9c46 = v_d0b6d4?.ad_company || v_04cb77?.ad_company || 'nas';
            console.log('🔍 모달 내부 ad_company 확인:', v_5a9c46, {
              fromParams: v_d0b6d4?.ad_company,
              fromToken: v_04cb77?.ad_company,
              final: v_5a9c46,
            });

            if (v_5a9c46 === 'pock' || v_5a9c46 === 'pointclick' || v_5a9c46 === 'POCK') {
              return (
                <ShowPockAdScreen
                  onClose={async () => {
                    v_219124(false);

                    if (v_181e3e.current) {
                      clearTimeout(v_181e3e.current);
                      v_181e3e.current = null;
                    }
                    if (v_a27ed2.current) {
                      clearTimeout(v_a27ed2.current);
                      v_a27ed2.current = null;
                    }
                    v_6890b1.current = false;

                    const v_764826 = await v_e84827.getItem('shouldNavigateToCamera');
                    if (v_764826 === 'true') {
                      await v_e84827.removeItem('shouldNavigateToCamera');

                    }
                  }}
                  isModal={true}
                />
              );
            } else {
              return (
                <ShowNapAdScreen
                  onClose={async () => {
                    v_219124(false);

                    if (v_181e3e.current) {
                      clearTimeout(v_181e3e.current);
                      v_181e3e.current = null;
                    }
                    if (v_a27ed2.current) {
                      clearTimeout(v_a27ed2.current);
                      v_a27ed2.current = null;
                    }
                    v_6890b1.current = false;

                    const v_764826 = await v_e84827.getItem('shouldNavigateToCamera');
                    if (v_764826 === 'true') {
                      await v_e84827.removeItem('shouldNavigateToCamera');

                    }
                  }}
                  isModal={true}
                />
              );
            }
          })()}
        </View>
        {

}
      </Modal>

      {}
      <Dialog
        visible={v_def1ae}
        title={v_8d41d7('screens.camera.genderAgeRequired') || '성별과 연령대를 입력해주세요'}
        actions={[
          {
            label: v_8d41d7('common.buttons.confirm') || '확인',
            onPress: v_8285e9,
            variant: 'primary',
            disabled: v_46602a || !v_2610e9 || !v_10adc9,
          },
        ]}
      >
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>
              {v_8d41d7('screens.camera.genderLabel') || '성별'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <OptionButton
                label={v_8d41d7('screens.signup.genderMale') || '남성'}
                selected={v_2610e9 === 'male'}
                onPress={() => v_12be53('male')}
              />
              <OptionButton
                label={v_8d41d7('screens.signup.genderFemale') || '여성'}
                selected={v_2610e9 === 'female'}
                onPress={() => v_12be53('female')}
              />
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>
              {v_8d41d7('screens.camera.ageLabel') || '연령대'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(['10', '20', '30', '40', '50+'] as const).map((v_2694bd) => (
                <OptionButton
                  key={v_2694bd}
                  label={v_2694bd}
                  selected={v_10adc9 === v_2694bd}
                  onPress={() => v_8d44be(v_2694bd)}
                  flex={v_2694bd !== '50+' ? 1 : undefined}
                />
              ))}
            </View>
          </View>
        </View>
      </Dialog>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusBar: {
    height: 44,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 21,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4, 
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {

  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1, 
  },
  camera: {
    flex: 1,
    marginTop: 42,
    width: '100%',
    height: '100%',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  mapPinButton: {
    position: 'absolute',
    top: 61,
    right: 16,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinIcon: {
    width: 25,
    height: 25,
  },

  tokenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 5, 
  },

  tokenSpot: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 150,
    height: 175,
    borderRadius: 150,
  },

  tokenButtonContainer: {
    height: 94,
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tokenButton: {
    height: 94,
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161d2d',
    borderRadius: 47,
    borderWidth: 3,
    borderColor: '#E5E5E5',
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },

  tokenIcon: {
    height: '60%',
    width: '60%',
  },

  tokenPriceText: {
    color: 'white',
    fontSize: v_843035.size.small,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tokenDistanceText: {
    color: '#CCCCCC',
    fontSize: v_843035.size.xxsmall,
    marginTop: -2,
    textAlign: 'center',
  },

  blinkImage: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
    position: 'absolute',
    top: -80,
  },
  topLogo: {
    position: 'absolute',
    top: 76,
    left: 8,
    width: v_700696.get('window').width / 4,
    height: v_700696.get('window').width / 4,
    zIndex: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

