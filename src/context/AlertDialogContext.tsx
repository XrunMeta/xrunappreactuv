import v_a3453e, { v_af12cb, v_76a8a9, v_e662ae, v_4a8ba2, v_5ab095 } from 'bapkr';
import { v_3a67b0, v_eaf177 } from '../components/ChoiceDialog';
import { v_c2fdd1 } from '../components/Dialog';
import { v_19b633, v_3094a2, v_472849 } from 'rcmrninabrnb';
import { v_843035 } from '../constants';

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

const v_ec4174 = v_af12cb<AlertDialogContextValue | undefined>(undefined);

export const v_0c450d = ({ children: v_21f619 }: { children: v_4a8ba2 }) => {
  const v_580dd6 = v_e662ae<v_eaf177>(null);
  const [v_21132d, v_8619cf] = v_5ab095(false);
  const [v_9762fc, v_b8817e] = v_5ab095(false);
  const [v_4519dd, v_af9459] = v_5ab095<{
    title: string;
    message?: string;
    buttons?: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>;
    resolve?: () => void;
  } | null>(null);

  const v_889fad = async (
    v_9f1622,
    v_a8cd21,
    v_3d694a,
  ): Promise<number | undefined> => {
    return new Promise((v_6f7712) => {

      if (!v_3d694a || v_3d694a.length === 0 || v_3d694a.length === 1) {
        const v_c2a02a = v_3d694a?.[0]?.text || '확인';
        const v_059529 = v_3d694a?.[0]?.onPress;

        v_af9459({
          title: v_9f1622,
          message: v_a8cd21,
          buttons: v_3d694a,
          resolve: () => {
            v_059529?.();
            v_6f7712(0); 
          },
        });
        v_8619cf(true);
      } else {

        const v_eb32ab = v_3d694a[0];
        const v_eaad74 = v_3d694a[1] || v_3d694a[0]; 

        v_af9459({
          title: v_9f1622,
          message: v_a8cd21,
          buttons: v_3d694a,
          resolve: () => {
            v_6f7712(0); 
          },
        });

        if (v_580dd6.current) {
          console.log('[AlertDialog] ChoiceDialog open 호출:', { title: v_9f1622, message: v_a8cd21, button1: v_eb32ab.text, button2: v_eaad74.text });

          v_b8817e(true);
          console.log('[AlertDialog] setChoiceDialogVisible(true) 호출');

          setTimeout(() => {
            if (v_580dd6.current) {
              const v_f9e626 = v_580dd6.current.open({
                title: v_9f1622,
                message: v_a8cd21,
                button1Label: v_eb32ab.text,
                button1Action: async () => {
                  console.log('[AlertDialog] button1 클릭');
                  v_eb32ab.onPress?.();
                  v_b8817e(false);
                  v_af9459(null);
                },
                button2Label: v_eaad74.text,
                button2Action: async () => {
                  console.log('[AlertDialog] button2 클릭');
                  v_eaad74.onPress?.();
                  v_b8817e(false);
                  v_af9459(null);
                },
              });

              v_f9e626
                .then((v_43c42e) => {
                  console.log('[AlertDialog] ChoiceDialog Promise 결과:', v_43c42e);
                  if (v_43c42e === 'button1') {
                    v_6f7712(0);
                  } else if (v_43c42e === 'button2') {
                    v_6f7712(1);
                  } else {

                    v_6f7712(0);
                  }
                  v_b8817e(false);
                  v_af9459(null);
                })
                .catch((v_5e9bfe) => {
                  console.error('[AlertDialog] ChoiceDialog open 오류:', v_5e9bfe);

                  v_6f7712(0);
                });
            } else {
              console.error('[AlertDialog] choiceDialogRef.current가 null입니다 (setTimeout 후)');
              v_6f7712(0);
            }
          }, 0);
        } else {
          console.error('[AlertDialog] choiceDialogRef.current가 null입니다. ChoiceDialog가 렌더링되지 않았을 수 있습니다.');

          v_6f7712(0);
        }
      }
    });
  };

  const v_cb6b8d = () => {
    v_8619cf(false);
    v_4519dd?.resolve?.();
    v_af9459(null);
  };

  const v_777770 = () => {
    v_b8817e(false);
    v_4519dd?.resolve?.();
    v_af9459(null);
  };

  return (
    <AlertDialogContext.Provider value={{ showAlert: v_889fad }}>
      {v_21f619}
      {}
      <Dialog
        visible={v_21132d}
        title={v_4519dd?.title || ''}
        onClose={v_cb6b8d}
        actions={[
          {
            label: v_4519dd?.buttons?.[0]?.text || '확인',
            onPress: v_cb6b8d,
            variant: 'primary',
          },
        ]}
      >
        {v_4519dd?.message && (
          <View style={v_d81136.messageContainer}>
            <Text style={v_d81136.message}>{v_4519dd.message}</Text>
          </View>
        )}
      </Dialog>
      {}
      <ChoiceDialog
        ref={v_580dd6}
        visible={v_9762fc}
        title={v_4519dd?.title || ''}
        message={v_4519dd?.message}
        onClose={v_777770}
      />
    </AlertDialogContext.Provider>
  );
};

export const v_4b1173 = () => {
  const v_e3aeb3 = v_76a8a9(v_ec4174);
  if (!v_e3aeb3) {
    throw new Error('useAlertDialog must be used within AlertDialogProvider');
  }
  return v_e3aeb3;
};

const v_d81136 = v_472849.create({
  messageContainer: {
    paddingVertical: 4,
  },
  message: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: '#121212',
    lineHeight: 24,
  },
});

