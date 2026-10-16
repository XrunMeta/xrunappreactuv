import v_a3453e, { v_af12cb, v_76a8a9, v_e662ae, v_4a8ba2, v_5ab095, v_c4deb2 } from 'bapkr';

import { v_772971 } from 'jmpfvteuuztnp';
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

    options?: { hideCloseButton?: boolean },
  ) => Promise<number | undefined>; 
}

const v_ec4174 = v_af12cb<AlertDialogContextValue | undefined>(undefined);

let v_4d65e1 = null;
export function v_c551a1() { return v_4d65e1; }

export const v_0c450d = ({ children: v_21f619 }: { children: v_4a8ba2 }) => {
  const { t: v_8d41d7 } = v_772971();
  const v_580dd6 = v_e662ae<v_eaf177>(null);
  const [v_21132d, v_8619cf] = v_5ab095(false);
  const [v_9762fc, v_b8817e] = v_5ab095(false);

  const [v_f5dc05, v_50c81e] = v_5ab095<{
    title: string;
    message?: string;
    b0Label: string;
    b1Label: string;
    onB0: () => void;
    onB1: () => void;
  } | null>(null);
  const [v_502f8f, v_391672] = v_5ab095(false);

  const v_0cef4d = v_e662ae<ReturnType<typeof setTimeout> | null>(null);
  const [v_4519dd, v_af9459] = v_5ab095<{
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

  const v_889fad = async (
    v_9f1622,
    v_a8cd21,
    v_3d694a,
    v_b36f96,
  ): Promise<number | undefined> => {
    return new Promise((v_6f7712) => {

      if (v_3d694a && v_3d694a.length === 2) {
        const [v_d26233, v_cd6092] = v_3d694a;

        v_8619cf(false);
        v_b8817e(false);
        v_af9459(null);

        if (v_0cef4d.current) {
          clearTimeout(v_0cef4d.current);
          v_0cef4d.current = null;
        }

        const v_764c58 = () => {
          v_391672(false);
          v_0cef4d.current = setTimeout(() => {
            v_50c81e(null);
            v_0cef4d.current = null;
          }, 300);
        };
        v_50c81e({
          title: v_9f1622,
          message: v_a8cd21,
          b0Label: v_d26233.text,
          b1Label: v_cd6092.text,
          onB0: () => { v_d26233.onPress?.(); v_764c58(); v_6f7712(0); },
          onB1: () => { v_cd6092.onPress?.(); v_764c58(); v_6f7712(1); },
        });
        v_391672(true);
        return;
      }

      if (!v_3d694a || v_3d694a.length === 0 || v_3d694a.length === 1) {
        const v_c2a02a = v_3d694a?.[0]?.text || v_8d41d7('common.buttons.confirm');
        const v_059529 = v_3d694a?.[0]?.onPress;

        v_af9459({
          title: v_9f1622,
          message: v_a8cd21,
          buttons: v_3d694a,
          hideCloseButton: v_b36f96?.hideCloseButton,
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

  v_c4deb2(() => {
    v_4d65e1 = v_889fad;
    return () => { v_4d65e1 = null; };
  }, []);

  return (
    <AlertDialogContext.Provider value={{ showAlert: v_889fad }}>
      {v_21f619}
      {}
      {}
      <Dialog
        visible={v_21132d && !!v_4519dd?.title}
        title={v_4519dd?.title || ''}

        onClose={v_4519dd?.hideCloseButton ? undefined : v_cb6b8d}
        actions={[
          {
            label: v_4519dd?.buttons?.[0]?.text || v_8d41d7('common.buttons.confirm'),
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
      {}
      {
}
      <Dialog
        visible={v_502f8f && !!v_f5dc05?.title}
        title={v_f5dc05?.title || ''}
        onClose={() => { v_f5dc05?.onB0(); }}
        actions={v_f5dc05 ? [
          { label: v_f5dc05.b0Label, onPress: v_f5dc05.onB0, variant: 'secondary' },
          { label: v_f5dc05.b1Label, onPress: v_f5dc05.onB1, variant: 'primary' },
        ] : []}
      >
        {v_f5dc05?.message ? (
          <View style={v_d81136.messageContainer}>
            <Text style={v_d81136.message}>{v_f5dc05.message}</Text>
          </View>
        ) : null}
      </Dialog>
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

