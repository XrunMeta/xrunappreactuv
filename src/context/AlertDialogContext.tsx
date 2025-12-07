import React, { createContext, useContext, useRef, ReactNode, useState } from 'react';
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
  ) => Promise<number | undefined>; 
}

const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(undefined);

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
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
  ): Promise<number | undefined> => {
    return new Promise((resolve) => {

      if (!buttons || buttons.length === 0 || buttons.length === 1) {
        const buttonLabel = buttons?.[0]?.text || '확인';
        const buttonAction = buttons?.[0]?.onPress;

        setCurrentConfig({
          title,
          message,
          buttons,
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
          choiceDialogRef.current
            .open({
              title,
              message,
              button1Label: button1.text,
              button1Action: async () => {
                button1.onPress?.();
                setChoiceDialogVisible(false);
                setCurrentConfig(null);
                resolve(0); 
              },
              button2Label: button2.text,
              button2Action: async () => {
                button2.onPress?.();
                setChoiceDialogVisible(false);
                setCurrentConfig(null);
                resolve(1); 
              },
            })
            .then((result) => {

              if (result === 'button1') {
                resolve(0);
              } else if (result === 'button2') {
                resolve(1);
              }
              setChoiceDialogVisible(false);
              setCurrentConfig(null);
            });
        }
        setChoiceDialogVisible(true);
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

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}
      {}
      <Dialog
        visible={simpleDialogVisible}
        title={currentConfig?.title || ''}
        onClose={handleSimpleDialogClose}
        actions={[
          {
            label: currentConfig?.buttons?.[0]?.text || '확인',
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

