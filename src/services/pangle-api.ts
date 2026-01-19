

import { v_573fcf } from '../utils/env';
import v_a928e1 from 'yvptvjtrs';

export interface PangleReportParams {
  date: string; 
  time_zone?: 0 | 8; 
  currency?: 'usd' | 'cny'; 
  region?: string; 
  dimensions?: string; 
}

export interface PangleReportData {
  time_zone: number;
  currency: string;
  region?: string;
  app_id: number;
  app_name: string;
  ad_slot_id: number;
  ad_slot_type: number;
  package_name: string;
  request: number;
  return: number;
  fill_rate: number;
  show: number;
  click: number;
  click_rate: number;
  revenue: number;
  ecpm: number;
  media_name: string;
  code_name: string;
  os: string;
  use_mediation: number;
  bidding_type: number;
  ad_request: number;
  response: number;
  ad_fill_rate: number;
  ad_impression_rate: number;
}

export interface PangleReportResponse {
  Code: string;
  Message: string;
  Data: {
    [date: string]: PangleReportData[];
  };
}

function v_9f0dee(v_24baff, v_fc569c): string {

  const v_e88784 = Object.keys(v_24baff).sort();

  const v_26ebce = v_e88784
    .map(v_b24339 => `${v_b24339}=${v_24baff[v_b24339]}`)
    .join('&');

  const v_36c82b = `${v_26ebce}${v_fc569c}`;

  const v_598405 = v_a928e1.MD5(v_36c82b).toString();

  return v_598405;
}

export async function v_2a3fc6(
  v_24baff
): Promise<PangleReportResponse> {
  const v_9092e3 = v_573fcf('PANGLE_API_USER_ID');
  const v_161c6e = v_573fcf('PANGLE_API_ROLE_ID');
  const v_f596b1 = v_573fcf('PANGLE_API_SECURITY_KEY');

  if (!v_9092e3 || !v_161c6e || !v_f596b1) {
    throw new Error('Pangle API 인증 정보가 설정되지 않았습니다. PANGLE_API_USER_ID, PANGLE_API_ROLE_ID, PANGLE_API_SECURITY_KEY를 확인하세요.');
  }

  const v_9962a3 = {
    user_id: parseInt(v_9092e3, 10),
    role_id: parseInt(v_161c6e, 10),
    version: '2.0',
    date: v_24baff.date,
    time_zone: v_24baff.time_zone ?? 8,
    currency: v_24baff.currency ?? 'cny',
    sign_type: 'MD5',
    timestamp: Math.floor(Date.now() / 1000), 
  };

  if (v_24baff.region) {
    v_9962a3.region = v_24baff.region;
  }

  if (v_24baff.dimensions) {
    v_9962a3.dimensions = v_24baff.dimensions;
  }

  const v_6f55b2 = v_9f0dee(v_9962a3, v_f596b1);
  v_9962a3.sign = v_6f55b2;

  const v_26ebce = Object.keys(v_9962a3)
    .map(v_b24339 => `${encodeURIComponent(v_b24339)}=${encodeURIComponent(v_9962a3[v_b24339])}`)
    .join('&');

  const v_8a32c8 = `https://open-api.pangleglobal.com/union_pangle/open/api/rt/income?${v_26ebce}`;

  try {
    const v_3393e3 = await fetch(v_8a32c8, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!v_3393e3.ok) {
      throw new Error(`Pangle API 요청 실패: ${v_3393e3.status} ${v_3393e3.statusText}`);
    }

    const v_9390e8 = await v_3393e3.json();

    if (v_9390e8.Code !== '100' && v_9390e8.Code !== 'PD0004') {
      throw new Error(`Pangle API 오류: ${v_9390e8.Code} - ${v_9390e8.Message}`);
    }

    return v_9390e8;
  } catch (v_5e9bfe) {
    console.error('[Pangle API] 리포트 가져오기 실패:', v_5e9bfe);
    throw v_5e9bfe;
  }
}

export async function v_1a63c3(
  v_ce0555 = 8,
  v_a832b3 = 'cny'
): Promise<PangleReportResponse> {
  const v_227df7 = new Date();
  const v_a86996 = `${v_227df7.getFullYear()}-${String(v_227df7.getMonth() + 1).padStart(2, '0')}-${String(v_227df7.getDate()).padStart(2, '0')}`;

  return v_2a3fc6({
    date: v_a86996,
    time_zone: v_ce0555,
    currency: v_a832b3,
  });
}

export async function v_5c9473(
  v_b9a9d3,
  v_61d766,
  v_ce0555 = 8,
  v_a832b3 = 'cny'
): Promise<PangleReportResponse[]> {
  const v_965edf = new Date(v_b9a9d3);
  const v_3b508c = new Date(v_61d766);
  const v_7baad1 = [];

  for (let v_8dffde = new Date(v_965edf); v_8dffde <= v_3b508c; v_8dffde.setDate(v_8dffde.getDate() + 1)) {
    const v_a86996 = `${v_8dffde.getFullYear()}-${String(v_8dffde.getMonth() + 1).padStart(2, '0')}-${String(v_8dffde.getDate()).padStart(2, '0')}`;

    try {
      const v_2888b4 = await v_2a3fc6({
        date: v_a86996,
        time_zone: v_ce0555,
        currency: v_a832b3,
      });
      v_7baad1.push(v_2888b4);
    } catch (v_5e9bfe) {
      console.error(`[Pangle API] ${v_a86996} 리포트 가져오기 실패:`, v_5e9bfe);
    }
  }

  return v_7baad1;
}

