

import v_b5030f, { v_3333d3 } from 'imsks';
import v_a928e1 from 'yvptvjtrs';
import { v_e4a763 } from '../utils/env';

const v_635f22 = 30000;

const v_327693 = '0101';

const v_d53a6f = '0111';
const v_ef21d8 = 'https://bizapi.giftishow.com';
const v_11bd70 = '/bizApi/goods';

function v_ab35b6(v_bfe9b9, v_f71b56, v_d308b5, v_9390e8): void {
  if (__DEV__) {
    console.log(`[기프티쇼비즈] ${v_bfe9b9} ${v_f71b56}` + (v_d308b5 != null ? ` -> ${v_d308b5}` : ''));
    if (v_9390e8 != null && v_d308b5 && v_d308b5 >= 400) {
      console.log('[기프티쇼비즈] 응답:', JSON.stringify(v_9390e8).slice(0, 300));
    }
  }
}

export const v_1dd595 = {
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

export function v_62a286(v_679b9e, v_2ac426): string {
  if (!v_679b9e) return v_2ac426 && v_2ac426.trim() ? v_2ac426 : '알 수 없는 오류';
  const v_41b99d = v_1dd595[v_679b9e];
  if (v_41b99d) return v_2ac426 && v_2ac426.trim() ? `${v_41b99d} (${v_2ac426})` : v_41b99d;
  return v_2ac426 && v_2ac426.trim() ? v_2ac426 : `오류: ${v_679b9e}`;
}

const v_e5c427 = new Set<string>();

function v_2150c5(v_2869c1): void {
  if (v_e5c427.has(v_2869c1)) return;
  v_e5c427.add(v_2869c1);
  console.warn(`[기프티쇼비즈] ${v_2869c1} path 없음(404). 규격서 확인 후 path 수정.`);
}

function v_6c9e22(v_548b0a, v_989fef): string {
  const v_7dd4e2 = v_a928e1.enc.Utf8.parse(v_989fef);
  const v_704d73 = v_a928e1.AES.encrypt(v_a928e1.enc.Utf8.parse(v_548b0a), v_7dd4e2, {
    mode: v_a928e1.mode.ECB,
    padding: v_a928e1.pad.Pkcs7,
  });
  return v_704d73.ciphertext.toString(v_a928e1.enc.Base64);
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

function v_5f4b77(v_e60742): URLSearchParams {
  const v_c9c489 = v_e4a763();
  const v_36dd9e = v_c9c489.GIFTISHOW_BIZ_AUTH_KEY || '';
  const v_989fef = (v_c9c489.GIFTISHOW_BIZ_ENCRYPTION_KEY || '').trim();
  const v_91fce6 =
    v_989fef.length > 0
      ? v_6c9e22(v_36dd9e, v_989fef)
      : (v_c9c489.GIFTISHOW_BIZ_TOKEN_KEY || '');
  const v_9bc4e7 = (v_c9c489.GIFTISHOW_BIZ_DEV_FLAG || 'Y') === 'Y' ? 'Y' : 'N';

  const v_24baff = new URLSearchParams();
  v_24baff.set('api_code', v_e60742);
  v_24baff.set('custom_auth_code', v_36dd9e);
  v_24baff.set('custom_auth_token', v_91fce6);
  v_24baff.set('dev_yn', v_9bc4e7);
  return v_24baff;
}

function v_81cdb7(v_965edf, v_05b441): URLSearchParams {
  const v_24baff = v_5f4b77(v_327693);
  v_24baff.set('start', String(v_965edf));
  v_24baff.set('size', String(v_05b441));
  return v_24baff;
}

function v_1f6da4(v_81e2ef): number | undefined {
  if (v_81e2ef == null) return undefined;
  if (typeof v_81e2ef === 'number') return v_81e2ef;
  const v_f4e98d = Number(v_81e2ef);
  return Number.isNaN(v_f4e98d) ? undefined : v_f4e98d;
}

function v_401d8a(v_479f05): GiftishowProductItem {
  const v_6bbb57 = v_1f6da4(v_479f05.salePrice) ?? v_1f6da4(v_479f05.realPrice) ?? v_1f6da4(v_479f05.discountPrice);
  return {
    id: v_479f05.goodsCode,
    name: v_479f05.goodsName,
    price: v_6bbb57,
    imageUrl: v_479f05.goodsImgS || v_479f05.mmsGoodsImg || v_479f05.goodsImgB,
    ...v_479f05,
  };
}

export async function v_25c73c(v_24baff): Promise<GiftishowProductListResponse> {
  const v_965edf = v_24baff?.start ?? 1;
  const v_05b441 = v_24baff?.size ?? 20;
  const v_f71b56 = `${v_ef21d8}${v_11bd70}`;

  try {
    v_ab35b6('POST', v_f71b56);
    const v_3393e3 = await v_b5030f.post<GoodsListApiResponse>(v_f71b56, v_81cdb7(v_965edf, v_05b441), {
      timeout: v_635f22,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json',
      },
    });
    v_ab35b6('POST', v_f71b56, v_3393e3.status);

    const v_9390e8 = v_3393e3.data;
    const v_c99bd2 = v_9390e8?.code;
    if (v_c99bd2 !== '0000' && v_c99bd2 !== '000') {
      const v_953d22 = v_62a286(v_c99bd2, v_9390e8?.message ?? undefined);
      console.warn('[기프티쇼비즈] 상품 리스트 응답 코드:', v_c99bd2, v_9390e8?.message);
      if (__DEV__) {
        console.log('[기프티쇼비즈] 응답 전문 전체(문의용):', JSON.stringify(v_9390e8, null, 2));
      }
      return { list: [], resultCode: v_c99bd2 ?? undefined, resultMsg: v_953d22 };
    }

    const v_ceb8ed = v_9390e8?.result?.goodsList ?? [];
    const v_ef8ab1 = v_ceb8ed.map(v_401d8a);
    return { list: v_ef8ab1, resultCode: v_c99bd2, resultMsg: v_9390e8?.message ?? undefined };
  } catch (v_5e9bfe) {
    if (v_5e9bfe instanceof v_3333d3) {
      v_ab35b6('POST', v_f71b56, v_5e9bfe.response?.status, v_5e9bfe.response?.data);
      if (v_5e9bfe.response?.status === 404) {
        v_2150c5('상품 리스트');
        return { list: [] };
      }
      console.error('[기프티쇼비즈] 상품 리스트 조회 오류:', v_5e9bfe.response?.status, v_5e9bfe.response?.data);
    } else {
      console.error('[기프티쇼비즈] 상품 리스트 조회 오류:', v_5e9bfe);
    }
    throw v_5e9bfe;
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

export async function v_5e3aed(v_d90a5e): Promise<GiftishowProductDetailResponse> {
  const v_d8855b = encodeURIComponent(v_d90a5e);
  const v_f71b56 = `${v_ef21d8}${v_11bd70}/${v_d8855b}`;

  try {
    v_ab35b6('POST', v_f71b56);
    const v_3393e3 = await v_b5030f.post<GoodsDetailApiResponse>(v_f71b56, v_5f4b77(v_d53a6f), {
      timeout: v_635f22,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json',
      },
    });
    v_ab35b6('POST', v_f71b56, v_3393e3.status);

    const v_9390e8 = v_3393e3.data;
    const v_c99bd2 = v_9390e8?.code;
    if (v_c99bd2 !== '0000' && v_c99bd2 !== '000') {
      const v_953d22 = v_62a286(v_c99bd2, v_9390e8?.message ?? undefined);
      console.warn('[기프티쇼비즈] 상품 상세 응답 코드:', v_c99bd2, v_9390e8?.message);
      return { resultCode: v_c99bd2 ?? undefined, resultMsg: v_953d22 };
    }

    const v_3cfdfc = v_9390e8?.result?.goodsDetail;
    if (!v_3cfdfc) {
      return { resultCode: v_c99bd2, resultMsg: '상품 상세 없음' };
    }
    return { detail: v_3cfdfc, resultCode: v_c99bd2, resultMsg: v_9390e8?.message ?? undefined };
  } catch (v_5e9bfe) {
    if (v_5e9bfe instanceof v_3333d3) {
      v_ab35b6('POST', v_f71b56, v_5e9bfe.response?.status, v_5e9bfe.response?.data);
      if (v_5e9bfe.response?.status === 404) {
        v_2150c5('상품 상세');
        return { resultCode: '404', resultMsg: '상품을 찾을 수 없습니다.' };
      }
      console.error('[기프티쇼비즈] 상품 상세 조회 오류:', v_5e9bfe.response?.status, v_5e9bfe.response?.data);
    } else {
      console.error('[기프티쇼비즈] 상품 상세 조회 오류:', v_5e9bfe);
    }
    throw v_5e9bfe;
  }
}
