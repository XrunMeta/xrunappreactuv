import React from 'react';
import { requireNativeComponent, ViewStyle, Platform } from 'react-native';

interface TaboolaNativeViewProps {

  publisherId?: string;

  placement: string;

  mode: string;

  pageUrl?: string;

  pageType?: string;

  targetType?: string;

  style?: ViewStyle;
}

let TaboolaNativeViewNative: React.ComponentType<TaboolaNativeViewProps> | null = null;

try {
  const { UIManager } = require('react-native');

  if (UIManager && UIManager.getViewManagerConfig) {
    const viewConfig = UIManager.getViewManagerConfig('TaboolaView');
    if (viewConfig) {
      TaboolaNativeViewNative = requireNativeComponent<TaboolaNativeViewProps>('TaboolaView');
    }
  }
} catch (error) {

}

export const TaboolaNativeView: React.FC<TaboolaNativeViewProps> = ({
  publisherId,
  placement,
  mode,
  pageUrl,
  pageType = 'article',
  targetType = 'mix',
  style,
}) => {

  if (!TaboolaNativeViewNative) {
    return null;
  }

  return (
    <TaboolaNativeViewNative
      publisherId={publisherId}
      placement={placement}
      mode={mode}
      pageUrl={pageUrl}
      pageType={pageType}
      targetType={targetType}
      style={style}
    />
  );
};

export const isTaboolaNativeViewAvailable = (): boolean => {
  return TaboolaNativeViewNative !== null;
};
