import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_326be8,
  v_03e392,
  v_700696,
  v_19b633,
  v_cf9c33,
  v_6b5698,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import v_2b5678, { v_65a8f9, v_b4043e } from 'voblsepvtvpzyatxk';
import * as v_8a44cb from 'zryrlwvgokjhz';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_f4e704, v_a77ce6 } from '../components';
import { v_cc3e1f } from './CameraMainScreen';
import { v_ce4741, v_a0daa8 } from '../navigation';
import { v_f71847 } from '../types';
import { v_f84ef5 } from '../services';

interface LocationData {
  latitude: number;
  longitude: number;
}

let v_8daafe = null;
let v_e96568 = null;
let v_79011b = null;
let v_b636c9 = null;
let v_86146a = null;
let v_800dd2 = null;

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
  v_86146a = require('../../assets/images/icon_advertisement.png');
} catch (v_9e86fd) {
  console.warn('icon_advertisement.png not found');
}

try {
  v_800dd2 = require('../../assets/images/icon_bell.png');
} catch (v_9e86fd) {
  console.warn('icon_bell.png not found');
}

let v_16772f = null;

try {
  v_16772f = require('../../assets/images/icon_mapPoint.png');
} catch (v_9e86fd) {
  console.warn('icon_mapPoint.png not found');
}

let v_232839 = null;

try {
  v_232839 = require('../../assets/logo_tempMarker.png');
} catch (v_9e86fd) {
  console.warn('logo_tempMarker.png not found');
}

