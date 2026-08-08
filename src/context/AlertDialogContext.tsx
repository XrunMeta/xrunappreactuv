import React, { createContext, useContext, useRef, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChoiceDialog, ChoiceDialogRef } from '../components/ChoiceDialog';
import { Dialog } from '../components/Dialog';
import { Text, View, StyleSheet } from 'react-native';
import { FONTS } from '../constants';

interface AlertDialogContextValue {
  showAlert: (
    title: string,
    message?: string,
    buttons?: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>,

    options?: { hideCloseButton?: boolean },
  ) => Promise<number | undefined>; 
}

const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(undefined);

let _globalShowAlert: AlertDialogContextValue['showAlert'] | null = null;
export function getGlobalShowAlert() { return _globalShowAlert; }

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const choiceDialogRef = useRef<ChoiceDialogRef>(null);
  const [simpleDialogVisible, setSimpleDialogVisible] = useState(false);
  const [choiceDialogVisible, setChoiceDialogVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<{
    title: string;
    message?: string;
    buttons?: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>;
    hideCloseButton?: boolean;
    resolve?: () => void;
  } | null>(null);

  const showAlert = async (
    title: string,
    message?: string,
    buttons?: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>,
    options?: { hideCloseButton?: boolean },
  ): Promise<number | undefined> => {
    return new Promise((resolve) => {

      if (!buttons || buttons.length === 0 || buttons.length === 1) {
        const buttonLabel = buttons?.[0]?.text || t('common.buttons.confirm');
        const buttonAction = buttons?.[0]?.onPress;

        setCurrentConfig({
          title,
          message,
          buttons,
          hideCloseButton: options?.hideCloseButton,
          resolve: () => {
            buttonAction?.();
            resolve(0); 
          },
        });
        setSimpleDialogVisible(true);
      } else {

        const button1 = buttons[0];
        const button2 = buttons[1] || buttons[0]; 

        setCurrentConfig({
          title,
          message,
          buttons,
          resolve: () => {
            resolve(0); 
          },
        });

        if (choiceDialogRef.current) {
          console.log('[AlertDialog] ChoiceDialog open 호출:', { title, message, button1: button1.text, button2: button2.text });

          setChoiceDialogVisible(true);
          console.log('[AlertDialog] setChoiceDialogVisible(true) 호출');

          setTimeout(() => {
            if (choiceDialogRef.current) {
              const dialogPromise = choiceDialogRef.current.open({
                title,
                message,
                button1Label: button1.text,
                button1Action: async () => {
                  console.log('[AlertDialog] button1 클릭');
                  button1.onPress?.();
                  setChoiceDialogVisible(false);
                  setCurrentConfig(null);
                },
                button2Label: button2.text,
                button2Action: async () => {
                  console.log('[AlertDialog] button2 클릭');
                  button2.onPress?.();
                  setChoiceDialogVisible(false);
                  setCurrentConfig(null);
                },
              });

              dialogPromise
                .then((result) => {
                  console.log('[AlertDialog] ChoiceDialog Promise 결과:', result);
                  if (result === 'button1') {
                    resolve(0);
                  } else if (result === 'button2') {
                    resolve(1);
                  } else {

                    resolve(0);
                  }
                  setChoiceDialogVisible(false);
                  setCurrentConfig(null);
                })
                .catch((error) => {
                  console.error('[AlertDialog] ChoiceDialog open 오류:', error);

                  resolve(0);
                });
            } else {
              console.error('[AlertDialog] choiceDialogRef.current가 null입니다 (setTimeout 후)');
              resolve(0);
            }
          }, 0);
        } else {
          console.error('[AlertDialog] choiceDialogRef.current가 null입니다. ChoiceDialog가 렌더링되지 않았을 수 있습니다.');

          resolve(0);
        }
      }
    });
  };

  const handleSimpleDialogClose = () => {
    setSimpleDialogVisible(false);
    currentConfig?.resolve?.();
    setCurrentConfig(null);
  };

  const handleChoiceDialogClose = () => {
    setChoiceDialogVisible(false);
    currentConfig?.resolve?.();
    setCurrentConfig(null);
  };

  useEffect(() => {
    _globalShowAlert = showAlert;
    return () => { _globalShowAlert = null; };
  }, []);

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}
      {}
      <Dialog
        visible={simpleDialogVisible}
        title={currentConfig?.title || ''}

        onClose={currentConfig?.hideCloseButton ? undefined : handleSimpleDialogClose}
        actions={[
          {
            label: currentConfig?.buttons?.[0]?.text || t('common.buttons.confirm'),
            onPress: handleSimpleDialogClose,
            variant: 'primary',
          },
        ]}
      >
        {currentConfig?.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{currentConfig.message}</Text>
          </View>
        )}
      </Dialog>
      {}
      <ChoiceDialog
        ref={choiceDialogRef}
        visible={choiceDialogVisible}
        title={currentConfig?.title || ''}
        message={currentConfig?.message}
        onClose={handleChoiceDialogClose}
      />
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within AlertDialogProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingVertical: 4,
  },
  message: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
    lineHeight: 24,
  },
});

