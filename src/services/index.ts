
import { AliveResponse } from '../types';

export const sendAliveSignal = async (): Promise<AliveResponse> => {

  return Promise.resolve({
    success: true,
    emergencyStop: {
      enabled: false, 
      message: undefined,
      link: undefined,
    },
  });

};