export const MapMainScreen: v_a3453e.FC = () => {
  const { navigate: v_9b57fc } = v_a0daa8();
  const { t: v_8d41d7 } = v_772971();
  const [v_a55f0b, v_0326b2] = v_5ab095<LocationData | null>(null);
  const [v_976e82, v_a7e4fc] = v_5ab095<string | null>(null);
  const [v_ac1d22, v_02dd63] = v_5ab095<'Map' | 'Camera'>('Map');
  const [v_434ce4, v_ed2516] = v_5ab095({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [v_572bd3, v_6a4dcd] = v_5ab095(false);
  const [v_27aea1, v_22f943] = v_5ab095<v_f71847 | null>(null);

  const [v_4b9594, v_a18647] = v_5ab095<number | null>(null);
  const v_aae2cb = v_e662ae<number | null>(null);

  const [v_b4d4c5, v_14dd24] = v_5ab095<v_f71847[]>([]);
  const [v_818f4d, v_e1bb1a] = v_5ab095(false);
  const v_5db874 = v_e662ae(false); 

  const [v_001c8f, v_d8a1fd] = v_5ab095(false);
  const [v_96b118, v_17f37a] = v_5ab095({ x: 0, y: 0 });
  const [v_456f34, v_94e8d8] = v_5ab095<v_f71847 | null>(null);

  const v_3ec640 = v_e662ae<v_2b5678>(null);

  const [v_c19838, v_b6ebe9] = v_5ab095<LocationData | null>(null);
  const [v_b8d9d3, v_c84980] = v_5ab095<LocationData | null>(null);

  const v_a2b40c = v_e662ae<LocationData | null>(null);

  const v_c38114 = v_e662ae<LocationData | null>(null);

  const v_bbb844 = v_e662ae<NodeJS.Timeout | null>(null);

  const v_e40b2a = v_e662ae<NodeJS.Timeout | null>(null);

  const v_a11b30 = v_e662ae<number>(Date.now());

  const v_de148f = v_e662ae(v_434ce4);

  let v_be97ff = null;
  try {
    v_be97ff = require('../../assets/images/icon_xrun_black.png');
  } catch (v_9e86fd) {
    console.warn('icon_xrun_black.png not found');
  }

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

  const v_524200 = v_de06a3(async (v_f18a9c) => {

    if (v_5db874.current) {
      console.log('=== 맵 마커 로딩 중, 중복 호출 방지 ===');
      return;
    }

    const v_ef7306 = await v_e84827.getItem('userData');
    if (!v_ef7306) {
      console.log('userData가 없습니다. 로그인이 필요할 수 있습니다.');
      return;
    }

    try {
      const v_ff39bc = JSON.parse(v_ef7306);
      const v_660822 = v_ff39bc?.member;
      if (!v_660822) {
        console.log('userData에 member가 없습니다.');
        return;
      }

      v_5db874.current = true;
      v_e1bb1a(true);
      console.log('=== 맵 마커 데이터 가져오기 시작 ===');
      console.log('위치:', v_f18a9c.latitude, v_f18a9c.longitude);
      const v_003147 = await v_f84ef5(
        v_f18a9c.latitude,
        v_f18a9c.longitude,
        v_660822,
        v_9b57fc,
      );
      console.log('=== 맵 마커 데이터 가져오기 완료 ===');
      console.log('마커 개수:', v_003147.length);
      v_14dd24(v_003147);
      v_c84980(v_f18a9c);
      v_a2b40c.current = v_f18a9c;

      if (v_003147.length > 0) {
        try {
          await v_e84827.setItem('astorCoinsData', JSON.stringify(v_003147));
          console.log('✅ astorCoinsData AsyncStorage에 저장 완료');
        } catch (v_df17d5) {
          console.error('AsyncStorage 저장 오류:', v_df17d5);
        }
      }
    } catch (v_5f9add) {
      console.error('userData 파싱 오류:', v_5f9add);
    } finally {

      v_5db874.current = false;
      v_e1bb1a(false);
    }
  }, [v_9b57fc]);

  const v_668889 = v_de06a3(async () => {

    if (v_5db874.current) {
      return;
    }

    const v_0ff02b = v_c19838;
    if (!v_0ff02b) {
      console.log('초기 위치가 없습니다.');
      return;
    }

    console.log('=== 20초 동안 드래그 없음, 초기 위치로 복귀 ===');

    const v_dfcc93 = v_de148f.current;

    if (v_3ec640.current) {
      v_3ec640.current.animateToRegion({
        latitude: v_0ff02b.latitude,
        longitude: v_0ff02b.longitude,
        latitudeDelta: v_dfcc93.latitudeDelta,
        longitudeDelta: v_dfcc93.longitudeDelta,
      }, 500);
    }

    const v_6ffbdc = {
      latitude: v_0ff02b.latitude,
      longitude: v_0ff02b.longitude,
      latitudeDelta: v_dfcc93.latitudeDelta,
      longitudeDelta: v_dfcc93.longitudeDelta,
    };
    v_ed2516(v_6ffbdc);
    v_de148f.current = v_6ffbdc;

    await v_524200(v_0ff02b);
  }, [v_c19838, v_524200]);

  const v_acecf6 = v_de06a3(async () => {

    if (v_5db874.current) {
      return;
    }

    const v_0ff02b = v_c38114.current;
    const v_5a477d = v_a2b40c.current;

    if (!v_0ff02b || !v_5a477d) {
      return;
    }

    const v_340e3c = v_de148f.current;
    const v_7dd198 = {
      latitude: v_340e3c.latitude,
      longitude: v_340e3c.longitude,
    };

    const v_926d1c = v_b464ed(
      v_7dd198.latitude,
      v_7dd198.longitude,
      v_5a477d.latitude,
      v_5a477d.longitude
    );

    const v_dcebe9 = Date.now();
    const v_f69ae0 = 
      Math.abs(v_7dd198.latitude - v_5a477d.latitude) > 0.0001 ||
      Math.abs(v_7dd198.longitude - v_5a477d.longitude) > 0.0001;

    if (v_f69ae0) {
      v_a11b30.current = v_dcebe9;

    }

    if (v_926d1c >= 500) {
      console.log('=== 200m 이상 이동, 새로운 위치에서 마커 로드 ===');
      await v_524200(v_7dd198);
    }

    const v_6264da = v_dcebe9 - v_a11b30.current;
    if (v_6264da >= 20000) {

      const v_065b71 = v_b464ed(
        v_7dd198.latitude,
        v_7dd198.longitude,
        v_0ff02b.latitude,
        v_0ff02b.longitude
      );

      if (v_065b71 > 50) { 
        console.log('=== 20초 동안 위치 변경 없음, 초기 위치로 복귀 ===');
        await v_668889();
        v_a11b30.current = Date.now(); 
      }
    }
  }, [v_524200, v_668889]);

  v_c4deb2(() => {
    let v_fd434d = null;

    const v_169317 = async () => {

      const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
      if (v_d308b5 !== 'granted') {
        v_a7e4fc('위치 권한이 거부되었습니다.');
        v_03e392.alert(
          '위치 권한 필요',
          '지도를 사용하려면 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      try {

        const v_7dd198 = await v_8a44cb.getCurrentPositionAsync({
          accuracy: v_8a44cb.Accuracy.High,
        });

        const v_4a8217 = {
          latitude: v_7dd198.coords.latitude,
          longitude: v_7dd198.coords.longitude,
        };

        v_0326b2(v_4a8217);
        const v_6ffbdc = {
          latitude: v_4a8217.latitude,
          longitude: v_4a8217.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        v_ed2516(v_6ffbdc);
        v_de148f.current = v_6ffbdc;

        if (!v_c19838) {
          v_b6ebe9(v_4a8217);
          v_c84980(v_4a8217);
          v_c38114.current = v_4a8217;
          v_a2b40c.current = v_4a8217;
          console.log('=== 초기 위치 저장 ===', v_4a8217);
        }

        await v_e84827.setItem('selfCoordinate', JSON.stringify(v_4a8217));

        if (!v_c19838 || 
            (v_b8d9d3 && 
             v_b8d9d3.latitude === v_4a8217.latitude && 
             v_b8d9d3.longitude === v_4a8217.longitude)) {
          await v_524200(v_4a8217);
        }
      } catch (v_5e9bfe) {
        const v_1744b9 = v_5e9bfe instanceof Error ? v_5e9bfe.message : '알 수 없는 오류';
        v_a7e4fc('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', v_5e9bfe);

        if (v_1744b9.includes('location services') || v_1744b9.includes('unavailable')) {
          v_03e392.alert(
            '위치 서비스 오류',
            '위치 정보를 가져올 수 없습니다.\n\n다음 사항을 확인해주세요:\n• 기기의 위치 서비스(GPS)가 켜져 있는지\n• 네트워크 위치 서비스가 활성화되어 있는지\n• 실내에서는 GPS 신호가 약할 수 있습니다.',
            [
              { text: '기본 위치 사용', onPress: async () => {

                const v_3a1065 = {
                  latitude: 37.5665,
                  longitude: 126.9780,
                };
                v_0326b2(v_3a1065);
                const v_6ffbdc = {
                  latitude: v_3a1065.latitude,
                  longitude: v_3a1065.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                v_ed2516(v_6ffbdc);
                v_de148f.current = v_6ffbdc;

                if (!v_c19838) {
                  v_b6ebe9(v_3a1065);
                  v_c84980(v_3a1065);
                  v_c38114.current = v_3a1065;
                  v_a2b40c.current = v_3a1065;
                }

                await v_524200(v_3a1065);
              }},
              { text: '확인', style: 'cancel' }
            ]
          );
        } else {

          const v_3a1065 = {
            latitude: 37.5665,
            longitude: 126.9780,
          };
          v_0326b2(v_3a1065);
          const v_6ffbdc = {
            latitude: v_3a1065.latitude,
            longitude: v_3a1065.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          v_ed2516(v_6ffbdc);
          v_de148f.current = v_6ffbdc;

          if (!v_c19838) {
            v_b6ebe9(v_3a1065);
            v_c84980(v_3a1065);
            v_c38114.current = v_3a1065;
            v_a2b40c.current = v_3a1065;
          }

          await v_524200(v_3a1065);
        }
      }
    };

    v_169317();

    const v_1f994c = async (): Promise<v_8a44cb.LocationSubscription | null> => {
      try {
        const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
        if (v_d308b5 !== 'granted') {
          return null;
        }

        const v_4385ba = await v_8a44cb.watchPositionAsync(
          {
            accuracy: v_8a44cb.Accuracy.High,

            timeInterval: 0, 
            distanceInterval: 0, 
          },
          (v_a55f0b) => {

            const v_66b19f = v_a55f0b.coords.heading;

            if (v_66b19f !== null && v_66b19f !== undefined && !isNaN(v_66b19f)) {
              const v_ca5264 = v_aae2cb.current;

              if (v_ca5264 === null || v_66b19f !== v_ca5264) {

                v_a18647(v_66b19f);
                v_aae2cb.current = v_66b19f;
              }
            }
          }
        );

        return v_4385ba;
      } catch (v_5e9bfe) {
        console.error('헤딩 추적 오류:', v_5e9bfe);
        return null;
      }
    };

    let headingSubscription: v_8a44cb.LocationSubscription | null = null;
    v_1f994c().then((v_269481) => {
      v_4385ba = v_269481;
    });

    const v_269481 = v_6b5698.addEventListener('change', (v_3b10d8) => {
      if (v_3b10d8 === 'active') {

        v_169317();

        v_1f994c().then((v_1ae212) => {
          if (v_4385ba) {
            v_4385ba.remove();
          }
          v_4385ba = v_1ae212 || null;
        });
      }
    });

    return () => {
      v_269481?.remove();

      if (v_4385ba) {
        v_4385ba.remove();
      }

      if (v_bbb844.current) {
        clearTimeout(v_bbb844.current);
        v_bbb844.current = null;
      }
      if (v_e40b2a.current) {
        clearInterval(v_e40b2a.current);
        v_e40b2a.current = null;
      }
    };
  }, [v_9b57fc]);

  v_c4deb2(() => {

    if (!v_c19838 || !v_b8d9d3) {
      return;
    }

    if (v_e40b2a.current) {
      clearInterval(v_e40b2a.current);
      v_e40b2a.current = null;
    }

    v_e40b2a.current = setInterval(() => {
      v_acecf6();
    }, 3000); 

    v_a11b30.current = Date.now();

    return () => {

      if (v_e40b2a.current) {
        clearInterval(v_e40b2a.current);
        v_e40b2a.current = null;
      }
    };
  }, [v_c19838, v_b8d9d3, v_acecf6]);

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
        v_9b57fc(v_ce4741.referralMyGroup);
        break;
      case 'info':
        v_9b57fc(v_ce4741.myInfo);
        break;
      case 'map':

        break;
      default:
        console.log('Unknown navigation item:', v_6e55b1);
    }
  };

  const v_42b5ed = (v_11083e) => {
    v_02dd63(v_11083e);
    console.log('Tab changed to:', v_11083e);
  };

  const v_fc58d0 = (spot: v_f71847, v_a56041) => {
    console.log('Marker pressed:', v_c5ac8b);
    v_22f943(v_c5ac8b);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }

    if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {
      const v_340e3c = v_de148f.current;
      v_3ec640.current.animateToRegion({
        latitude: v_c5ac8b.latitude,
        longitude: v_c5ac8b.longitude,
        latitudeDelta: v_340e3c.latitudeDelta,
        longitudeDelta: v_340e3c.longitudeDelta,
      }, 500); 

      const v_6ffbdc = {
        latitude: v_c5ac8b.latitude,
        longitude: v_c5ac8b.longitude,
        latitudeDelta: v_340e3c.latitudeDelta,
        longitudeDelta: v_340e3c.longitudeDelta,
      };
      v_ed2516(v_6ffbdc);
      v_de148f.current = v_6ffbdc;
      v_a11b30.current = Date.now();

      setTimeout(() => {
        if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {
          v_3ec640.current.pointForCoordinate({
            latitude: v_c5ac8b.latitude!,
            longitude: v_c5ac8b.longitude!,
          }).then((v_49cb67) => {
            if (v_49cb67) {
              v_17f37a({
                x: v_49cb67.x - 110, 
                y: Math.max(50, v_49cb67.y - 80), 
              });
              v_94e8d8(v_c5ac8b);
              v_d8a1fd(true);
            }
          }).catch((v_5e9bfe) => {
            console.error('좌표 변환 오류:', v_5e9bfe);

            const { width: v_8e4fb6 } = v_700696.get('window');
            v_17f37a({
              x: (v_8e4fb6 - 220) / 2, 
              y: 100, 
            });
            v_94e8d8(v_c5ac8b);
            v_d8a1fd(true);
          });
        }
      }, 600); 
    } else {

      const { width: v_8e4fb6 } = v_700696.get('window');
      v_17f37a({
        x: (v_8e4fb6 - 220) / 2, 
        y: 100,
      });
      v_94e8d8(v_c5ac8b);
      v_d8a1fd(true);
    }
  };

  const v_4e890f = (v_d48baf) => {

    const v_87aa97 = v_d48baf.nativeEvent.coordinate;
    if (!v_87aa97 || !v_87aa97.latitude || !v_87aa97.longitude) {

      v_d8a1fd(false);
      v_94e8d8(null);
      return;
    }

    if (v_b4d4c5.length === 0) {
      v_d8a1fd(false);
      v_94e8d8(null);
      return;
    }

    let nearestMarker: v_f71847 | null = null;
    let v_2540f0 = Infinity;

    v_b4d4c5.forEach((v_5e3dbb) => {
      if (!v_5e3dbb.latitude || !v_5e3dbb.longitude) {
        return;
      }

      const v_926d1c = v_b464ed(
        v_87aa97.latitude,
        v_87aa97.longitude,
        v_5e3dbb.latitude,
        v_5e3dbb.longitude
      );

      if (v_926d1c < v_2540f0) {
        v_2540f0 = v_926d1c;
        v_386fb7 = v_5e3dbb;
      }
    });

    if (v_386fb7 === null) {

      v_d8a1fd(false);
      v_94e8d8(null);
      return;
    }

    const marker: v_f71847 = v_386fb7;
    if (!v_5e3dbb.latitude || !v_5e3dbb.longitude) {

      v_d8a1fd(false);
      v_94e8d8(null);
      return;
    }

    console.log('=== 맵 클릭: 가장 가까운 마커 찾기 ===');
    console.log('클릭한 위치:', v_87aa97.latitude, v_87aa97.longitude);
    console.log('가장 가까운 마커:', v_5e3dbb.name || 'Unknown', '거리:', v_2540f0.toFixed(2), 'm');

    v_22f943(v_5e3dbb);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }

    const v_340e3c = v_de148f.current;
    if (v_3ec640.current && v_5e3dbb.latitude && v_5e3dbb.longitude) {
      v_3ec640.current.animateToRegion({
        latitude: v_5e3dbb.latitude,
        longitude: v_5e3dbb.longitude,
        latitudeDelta: v_340e3c.latitudeDelta,
        longitudeDelta: v_340e3c.longitudeDelta,
      }, 500); 
    }

    const v_6ffbdc = {
      latitude: v_5e3dbb.latitude!,
      longitude: v_5e3dbb.longitude!,
      latitudeDelta: v_340e3c.latitudeDelta,
      longitudeDelta: v_340e3c.longitudeDelta,
    };
    v_ed2516(v_6ffbdc);
    v_de148f.current = v_6ffbdc;
    v_a11b30.current = Date.now();

    setTimeout(() => {
      if (v_3ec640.current && v_5e3dbb.latitude && v_5e3dbb.longitude) {
        v_3ec640.current.pointForCoordinate({
          latitude: v_5e3dbb.latitude,
          longitude: v_5e3dbb.longitude,
        }).then((v_49cb67) => {
          if (v_49cb67) {
            v_17f37a({
              x: v_49cb67.x - 110, 
              y: Math.max(50, v_49cb67.y - 80), 
            });
            v_94e8d8(v_5e3dbb);
            v_d8a1fd(true);
          }
        }).catch((v_5e9bfe) => {
          console.error('좌표 변환 오류:', v_5e9bfe);

          const { width: v_8e4fb6 } = v_700696.get('window');
          v_17f37a({
            x: (v_8e4fb6 - 220) / 2, 
            y: 100, 
          });
          v_94e8d8(v_5e3dbb);
          v_d8a1fd(true);
        });
      }
    }, 600); 
  };

  const v_2cf5bb = (spot: v_f71847) => {
    if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {
      v_3ec640.current.pointForCoordinate({
        latitude: v_c5ac8b.latitude!,
        longitude: v_c5ac8b.longitude!,
      }).then((v_49cb67) => {
        if (v_49cb67) {
          v_17f37a({
            x: v_49cb67.x - 135, 
            y: Math.max(50, v_49cb67.y - 80), 
          });
        }
      }).catch((v_5e9bfe) => {
        console.error('좌표 변환 오류:', v_5e9bfe);
      });
    }
  };

  const v_0424a1 = (v_a6c30b) => {

  };

  const v_6b4469 = (v_a6c30b) => {

    v_ed2516(v_a6c30b);
    v_de148f.current = v_a6c30b;

    v_a11b30.current = Date.now();
  };

  const v_fce460 = [
    { id: 'wallet', label: v_8d41d7('components.bottomNavigationBar.wallet'), icon: v_8daafe },
    { id: 'shop', label: v_8d41d7('components.bottomNavigationBar.shop'), icon: v_e96568 },
    { id: 'map', label: '' }, 
    { id: 'referral', label: v_8d41d7('components.bottomNavigationBar.referral'), icon: v_79011b },
    { id: 'info', label: v_8d41d7('components.bottomNavigationBar.info'), icon: v_b636c9 },
  ];

  if (v_ac1d22 === 'Camera') {
    return (
      <CameraMainScreen
        activeTab={v_ac1d22}
        onTabChange={v_42b5ed}
      />
    );
  }

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />

      {}
      <View style={v_d81136.statusBar}>
        <View style={v_d81136.statusBarContent}>
          <View style={v_d81136.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={v_d81136.mapContainer}>
        {v_a55f0b ? (
          <MapView
            ref={v_3ec640}
            provider={v_b4043e}
            style={v_d81136.map}
            region={v_434ce4}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChange={v_0424a1}
            onRegionChangeComplete={v_6b4469}
            onPress={v_4e890f}
          >
            {}
            {v_b4d4c5
              .filter((v_5e3dbb) => v_5e3dbb.latitude && v_5e3dbb.longitude) 
              .map((v_5e3dbb, v_a56041) => {

                const v_e149c8 = v_5e3dbb.coin || `marker-${v_5e3dbb.latitude}-${v_5e3dbb.longitude}`;

                return (
                <Marker
                  key={v_e149c8}
                  coordinate={{
                    latitude: v_5e3dbb.latitude!,
                    longitude: v_5e3dbb.longitude!,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => v_fc58d0(v_5e3dbb, v_a56041)}
                >
                  {}
                  {v_232839 && (
                    <Image
                      source={v_232839}
                      style={v_d81136.markerImage}
                      resizeMode="contain"
                    />
                  )}
                </Marker>
              );
              })}
          </MapView>
        ) : (
          <View style={v_d81136.mapPlaceholder}>
            {}
          </View>
        )}

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

        {}
        {v_001c8f && v_456f34 && (
          <View
            style={[
              v_d81136.calloutPopup,
              {
                left: v_96b118.x,
                top: v_96b118.y,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={v_d81136.calloutContainer}>
              <View style={v_d81136.calloutLeft}>
                {}
                {v_456f34.iconurl ? (
                  <Image
                    source={{ uri: v_456f34.iconurl }}
                    style={v_d81136.calloutImage}
                    resizeMode="contain"
                  />
                ) : (
                  v_be97ff && (
                    <Image
                      source={v_be97ff}
                      style={v_d81136.calloutImage}
                      resizeMode="contain"
                    />
                  )
                )}
                {}
                <Text style={v_d81136.calloutDistance}>
                  {v_456f34.distance.toFixed(2)}m
                </Text>
              </View>
              <View style={v_d81136.calloutRight}>
                <Text style={v_d81136.calloutBrand}>
                  {v_456f34.brand || v_456f34.name} 획득 가능합니다.
                </Text>
                <Text style={v_d81136.calloutCoins}>
                  {v_456f34.xrunPrice?.toFixed(2) || '0'} {v_456f34.brand || 'XRUN'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {}
      <MapBottomPanel
        visible={v_572bd3}
        spotData={v_27aea1}
        deviceHeading={v_4b9594}
        onClose={() => {
          v_6a4dcd(false);
          v_22f943(null);
        }}
      />

      {}
      {}
      <View style={{ zIndex: 10 }}>
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
    backgroundColor: '#F8F8F8',
  },
  statusBar: {
    height: 44,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 21,
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {

  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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

  calloutPopup: {
    position: 'absolute',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },

  calloutContainer: {
    backgroundColor: 'white',
    borderColor: '#ffdc04',
    borderWidth: 5,
    flexDirection: 'row',
    width: 220,
    minHeight: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutLeft: {
    justifyContent: 'space-between',
    marginLeft: 0,
  },
  calloutImage: {
    marginLeft: 8,
    width: 32,
    height: 32,
  },
  calloutDistance: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: 2,
  },
  calloutRight: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  calloutBrand: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  calloutCoins: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },

  markerImage: {
    width: 40,
    height: 40,
  },
});

