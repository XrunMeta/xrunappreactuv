

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

  REQUIRED_VALUE_MISSING: '서버에 기프티쇼 인증 정보가 설정되어 있지 않습니다. 잠시 후 다시 시도해 주세요.',
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
  const v_badeaf = (v_2ac426 && v_2ac426.trim()) || '';
  if (v_badeaf.toLowerCase().includes('required value is missing') || v_badeaf.toLowerCase().includes('required value'))
    return v_1dd595.REQUIRED_VALUE_MISSING;
  if (!v_679b9e) return v_badeaf || '알 수 없는 오류';
  const v_41b99d = v_1dd595[v_679b9e];
  if (v_41b99d) return v_badeaf ? `${v_41b99d} (${v_2ac426})` : v_41b99d;
  return v_badeaf || `오류: ${v_679b9e}`;
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
  try {

    const { createAxiosInstance: v_7488d5 } = await import('./index');
    const v_9f42a4 = v_7488d5();
    const v_3393e3 = await v_9f42a4.post('/getGiftishowGoodsDetail', { goods_code: v_d90a5e });

    const v_97aebb = v_3393e3.data as { status?: string; code?: number; message?: string; data?: GoodsDetailApiResponse } | undefined;
    if (v_97aebb?.status !== 'success') {
      const v_badeaf = v_97aebb?.message || '상품 상세를 불러오지 못했습니다.';
      console.warn('[기프티쇼] 상품 상세 게이트웨이 응답:', v_97aebb?.code, v_badeaf);
      return { resultCode: v_97aebb?.code != null ? String(v_97aebb.code) : undefined, resultMsg: v_badeaf };
    }

    const v_9390e8 = v_97aebb.data;
    const v_c99bd2 = v_9390e8?.code;
    if (v_c99bd2 !== '0000' && v_c99bd2 !== '000') {
      const v_953d22 = v_62a286(v_c99bd2, v_9390e8?.message ?? undefined);
      console.warn('[기프티쇼] 상품 상세 응답 코드:', v_c99bd2, v_9390e8?.message);
      return { resultCode: v_c99bd2 ?? undefined, resultMsg: v_953d22 };
    }

    const v_3cfdfc = v_9390e8?.result?.goodsDetail;
    if (!v_3cfdfc) {
      return { resultCode: v_c99bd2, resultMsg: '상품 상세 없음' };
    }
    return { detail: v_3cfdfc, resultCode: v_c99bd2, resultMsg: v_9390e8?.message ?? undefined };
  } catch (v_5e9bfe) {
    console.error('[기프티쇼] 상품 상세 조회 오류:', v_5e9bfe);
    return { resultMsg: '상품 상세를 불러오지 못했습니다.' };
  }
}
