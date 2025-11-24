
import { AliveResponse } from '../types';

export const sendAliveSignal = async (): Promise<AliveResponse> => {

  return Promise.resolve({
    success: true,
    emergencyStop: {
      enabled: true, 
      message: '긴급 안내: 시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
      link: 'https://example.com/emergency-notice', 
    },
  });

};

