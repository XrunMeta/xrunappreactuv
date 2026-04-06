

import { Platform } from 'react-native';

export const MYCHIPS_CONTENT_ID = Platform.OS === 'ios'
  ? 'fe775420-0581-4fe7-b732-85d4ef03c367'
  : '93a7b6fa-d336-41d9-a653-cd657802faf2';

export const getMyChipsOfferwallUrl = (
  userId: string = '',
  gender: string = '',
  age: string = '',
): string => {
  return `https://sdk.mychips.io/content?content_id=${MYCHIPS_CONTENT_ID}&user_id=${userId}&gender=${gender}&age=${age}`;
};
