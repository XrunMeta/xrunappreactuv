

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

const isStackBackScreen = (screen: string): boolean =>
  screen.startsWith('wallet') ||
  screen.startsWith('myInfo') ||
  screen.startsWith('referral') ||
  screen === 'polygonHistory' ||
  screen === 'xrunHistory' ||
  screen === 'xrunHistory2' ||
  screen === 'nftHistory' ||
  screen === 'adHistory';

export function resolveBackAction({ screen, canGoBack, source }: BackActionInput): BackAction {
  const current = screen ?? '';

  if (source === 'hardware' && current === 'walletKeyTutorial') {
    return 'block';
  }

  if (isStackBackScreen(current)) {
    return canGoBack ? 'goBack' : 'resetMap';
  }

  if (current.startsWith('shop')) {
    return 'resetMap';
  }

  if (source === 'header') {
    return 'resetMap';
  }

  return canGoBack ? 'goBack' : 'rootExit';
}
