

export type BackAction =

  | 'goBack'

  | 'resetMap'

  | 'block'

  | 'rootExit';

export interface BackActionInput {
  screen: string | undefined;
  canGoBack: boolean;
  source: 'header' | 'hardware';
}

const v_460d6a = (v_53746a): boolean =>
  v_53746a.startsWith('wallet') ||
  v_53746a.startsWith('myInfo') ||
  v_53746a.startsWith('referral') ||
  v_53746a === 'polygonHistory' ||
  v_53746a === 'xrunHistory' ||
  v_53746a === 'xrunHistory2' ||
  v_53746a === 'nftHistory' ||
  v_53746a === 'adHistory';

export function v_be6b97({ screen: v_53746a, canGoBack: v_7e32fb, source: v_04e790 }: BackActionInput): BackAction {
  const v_275ccd = v_53746a ?? '';

  if (v_04e790 === 'hardware' && v_275ccd === 'walletKeyTutorial') {
    return 'block';
  }

  if (v_460d6a(v_275ccd)) {
    return v_7e32fb ? 'goBack' : 'resetMap';
  }

  if (v_275ccd.startsWith('shop')) {
    return 'resetMap';
  }

  if (v_04e790 === 'header') {
    return 'resetMap';
  }

  return v_7e32fb ? 'goBack' : 'rootExit';
}
