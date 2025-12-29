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
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_78ceb7, v_d4f1cc } from 'mbgbsytfgyr';
import * as v_8a44cb from 'zryrlwvgokjhz';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_f4e704, v_66b9cc, v_c2fdd1, v_89c10a } from '../components';
import { v_843035 } from '../constants';
import { v_60c7c3, v_f71847 } from '../types';
import { v_f84ef5, v_5d7ca4, v_563153, v_a7ab3c, v_71d37e, v_07f367 } from '../services';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_287831 } from './ShowNapAdScreen';
import { v_540580 } from './ShowPockAdScreen';
import { v_cba33f } from '../utils';

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
        }}
      />

      <TouchableOpacity
        onPress={v_719eed}
        style={[
          v_d81136.tokenButtonContainer,
          {
            transform: [
              { scale: v_c4aeea(v_926d1c) },
            ],
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
          {parseFloat(String(v_926d1c)) < 30 && (
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
                v_a5ed76 && { top: -90 },
              ]}
            />
          )}
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
let v_79011b = null;
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
  v_79011b = require('../../assets/images/icon_referral.png');
} catch (v_9e86fd) {
  console.warn('icon_referral.png not found');
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

  const [v_ef86b6, v_8ce112] = v_5ab095<v_60c7c3[]>([]);
  const [v_b9ce93, v_7bb835] = v_5ab095<any[]>([]); 
  const [v_683210, v_34a50a] = v_5ab095(true);
  const v_a96760 = v_e662ae(0);
  const v_253a77 = 5;

  const [v_1f3d99, v_7d7b3a] = v_5ab095(0);

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

  const [v_94a194, v_3fff8d] = v_5ab095(v_6b5698.currentState);

  const v_0b2c53 = v_e662ae(false);

  const v_181e3e = v_e662ae<NodeJS.Timeout | null>(null);
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

  const v_0a6f80 = v_de06a3((v_8ac288) => {
    if (v_8ac288.length === 0) {
      v_8ce112([]);
      return;
    }

    console.log('🔄 [organizeData] 호출:', {
      currentIndex: v_a96760.current,
      totalDataLength: v_8ac288.length,
      chunkSize: v_253a77,
    });

    let v_2e375c = [];
    let v_da1995 = Math.min(v_253a77, v_8ac288.length);

    if (v_a96760.current + v_da1995 > v_8ac288.length) {

      v_2e375c = [
        ...v_8ac288.slice(v_a96760.current),
        ...v_8ac288.slice(0, (v_a96760.current + v_da1995) % v_8ac288.length),
      ];
      v_a96760.current = (v_a96760.current + v_da1995) % v_8ac288.length;
    } else {

      v_2e375c = v_8ac288.slice(v_a96760.current, v_a96760.current + v_da1995);
      v_a96760.current = (v_a96760.current + v_da1995) % v_8ac288.length;
    }

    console.log('📋 [organizeData] 선택된 데이터 (처음 5개):', v_2e375c.slice(0, 5).map((v_d5dda0, v_e86ad8) => ({
      index: v_e86ad8,
      distance: v_d5dda0.distance,
      advertisement: v_d5dda0.advertisement,
      campid: v_d5dda0.campid,
      name: v_d5dda0.name,
      xrunPrice: v_d5dda0.xrunPrice,
    })));

    const v_368ba7 = v_2e375c.map((v_9390e8, v_a56041) => {
      return { ...v_4ac6a7[v_a56041 % v_4ac6a7.length], ...v_9390e8 };
    });

    console.log('✅ [organizeData] 최종 토큰 데이터:', v_368ba7.map((v_8d41d7, v_e86ad8) => ({
      spotID: v_8d41d7.spotID,
      distance: v_8d41d7.distance,
      advertisement: v_8d41d7.advertisement,
      campid: v_8d41d7.campid,
      name: v_8d41d7.name,
      xrunPrice: v_8d41d7.xrunPrice,
    })));

    v_8ce112(v_368ba7);
  }, []);

  const v_c4c061 = v_de06a3(async (v_9d6a91 = false) => {

    if (v_0b2c53.current && !v_9d6a91) {
      return;
    }

    try {
      v_34a50a(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', v_9d6a91 ? '(강제 새로고침)' : '');

      await v_e1f9f9();

      if (!v_9d6a91) {
        const v_99c46d = await v_e84827.getItem('astorCoinsData');

        if (v_99c46d) {
          console.log('✅ AsyncStorage에서 astorCoinsData 발견');
          try {
            const v_b9ce93 = JSON.parse(v_99c46d);

            if (v_b9ce93 && Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

              const v_3d87ed = v_b9ce93.map((v_51b584) => {

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

              console.log('✅ validatedCoinsData 생성 완료:', v_3d87ed.length, '개');

              try {

                console.log('[CameraMainScreen] 1단계: TopAd5 데이터 새로고침 시작');
                let v_e36b07 = await v_563153();

                if (Array.isArray(v_e36b07) && v_e36b07.length === 0) {
                  console.log('[CameraMainScreen] ℹ️ 활성 광고 캠페인이 없습니다 (서버 정상 응답)');
                  v_e36b07 = null; 
                }

                if (!v_e36b07 || !Array.isArray(v_e36b07)) {
                  console.warn('[CameraMainScreen] TopAd5 API 호출 실패. 저장된 데이터 사용 시도');
                  v_e36b07 = await v_5d7ca4();
                }

                if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {
                  console.log('✅ [CameraMainScreen] TopAd5 데이터 발견:', v_e36b07.length, '개');

                  console.log('🔍 [CameraMainScreen] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
                    keys: Object.keys(v_e36b07[0] || {}),
                    firstItem: v_e36b07[0],
                  });

                  const v_beddf3 = [...v_3d87ed].sort((v_779914, v_148ff6) => {
                    const v_1b0610 = parseFloat(String(v_779914.distance || 0));
                    const v_161ea9 = parseFloat(String(v_148ff6.distance || 0));
                    return v_1b0610 - v_161ea9; 
                  });

                  console.log('📊 [CameraMainScreen] 거리 순 정렬 완료 (가까운 순서)');

                  const v_dc4d18 = 5;
                  const v_09cb96 = v_e36b07.length * v_dc4d18;

                  const v_7864b3 = new Map<number, number>();

                  const v_8ceeaa = v_beddf3.map((v_51b584, v_a56041) => {

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
                    };
                  });

                  console.log('✅ [CameraMainScreen] TopAd5 매핑 완료:', v_8ceeaa.length, '개 토큰');

                  console.log('🔍 [loadTokenData] mappedCoinsData 고유 데이터 확인 (처음 10개):');
                  v_8ceeaa.slice(0, 10).forEach((v_51b584, v_e86ad8) => {
                    console.log(`📋 mappedCoinsData[${v_e86ad8}]:`, {
                      name: v_51b584.name,
                      advertisement: v_51b584.advertisement,
                      campid: v_51b584.campid,
                      xrunPrice: v_51b584.xrunPrice,
                      distance: v_51b584.distance,
                      coin: v_51b584.coin,
                      brand: v_51b584.brand,
                    });
                  });

                  const v_d05944 = v_8ceeaa.map((v_3f4e2e) => v_3f4e2e.advertisement).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                  const v_f1a4ef = v_8ceeaa.map((v_3f4e2e) => v_3f4e2e.campid).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                  const v_f64f3e = Array.from(new Set(v_d05944));
                  const v_8d3fbf = Array.from(new Set(v_f1a4ef));
                  console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                    total: v_8ceeaa.length,
                    uniqueAdvertisements: v_f64f3e.length,
                    uniqueCampids: v_8d3fbf.length,
                    advertisementValues: v_f64f3e.slice(0, 10),
                    campidValues: v_8d3fbf.slice(0, 10),
                  });

                  v_7bb835(v_8ceeaa);

                  v_a96760.current = 0;
                  console.log('🔄 [CameraMainScreen] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');

                  v_0a6f80(v_8ceeaa);
                } else {
                  console.log('⚠️ [CameraMainScreen] TopAd5 데이터 없음, 기존 데이터 사용');

                  console.log('🔍 [loadTokenData] validatedCoinsData 고유 데이터 확인 (처음 10개):');
                  v_3d87ed.slice(0, 10).forEach((v_51b584, v_e86ad8) => {
                    console.log(`📋 validatedCoinsData[${v_e86ad8}]:`, {
                      name: v_51b584.name,
                      advertisement: v_51b584.advertisement,
                      campid: v_51b584.campid,
                      xrunPrice: v_51b584.xrunPrice,
                      coin: v_51b584.coin,
                      brand: v_51b584.brand,
                    });
                  });

                  const v_d05944 = v_3d87ed.map((v_3f4e2e) => v_3f4e2e.advertisement).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                  const v_f1a4ef = v_3d87ed.map((v_3f4e2e) => v_3f4e2e.campid).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                  const v_f64f3e = Array.from(new Set(v_d05944));
                  const v_8d3fbf = Array.from(new Set(v_f1a4ef));
                  console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                    total: v_3d87ed.length,
                    uniqueAdvertisements: v_f64f3e.length,
                    uniqueCampids: v_8d3fbf.length,
                    advertisementValues: v_f64f3e.slice(0, 10),
                    campidValues: v_8d3fbf.slice(0, 10),
                  });

                  v_7bb835(v_3d87ed);

                  v_0a6f80(v_3d87ed);
                }
              } catch (v_b87cac) {
                console.error('❌ [CameraMainScreen] TopAd5 데이터 가져오기 실패:', v_b87cac);
                console.log('⚠️ 기존 데이터 사용');

                console.log('🔍 [loadTokenData] validatedCoinsData 고유 데이터 확인 (처음 10개):');
                v_3d87ed.slice(0, 10).forEach((v_51b584, v_e86ad8) => {
                  console.log(`📋 validatedCoinsData[${v_e86ad8}]:`, {
                    name: v_51b584.name,
                    advertisement: v_51b584.advertisement,
                    campid: v_51b584.campid,
                    xrunPrice: v_51b584.xrunPrice,
                    coin: v_51b584.coin,
                    brand: v_51b584.brand,
                  });
                });

                const v_d05944 = v_3d87ed.map((v_3f4e2e) => v_3f4e2e.advertisement).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                const v_f1a4ef = v_3d87ed.map((v_3f4e2e) => v_3f4e2e.campid).filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
                const v_f64f3e = Array.from(new Set(v_d05944));
                const v_8d3fbf = Array.from(new Set(v_f1a4ef));
                console.log('📊 [loadTokenData] 전체 데이터 고유값 통계:', {
                  total: v_3d87ed.length,
                  uniqueAdvertisements: v_f64f3e.length,
                  uniqueCampids: v_8d3fbf.length,
                  advertisementValues: v_f64f3e.slice(0, 10),
                  campidValues: v_8d3fbf.slice(0, 10),
                });

                v_7bb835(v_3d87ed);

                v_0a6f80(v_3d87ed);
              }

              v_0b2c53.current = true;
              v_34a50a(false);
              return;
            }
          } catch (v_5f9add) {
            console.error('astorCoinsData 파싱 오류:', v_5f9add);
          }
        }
      }

      if (v_9d6a91) {
        console.log('🔄 서버에서 새 데이터 가져오기');
      } else {
        console.log('⚠️ AsyncStorage에 데이터 없음, API 호출');
      }

      const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
      if (v_d308b5 !== 'granted') {
        console.log('위치 권한이 없습니다.');
        v_34a50a(false);
        return;
      }

      const v_7dd198 = await v_8a44cb.getCurrentPositionAsync({
        accuracy: v_8a44cb.Accuracy.High,
      });

      const v_ef7306 = await v_e84827.getItem('userData');
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

      const v_003147 = await v_f84ef5(
        v_7dd198.coords.latitude,
        v_7dd198.coords.longitude,
        v_660822,
        v_9b57fc,
      );

      if (v_003147 && v_003147.length > 0) {

        await v_e84827.setItem('astorCoinsData', JSON.stringify(v_003147));

        const v_3d87ed = v_003147.map((v_51b584) => {

          const v_8ec93d = v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || v_51b584.coins || 0;

          console.log(`🔍 [loadTokenData API] 코인 원본 데이터 확인:`, {
            coin: v_51b584.coin,
            advertisement: v_51b584.advertisement,
            xrunPrice: v_51b584.xrunPrice,
            xrunprice: v_51b584.xrunprice,
            price: v_51b584.price,
            coins: v_51b584.coins,
            originalXrunPrice: v_8ec93d,
          });

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

        try {

          console.log('[CameraMainScreen API] 1단계: TopAd5 데이터 새로고침 시작');
          let v_e36b07 = await v_563153();

          if (Array.isArray(v_e36b07) && v_e36b07.length === 0) {
            console.log('[CameraMainScreen API] ℹ️ 활성 광고 캠페인이 없습니다 (서버 정상 응답)');
            v_e36b07 = null; 
          }

          if (!v_e36b07 || !Array.isArray(v_e36b07)) {
            console.warn('[CameraMainScreen API] TopAd5 API 호출 실패. 저장된 데이터 사용 시도');
            v_e36b07 = await v_5d7ca4();
          }

          if (v_e36b07 && Array.isArray(v_e36b07) && v_e36b07.length > 0) {
            console.log('✅ [CameraMainScreen API] TopAd5 데이터 발견:', v_e36b07.length, '개');

            console.log('🔍 [CameraMainScreen API] TopAd5 데이터 구조 확인 (첫 번째 항목):', {
              keys: Object.keys(v_e36b07[0] || {}),
              firstItem: v_e36b07[0],
            });

            const v_beddf3 = [...v_3d87ed].sort((v_779914, v_148ff6) => {
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
              const v_aa0917 = v_127b33?.campid;

              if (v_aa0917) {
                const v_375fda = v_7864b3.get(v_aa0917) || 0;
                if (v_375fda >= v_dc4d18) {
                  return v_51b584;
                }
                v_7864b3.set(v_aa0917, v_375fda + 1);
              }

              console.log(`🔗 [CameraMainScreen API] 토큰 ${v_a56041} 매핑:`, {
                distance: v_51b584.distance,
                adIndex: v_ba7922,
                adName: v_127b33?.name || '없음',
                adCompany: v_127b33?.ad_company || '없음',
                originalAdvertisement: v_51b584.advertisement,
                originalCampid: v_51b584.campid,
                mappedAdvertisement: v_127b33?.advertisement || v_127b33?.adid || v_127b33?.ad || v_127b33?.coin,
                mappedCampid: v_127b33?.campid,
              });

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
              };
            });

            console.log('✅ [CameraMainScreen API] TopAd5 매핑 완료:', v_8ceeaa.length, '개 토큰');

            v_7bb835(v_8ceeaa);

            v_a96760.current = 0;
            console.log('🔄 [CameraMainScreen API] TopAd5 매핑 후 인덱스 리셋 (항상 처음 5개 사용)');

            v_0a6f80(v_8ceeaa);
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
    } catch (v_5e9bfe) {
      console.error('데이터 로딩 오류:', v_5e9bfe);
      v_8ce112([]);
    } finally {
      v_34a50a(false);
    }
  }, [v_9b57fc]);

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

    const v_ad1d65 = setInterval(() => {
      console.log('⏰ 3분 경과 - 다른 코인들로 교체');
      if (v_b9ce93.length > 0) {
        v_0a6f80(v_b9ce93);
      }
    }, 180000); 

    return () => clearInterval(v_ad1d65); 
  }, [v_b9ce93, v_0a6f80]); 

  v_c4deb2(() => {
    const v_7a424f = (nextAppState: typeof v_94a194) => {
      console.log('📱 AppState 변경:', v_94a194, '->', v_3b10d8);

      if (v_94a194.match(/inactive|background/) && v_3b10d8 === 'active') {

        console.log('🔄 앱 활성화 - 토큰 애니메이션 재시작');
        v_0b240b();
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
  }, [v_94a194, v_24b08b, v_0b240b]);

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
    console.log('🔄 selectedToken 변경 감지:', {
      spotID: v_04cb77?.spotID,
      advertisement: v_04cb77?.advertisement,
      campid: v_04cb77?.campid,
      coin: v_04cb77?.coin,
      xrunPrice: v_04cb77?.xrunPrice,
      name: v_04cb77?.name,
    });
    v_6890b1.current = false;
  }, [v_04cb77]);

  v_c4deb2(() => {
    console.log('📱 CameraMainScreen 포커스 받음');

    return () => {
      console.log('📱 CameraMainScreen 포커스 잃음 - 광고 초기화 중단');

      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
        console.log('⏹️ 자동 광고 이동 타이머 정리됨');
      }

      v_6890b1.current = false;
      console.log('🔄 자동 광고 트리거 상태 리셋됨');
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
      case 'wallet':
        v_9b57fc(v_ce4741.wallet);
        break;
      case 'shop':
        v_9b57fc(v_ce4741.shopTicket);
        break;
      case 'referral':
        v_9b57fc(v_ce4741.referralSettlement);
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
      console.log('=== showAdInModal 함수 시작 ===');
      console.log('📥 전달받은 토큰 원본:', JSON.stringify(v_21cc31, null, 2));

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
        console.error('❌ advertisement가 유효하지 않습니다');
        return;
      }

      if (!v_aa0917 || v_aa0917 === '' || v_aa0917 === 'undefined') {
        console.error('❌ campid가 유효하지 않습니다');
        return;
      }

      const v_5a9c46 = v_21cc31.ad_company || 'nas';
      console.log('🔍 ad_company 확인:', v_5a9c46);

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
      };

      console.log('✅ showAdInModal 최종 파라미터:', JSON.stringify(v_75c344, null, 2));

      v_96a9ed(v_21cc31);

      v_d48a26(v_75c344);

      setTimeout(() => {
        console.log('🔄 Context 업데이트 완료 - 모달 표시');
        v_219124(true);
      }, 100);
    } catch (v_5e9bfe) {
      console.error('❌ showAdInModal 오류:', v_5e9bfe);
    }
  }, [v_d48a26]);

  const v_917f22 = v_de06a3(async (token: v_60c7c3) => {
    try {
      console.log('=== navigateToAd 함수 시작 ===');
      console.log('📥 전달받은 토큰 원본:', JSON.stringify(v_21cc31, null, 2));
      console.log('🔍 navigateToAd 토큰 상세:', {
        spotID: v_21cc31.spotID,
        advertisement: v_21cc31.advertisement,
        campid: v_21cc31.campid,
        coin: v_21cc31.coin,
        xrunPrice: v_21cc31.xrunPrice,
        name: v_21cc31.name,
        brand: v_21cc31.brand,
        ad_company: v_21cc31.ad_company,
      });

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

      console.log('🔍 navigateToAd - advertisement/campid 추출:', {
        tokenAdvertisement: v_21cc31.advertisement,
        tokenCampid: v_21cc31.campid,
        extractedAdvertisement: v_5389c3,
        extractedCampid: v_aa0917,
        tokenSpotID: v_21cc31.spotID,
        tokenCoin: v_21cc31.coin,
        tokenAdCompany: v_21cc31.ad_company,
      });

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
      };

      console.log('✅ navigateToAd 최종 파라미터:', JSON.stringify(v_75c344, null, 2));
      console.log('🔍 파라미터 상세:', {
        member: v_660822,
        advertisement: v_5389c3,
        campid: v_aa0917,
        coin: v_21cc31.coin,
        name: v_21cc31.name,
        xrunPrice: v_21cc31.xrunPrice,
        joindesc: v_21cc31.joindesc,
        ad_company: v_5a9c46,
      });

      console.log('🔄 Context에 광고 파라미터 설정 전:', {
        advertisement: v_75c344.advertisement,
        campid: v_75c344.campid,
        coin: v_75c344.coin,
        name: v_75c344.name,
        ad_company: v_75c344.ad_company,
      });
      v_d48a26(v_75c344);
      console.log('✅ Context에 광고 파라미터 설정 완료:', {
        advertisement: v_75c344.advertisement,
        campid: v_75c344.campid,
        coin: v_75c344.coin,
        name: v_75c344.name,
        ad_company: v_75c344.ad_company,
      });

      if (v_5a9c46 === 'pock' || v_5a9c46 === 'pointclick' || v_5a9c46 === 'POCK') {

        console.log('🚀 ShowPockAd 화면으로 이동 시작 (reset 사용)...');
        console.log('🔍 이동 시 전달할 파라미터:', {
          advertisement: v_75c344.advertisement,
          campid: v_75c344.campid,
          coin: v_75c344.coin,
          name: v_75c344.name,
          ad_company: v_75c344.ad_company,
        });
        v_487a25(v_ce4741.showPockAd);
        console.log('✅ ShowPockAd 화면으로 이동 완료');
      } else {

        console.log('🚀 ShowNapAd 화면으로 이동 시작 (reset 사용)...');
        console.log('🔍 이동 시 전달할 파라미터:', {
          advertisement: v_75c344.advertisement,
          campid: v_75c344.campid,
          coin: v_75c344.coin,
          name: v_75c344.name,
          ad_company: v_75c344.ad_company,
        });
        v_487a25(v_ce4741.showNapAd);
        console.log('✅ ShowNapAd 화면으로 이동 완료');
      }
    } catch (v_5e9bfe) {
      console.error('❌ navigateToAd 오류:', v_5e9bfe);
    }
  }, [v_9b57fc, v_487a25, v_d48a26]);

  v_c4deb2(() => {
    if (v_572bd3 && v_04cb77 && !v_6890b1.current) {

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

      console.log('📱 하단 패널 열림 - 3초 후 자동 광고 이동 타이머 설정');
      console.log('🔍 자동 광고 이동 대상 토큰 (현재 selectedToken):', {
        advertisement: v_191c8b.advertisement,
        campid: v_191c8b.campid,
        coin: v_191c8b.coin,
        name: v_191c8b.name,
        spotID: v_191c8b.spotID,
      });
      v_6890b1.current = true;
      v_181e3e.current = setTimeout(() => {
        console.log('⏰ 3초 경과 - 자동으로 광고 화면으로 이동');
        console.log('🔍 자동 이동 시 토큰 정보 (저장된 currentToken):', {
          advertisement: v_191c8b.advertisement,
          campid: v_191c8b.campid,
          coin: v_191c8b.coin,
          name: v_191c8b.name,
          spotID: v_191c8b.spotID,
        });
        v_917f22(v_191c8b);
      }, 3000); 
    } else {

      if (v_181e3e.current) {
        console.log('📱 하단 패널 닫힘 또는 토큰 변경 - 자동 광고 이동 타이머 정리');
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }
    }

    return () => {
      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
      }
    };
  }, [v_572bd3, v_04cb77, v_917f22]);

  const v_eed806 = v_de06a3((token: v_60c7c3) => {
    console.log('=== 토큰 클릭 이벤트 발생 ===');
    console.log('클릭된 토큰 정보:', JSON.stringify(v_21cc31, null, 2));
    console.log('🔍 클릭된 토큰 상세:', {
      spotID: v_21cc31.spotID,
      advertisement: v_21cc31.advertisement,
      campid: v_21cc31.campid,
      coin: v_21cc31.coin,
      xrunPrice: v_21cc31.xrunPrice,
      name: v_21cc31.name,
    });

    if (v_181e3e.current) {
      console.log('🔄 다른 토큰 클릭 - 이전 자동 광고 이동 타이머 정리');
      clearTimeout(v_181e3e.current);
      v_181e3e.current = null;
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

    console.log('🔍 tokenCopy 상세 검증:', {
      spotID: v_021ef9.spotID,
      advertisement: v_021ef9.advertisement,
      campid: v_021ef9.campid,
      coin: v_021ef9.coin,
      name: v_021ef9.name,
    });

    v_96a9ed(v_021ef9);
    v_6a4dcd(true); 

    setTimeout(() => {
      console.log('⏱️ selectedToken 업데이트 확인 (100ms 후):', {
        advertisement: v_021ef9.advertisement,
        campid: v_021ef9.campid,
        coin: v_021ef9.coin,
        ad_company: v_021ef9.ad_company,
      });
    }, 100);
  }, []);

  const v_fce460 = [
    { id: 'wallet', label: v_8d41d7('components.bottomNavigationBar.wallet'), icon: v_8daafe },
    { id: 'shop', label: v_8d41d7('components.bottomNavigationBar.shop'), icon: v_e96568 },
    { id: 'map', label: '' }, 
    { id: 'referral', label: v_8d41d7('components.bottomNavigationBar.referral'), icon: v_79011b },
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

              v_ef86b6.forEach((v_8d41d7) => {
                console.log('토큰:', {
                  spotID: v_8d41d7.spotID,
                  advertisement: v_8d41d7.advertisement,
                  campid: v_8d41d7.campid,
                  coin: v_8d41d7.coin,
                  xrunPrice: v_8d41d7.xrunPrice,
                  distance: v_8d41d7.distance,
                  ad_company: v_8d41d7.ad_company,
                });
              });

              return v_ef86b6
                .sort((v_779914, v_148ff6) => (v_148ff6.distance || 0) - (v_779914.distance || 0)) 
                .map((v_21cc31) => {

                  const v_d0be5e = () => {
                    console.log('🖱️ [TokenComponent] 토큰 클릭됨:', {
                      spotID: v_21cc31.spotID,
                      advertisement: v_21cc31.advertisement,
                      campid: v_21cc31.campid,
                      coin: v_21cc31.coin,
                      name: v_21cc31.name,
                    });
                    v_eed806(v_21cc31);
                  };

                  return (
                    <TokenComponent
                      key={v_21cc31.spotID}
                      token={v_21cc31}
                      onPress={v_d0be5e} 
                      animationRefs={v_5b4d76}
                      appState={v_94a194}
                      rageProgress={v_95eb72}
                      isRageMode={v_a5ed76}
                      rageColor={v_269c04}
                      calculateScaleBasedOnDistance={v_c4aeea}
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
              zIndex: 3, 
              pointerEvents: v_572bd3 ? 'box-none' : 'none', 
            },
          ]}>
          <Pressable
            onPress={() => {
              if (v_572bd3) {
                console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                v_6a4dcd(false);
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
        visible={v_fa7c50}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          console.log('모달 닫기 요청');
          v_219124(false);
        }}
        onDismiss={() => {

          console.log('📱 [CameraMainScreen] 모달이 완전히 닫혔습니다 (onDismiss)');
          console.log('📊 [CameraMainScreen] 현재 상태 확인:', {
            showAdModal: v_fa7c50,
            activeTab: v_ac1d22,
            loading: v_683210,
            tokensCount: v_ef86b6?.length ?? 0,
            appState: v_6b5698.currentState,
          });

          if (v_326be8.OS === 'ios') {
            console.log('🔄 [CameraMainScreen] onDismiss에서 iOS 복원 트리거');
            setTimeout(() => {
              v_7d7b3a(v_ba2215 => v_ba2215 + 1);
            }, 100);
          }
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
                onClose={() => {
                  console.log('ShowPockAdScreen 모달 닫기');
                  v_219124(false);

                }}
              />
            );
          } else {
            return (
              <ShowNapAdScreen
                onClose={() => {
                  console.log('ShowNapAdScreen 모달 닫기');
                  v_219124(false);

                }}
              />
            );
          }
        })()}
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

