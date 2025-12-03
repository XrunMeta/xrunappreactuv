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
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_78ceb7, v_d4f1cc } from 'mbgbsytfgyr';
import * as v_8a44cb from 'zryrlwvgokjhz';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_f4e704 } from '../components';
import { v_60c7c3, v_f71847 } from '../types';
import { v_f84ef5 } from '../services';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_4b1173 } from '../context/AlertDialogContext';

const { width: v_8e4fb6, height: v_c86e33 } = v_700696.get('window');

const v_4ac6a7 = [
  { spotID: 1, x: 0, y: 0 },
  { spotID: 2, x: -100, y: 50 },
  { spotID: 3, x: 100, y: 50 },
  { spotID: 4, x: -50, y: 150 },
];

const v_69ee00 = (v_3b402b, v_4f2c9c): number => {
  return v_3b402b + (Math.random() * (v_4f2c9c * 2) - v_4f2c9c);
};

interface TokenComponentProps {
  token: v_60c7c3;
  onPress: () => void;
  animationRefs: v_a3453e.MutableRefObject<Map<number, v_a3453e.MutableRefObject<v_a2349e.CompositeAnimation | null>>>;
  appState: string;
}

const TokenComponent: v_a3453e.FC<TokenComponentProps> = ({ token: v_21cc31, onPress: v_719eed, animationRefs: v_5b4d76, appState: v_94a194 }) => {
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

    const v_d620a9 = 300; 
    v_a2349e.loop(
      v_a2349e.sequence([
        v_a2349e.timing(v_f2d721, {
          toValue: 0,
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
  }, [v_9305dc, v_4da25a, v_f2d721]);

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
        style={v_d81136.tokenButtonContainer}
        activeOpacity={0.7}>
        <View style={v_d81136.tokenButton}>
          {}
          {parseFloat(String(v_926d1c)) < 20 && v_f0b2c0 && (
            <Animated.Image
              source={v_f0b2c0}
              style={[
                v_d81136.blinkImage,
                {
                  opacity: v_f2d721,
                },
              ]}
            />
          )}
          {v_ed24ee && (
            <Image
              source={v_ed24ee}
              style={[v_d81136.tokenIcon, { marginTop: 3 }]}
            />
          )}
          <View style={{ alignItems: 'center', marginTop: -4 }}>
            <Text style={v_d81136.tokenPriceText}>
              {v_21cc31?.xrunPrice ? parseFloat(String(v_21cc31.xrunPrice)).toFixed(2) : '0.00'}
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
  v_16772f = require('../../assets/images/icon_mapPoint.png');
} catch (v_9e86fd) {
  console.warn('icon_mapPoint.png not found');
}

let v_ed24ee = null;
let v_5be6d0 = null;
let v_f0b2c0 = null;

try {
  v_ed24ee = require('../../assets/images/icon_xrun_white.png');
} catch (v_9e86fd) {
  console.warn('icon_xrun_white.png not found');
}

try {
  v_5be6d0 = require('../../assets/images/icon_bottom.png');
} catch (v_9e86fd) {
  console.warn('icon_bottom.png not found');
}

try {
  v_f0b2c0 = require('../../assets/images/icon_catch.png');
} catch (v_9e86fd) {
  console.warn('icon_catch.png not found');
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
  const { setAdvertisementParams: v_d48a26 } = v_700ef9();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_d1a6bb, v_1e66f0] = v_d4f1cc();

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);
  const [v_04cb77, v_96a9ed] = v_5ab095<v_60c7c3 | null>(null);

  const v_8f79f8 = v_e662ae(new v_a2349e.Value(20)).current;

  const [v_ef86b6, v_8ce112] = v_5ab095<v_60c7c3[]>([]);
  const [v_b9ce93, v_7bb835] = v_5ab095<any[]>([]); 
  const [v_683210, v_34a50a] = v_5ab095(true);
  const v_a96760 = v_e662ae(0);
  const v_253a77 = 4;

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
    console.log('🔧 organizeData 호출됨:', {
      oCoinDataLength: v_8ac288.length,
      currentIndex: v_a96760.current,
      chunkSize: v_253a77,
    });

    if (v_8ac288.length === 0) {
      console.log('❌ oCoinData가 비어있음');
      v_8ce112([]);
      return;
    }

    let v_2e375c = [];
    let v_da1995 = Math.min(v_253a77, v_8ac288.length);
    const v_6e5804 = v_a96760.current; 

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

    console.log('📊 nextData 정보:', {
      nextDataLength: v_2e375c.length,
      startIndex: v_6e5804,
      currentIndex: v_a96760.current,
      actualChunkSize: v_da1995,
    });

    v_2e375c.forEach((v_9390e8, v_e86ad8) => {
      console.log(`📋 nextData[${v_e86ad8}] 원본 데이터:`, {
        name: v_9390e8.name,
        coin: v_9390e8.coin,
        advertisement: v_9390e8.advertisement,
        campid: v_9390e8.campid,
        xrunPrice: v_9390e8.xrunPrice || v_9390e8.xrunprice,
        xrunprice: v_9390e8.xrunprice,
        distance: v_9390e8.distance,
        iconurl: v_9390e8.iconurl,
        joindesc: v_9390e8.joindesc,
        brand: v_9390e8.brand,

        allKeys: Object.keys(v_9390e8),
      });
    });

    const v_368ba7 = v_2e375c.map((v_9390e8, v_a56041) => {

      const v_c93017 = {
        ...v_4ac6a7[v_a56041 % v_4ac6a7.length], 
        ...v_9390e8, 
      };

      console.log(`🎯 토큰 [${v_a56041}] 데이터 합치기:`, {
        spotID: v_c93017.spotID,
        name: v_c93017.name,
        coin: v_c93017.coin,
        advertisement: v_c93017.advertisement,
        xrunPrice: v_c93017.xrunPrice || v_c93017.xrunprice,
        campid: v_c93017.campid,
        distance: v_c93017.distance,
        iconurl: v_c93017.iconurl,
        joindesc: v_c93017.joindesc,
        brand: v_c93017.brand,
      });

      return v_c93017 as v_60c7c3;
    });

    console.log('✅ organizedData 상태 업데이트 완료:', v_368ba7.length, '개');
    v_8ce112(v_368ba7);
  }, []);

  const v_c4c061 = v_de06a3(async (v_9d6a91 = false) => {

    if (v_0b2c53.current && !v_9d6a91) {
      return;
    }

    try {
      v_34a50a(true);
      console.log('=== CameraMainScreen 데이터 로딩 시작 ===', v_9d6a91 ? '(강제 새로고침)' : '');

      if (!v_9d6a91) {
        const v_99c46d = await v_e84827.getItem('astorCoinsData');

        if (v_99c46d) {
          console.log('✅ AsyncStorage에서 astorCoinsData 발견');
          try {
            const v_b9ce93 = JSON.parse(v_99c46d);

            if (v_b9ce93 && Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

              const v_3d87ed = v_b9ce93.map((v_51b584) => ({
                ...v_51b584, 
                iconurl: v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_51b584.joindesc || '',
                name: v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
                xrunprice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || '',
                xrunPrice: v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || 0, 
                campid: v_51b584.campid || v_51b584.campId || '',

                advertisement: v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',
              }));

              console.log('✅ validatedCoinsData 생성 완료:', v_3d87ed.length, '개');

              v_3d87ed.slice(0, 4).forEach((v_51b584, v_e86ad8) => {
                console.log(`📋 validatedCoinsData[${v_e86ad8}]:`, {
                  name: v_51b584.name,
                  advertisement: v_51b584.advertisement,
                  campid: v_51b584.campid,
                  xrunPrice: v_51b584.xrunPrice,
                  coin: v_51b584.coin,
                  brand: v_51b584.brand,
                });
              });

              v_7bb835(v_3d87ed);

              v_0a6f80(v_3d87ed);

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

        const v_3d87ed = v_003147.map((v_51b584) => ({
          ...v_51b584, 
          iconurl: v_51b584.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
          joindesc: v_51b584.joindesc || '',
          name: v_51b584.name || v_51b584.title || v_51b584.brand || 'Unknown coin',
          xrunprice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || '',
          xrunPrice: v_51b584.xrunPrice || v_51b584.xrunprice || v_51b584.price || 0, 
          campid: v_51b584.campid || v_51b584.campId || '',

          advertisement: v_51b584.advertisement || v_51b584.adid || v_51b584.ad || v_51b584.coin || '',
        }));

        v_7bb835(v_3d87ed);

        v_0a6f80(v_3d87ed);
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

  v_c4deb2(() => {
    if (!v_0b2c53.current) {
      v_c4c061(false); 
    }
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
    const v_269481 = v_6b5698.addEventListener('change', (v_3b10d8) => {
      v_3fff8d(v_3b10d8);
    });

    return () => {
      v_269481?.remove();
    };
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

  const v_c1b041 = v_df9f57(() => {
    if (v_ef86b6.length === 0) {
      return v_ef86b6;
    }

    const v_524a51 = v_ef86b6.every(v_21cc31 => {
      const v_926d1c = parseFloat(String(v_21cc31.distance || 0));
      return v_926d1c >= 20;
    });

    if (!v_524a51) {

      return v_ef86b6;
    }

    const v_c27036 = Math.floor(Math.random() * 2) + 1; 
    const v_bbb1fd = new Set<number>();

    while (v_bbb1fd.size < v_c27036 && v_bbb1fd.size < v_ef86b6.length) {
      const v_668416 = Math.floor(Math.random() * v_ef86b6.length);
      v_bbb1fd.add(v_668416);
    }

    const v_2d1be2 = v_ef86b6.map((v_21cc31, v_a56041) => {
      if (v_bbb1fd.has(v_a56041)) {

        const v_f3c0bc = Math.floor(Math.random() * 19) + 1; 
        return {
          ...v_21cc31,
          distance: v_f3c0bc, 
        };
      }

      return v_21cc31;
    });

    console.log(`📊 표시용 토큰 생성: ${v_c27036}개 토큰의 거리를 20미터 이내로 조정`);
    return v_2d1be2;
  }, [v_ef86b6]);

  const v_6a213b = (v_6e55b1) => {
    console.log('Navigation item pressed:', v_6e55b1);

  };

  const v_42b5ed = (v_11083e) => {
    v_d52709?.(v_11083e);
  };

  const v_eb5fc7 = () => {
    if (v_572bd3) {

      v_6a4dcd(false);
    } else {

      if (!v_04cb77) {
        console.log('selectedToken이 없어서 하단 패널을 열 수 없습니다.');
        return;
      }
      v_6a4dcd(true);
    }
  };

  v_c4deb2(() => {
    if (v_572bd3) {
      v_a2349e.timing(v_8f79f8, {
        toValue: 90, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    } else {
      v_a2349e.timing(v_8f79f8, {
        toValue: 20, 
        duration: 300,
        easing: v_cdbae1.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false, 
      }).start();
    }
  }, [v_572bd3]);

  const v_917f22 = v_de06a3(async (token: v_60c7c3) => {
    try {
      console.log('=== navigateToAd 함수 시작 ===');
      console.log('전달받은 토큰 정보:', JSON.stringify(v_21cc31, null, 2));

      const v_ef7306 = await v_e84827.getItem('userData');
      if (!v_ef7306) {
        console.log('userData가 없습니다.');
        return;
      }

      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member?.toString() || '';

      const v_aa0917 = v_21cc31.campid || '';
      console.log('campid 확인:', {
        tokenCampid: v_21cc31.campid,
        finalCampid: v_aa0917,
        coin: v_21cc31.coin,
      });

      const v_75c344 = {
        member: v_660822,
        advertisement: v_21cc31.advertisement || v_21cc31.coin || '',
        coin: v_21cc31.coin || '',
        campid: v_aa0917, 
        joindesc: v_21cc31.joindesc || '',
        name: v_21cc31.name || 'XRUN coin',
        xrunPrice: v_21cc31.xrunPrice || 0,
        coinScreen: true,
      };

      console.log('Context에 저장할 광고 파라미터:', JSON.stringify(v_75c344, null, 2));
      v_d48a26(v_75c344);

      console.log('ShowNapAdScreen으로 이동');
      v_487a25(v_ce4741.showNapAd);
    } catch (v_5e9bfe) {
      console.error('광고 화면 이동 실패:', v_5e9bfe);
    }
  }, [v_d48a26, v_487a25]);

  const v_eed806 = v_de06a3((originalToken: v_60c7c3, displayToken?: v_60c7c3) => {

    console.log('=== 토큰 클릭 이벤트 발생 ===');
    console.log('원본 토큰 정보:', JSON.stringify(v_cc8a46, null, 2));
    console.log('표시용 토큰 정보:', v_33e0b4 ? JSON.stringify(v_33e0b4, null, 2) : '없음');
    console.log('spotID:', v_cc8a46.spotID);
    console.log('원본 distance:', v_cc8a46.distance);
    console.log('표시용 distance:', v_33e0b4?.distance);
    console.log('xrunPrice:', v_cc8a46.xrunPrice);
    console.log('name:', v_cc8a46.name);
    console.log('iconurl:', v_cc8a46.iconurl);
    console.log('joindesc:', v_cc8a46.joindesc);
    console.log('brand:', v_cc8a46.brand);
    console.log('advertisement:', v_cc8a46.advertisement);
    console.log('coin:', v_cc8a46.coin);
    console.log('campid:', v_cc8a46.campid);
    console.log('member:', v_cc8a46.member);
    console.log('=== 토큰 클릭 이벤트 끝 ===');

    v_96a9ed(v_cc8a46);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }

    const v_d35959 = parseFloat(String(v_cc8a46.distance || 0));
    const v_83413d = v_33e0b4 ? parseFloat(String(v_33e0b4.distance || 0)) : v_d35959;

    const v_7c662d = v_33e0b4 && v_83413d < v_d35959;

    console.log('거리 체크:', { 
      displayDistance: v_83413d, 
      originalDistance: v_d35959,
      isDistanceAdjusted: v_7c662d,
      isWithin20m: v_d35959 < 20,
      willProceed: v_7c662d || v_d35959 < 20,
    });

    if (v_7c662d || v_d35959 < 20) {
      if (v_7c662d) {
        console.log('✅ 토큰 거리가 조정되어 표시됨 - 실제 거리와 상관없이 광고 진행');
      } else {
        console.log('✅ 토큰 거리 20미터 이내 - 2초 후 광고 화면으로 이동');
      }

      if (v_181e3e.current) {
        clearTimeout(v_181e3e.current);
        v_181e3e.current = null;
        console.log('⏹️ 이전 타이머 정리됨');
      }

      v_6890b1.current = false;
      console.log('🔄 자동 광고 트리거 상태 리셋');

      console.log('⏰ 2초 타이머 시작');
      v_181e3e.current = setTimeout(() => {
        console.log('⏰ 2초 경과 - 자동으로 광고 화면으로 이동');
        v_6890b1.current = true;
        v_917f22(v_cc8a46); 
      }, 2000);
    } else {
      console.log('⚠️ 토큰 거리 20미터 초과 - 광고 화면으로 이동하지 않음');
    }
  }, [v_572bd3, v_917f22]);

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
          {}
          {v_16772f && (
            <View style={v_d81136.mapPinButton}>
              <Image
                source={v_16772f}
                style={v_d81136.mapPinIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </CameraView>

        {}
        {

}
        {v_683210 ? (
          <View style={[v_d81136.tokenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>
        ) : (
          <View style={[v_d81136.tokenContainer, { bottom: v_572bd3 && v_04cb77 ? 200 : 110 }]}>
            {v_c1b041
              .sort((v_779914, v_148ff6) => (v_148ff6.distance || 0) - (v_779914.distance || 0)) 
              .map((v_33e0b4) => {

                const v_cc8a46 = v_ef86b6.find(v_8d41d7 => v_8d41d7.spotID === v_33e0b4.spotID) || v_33e0b4;

                return (
                  <TokenComponent
                    key={v_33e0b4.spotID}
                    token={v_33e0b4} 
                    onPress={() => v_eed806(v_cc8a46, v_33e0b4)} 
                    animationRefs={v_5b4d76}
                    appState={v_94a194}
                  />
                );
              })}
          </View>
        )}

        {}
        {

}
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 0,
            top: 0,
            left: 0,
            zIndex: 3, 
            pointerEvents: v_572bd3 ? 'auto' : 'none', 
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: v_8f79f8, 
                left: 0,
                right: 0,
                zIndex: 1,
              },
            ]}>
            <Pressable
              onPress={() => {
                if (v_572bd3) {
                  console.log('📱 하단 패널 배경 터치 - 패널 닫기');
                  v_6a4dcd(false);
                }
              }}
              style={{
                backgroundColor: v_572bd3 && v_04cb77 ? '#EFF4F5' : '#adadad',
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderTopStartRadius: 30,
                borderTopEndRadius: 30,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: v_572bd3 && v_04cb77 ? 150 : 35,
                paddingBottom: v_572bd3 && v_04cb77 ? 40 : 15,
                zIndex: 1,
                position: 'relative',
              }}>
              {}
              {v_572bd3 && v_04cb77 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    paddingTop: 0,
                    gap: 10,
                    zIndex: 1,
                    pointerEvents: 'box-none', 
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
                          marginLeft: 10,
                          height: 65,
                          width: 65,
                          borderRadius: 10,
                          backgroundColor: '#161d2d',
                          padding: 10,
                        }}
                      />
                    )
                  ) : (
                    <Image
                      source={{ uri: v_04cb77?.iconurl }}
                      resizeMode="contain"
                      style={{
                        marginLeft: 10,
                        height: 65,
                        width: 65,
                        borderRadius: 10,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 20,
                        color: '#343a59',
                        marginBottom: -9,
                        marginTop: -3,
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
                        fontFamily: 'Roboto-Medium',
                        fontSize: 16,
                        color: '#343a59',
                        marginTop: 10,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {!v_04cb77?.joindesc ||
                      v_04cb77?.joindesc.toString().trim() === ''
                        ? 'XRUN coin'
                        : v_04cb77?.joindesc}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 12,
                        color: '#666',
                        marginTop: 5,
                      }}>
                      {(v_04cb77?.xrunPrice || 0).toFixed(2)} {v_04cb77?.brand || ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {

                      if (v_181e3e.current) {
                        clearTimeout(v_181e3e.current);
                        v_181e3e.current = null;
                      }
                      v_6890b1.current = true; 

                      if (v_04cb77) {
                        v_917f22(v_04cb77);
                      }
                    }}
                    style={{
                      backgroundColor: '#FFDC04',
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      borderColor: '#D9D9D9',
                      borderWidth: 1,
                      alignSelf: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Roboto-Bold',
                        color: 'black',
                      }}>
                      View ad
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Pressable>
          </Animated.View>
        </View>
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
    zIndex: 2, 
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
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tokenDistanceText: {
    color: '#CCCCCC',
    fontSize: 10,
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
});

