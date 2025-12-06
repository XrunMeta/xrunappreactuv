import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER } from '../constants';

export const useHeaderDimensions = () => {
  const insets = useSafeAreaInsets();

  const topPadding = insets.top; 
  const headerHeight = topPadding + HEADER.contentHeight; 

  return {
    topPadding,
    headerHeight,
  };
};

