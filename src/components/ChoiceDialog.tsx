import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Dialog } from './Dialog';
import { useAppNavigation, ROUTES } from '../navigation';
import { FONTS } from '../constants';

export interface ChoiceDialogStep {
  title: string;
  message?: string;
  children?: React.ReactNode;
  button1Label: string;
  button1Action: (
    goToNextStep: () => void,
    goToPrevStep: () => void,
    closeDialog: () => void,
  ) => void | Promise<void> | string;
  button2Label: string;
  button2Action: (
    goToNextStep: () => void,
    goToPrevStep: () => void,
    closeDialog: () => void,
  ) => void | Promise<void> | string;
}

interface ChoiceDialogConfig {
  title: string;
  message?: string;
  children?: React.ReactNode;
  button1Label: string;
  button1Action?: () => void | Promise<void> | string;
  button2Label: string;
  button2Action?: () => void | Promise<void> | string;
}

interface ChoiceDialogProps {
  visible: boolean;

  title?: string;
  message?: string;
  children?: React.ReactNode;
  button1Label?: string;
  button1Action?: () => void | Promise<void> | string;
  button2Label?: string;
  button2Action?: () => void | Promise<void> | string;

  steps?: ChoiceDialogStep[];
  initialStep?: number; 
  onClose?: () => void;
  fullScreen?: boolean; 
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: ViewStyle; 
}

export interface ChoiceDialogRef {
  open: (config: ChoiceDialogConfig) => Promise<'button1' | 'button2'>;
}

export const ChoiceDialog = forwardRef<ChoiceDialogRef, ChoiceDialogProps>(
  (
    {
      visible,
      title,
      message,
      children,
      button1Label,
      button1Action,
      button2Label,
      button2Action,
      steps,
      initialStep = 0,
      onClose,
      fullScreen = false,
      containerStyle,
      contentContainerStyle,
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [promiseResolve, setPromiseResolve] = useState<
      ((value: 'button1' | 'button2') => void) | null
    >(null);
    const [promiseConfig, setPromiseConfig] = useState<ChoiceDialogConfig | null>(null);
    const [isPromiseMode, setIsPromiseMode] = useState(false);
    const navigation = useAppNavigation();

    useEffect(() => {
      if (!visible) {
        setCurrentStep(initialStep);

        if (promiseResolve && isPromiseMode && promiseConfig) {

          console.log('[ChoiceDialog] visible이 false로 변경 - Promise resolve (button1 기본값)');
          promiseResolve('button1'); 
          setPromiseResolve(null);
        }
        setIsPromiseMode(false);
        setPromiseConfig(null);
      }
    }, [visible, initialStep]);

    useImperativeHandle(ref, () => ({
      open: (config: ChoiceDialogConfig): Promise<'button1' | 'button2'> => {
        console.log('[ChoiceDialog] open 메서드 호출:', config);
        return new Promise((resolve) => {
          console.log('[ChoiceDialog] Promise 생성, config 설정');
          setPromiseConfig(config);
          setIsPromiseMode(true);
          setPromiseResolve(() => {
            console.log('[ChoiceDialog] Promise resolve 함수 호출');
            return resolve;
          });
          setCurrentStep(0);
        });
      },
    }));

    const goToNextStep = () => {
      if (steps) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {

          handleClose();
        }
      }
    };

    const goToPrevStep = () => {
      if (steps && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleClose = () => {
      if (promiseResolve) {
        promiseResolve('button1'); 
        setPromiseResolve(null);
      }
      setIsPromiseMode(false);
      setPromiseConfig(null);
      onClose?.();
    };

    const handleAction = async (
      action: (() => void | Promise<void> | string) | undefined,
      buttonType: 'button1' | 'button2',
    ) => {
      console.log('[ChoiceDialog] handleAction 호출:', buttonType, 'isPromiseMode:', isPromiseMode);
      if (!action) {
        console.log('[ChoiceDialog] action이 없음');
        return;
      }

      try {
        console.log('[ChoiceDialog] action 실행 시작');
        const result = await action();
        console.log('[ChoiceDialog] action 실행 완료:', result);
        if (typeof result === 'string') {

          if (result in ROUTES) {
            navigation.navigate(result as keyof typeof ROUTES);
          }
        }
      } catch (error) {
        console.error('ChoiceDialog action error:', error);
      }

      if (isPromiseMode && promiseResolve) {
        console.log('[ChoiceDialog] Promise resolve 호출:', buttonType);
        promiseResolve(buttonType);
        setPromiseResolve(null);
        setIsPromiseMode(false);
        setPromiseConfig(null);
      } else {
        console.log('[ChoiceDialog] Promise resolve하지 않음:', { isPromiseMode, hasResolve: !!promiseResolve });
      }
    };

    const getCurrentConfig = () => {
      if (isPromiseMode && promiseConfig) {
        return {
          title: promiseConfig.title,
          message: promiseConfig.message,
          children: promiseConfig.children,
          button1Label: promiseConfig.button1Label,
          button1Action: promiseConfig.button1Action,
          button2Label: promiseConfig.button2Label,
          button2Action: promiseConfig.button2Action,
        };
      }

      if (steps && steps.length > 0) {
        const step = steps[currentStep];
        return {
          title: step.title,
          message: step.message,
          children: step.children,
          button1Label: step.button1Label,
          button1Action: () => step.button1Action(goToNextStep, goToPrevStep, handleClose),
          button2Label: step.button2Label,
          button2Action: () => step.button2Action(goToNextStep, goToPrevStep, handleClose),
        };
      }

      return {
        title: title || '',
        message,
        children,
        button1Label: button1Label || '',
        button1Action,
        button2Label: button2Label || '',
        button2Action,
      };
    };

    const config = getCurrentConfig();

    const actions = [
      {
        label: config.button1Label,
        onPress: async () => {
          await handleAction(config.button1Action, 'button1');
          if (!isPromiseMode && !steps) {
            handleClose();
          }
        },
        variant: 'secondary' as const,
      },
      {
        label: config.button2Label,
        onPress: async () => {
          await handleAction(config.button2Action, 'button2');
          if (!isPromiseMode && !steps) {
            handleClose();
          }
        },
        variant: 'primary' as const,
      },
    ];

    const renderBody = () => {
      const hasMessage = config.message;
      const hasChildren = config.children;

      if (!hasMessage && !hasChildren) {
        return null;
      }

      return (
        <View style={[styles.body, contentContainerStyle]}>
          {hasMessage && <Text style={styles.message}>{config.message}</Text>}
          {hasChildren && (
            <View style={styles.childrenContainer}>{config.children}</View>
          )}
        </View>
      );
    };

    return (
      <Dialog
        visible={visible}
        title={config.title}
        onClose={handleClose}
        actions={actions}
        containerStyle={[
          containerStyle,
          fullScreen ? styles.fullScreenContainer : undefined,
        ]}
      >
        {renderBody()}
      </Dialog>
    );
  },
);

ChoiceDialog.displayName = 'ChoiceDialog';

const styles = StyleSheet.create({
  body: {
    paddingVertical: 4,
  },
  message: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
    lineHeight: 24,
    marginBottom: 16,
  },
  childrenContainer: {
    width: '100%',
  },
  fullScreenContainer: {
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
});

