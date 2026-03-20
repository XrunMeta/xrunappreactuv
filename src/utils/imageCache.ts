import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import { v_e4a763, v_a358b9 } from './env';
import v_b5030f, { v_3333d3 } from 'imsks';

export const v_858bfa = {

  CACHE_LIST_KEY: 'cashingimages_cache_list',

  getCacheKey: (v_433c46) => `cashingimages_file_${v_433c46}`,

  getCacheList: async (): Promise<Record<string, any>> => {
    try {
      const v_f5acfc = await v_e84827.getItem(v_858bfa.CACHE_LIST_KEY);
      return v_f5acfc ? JSON.parse(v_f5acfc) : {};
    } catch (v_5e9bfe) {
      console.error('[이미지 캐시] 캐시 목록 가져오기 실패:', v_5e9bfe);
      return {};
    }
  },

  setCacheList: async (v_f5acfc): Promise<void> => {
    try {
      await v_e84827.setItem(
        v_858bfa.CACHE_LIST_KEY,
        JSON.stringify(v_f5acfc),
      );
    } catch (v_5e9bfe) {
      console.error('[이미지 캐시] 캐시 목록 저장 실패:', v_5e9bfe);
    }
  },

  isCached: async (v_433c46): Promise<boolean> => {
    try {
      const v_f5acfc = await v_858bfa.getCacheList();
      return v_f5acfc[String(v_433c46)] !== undefined;
    } catch (v_5e9bfe) {
      console.error('[이미지 캐시] 캐시 확인 실패:', v_5e9bfe);
      return false;
    }
  },

  getCachedImage: async (v_433c46): Promise<string | null> => {
    try {
      const v_7ac310 = v_858bfa.getCacheKey(v_433c46);
      const v_dd2dca = await v_e84827.getItem(v_7ac310);

      if (v_dd2dca) {
        const v_14a7eb = JSON.parse(v_dd2dca);
        const v_01513a = v_14a7eb.filecontents;
        const v_fe09e6 = v_14a7eb.filesize;

        if (!v_fe09e6 || v_fe09e6 === 0) {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${v_433c46}의 파일 크기가 0이거나 없음. 캐시 무효화.`);
          return null;
        }

        if (!v_01513a || typeof v_01513a !== 'string' || v_01513a.trim() === '') {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${v_433c46}의 파일 내용이 없거나 비어있음. 캐시 무효화.`);
          return null;
        }

        if (v_01513a.length < 100) {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${v_433c46}의 파일 내용이 너무 짧음 (${v_01513a.length}자). 캐시 무효화.`);
          return null;
        }

        console.log(`[이미지 캐시] ✅ 이미지 ${v_433c46} 캐시 유효성 검증 통과 (크기: ${v_fe09e6} bytes, 내용 길이: ${v_01513a.length}자)`);
        return v_01513a;
      }
      return null;
    } catch (v_5e9bfe) {
      console.error('[이미지 캐시] 캐시된 이미지 가져오기 실패:', v_5e9bfe);
      return null;
    }
  },

  downloadAndCacheImage: async (
    v_433c46,
    v_feeeb6,
  ): Promise<boolean> => {
    try {
      console.log(`[이미지 캐시] === 이미지 다운로드 시작: ${v_433c46} ===`);
      const v_fb7a65 = Date.now();

      const v_d811f7 = await v_858bfa.isCached(v_433c46);
      if (v_d811f7) {
        console.log(`[이미지 캐시] 이미지 ${v_433c46}는 이미 캐시되어 있습니다.`);
        return true;
      }

      let v_c9c489;
      try {
        v_c9c489 = v_e4a763();
      } catch (v_5e9bfe) {
        console.warn('[이미지 캐시] 환경 변수 로드 실패, 재시도 중...', v_5e9bfe);

        try {
          const { loadEnv: v_a2474a } = await import('./env');
          await v_a2474a();
          v_c9c489 = v_e4a763();
          console.log('[이미지 캐시] 환경 변수 로드 성공');
        } catch (v_95616f) {
          console.error('[이미지 캐시] 환경 변수 로드 재시도 실패:', v_95616f);
          return false;
        }
      }

      let v_361e65 = v_feeeb6 || (v_c9c489.USE_WORKERS_API === 'true' ? v_c9c489.GATEWAY_WORKERS : v_c9c489.GATEWAY_NODEJS);

      console.log('[이미지 캐시] URL_API_NODEJS (gatewayApiAddress):', v_361e65);

      let v_36dd9e;
      try {
        v_36dd9e = v_a358b9();
      } catch (v_5e9bfe) {
        console.error('[이미지 캐시] ❌ 인증 코드 가져오기 실패:', v_5e9bfe);
        return false;
      }

      const v_bb51e2 = String(v_433c46);

      if (!v_36dd9e || v_36dd9e.trim() === '') {
        console.error('[이미지 캐시] ❌ GATEWAY_AUTH_CODE가 비어있습니다.');
        console.error('[이미지 캐시] env 객체:', v_c9c489);
        return false;
      }

      let v_ec0757 = `${v_361e65}/files/${v_bb51e2}`;
      v_ec0757 = v_ec0757.replace('/oth-path', '');

      console.log('[이미지 캐시] === URL 구성 확인 ===');
      console.log('[이미지 캐시] 1. URL_API_NODEJS 값:', v_361e65);
      console.log('[이미지 캐시] 2. /oth-path 포함 여부:', v_361e65.includes('/oth-path') ? '✅ 포함됨' : '❌ 포함 안 됨');
      console.log('[이미지 캐시] 3. fileId:', v_bb51e2);
      console.log('[이미지 캐시] 4. 최종 fixedUrl:', v_ec0757);

      const v_866dae = v_ec0757.split('/files/');
      const v_fed274 = v_866dae[0]; 
      const v_09dafd = `/files/${v_bb51e2}`; 

      const v_2ba14f = !!v_36dd9e && v_36dd9e.trim() !== '';

      const v_5c1e3a = `Bearer ${v_36dd9e}`;

      const v_0d450f = {
        'Content-Type': 'application/json',
        Authorization: v_5c1e3a,
      };

      console.log(`[이미지 캐시] === 이미지 다운로드 요청 시작 ===`);
      console.log(`[이미지 캐시] fileId: ${v_bb51e2}`);
      console.log(`[이미지 캐시] 엔드포인트: ${v_09dafd}`);
      console.log(`[이미지 캐시] baseURL: ${v_fed274}`);
      console.log(`[이미지 캐시] 최종 fixedUrl: ${v_ec0757}`);
      console.log(`[이미지 캐시] === 401 체크 포인트 ===`);
      console.log(`[이미지 캐시] 1. authcode 존재 여부: ${v_2ba14f ? '✅ 있음' : '❌ 없음'}`);
      console.log(`[이미지 캐시] 2. Authorization 헤더 형식: ${v_5c1e3a.substring(0, 20)}...`);
      console.log(`[이미지 캐시] 3. 실제 Request Header:`, {
        'Content-Type': v_0d450f['Content-Type'],
        Authorization: `${v_5c1e3a.substring(0, 20)}... (전체 길이: ${v_36dd9e.length})`,
      });
      console.log(`[이미지 캐시] === 404 체크 포인트 ===`);
      console.log(`[이미지 캐시] 1. 백엔드 라우트 경로: ${v_09dafd}`);
      console.log(`[이미지 캐시] 2. fileId 존재 여부: ${v_bb51e2 ? '✅ 있음' : '❌ 없음'}`);
      console.log(`[이미지 캐시] 3. 전체 요청 URL: ${v_ec0757}`);

      const v_9f42a4 = v_b5030f.create({
        baseURL: v_fed274, 
        timeout: 20000,
        headers: v_0d450f,
      });

      let v_43c42e;
      try {

        const v_3393e3 = await v_9f42a4.get(v_09dafd);

        v_43c42e = v_3393e3.data;
        console.log(`[이미지 캐시] ✅ 이미지 다운로드 성공: ${v_bb51e2}`);
      } catch (v_5e9bfe) {

        if (v_5e9bfe instanceof v_3333d3 && v_5e9bfe.response?.status === 404) {
          console.warn(`[이미지 캐시] ⚠️ 이미지 파일을 찾을 수 없습니다 (404): ${v_bb51e2}. 파일이 삭제되었거나 존재하지 않을 수 있습니다.`);
          return false;
        }

        if (v_5e9bfe instanceof v_3333d3 && v_5e9bfe.response) {

          const v_d308b5 = v_5e9bfe.response.status;
          const v_311c56 = v_5e9bfe.response.data;

          console.error(`[이미지 캐시] === 에러 상세 정보 ===`);
          console.error(`[이미지 캐시] ❌ 이미지 다운로드 실패 (${v_d308b5}): ${v_bb51e2}`);
          console.error(`[이미지 캐시] 응답 내용:`, JSON.stringify(v_311c56, null, 2));
          console.error(`[이미지 캐시] 요청 URL: ${v_ec0757}`);
          console.error(`[이미지 캐시] 요청 메서드: GET`);
          console.error(`[이미지 캐시] 요청 헤더:`, JSON.stringify(v_0d450f, null, 2));

          if (v_d308b5 === 401) {
            console.error(`[이미지 캐시] === 401 에러 분석 ===`);
            console.error(`[이미지 캐시] ❌ 인증 실패: 토큰이 유효하지 않습니다.`);
            console.error(`[이미지 캐시] 체크 포인트 1 - authcode 존재 여부: ${v_2ba14f ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Authorization 헤더 형식: ${v_5c1e3a}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - 실제 Request Header:`, v_0d450f);
            console.error(`[이미지 캐시] 전체 토큰: ${v_36dd9e}`);
            console.error(`[이미지 캐시] 토큰 길이: ${v_36dd9e.length}`);
          }

          if (v_d308b5 === 404) {
            console.error(`[이미지 캐시] === 404 에러 분석 ===`);
            console.error(`[이미지 캐시] ❌ 파일을 찾을 수 없습니다: ${v_bb51e2}`);
            console.error(`[이미지 캐시] 체크 포인트 1 - 백엔드 라우트 경로: ${v_09dafd} (GET)`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Postman으로 직접 테스트 필요:`);
            console.error(`[이미지 캐시]   URL: ${v_ec0757}`);
            console.error(`[이미지 캐시]   Method: GET`);
            console.error(`[이미지 캐시]   Headers:`);
            console.error(`[이미지 캐시]     Authorization: Bearer ${v_36dd9e}`);
            console.error(`[이미지 캐시]     Content-Type: application/json`);
            console.error(`[이미지 캐시] 체크 포인트 3 - fileId 존재 여부: ${v_bb51e2 ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] === 백엔드 확인 체크리스트 ===`);
            console.error(`[이미지 캐시] A. 라우트 확인:`);
            console.error(`[이미지 캐시]   [ ] /files/:fileId 라우트가 존재하는지`);
            console.error(`[이미지 캐시]   [ ] 라우트가 활성화되어 있는지`);
            console.error(`[이미지 캐시]   [ ] 다른 경로 형식이 필요한지 (예: /oth-path)`);
            console.error(`[이미지 캐시] C. 대안 엔드포인트 확인:`);
            console.error(`[이미지 캐시]   - POST /oth-path (body에 fileId 포함)`);
            console.error(`[이미지 캐시]   - GET /oth-path?fileId=${v_bb51e2}`);
            console.error(`[이미지 캐시]   - GET /oth-path${v_bb51e2}`);
          }
        } else if (v_5e9bfe instanceof v_3333d3 && v_5e9bfe.request) {

          console.error(`[이미지 캐시] ❌ 네트워크 오류: 응답을 받지 못했습니다.`);
          console.error(`[이미지 캐시] 요청 URL: ${v_ec0757}`);
        } else {

          console.error(`[이미지 캐시] ❌ 요청 설정 오류:`, v_5e9bfe.message);
        }
        return false;
      }

      if (!v_43c42e) {
        console.error(`[이미지 캐시] 이미지 다운로드 응답이 null입니다: ${v_bb51e2}`);
        return false;
      }

      if (v_43c42e.status === 'error' || v_43c42e.status === 'fail') {
        const v_7a5fef = v_43c42e.code || 'UNKNOWN';
        console.error(`[이미지 캐시] === 응답 body 에러 분석 ===`);
        console.error(`[이미지 캐시] ❌ 이미지 다운로드 실패 (${v_7a5fef}): ${v_bb51e2}`);
        console.error(`[이미지 캐시] 응답 상태: ${v_43c42e.status}`);
        console.error(`[이미지 캐시] 응답 내용:`, JSON.stringify(v_43c42e, null, 2));
        console.error(`[이미지 캐시] 사용된 토큰: ${v_36dd9e ? '있음 (길이: ' + v_36dd9e.length + ')' : '없음'}`);
        console.error(`[이미지 캐시] 요청 URL: ${v_ec0757}`);

        if (v_7a5fef === 401 || v_7a5fef === 404) {
          if (v_7a5fef === 401) {
            console.error(`[이미지 캐시] === 401 에러 분석 (응답 body) ===`);
            console.error(`[이미지 캐시] 체크 포인트 1 - authcode 존재 여부: ${v_2ba14f ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Authorization 헤더 형식: ${v_5c1e3a}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - 실제 Request Header:`, v_0d450f);
          }
          if (v_7a5fef === 404) {
            console.error(`[이미지 캐시] === 404 에러 분석 (응답 body) ===`);
            console.error(`[이미지 캐시] 체크 포인트 1 - 백엔드 라우트 경로: ${v_09dafd}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Postman으로 직접 테스트 필요: ${v_ec0757}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - fileId 존재 여부: ${v_bb51e2 ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 가능한 원인:`);
            console.error(`[이미지 캐시]   - URL 형식이 잘못되었을 수 있습니다.`);
            console.error(`[이미지 캐시]   - 엔드포인트가 다를 수 있습니다 (예: POST /oth-path).`);
            console.error(`[이미지 캐시]   - 백엔드 라우트가 설정되지 않았을 수 있습니다.`);
          }
        }
        return false;
      }

      if (!v_43c42e.success || !v_43c42e.data) {
        console.error(`[이미지 캐시] 이미지 다운로드 응답 오류: ${v_bb51e2}`, v_43c42e);
        console.error(`[이미지 캐시] 요청 URL: ${v_ec0757}`);
        return false;
      }

      if (!v_43c42e.data.filecontents) {
        console.error(`[이미지 캐시] 이미지 데이터가 없습니다: ${v_bb51e2}`, v_43c42e);
        return false;
      }

      const { filecontents: v_01513a, filesize: v_fe09e6, filename: v_c424ac } = v_43c42e.data;

      const v_14a7eb = {
        fileId: v_bb51e2,
        filecontents: v_01513a,
        filesize: v_fe09e6,
        filename: v_c424ac,
        cachedAt: new Date().toISOString(),
      };

      await v_e84827.setItem(
        v_858bfa.getCacheKey(v_433c46),
        JSON.stringify(v_14a7eb),
      );

      const v_f5acfc = await v_858bfa.getCacheList();
      v_f5acfc[v_bb51e2] = {
        filename: v_c424ac,
        filesize: v_fe09e6,
        cachedAt: v_14a7eb.cachedAt,
      };
      await v_858bfa.setCacheList(v_f5acfc);

      const v_39bc0e = Date.now();
      const v_a712cf = v_39bc0e - v_fb7a65;
      console.log(`[이미지 캐시] 이미지 ${v_433c46} 다운로드 및 캐시 성공 (소요 시간: ${v_a712cf}ms)`);
      return true;
    } catch (v_5e9bfe) {
      console.error(`[이미지 캐시] 이미지 ${v_433c46} 다운로드 오류:`, v_5e9bfe);
      return false;
    }
  },

  downloadMultipleImages: async (
    v_a750e4,
    v_feeeb6,
  ): Promise<boolean[]> => {
    console.log(`[이미지 캐시] === 여러 이미지 다운로드 시작: ${v_a750e4.length}개 ===`);
    const v_fb7a65 = Date.now();

    const v_bf588a = Array.from(new Set(v_a750e4.map(v_389afb => String(v_389afb))));
    console.log(`[이미지 캐시] 중복 제거 후: ${v_bf588a.length}개`);

    const v_0f892a = [];
    for (const v_433c46 of v_bf588a) {
      const v_49774a = await v_858bfa.isCached(v_433c46);
      if (!v_49774a) {
        v_0f892a.push(v_433c46);
      }
    }

    console.log(`[이미지 캐시] 캐시되지 않은 이미지: ${v_0f892a.length}개`);

    if (v_0f892a.length === 0) {
      console.log(`[이미지 캐시] 모든 이미지가 이미 캐시되어 있습니다.`);
      return v_bf588a.map(() => true);
    }

    const v_5f1221 = 5;
    const v_a7f568 = new Array(v_bf588a.length).fill(false);

    for (let v_ebec57 = 0; v_ebec57 < v_0f892a.length; v_ebec57 += v_5f1221) {
      const v_36e01f = v_0f892a.slice(v_ebec57, v_ebec57 + v_5f1221);
      console.log(`[이미지 캐시] 배치 ${Math.floor(v_ebec57 / v_5f1221) + 1} 다운로드 시작: ${v_36e01f.length}개`);

      const v_8067e8 = await Promise.all(
        v_36e01f.map(async (v_433c46) => {
          return await v_858bfa.downloadAndCacheImage(v_433c46, v_feeeb6);
        }),
      );

      v_36e01f.forEach((v_433c46, v_51d7da) => {
        const v_3effb4 = v_bf588a.indexOf(v_433c46);
        if (v_3effb4 !== -1) {
          v_a7f568[v_3effb4] = v_8067e8[v_51d7da];
        }
      });
    }

    const v_39bc0e = Date.now();
    const v_a712cf = v_39bc0e - v_fb7a65;
    const v_0d7889 = v_a7f568.filter(v_cb35cb => v_cb35cb).length;
    console.log(`[이미지 캐시] === 여러 이미지 다운로드 완료 ===`);
    console.log(`[이미지 캐시] 성공: ${v_0d7889}/${v_bf588a.length}개`);
    console.log(`[이미지 캐시] 소요 시간: ${v_a712cf}ms`);

    return v_a7f568;
  },
};
