import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnv, getAuthCode } from './env';
import axios, { AxiosError } from 'axios';

export const cashingimages = {

  CACHE_LIST_KEY: 'cashingimages_cache_list',

  getCacheKey: (fileId: string | number) => `cashingimages_file_${fileId}`,

  getCacheList: async (): Promise<Record<string, any>> => {
    try {
      const cacheList = await AsyncStorage.getItem(cashingimages.CACHE_LIST_KEY);
      return cacheList ? JSON.parse(cacheList) : {};
    } catch (error) {
      console.error('[이미지 캐시] 캐시 목록 가져오기 실패:', error);
      return {};
    }
  },

  setCacheList: async (cacheList: Record<string, any>): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        cashingimages.CACHE_LIST_KEY,
        JSON.stringify(cacheList),
      );
    } catch (error) {
      console.error('[이미지 캐시] 캐시 목록 저장 실패:', error);
    }
  },

  isCached: async (fileId: string | number): Promise<boolean> => {
    try {
      const cacheList = await cashingimages.getCacheList();
      return cacheList[String(fileId)] !== undefined;
    } catch (error) {
      console.error('[이미지 캐시] 캐시 확인 실패:', error);
      return false;
    }
  },

  getCachedImage: async (fileId: string | number): Promise<string | null> => {
    try {
      const cacheKey = cashingimages.getCacheKey(fileId);
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        const imageData = JSON.parse(cachedData);
        const filecontents = imageData.filecontents;
        const filesize = imageData.filesize;

        if (!filesize || filesize === 0) {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${fileId}의 파일 크기가 0이거나 없음. 캐시 무효화.`);
          return null;
        }

        if (!filecontents || typeof filecontents !== 'string' || filecontents.trim() === '') {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${fileId}의 파일 내용이 없거나 비어있음. 캐시 무효화.`);
          return null;
        }

        if (filecontents.length < 100) {
          console.log(`[이미지 캐시] ⚠️ 이미지 ${fileId}의 파일 내용이 너무 짧음 (${filecontents.length}자). 캐시 무효화.`);
          return null;
        }

        console.log(`[이미지 캐시] ✅ 이미지 ${fileId} 캐시 유효성 검증 통과 (크기: ${filesize} bytes, 내용 길이: ${filecontents.length}자)`);
        return filecontents;
      }
      return null;
    } catch (error) {
      console.error('[이미지 캐시] 캐시된 이미지 가져오기 실패:', error);
      return null;
    }
  },

  downloadAndCacheImage: async (
    fileId: string | number,
    gatewayApiAddress?: string,
  ): Promise<boolean> => {
    try {
      console.log(`[이미지 캐시] === 이미지 다운로드 시작: ${fileId} ===`);
      const startTime = Date.now();

      const isAlreadyCached = await cashingimages.isCached(fileId);
      if (isAlreadyCached) {
        console.log(`[이미지 캐시] 이미지 ${fileId}는 이미 캐시되어 있습니다.`);
        return true;
      }

      let env;
      try {
        env = getEnv();
      } catch (error) {
        console.warn('[이미지 캐시] 환경 변수 로드 실패, 재시도 중...', error);

        try {
          const { loadEnv } = await import('./env');
          await loadEnv();
          env = getEnv();
          console.log('[이미지 캐시] 환경 변수 로드 성공');
        } catch (loadError) {
          console.error('[이미지 캐시] 환경 변수 로드 재시도 실패:', loadError);
          return false;
        }
      }

      let apiAddress = gatewayApiAddress || env.GATEWAY_NODEJS;

      console.log('[이미지 캐시] URL_API_NODEJS (gatewayApiAddress):', apiAddress);

      let authCode: string;
      try {
        authCode = getAuthCode();
      } catch (error) {
        console.error('[이미지 캐시] ❌ 인증 코드 가져오기 실패:', error);
        return false;
      }

      const fileIdStr = String(fileId);

      if (!authCode || authCode.trim() === '') {
        console.error('[이미지 캐시] ❌ GATEWAY_AUTH_CODE가 비어있습니다.');
        console.error('[이미지 캐시] env 객체:', env);
        return false;
      }

      let fixedUrl = `${apiAddress}/files/${fileIdStr}`;
      fixedUrl = fixedUrl.replace('/oth-path', '');

      console.log('[이미지 캐시] === URL 구성 확인 ===');
      console.log('[이미지 캐시] 1. URL_API_NODEJS 값:', apiAddress);
      console.log('[이미지 캐시] 2. /oth-path 포함 여부:', apiAddress.includes('/oth-path') ? '✅ 포함됨' : '❌ 포함 안 됨');
      console.log('[이미지 캐시] 3. fileId:', fileIdStr);
      console.log('[이미지 캐시] 4. 최종 fixedUrl:', fixedUrl);

      const urlParts = fixedUrl.split('/files/');
      const baseURL = urlParts[0]; 
      const endpoint = `/files/${fileIdStr}`; 

      const hasAuthCode = !!authCode && authCode.trim() !== '';

      const authHeader = `Bearer ${authCode}`;

      const requestHeaders = {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      };

      console.log(`[이미지 캐시] === 이미지 다운로드 요청 시작 ===`);
      console.log(`[이미지 캐시] fileId: ${fileIdStr}`);
      console.log(`[이미지 캐시] 엔드포인트: ${endpoint}`);
      console.log(`[이미지 캐시] baseURL: ${baseURL}`);
      console.log(`[이미지 캐시] 최종 fixedUrl: ${fixedUrl}`);
      console.log(`[이미지 캐시] === 401 체크 포인트 ===`);
      console.log(`[이미지 캐시] 1. authcode 존재 여부: ${hasAuthCode ? '✅ 있음' : '❌ 없음'}`);
      console.log(`[이미지 캐시] 2. Authorization 헤더 형식: ${authHeader.substring(0, 20)}...`);
      console.log(`[이미지 캐시] 3. 실제 Request Header:`, {
        'Content-Type': requestHeaders['Content-Type'],
        Authorization: `${authHeader.substring(0, 20)}... (전체 길이: ${authCode.length})`,
      });
      console.log(`[이미지 캐시] === 404 체크 포인트 ===`);
      console.log(`[이미지 캐시] 1. 백엔드 라우트 경로: ${endpoint}`);
      console.log(`[이미지 캐시] 2. fileId 존재 여부: ${fileIdStr ? '✅ 있음' : '❌ 없음'}`);
      console.log(`[이미지 캐시] 3. 전체 요청 URL: ${fixedUrl}`);

      const axiosInstance = axios.create({
        baseURL: baseURL, 
        timeout: 20000,
        headers: requestHeaders,
      });

      let result;
      try {

        const response = await axiosInstance.get(endpoint);

        result = response.data;
        console.log(`[이미지 캐시] ✅ 이미지 다운로드 성공: ${fileIdStr}`);
      } catch (error: any) {

        if (error instanceof AxiosError && error.response) {

          const status = error.response.status;
          const errorData = error.response.data;

          console.error(`[이미지 캐시] === 에러 상세 정보 ===`);
          console.error(`[이미지 캐시] ❌ 이미지 다운로드 실패 (${status}): ${fileIdStr}`);
          console.error(`[이미지 캐시] 응답 내용:`, JSON.stringify(errorData, null, 2));
          console.error(`[이미지 캐시] 요청 URL: ${fixedUrl}`);
          console.error(`[이미지 캐시] 요청 메서드: GET`);
          console.error(`[이미지 캐시] 요청 헤더:`, JSON.stringify(requestHeaders, null, 2));

          if (status === 401) {
            console.error(`[이미지 캐시] === 401 에러 분석 ===`);
            console.error(`[이미지 캐시] ❌ 인증 실패: 토큰이 유효하지 않습니다.`);
            console.error(`[이미지 캐시] 체크 포인트 1 - authcode 존재 여부: ${hasAuthCode ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Authorization 헤더 형식: ${authHeader}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - 실제 Request Header:`, requestHeaders);
            console.error(`[이미지 캐시] 전체 토큰: ${authCode}`);
            console.error(`[이미지 캐시] 토큰 길이: ${authCode.length}`);
          }

          if (status === 404) {
            console.error(`[이미지 캐시] === 404 에러 분석 ===`);
            console.error(`[이미지 캐시] ❌ 파일을 찾을 수 없습니다: ${fileIdStr}`);
            console.error(`[이미지 캐시] 체크 포인트 1 - 백엔드 라우트 경로: ${endpoint} (GET)`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Postman으로 직접 테스트 필요:`);
            console.error(`[이미지 캐시]   URL: ${fixedUrl}`);
            console.error(`[이미지 캐시]   Method: GET`);
            console.error(`[이미지 캐시]   Headers:`);
            console.error(`[이미지 캐시]     Authorization: Bearer ${authCode}`);
            console.error(`[이미지 캐시]     Content-Type: application/json`);
            console.error(`[이미지 캐시] 체크 포인트 3 - fileId 존재 여부: ${fileIdStr ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] === 백엔드 확인 체크리스트 ===`);
            console.error(`[이미지 캐시] A. 라우트 확인:`);
            console.error(`[이미지 캐시]   [ ] /files/:fileId 라우트가 존재하는지`);
            console.error(`[이미지 캐시]   [ ] 라우트가 활성화되어 있는지`);
            console.error(`[이미지 캐시]   [ ] 다른 경로 형식이 필요한지 (예: /oth-path)`);
            console.error(`[이미지 캐시] C. 대안 엔드포인트 확인:`);
            console.error(`[이미지 캐시]   - POST /oth-path (body에 fileId 포함)`);
            console.error(`[이미지 캐시]   - GET /oth-path?fileId=${fileIdStr}`);
            console.error(`[이미지 캐시]   - GET /oth-path${fileIdStr}`);
          }
        } else if (error instanceof AxiosError && error.request) {

          console.error(`[이미지 캐시] ❌ 네트워크 오류: 응답을 받지 못했습니다.`);
          console.error(`[이미지 캐시] 요청 URL: ${fixedUrl}`);
        } else {

          console.error(`[이미지 캐시] ❌ 요청 설정 오류:`, error.message);
        }
        return false;
      }

      if (!result) {
        console.error(`[이미지 캐시] 이미지 다운로드 응답이 null입니다: ${fileIdStr}`);
        return false;
      }

      if (result.status === 'error' || result.status === 'fail') {
        const errorCode = result.code || 'UNKNOWN';
        console.error(`[이미지 캐시] === 응답 body 에러 분석 ===`);
        console.error(`[이미지 캐시] ❌ 이미지 다운로드 실패 (${errorCode}): ${fileIdStr}`);
        console.error(`[이미지 캐시] 응답 상태: ${result.status}`);
        console.error(`[이미지 캐시] 응답 내용:`, JSON.stringify(result, null, 2));
        console.error(`[이미지 캐시] 사용된 토큰: ${authCode ? '있음 (길이: ' + authCode.length + ')' : '없음'}`);
        console.error(`[이미지 캐시] 요청 URL: ${fixedUrl}`);

        if (errorCode === 401 || errorCode === 404) {
          if (errorCode === 401) {
            console.error(`[이미지 캐시] === 401 에러 분석 (응답 body) ===`);
            console.error(`[이미지 캐시] 체크 포인트 1 - authcode 존재 여부: ${hasAuthCode ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Authorization 헤더 형식: ${authHeader}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - 실제 Request Header:`, requestHeaders);
          }
          if (errorCode === 404) {
            console.error(`[이미지 캐시] === 404 에러 분석 (응답 body) ===`);
            console.error(`[이미지 캐시] 체크 포인트 1 - 백엔드 라우트 경로: ${endpoint}`);
            console.error(`[이미지 캐시] 체크 포인트 2 - Postman으로 직접 테스트 필요: ${fixedUrl}`);
            console.error(`[이미지 캐시] 체크 포인트 3 - fileId 존재 여부: ${fileIdStr ? '✅ 있음' : '❌ 없음'}`);
            console.error(`[이미지 캐시] 가능한 원인:`);
            console.error(`[이미지 캐시]   - URL 형식이 잘못되었을 수 있습니다.`);
            console.error(`[이미지 캐시]   - 엔드포인트가 다를 수 있습니다 (예: POST /oth-path).`);
            console.error(`[이미지 캐시]   - 백엔드 라우트가 설정되지 않았을 수 있습니다.`);
          }
        }
        return false;
      }

      if (!result.success || !result.data) {
        console.error(`[이미지 캐시] 이미지 다운로드 응답 오류: ${fileIdStr}`, result);
        console.error(`[이미지 캐시] 요청 URL: ${fixedUrl}`);
        return false;
      }

      if (!result.data.filecontents) {
        console.error(`[이미지 캐시] 이미지 데이터가 없습니다: ${fileIdStr}`, result);
        return false;
      }

      const { filecontents, filesize, filename } = result.data;

      const imageData = {
        fileId: fileIdStr,
        filecontents,
        filesize,
        filename,
        cachedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        cashingimages.getCacheKey(fileId),
        JSON.stringify(imageData),
      );

      const cacheList = await cashingimages.getCacheList();
      cacheList[fileIdStr] = {
        filename,
        filesize,
        cachedAt: imageData.cachedAt,
      };
      await cashingimages.setCacheList(cacheList);

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`[이미지 캐시] 이미지 ${fileId} 다운로드 및 캐시 성공 (소요 시간: ${duration}ms)`);
      return true;
    } catch (error) {
      console.error(`[이미지 캐시] 이미지 ${fileId} 다운로드 오류:`, error);
      return false;
    }
  },

  downloadMultipleImages: async (
    fileIds: (string | number)[],
    gatewayApiAddress?: string,
  ): Promise<boolean[]> => {
    console.log(`[이미지 캐시] === 여러 이미지 다운로드 시작: ${fileIds.length}개 ===`);
    const startTime = Date.now();

    const uniqueFileIds = Array.from(new Set(fileIds.map(id => String(id))));
    console.log(`[이미지 캐시] 중복 제거 후: ${uniqueFileIds.length}개`);

    const uncachedFileIds: string[] = [];
    for (const fileId of uniqueFileIds) {
      const isCached = await cashingimages.isCached(fileId);
      if (!isCached) {
        uncachedFileIds.push(fileId);
      }
    }

    console.log(`[이미지 캐시] 캐시되지 않은 이미지: ${uncachedFileIds.length}개`);

    if (uncachedFileIds.length === 0) {
      console.log(`[이미지 캐시] 모든 이미지가 이미 캐시되어 있습니다.`);
      return uniqueFileIds.map(() => true);
    }

    const batchSize = 5;
    const results: boolean[] = new Array(uniqueFileIds.length).fill(false);

    for (let i = 0; i < uncachedFileIds.length; i += batchSize) {
      const batch = uncachedFileIds.slice(i, i + batchSize);
      console.log(`[이미지 캐시] 배치 ${Math.floor(i / batchSize) + 1} 다운로드 시작: ${batch.length}개`);

      const batchResults = await Promise.all(
        batch.map(async (fileId) => {
          return await cashingimages.downloadAndCacheImage(fileId, gatewayApiAddress);
        }),
      );

      batch.forEach((fileId, batchIndex) => {
        const originalIndex = uniqueFileIds.indexOf(fileId);
        if (originalIndex !== -1) {
          results[originalIndex] = batchResults[batchIndex];
        }
      });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const successCount = results.filter(r => r).length;
    console.log(`[이미지 캐시] === 여러 이미지 다운로드 완료 ===`);
    console.log(`[이미지 캐시] 성공: ${successCount}/${uniqueFileIds.length}개`);
    console.log(`[이미지 캐시] 소요 시간: ${duration}ms`);

    return results;
  },
};
