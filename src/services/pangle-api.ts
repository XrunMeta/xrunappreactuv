

import { getEnvValue } from '../utils/env';
import CryptoJS from 'crypto-js';

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

function generateSign(params: Record<string, string | number>, securityKey: string): string {

  const sortedKeys = Object.keys(params).sort();

  const queryString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const signString = `${queryString}${securityKey}`;

  const hash = CryptoJS.MD5(signString).toString();

  return hash;
}

export async function getPangleReport(
  params: PangleReportParams
): Promise<PangleReportResponse> {
  const user_id = getEnvValue('PANGLE_API_USER_ID');
  const role_id = getEnvValue('PANGLE_API_ROLE_ID');
  const security_key = getEnvValue('PANGLE_API_SECURITY_KEY');

  if (!user_id || !role_id || !security_key) {
    throw new Error('Pangle API 인증 정보가 설정되지 않았습니다. PANGLE_API_USER_ID, PANGLE_API_ROLE_ID, PANGLE_API_SECURITY_KEY를 확인하세요.');
  }

  const requestParams: Record<string, string | number> = {
    user_id: parseInt(user_id, 10),
    role_id: parseInt(role_id, 10),
    version: '2.0',
    date: params.date,
    time_zone: params.time_zone ?? 8,
    currency: params.currency ?? 'cny',
    sign_type: 'MD5',
    timestamp: Math.floor(Date.now() / 1000), 
  };

  if (params.region) {
    requestParams.region = params.region;
  }

  if (params.dimensions) {
    requestParams.dimensions = params.dimensions;
  }

  const sign = generateSign(requestParams, security_key);
  requestParams.sign = sign;

  const queryString = Object.keys(requestParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestParams[key])}`)
    .join('&');

  const apiUrl = `https://open-api.pangleglobal.com/union_pangle/open/api/rt/income?${queryString}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Pangle API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: PangleReportResponse = await response.json();

    if (data.Code !== '100' && data.Code !== 'PD0004') {
      throw new Error(`Pangle API 오류: ${data.Code} - ${data.Message}`);
    }

    return data;
  } catch (error) {
    console.error('[Pangle API] 리포트 가져오기 실패:', error);
    throw error;
  }
}

export async function getTodayReport(
  timeZone: 0 | 8 = 8,
  currency: 'usd' | 'cny' = 'cny'
): Promise<PangleReportResponse> {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return getPangleReport({
    date: dateString,
    time_zone: timeZone,
    currency,
  });
}

export async function getDateRangeReport(
  startDate: string,
  endDate: string,
  timeZone: 0 | 8 = 8,
  currency: 'usd' | 'cny' = 'cny'
): Promise<PangleReportResponse[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const reports: PangleReportResponse[] = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      const report = await getPangleReport({
        date: dateString,
        time_zone: timeZone,
        currency,
      });
      reports.push(report);
    } catch (error) {
      console.error(`[Pangle API] ${dateString} 리포트 가져오기 실패:`, error);
    }
  }

  return reports;
}

