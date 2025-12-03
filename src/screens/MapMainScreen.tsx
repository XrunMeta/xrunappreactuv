import v_a3453e, { v_5ab095, v_c4deb2, v_e662ae, v_de06a3 } from 'bapkr';
import {
  v_3094a2,
  v_472849,
  v_326be8,
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
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_f71847 } from '../types';
import { v_f84ef5, v_c07360, v_91d5e4, v_965f93 } from '../services';
import { v_295e39 } from '../services/taboola';
import { v_858bfa } from '../utils/imageCache';
import { v_e4a763 } from '../utils/env';

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
  const { showAlert: v_889fad } = v_4b1173();
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

  const v_ca338a = v_e662ae(false);

  const v_43de51 = v_e662ae(false);

  const v_c675cc = v_e662ae<{ latitude: number; longitude: number } | null>(null);

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

  const v_524200 = v_de06a3(async (v_f18a9c, v_9d6a91 = false) => {

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

      if (!v_9d6a91) {
        const v_99c46d = await v_e84827.getItem('astorCoinsData');

        if (v_99c46d) {
          console.log('✅ [MapMainScreen] AsyncStorage에서 astorCoinsData 발견');
          try {
            const v_b9ce93 = JSON.parse(v_99c46d);

            if (v_b9ce93 && Array.isArray(v_b9ce93) && v_b9ce93.length > 0) {

              const spotDataArray: v_f71847[] = v_b9ce93.map((v_51b584) => ({
                spotID: v_51b584.spotid || v_51b584.spotID || v_51b584.id || 0,
                distance: v_51b584.distance || 0,
                direction: v_51b584.direction || 0,
                name: v_51b584.name || v_51b584.title || v_51b584.brand || 'XRUN coin',
                latitude: v_51b584.latitude || v_51b584.lat,
                longitude: v_51b584.longitude || v_51b584.lng,
                xrunPrice: v_51b584.xrunprice || v_51b584.xrunPrice || v_51b584.price || 0,
                iconurl: v_51b584.iconurl || '',
                joindesc: v_51b584.joindesc || '',
                brand: v_51b584.brand || v_51b584.coin || '',
                coins: v_51b584.coins || v_51b584.coin || '',
                coin: v_51b584.coin || '',
                campid: v_51b584.campid || v_51b584.campId || '',
              } as v_f71847 & { campid?: string }));

              console.log('✅ [MapMainScreen] 캐시된 마커 데이터 사용 (개수:', v_22ecab.length, ')');
              v_14dd24(v_22ecab);
              v_c84980(v_f18a9c);
              v_a2b40c.current = v_f18a9c;

              v_5db874.current = false;
              v_e1bb1a(false);
              return;
            }
          } catch (v_5f9add) {
            console.error('[MapMainScreen] astorCoinsData 파싱 오류:', v_5f9add);
          }
        }
      }

      if (v_9d6a91) {
        console.log('🔄 [MapMainScreen] 서버에서 새 데이터 가져오기');
      } else {
        console.log('⚠️ [MapMainScreen] AsyncStorage에 데이터 없음, API 호출');
      }

      v_5db874.current = true;
      v_e1bb1a(true);
      console.log('=== 맵 마커 데이터 가져오기 시작 ===');
      console.log('위치:', v_f18a9c.latitude, v_f18a9c.longitude);

      const v_c9c489 = v_e4a763();
      const v_cd6a57 = {
        member: v_660822.toString(),
        latitude: v_f18a9c.latitude,
        longitude: v_f18a9c.longitude,
        limit: 120,
      };

      const v_ee8180 = await v_c07360('app2000-01', 'POST', v_cd6a57, v_9b57fc);

      const v_e84694 = await v_f84ef5(
        v_f18a9c.latitude,
        v_f18a9c.longitude,
        v_660822,
        v_9b57fc,
      );
      console.log('=== 맵 마커 데이터 가져오기 완료 ===');
      console.log('마커 개수:', v_e84694.length);

      const v_44c411 = v_e84694
        .map((v_d5dda0) => v_d5dda0.advertisement)
        .filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
      const v_d25278 = Array.from(new Set(v_44c411));
      const v_ea4ce0 = v_e84694
        .map((v_d5dda0) => v_d5dda0.campid)
        .filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
      const v_0b0cab = Array.from(new Set(v_ea4ce0));

      console.log('🔍 [MapMainScreen] markerDataRaw 통계:', {
        totalCount: v_e84694.length,
        uniqueAdvertisements: v_d25278.length,
        uniqueCampids: v_0b0cab.length,
        advertisementValues: v_d25278.slice(0, 5),
        campidValues: v_0b0cab.slice(0, 5),
      });

      const v_0a08fb = v_ee8180?.data && Array.isArray(v_ee8180.data)
        ? v_ee8180.data.map((v_8c0b26) => ({
            coin: v_8c0b26.coin,
            advertisement: v_8c0b26.advertisement,
            campid: v_8c0b26.campid,
            name: v_8c0b26.name,
            xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
            iconurl: v_8c0b26.iconurl,
            joindesc: v_8c0b26.joindesc,
            brand: v_8c0b26.brand,
          }))
        : [];

      const v_134529 = new Map<number, any>();
      v_0a08fb.forEach((v_51b584) => {
        if (v_51b584.advertisement && !v_134529.has(v_51b584.advertisement)) {
          v_134529.set(v_51b584.advertisement, v_51b584);
        }
      });

      const v_003147 = v_e84694.map((v_8c0b26, v_a56041) => {

        const v_41b12b = v_d25278;
        const v_53c32d = v_0b0cab;

        let v_64253e = v_8c0b26.advertisement;
        let v_0d62f2 = v_8c0b26.campid;
        let v_20a4f9 = v_8c0b26.name;
        let v_bab2d5 = v_8c0b26.xrunPrice;
        let v_0c7ff8 = v_8c0b26.iconurl;
        let v_9ddd01 = v_8c0b26.joindesc;
        let v_6ba2e0 = v_8c0b26.brand;

        if (v_41b12b.length === 1 && v_53c32d.length === 1) {

          const v_133a54 = Number(v_41b12b[0]) || 668;
          const v_4de11e = Number(v_53c32d[0]) || 39619;

          const v_a3cd03 = Math.abs(Number(v_8c0b26.coin) || v_a56041) % 5; 

          v_64253e = v_133a54 + v_a3cd03;

          v_0d62f2 = v_4de11e + v_a3cd03;

          const v_8e49e1 = v_134529.get(v_64253e);
          if (v_8e49e1) {
            v_20a4f9 = v_8e49e1.name || v_8c0b26.name;
            v_bab2d5 = v_8e49e1.xrunPrice || v_8c0b26.xrunPrice;
            v_0c7ff8 = v_8e49e1.iconurl || v_8c0b26.iconurl;
            v_9ddd01 = v_8e49e1.joindesc || v_8c0b26.joindesc;
            v_6ba2e0 = v_8e49e1.brand || v_8c0b26.brand;
          } else {

            const v_ec5aac = [
              '워지아 포세린 세라믹 식탁 (클릭하고 20초보기)',
              'XRUN 코인 획득 기회',
              '특별 광고 이벤트',
              '리워드 토큰 수집',
              '프리미엄 광고 보기',
            ];
            const v_d02315 = [
              '워지아',
              'XRUN',
              '이벤트',
              '리워드',
              '프리미엄',
            ];
            const v_a44988 = [
              0.72,
              1.25,
              0.95,
              1.50,
              2.00,
            ];

            v_20a4f9 = v_ec5aac[v_a3cd03] || v_8c0b26.name;
            v_6ba2e0 = v_d02315[v_a3cd03] || v_8c0b26.brand || 'XRUN';
            v_bab2d5 = v_a44988[v_a3cd03] || v_8c0b26.xrunPrice || 0;

            if (!v_bab2d5 || v_bab2d5 === 0) {
              v_bab2d5 = v_a44988[v_a3cd03];
            }
          }

          console.log(`🔄 지도 마커 광고 분배 [${v_a56041}]: coin=${v_8c0b26.coin}, advertisement=${v_64253e}, campid=${v_0d62f2}, name=${v_20a4f9}`);
        } else if (v_41b12b.length > 1) {

          v_64253e = v_41b12b[v_a56041 % v_41b12b.length] as number;
          v_0d62f2 = v_53c32d[v_a56041 % v_53c32d.length] as number;

          const v_8e49e1 = v_134529.get(v_64253e);
          if (v_8e49e1) {
            v_20a4f9 = v_8e49e1.name || v_8c0b26.name;
            v_bab2d5 = v_8e49e1.xrunPrice || v_8c0b26.xrunPrice;
            v_0c7ff8 = v_8e49e1.iconurl || v_8c0b26.iconurl;
            v_9ddd01 = v_8e49e1.joindesc || v_8c0b26.joindesc;
            v_6ba2e0 = v_8e49e1.brand || v_8c0b26.brand;
          }
        }

        const v_59d211 = {
          ...v_8c0b26,
          advertisement: v_64253e,
          campid: v_0d62f2,
          name: v_20a4f9,
          xrunPrice: v_bab2d5,
          iconurl: v_0c7ff8,
          joindesc: v_9ddd01,
          brand: v_6ba2e0,
        };

        if (v_a56041 < 5) {
          console.log(`📊 분배된 마커 [${v_a56041}]:`, {
            coin: v_59d211.coin,
            name: v_59d211.name,
            advertisement: v_59d211.advertisement,
            campid: v_59d211.campid,
            xrunPrice: v_59d211.xrunPrice,
            brand: v_59d211.brand,
          });
        }

        return v_59d211;
      });

      const v_f6123d = await v_91d5e4(
        v_f18a9c.latitude,
        v_f18a9c.longitude,
        v_660822,
        v_9b57fc,
      );

      const v_f85685 = await v_965f93(v_9b57fc);
      const v_8f5869 = v_f85685?.data?.coins;

      const v_958ad1 = v_f6123d?.data && Array.isArray(v_f6123d.data)
        ? v_f6123d.data
            .slice(0, Math.random() < 0.5 ? 1 : 2)
            .map((v_8c0b26, v_a56041, v_09228c) => {

              if (v_09228c.length === 2 && v_a56041 === 1) {
                return {
                  ...v_8c0b26,
                  coin: 1,
                  lat: 0,
                  lng: 0,
                  title: v_8c0b26.title,
                  distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                  advertisement: v_8c0b26.advertisement,
                  coins: v_8c0b26.coins,
                  iconurl: v_8c0b26.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                  joindesc: v_8c0b26.joindesc || '가상 코인 설명',
                  name: v_8c0b26.name || v_8c0b26.title || v_8c0b26.brand,
                  campid: v_8c0b26.campid || v_8c0b26.campId || '',
                  xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
                };
              }
              return {
                ...v_8c0b26,
                currency: 18,
                lat: 0,
                lng: 0,
                title: v_8c0b26.title,
                distance: (Math.random() * (10 - 0.1) + 0.1).toFixed(2),
                coins: v_8f5869,
                advertisement: 672,
                iconurl: v_8c0b26.iconurl || 'https://www.xrun.run/assets/images/logo_visual_black.png',
                joindesc: v_8c0b26.joindesc || 'Virtual coin description',
                name: v_8c0b26.name || v_8c0b26.title || v_8c0b26.brand,
                campid: v_8c0b26.campid || v_8c0b26.campId || '',
                xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
              };
            })
        : [];

      let v_b9ce93 = v_ee8180?.data && Array.isArray(v_ee8180.data)
        ? v_ee8180.data.map((v_8c0b26) => ({
            lat: v_8c0b26.lat,
            lng: v_8c0b26.lng,
            title: v_8c0b26.title,
            distance: v_8c0b26.distance,
            coins: v_8c0b26.coins,
            coin: v_8c0b26.coin,
            advertisement: v_8c0b26.advertisement,
            iconurl: v_8c0b26.iconurl,
            joindesc: v_8c0b26.joindesc,
            name: v_8c0b26.name,
            campid: v_8c0b26.campid,
            xrunprice: v_8c0b26.xrunprice,
            xrunPrice: v_8c0b26.xrunPrice || v_8c0b26.xrunprice || 0,
            brand: v_8c0b26.brand,
          }))
        : [];

      const v_c8e33c = new Set(v_b9ce93.map((v_8c0b26) => v_8c0b26.advertisement)).size;
      const v_ea9888 = new Set(v_b9ce93.map((v_8c0b26) => v_8c0b26.campid)).size;

      if (v_b9ce93.length > 0 && v_c8e33c <= 1 && v_ea9888 <= 1) {
        console.log('⚠️ [MapMainScreen] 서버에서 단일 광고/캠페인 ID만 반환됨. 클라이언트에서 분배 시도.');
        const v_133a54 = v_b9ce93[0].advertisement || 668;
        const v_4de11e = v_b9ce93[0].campid || 39619;

        v_b9ce93 = v_b9ce93.map((v_8c0b26) => {

          const v_598405 = v_8c0b26.coin ? String(v_8c0b26.coin).split('').reduce((v_9f1d92, v_620da0) => v_9f1d92 + v_620da0.charCodeAt(0), 0) : 0;
          const v_a3cd03 = v_598405 % 5; 

          return {
            ...v_8c0b26,
            advertisement: v_133a54 + v_a3cd03,
            campid: v_4de11e + v_a3cd03,
          };
        });
        console.log('✅ [MapMainScreen] 클라이언트에서 advertisement/campid 분배 완료.');
      }

      const v_2876a4 = [...v_958ad1, ...v_b9ce93];
      console.log('=== 결합된 토큰 데이터 ===');
      console.log('combinedCoinsData length:', v_2876a4.length);

      const v_bf588a = [];
      v_2876a4.forEach((v_8c0b26) => {
        if (v_8c0b26.brandlogo_file) v_bf588a.push(v_8c0b26.brandlogo_file);
        if (v_8c0b26.adthumbnail2_file) v_bf588a.push(v_8c0b26.adthumbnail2_file);
        if (v_8c0b26.symbolimg_file) v_bf588a.push(v_8c0b26.symbolimg_file);
      });

      if (v_bf588a.length > 0) {
        try {
          await v_858bfa.downloadMultipleImages(v_bf588a, v_c9c489.GATEWAY_NODEJS);
          console.log('✅ 이미지 캐싱 완료');
        } catch (v_67ab2b) {
          console.error('이미지 캐싱 오류:', v_67ab2b);
        }
      }

      console.log('🔍 [MapMainScreen] 분배된 markerData 샘플 (처음 10개):');
      v_003147.slice(0, 10).forEach((v_5e3dbb, v_e86ad8) => {
        console.log(`  [${v_e86ad8}]: coin=${v_5e3dbb.coin}, name=${v_5e3dbb.name}, advertisement=${v_5e3dbb.advertisement}, campid=${v_5e3dbb.campid}, xrunPrice=${v_5e3dbb.xrunPrice}, brand=${v_5e3dbb.brand}`);
      });

      const v_ac7ea8 = v_003147
        .map((v_35f85c) => v_35f85c.advertisement)
        .filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
      const v_e7b34e = Array.from(new Set(v_ac7ea8));
      const v_59ff13 = v_003147
        .map((v_35f85c) => v_35f85c.campid)
        .filter((v_81e2ef) => v_81e2ef != null && v_81e2ef !== undefined && v_81e2ef !== '');
      const v_d7cb17 = Array.from(new Set(v_59ff13));

      console.log('📊 [MapMainScreen] 분배 후 통계:', {
        totalMarkers: v_003147.length,
        uniqueAdvertisements: v_e7b34e.length,
        uniqueCampids: v_d7cb17.length,
        advertisementValues: v_e7b34e.slice(0, 10),
        campidValues: v_d7cb17.slice(0, 10),
      });

      v_14dd24(v_003147);
      v_c84980(v_f18a9c);
      v_a2b40c.current = v_f18a9c;

      if (v_2876a4.length > 0) {
        try {
          await v_e84827.setItem('astorCoinsData', JSON.stringify(v_2876a4));
          console.log('✅ astorCoinsData AsyncStorage에 저장 완료');
          console.log('astorCoinsData -> ' + v_2876a4.length);
        } catch (v_df17d5) {
          console.error('AsyncStorage 저장 오류:', v_df17d5);
        }
      } else {

        if (v_958ad1.length > 0) {
          try {
            await v_e84827.setItem('astorCoinsData', JSON.stringify(v_958ad1));
            console.log('✅ astorCoinsData AsyncStorage에 저장 완료 (coinsDataVt:', v_958ad1.length, '개)');
          } catch (v_df17d5) {
            console.error('AsyncStorage 저장 오류:', v_df17d5);
          }
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

    v_ca338a.current = true;
    console.log('📍 [프로그램 이동] 초기 위치로 복귀 시작');
    console.log('  현재 위치:', v_dfcc93.latitude.toFixed(6), v_dfcc93.longitude.toFixed(6));
    console.log('  목표 위치:', v_0ff02b.latitude.toFixed(6), v_0ff02b.longitude.toFixed(6));

    if (v_3ec640.current) {
      v_3ec640.current.animateToRegion({
        latitude: v_0ff02b.latitude,
        longitude: v_0ff02b.longitude,
        latitudeDelta: v_dfcc93.latitudeDelta,
        longitudeDelta: v_dfcc93.longitudeDelta,
      }, 500);

      setTimeout(() => {
        v_ca338a.current = false;
        console.log('📍 [프로그램 이동] 플래그 리셋 완료');
      }, 600);
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
      console.log('=== [3초마다 위치 확인] 맵 위치 변경 감지 ===');
      console.log('  현재 위치:', v_7dd198.latitude.toFixed(6), v_7dd198.longitude.toFixed(6));
      console.log('  마지막 마커 로드 위치:', v_5a477d.latitude.toFixed(6), v_5a477d.longitude.toFixed(6));
      console.log('  거리:', v_926d1c.toFixed(2), 'm');
      console.log('  프로그램 이동 플래그:', v_ca338a.current);
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
    const v_f2c805 = async () => {
      try {
        console.log('[MapMainScreen] Taboola HTML 프리로드 시작');
        await v_295e39();
        console.log('[MapMainScreen] Taboola HTML 프리로드 완료');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      } catch (v_5e9bfe) {
        console.error('[MapMainScreen] Taboola HTML 프리로드 실패:', v_5e9bfe);
      }
    };

    v_f2c805();
  }, []); 

  v_c4deb2(() => {
    let v_fd434d = null;

    const v_169317 = async () => {

      const { status: v_d308b5 } = await v_8a44cb.requestForegroundPermissionsAsync();
      if (v_d308b5 !== 'granted') {
        v_a7e4fc(v_8d41d7('common.messages.locationPermissionMessage'));
        await v_889fad(
          v_8d41d7('common.messages.locationPermissionRequired'),
          v_8d41d7('common.messages.locationPermissionMessage'),
          [{ text: v_8d41d7('common.buttons.confirm') }]
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

          v_c675cc.current = {
            latitude: v_4a8217.latitude,
            longitude: v_4a8217.longitude,
          };
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
          await v_889fad(
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

                  v_c675cc.current = {
                    latitude: v_3a1065.latitude,
                    longitude: v_3a1065.longitude,
                  };
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

            v_c675cc.current = {
              latitude: v_3a1065.latitude,
              longitude: v_3a1065.longitude,
            };
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
    const v_f667f9 = v_c5ac8b as v_f71847 & { advertisement?: string | number; campid?: string };
    console.log('🎯 마커 클릭 - 전달된 데이터:', {
      index: v_a56041,
      name: v_f667f9.name,
      brand: v_f667f9.brand,
      xrunPrice: v_f667f9.xrunPrice,
      iconurl: v_f667f9.iconurl,
      advertisement: v_f667f9.advertisement,
      campid: v_f667f9.campid,
      coin: v_f667f9.coin,
      joindesc: v_f667f9.joindesc,
    });
    v_22f943(v_c5ac8b);
    if (!v_572bd3) {
      v_6a4dcd(true);
    }

    if (v_3ec640.current && v_c5ac8b.latitude && v_c5ac8b.longitude) {
      const v_340e3c = v_de148f.current;

      v_ca338a.current = true;
      console.log('📍 [프로그램 이동] 마커 클릭으로 맵 이동 시작');
      console.log('  현재 위치:', v_340e3c.latitude.toFixed(6), v_340e3c.longitude.toFixed(6));
      console.log('  목표 위치:', v_c5ac8b.latitude.toFixed(6), v_c5ac8b.longitude.toFixed(6));

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
        v_ca338a.current = false;
        console.log('📍 [프로그램 이동] 마커 클릭 이동 플래그 리셋 완료');
      }, 600);

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
              const v_f667f9 = v_c5ac8b as v_f71847 & { advertisement?: string | number; campid?: string };
              console.log('🎯 중앙 팝업 표시 데이터:', {
                name: v_f667f9.name,
                brand: v_f667f9.brand,
                xrunPrice: v_f667f9.xrunPrice,
                advertisement: v_f667f9.advertisement,
                campid: v_f667f9.campid,
                iconurl: v_f667f9.iconurl,
                joindesc: v_f667f9.joindesc,
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
            const v_f667f9 = v_c5ac8b as v_f71847 & { advertisement?: string | number; campid?: string };
            console.log('🎯 중앙 팝업 표시 데이터 (좌표 변환 실패):', {
              name: v_f667f9.name,
              brand: v_f667f9.brand,
              xrunPrice: v_f667f9.xrunPrice,
              advertisement: v_f667f9.advertisement,
              campid: v_f667f9.campid,
              iconurl: v_f667f9.iconurl,
              joindesc: v_f667f9.joindesc,
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
      const v_f667f9 = v_c5ac8b as v_f71847 & { advertisement?: string | number; campid?: string };
      console.log('🎯 중앙 팝업 표시 데이터 (맵 미준비):', {
        name: v_f667f9.name,
        brand: v_f667f9.brand,
        xrunPrice: v_f667f9.xrunPrice,
        advertisement: v_f667f9.advertisement,
        campid: v_f667f9.campid,
        iconurl: v_f667f9.iconurl,
        joindesc: v_f667f9.joindesc,
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

      v_ca338a.current = true;
      console.log('📍 [프로그램 이동] 맵 클릭으로 맵 이동 시작');
      console.log('  현재 위치:', v_340e3c.latitude.toFixed(6), v_340e3c.longitude.toFixed(6));
      console.log('  목표 위치:', v_5e3dbb.latitude.toFixed(6), v_5e3dbb.longitude.toFixed(6));

      v_3ec640.current.animateToRegion({
        latitude: v_5e3dbb.latitude,
        longitude: v_5e3dbb.longitude,
        latitudeDelta: v_340e3c.latitudeDelta,
        longitudeDelta: v_340e3c.longitudeDelta,
      }, 500); 

      setTimeout(() => {
        v_ca338a.current = false;
        console.log('📍 [프로그램 이동] 맵 클릭 이동 플래그 리셋 완료');
      }, 600);
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

  const v_f127bf = () => {
    if (v_326be8.OS === 'ios') {
      console.log('👆 [iOS] 사용자 드래그 시작 감지');
      v_43de51.current = true;
    }
  };

  const v_6b4469 = (v_a6c30b) => {
    const v_355a57 = v_ca338a.current;
    const v_81a27a = v_326be8.OS;
    const v_46e4e9 = v_c675cc.current;

    console.log('=== [맵 이동 완료 이벤트] ===');
    console.log('플랫폼:', v_81a27a);
    console.log('프로그램 이동 플래그:', v_355a57);
    console.log('사용자 터치 플래그:', v_43de51.current);
    console.log('새로운 위치:', v_a6c30b.latitude.toFixed(6), v_a6c30b.longitude.toFixed(6));
    console.log('현재 mapRegionRef 위치:', v_de148f.current.latitude.toFixed(6), v_de148f.current.longitude.toFixed(6));

    if (v_326be8.OS === 'ios' && v_ca338a.current) {
      console.log('⚠️ [iOS] 프로그램 이동 감지 - mapRegionRef 업데이트 건너뛰기');

      v_ed2516(v_a6c30b);

      v_ca338a.current = false;
      return;
    }

    if (v_326be8.OS === 'ios' && !v_43de51.current) {
      console.log('⚠️ [iOS] 사용자 터치 없음 - mapRegionRef 업데이트 건너뛰기 및 지도 위치 복귀');

      if (v_3ec640.current) {
        const v_340e3c = v_de148f.current;
        v_3ec640.current.animateToRegion({
          latitude: v_340e3c.latitude,
          longitude: v_340e3c.longitude,
          latitudeDelta: v_340e3c.latitudeDelta,
          longitudeDelta: v_340e3c.longitudeDelta,
        }, 100); 
      }

      return;
    }

    if (v_326be8.OS === 'ios' && v_46e4e9) {
      const v_7358c4 = Math.abs(v_a6c30b.latitude - v_46e4e9.latitude);
      const v_85decc = Math.abs(v_a6c30b.longitude - v_46e4e9.longitude);
      const v_8cc066 = 0.0001; 

      console.log('  위치 변경 차이:', 'latDiff:', v_7358c4.toFixed(6), 'lonDiff:', v_85decc.toFixed(6));

      if (v_7358c4 < v_8cc066 && v_85decc < v_8cc066) {
        console.log('⚠️ [iOS] 위치 변경이 너무 작음 - 무시 및 지도 위치 복귀');

        if (v_3ec640.current && v_46e4e9) {
          v_3ec640.current.animateToRegion({
            latitude: v_46e4e9.latitude,
            longitude: v_46e4e9.longitude,
            latitudeDelta: v_de148f.current.latitudeDelta,
            longitudeDelta: v_de148f.current.longitudeDelta,
          }, 100); 
        }

        return;
      }
    } else if (v_326be8.OS === 'ios' && !v_46e4e9) {

      console.log('  [iOS] 첫 위치 업데이트 (lastUpdated가 null)');
    }

    if (v_326be8.OS === 'ios') {
      console.log('✅ [iOS] 사용자 터치 + 위치 변경 확인 - mapRegionRef 업데이트');
    } else {
      console.log('✅ [Android] 사용자 드래그 감지 - mapRegionRef 업데이트');
    }

    v_ed2516(v_a6c30b);
    v_de148f.current = v_a6c30b;
    v_c675cc.current = {
      latitude: v_a6c30b.latitude,
      longitude: v_a6c30b.longitude,
    };

    v_a11b30.current = Date.now();

    v_43de51.current = false;
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
        <MapView
          ref={v_3ec640}
          provider={v_b4043e}
          style={v_d81136.map}
          region={v_434ce4}
          showsUserLocation={!!v_a55f0b} 
          showsMyLocationButton={false}
          onRegionChange={v_0424a1}
          onRegionChangeComplete={v_6b4469}
          onPanDrag={v_f127bf}
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

