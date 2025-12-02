import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Modal, Platform, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants';
import {
  getTaboolaPlacement,
  getTaboolaPublisherId,
  getTaboolaPageUrl,
  TABOOLA_PLACEMENTS,
} from '../services/taboola';
import { TaboolaNativeView, isTaboolaNativeViewAvailable } from './TaboolaNativeView';

interface TaboolaVignetteProps {

  placementType: 'apploading';

  visible: boolean;

  onClose?: () => void;

  pageUrl?: string;
}

export const TaboolaVignette: React.FC<TaboolaVignetteProps> = ({
  placementType,
  visible,
  onClose,
  pageUrl,
}) => {

  const placement = getTaboolaPlacement(placementType, true);
  const config = TABOOLA_PLACEMENTS[placement];
  const finalPageUrl = pageUrl || getTaboolaPageUrl();

  if (!visible) {
    return null;
  }

  if (!config) {
    console.error('[TaboolaVignette] config가 없습니다:', placement);
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {isTaboolaNativeViewAvailable() ? (
          <>
            <TaboolaNativeView
              publisherId={getTaboolaPublisherId()}
              placement={config.placement}
              mode={config.mode}
              pageUrl={finalPageUrl}
              pageType={config.pageType}
              targetType={config.targetType}
              style={styles.webView}
            />
            {onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.placeholderText}>Taboola 전면광고</Text>
            {onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webView: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  placeholderText: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    opacity: 0.5,
    marginTop: SIZES.medium,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    zIndex: 1000,
  },
  closeButtonText: {
    fontSize: SIZES.medium,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
