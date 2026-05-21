

import axios, { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import { getEnv } from '../utils/env';

const TIMEOUT_MS = 30000;

const API_CODE_GOODS = '0101';

const API_CODE_GOODS_DETAIL = '0111';
const GOODS_API_BASE_URL = 'https://bizapi.giftishow.com';
const GOODS_API_PATH = '/bizApi/goods';

function logDevRequest(method: string, url: string, status?: number, data?: unknown): void {
  if (__DEV__) {
    console.log(`[기프티쇼비즈] ${method} ${url}` + (status != null ? ` -> ${status}` : ''));
    if (data != null && status && status >= 400) {
      console.log('[기프티쇼비즈] 응답:', JSON.stringify(data).slice(0, 300));
    }
  }
}

export const GIFTISHOW_BIZ_ERROR_CODES: Record<string, string> = {
  '200': '요청 처리 성공',
  '204': '요청을 처리하였으나 전송할 결과 없음',
  '400': '요청형식 틀림',
  '401': '권한 없음 (자원에 대한 ACL에 기인한 권한 없음)',
  '403': '해당 리소스에 접근하는 것이 허락되지 않음',
  '405': '메서드 허용 안됨 (GET, POST, PUT, DELETE)',
  '414': '요청한 URI가 너무 김',
  '500': '내부 서버 오류',
  '503': '외부 서비스가 현재 멈춘 상태이거나 이용할 수 없는 서비스',
  '000': '정상처리',
  ERR0208: '상품 주문 관련 오류',
  ERR0209: '상품 주문 메시지 관련 오류',
  ERR0212: 'MMS 재발송 대상 미조회',
  ERR0213: 'MMS 재발송 대상 미조회',
  ERR0300: '회원정보 조회 실패',
  ERR0301: 'API 가입정보 없음',
  ERR0803: '비즈포인트 차감 오류',
  E0007: 'API코드가 일치하지 않습니다',
  E0008: '유효한 인증 키가 아닙니다',
  E0009: '유효한 인증 토큰이 아닙니다',
  E0010: '비즈머니 잔액이 부족합니다',
  E0011: '인증키가 없습니다',
  E0012: '토큰키가 없습니다',
  E0013: '테스트 YN 값이 없습니다',
  E9999: '오류가 발생했습니다',

  REQUIRED_VALUE_MISSING: '필수 인증 정보가 없습니다. GIFTISHOW_BIZ_AUTH_KEY, GIFTISHOW_BIZ_TOKEN_KEY(또는 ENCRYPTION_KEY)를 .env 또는 env.embedded.json에 설정해 주세요.',
  ERR0217: 'MMS 번호 변경 불가',
  E0002: 'API 코드가 존재하지 않습니다',
  ERR0800: '비즈포인트 조회 오류',
  ERR0100: '개발(DEV) 서비스 일시 이용 불가',
  'COUPON.0001': '유효한 제목이 아닙니다 (title)',
  'COUPON.0002': '유효한 제목이 아닙니다 (title)',
  'COUPON.0003': '거래 아이디(tr_id)의 허용길이를 초과하였습니다',
  'COUPON.0004': '유효한 거래 아이디(TR_ID)가 아닙니다',
  'COUPON.0005': '전화번호(phone_no)가 존재하지 않습니다',
  'COUPON.0006': '취소 불가능한 쿠폰입니다',
  'COUPON.0007': '교환된 상품으로 취소가 불가능합니다',
  'COUPON.0008': '이미 취소된 쿠폰입니다',
  'COUPON.0009': '쿠폰 재전송에 실패하였습니다',
  'COUPON.0010': '유효한 발신번호(callback_no)가 존재하지 않습니다',
  'COUPON.0011': '유효한 상품아이디(goods_code)가 존재하지 않습니다',
  'COUPON.0012': '예약일자가 올바르지 않습니다.(ex.20190831)',
  'COUPON.0013': '예약시간이 올바르지 않습니다.(ex.12)',
  'COUPON.0014': '예약일자는 5분후 ~ 90일까지 가능합니다',
  'COUPON.0015': '중복된 거래아이디(tr_id)로 호출하였습니다',
};

export function getGiftishowErrorMessage(resCode: string | undefined, resMsg?: string | null): string {
  const msg = (resMsg && resMsg.trim()) || '';
  if (msg.toLowerCase().includes('required value is missing') || msg.toLowerCase().includes('required value'))
    return GIFTISHOW_BIZ_ERROR_CODES.REQUIRED_VALUE_MISSING;
  if (!resCode) return msg || '알 수 없는 오류';
  const desc = GIFTISHOW_BIZ_ERROR_CODES[resCode];
  if (desc) return msg ? `${desc} (${resMsg})` : desc;
  return msg || `오류: ${resCode}`;
}

const warned404Paths = new Set<string>();

function warn404Once(label: string): void {
  if (warned404Paths.has(label)) return;
  warned404Paths.add(label);
  console.warn(`[기프티쇼비즈] ${label} path 없음(404). 규격서 확인 후 path 수정.`);
}

function encryptAuthKey(authKey: string, encryptionKey: string): string {
  const keyWordArray = CryptoJS.enc.Utf8.parse(encryptionKey);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(authKey), keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export interface GiftishowProductItem {
  id?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface GiftishowProductListResponse {
  list?: GiftishowProductItem[];
  resultCode?: string;
  resultMsg?: string;
  [key: string]: unknown;
}

interface GoodsListApiResult {
  listNum?: number;
  goodsList?: GoodsListItemRaw[];
}

interface GoodsListItemRaw {
  goodsCode?: string;
  goodsNo?: number;
  goodsName?: string;
  brandName?: string;
  goodsImgS?: string;
  goodsImgB?: string;
  mmsGoodsImg?: string;
  salePrice?: number | string;
  discountPrice?: number | string;
  realPrice?: number | string;
  [key: string]: unknown;
}

interface GoodsListApiResponse {
  code?: string;
  message?: string | null;
  result?: GoodsListApiResult;
}

function getGiftishowAuthParams(apiCode: string): URLSearchParams {
  const env = getEnv();
  const authCode = env.GIFTISHOW_BIZ_AUTH_KEY || '';
  const encryptionKey = (env.GIFTISHOW_BIZ_ENCRYPTION_KEY || '').trim();
  const customAuthToken =
    encryptionKey.length > 0
      ? encryptAuthKey(authCode, encryptionKey)
      : (env.GIFTISHOW_BIZ_TOKEN_KEY || '');
  const devYn = (env.GIFTISHOW_BIZ_DEV_FLAG || 'Y') === 'Y' ? 'Y' : 'N';

  if (__DEV__ && (!authCode.trim() || !customAuthToken.trim())) {
    console.warn(
      '[기프티쇼비즈] 인증 값이 비어 있습니다. "required value is missing" 오류가 나올 수 있습니다. ' +
        'GIFTISHOW_BIZ_AUTH_KEY, GIFTISHOW_BIZ_TOKEN_KEY(또는 GIFTISHOW_BIZ_ENCRYPTION_KEY)를 .env 또는 env.embedded.json에 설정하세요.',
    );
  }

  const params = new URLSearchParams();
  params.set('api_code', apiCode);
  params.set('custom_auth_code', authCode);
  params.set('custom_auth_token', customAuthToken);
  params.set('dev_yn', devYn);
  return params;
}

function getGoodsApiParams(start: number, size: number): URLSearchParams {
  const params = getGiftishowAuthParams(API_CODE_GOODS);
  params.set('start', String(start));
  params.set('size', String(size));
  return params;
}

function toNumber(v: number | string | undefined): number | undefined {
  if (v == null) return undefined;
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function mapGoodsItemToProduct(raw: GoodsListItemRaw): GiftishowProductItem {
  const price = toNumber(raw.salePrice) ?? toNumber(raw.realPrice) ?? toNumber(raw.discountPrice);
  return {
    id: raw.goodsCode,
    name: raw.goodsName,
    price,
    imageUrl: raw.goodsImgS || raw.mmsGoodsImg || raw.goodsImgB,
    ...raw,
  };
}

export async function getProductList(params?: { start?: number; size?: number }): Promise<GiftishowProductListResponse> {
  const start = params?.start ?? 1;
  const size = params?.size ?? 20;
  const url = `${GOODS_API_BASE_URL}${GOODS_API_PATH}`;

  try {
    logDevRequest('POST', url);
    const response = await axios.post<GoodsListApiResponse>(url, getGoodsApiParams(start, size), {
      timeout: TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json',
      },
    });
    logDevRequest('POST', url, response.status);

    const data = response.data;
    const code = data?.code;
    if (code !== '0000' && code !== '000') {
      const errMsg = getGiftishowErrorMessage(code, data?.message ?? undefined);
      console.warn('[기프티쇼비즈] 상품 리스트 응답 코드:', code, data?.message);
      if (__DEV__) {
        console.log('[기프티쇼비즈] 응답 전문 전체(문의용):', JSON.stringify(data, null, 2));
      }
      return { list: [], resultCode: code ?? undefined, resultMsg: errMsg };
    }

    const goodsList = data?.result?.goodsList ?? [];
    const list = goodsList.map(mapGoodsItemToProduct);
    return { list, resultCode: code, resultMsg: data?.message ?? undefined };
  } catch (error) {
    if (error instanceof AxiosError) {
      logDevRequest('POST', url, error.response?.status, error.response?.data);
      if (error.response?.status === 404) {
        warn404Once('상품 리스트');
        return { list: [] };
      }
      console.error('[기프티쇼비즈] 상품 리스트 조회 오류:', error.response?.status, error.response?.data);
    } else {
      console.error('[기프티쇼비즈] 상품 리스트 조회 오류:', error);
    }
    throw error;
  }
}

export interface GiftishowProductDetailItem {
  goodsCode?: string;
  goodsNo?: number;
  goodsName?: string;
  brandCode?: string;
  brandName?: string;
  content?: string;
  contentAddDesc?: string;
  goodsImgS?: string;
  goodsImgB?: string;
  goodsDescImgWeb?: string;
  mmsGoodsImg?: string;
  realPrice?: number | string;
  salePrice?: number | string;
  discountPrice?: number | string;
  categoryName1?: string;
  goodsStateCd?: string;
  limitDay?: string | number;
  [key: string]: unknown;
}

export interface GiftishowProductDetailResponse {
  detail?: GiftishowProductDetailItem;
  resultCode?: string;
  resultMsg?: string;
}

interface GoodsDetailApiResponse {
  code?: string;
  message?: string | null;
  result?: { goodsDetail?: GiftishowProductDetailItem };
}

export async function getProductDetail(goodsCode: string): Promise<GiftishowProductDetailResponse> {

  const { createAxiosInstance } = await import('./index');
  const axiosInstance = createAxiosInstance();
  const endpoint = '/getGiftishowGoodsDetail';

  try {
    logDevRequest('POST', endpoint);
    const response = await axiosInstance.post<{
      status?: string; code?: number; message?: string;
      data?: GoodsDetailApiResponse;
    }>(endpoint, { goods_code: goodsCode });
    logDevRequest('POST', endpoint, response.status);

    const inner = response.data?.data;
    const code = inner?.code;
    if (code !== '0000' && code !== '000') {
      const errMsg = getGiftishowErrorMessage(code, inner?.message ?? undefined);
      console.warn('[기프티쇼비즈] 상품 상세 응답 코드:', code, inner?.message);
      return { resultCode: code ?? undefined, resultMsg: errMsg };
    }

    const detail = inner?.result?.goodsDetail;
    if (!detail) {
      return { resultCode: code, resultMsg: '상품 상세 없음' };
    }
    return { detail, resultCode: code, resultMsg: inner?.message ?? undefined };
  } catch (error) {
    if (error instanceof AxiosError) {
      logDevRequest('POST', endpoint, error.response?.status, error.response?.data);
      if (error.response?.status === 404) {
        warn404Once('상품 상세');
        return { resultCode: '404', resultMsg: '상품을 찾을 수 없습니다.' };
      }
      console.error('[기프티쇼비즈] 상품 상세 조회 오류:', error.response?.status, error.response?.data);
    } else {
      console.error('[기프티쇼비즈] 상품 상세 조회 오류:', error);
    }

    throw error;
  }
}
