export const TOTAL_PAGES = 3;

export const isLastPage = (currentPage: number): boolean =>
  currentPage >= TOTAL_PAGES - 1;

export const canFinish = (currentPage: number, agreed: boolean): boolean =>
  isLastPage(currentPage) && agreed;

export const shouldShowTutorial = (
  pendingFlag: string | null,
  completedFlag: string | null,
): boolean => pendingFlag === 'true' && completedFlag !== 'true';

export const TUTORIAL_PENDING_KEY = 'tutorialPending';
export const TUTORIAL_COMPLETED_KEY = 'walletKeyTutorialCompleted';
