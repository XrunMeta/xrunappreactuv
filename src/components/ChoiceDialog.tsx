import v_a3453e, { v_c4deb2, v_5ab095, v_298205, v_680bcc } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_7e4944, v_961e77 } from 'rcmrninabrnb';
import { v_c2fdd1 } from './Dialog';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_843035 } from '../constants';

export interface ChoiceDialogStep {
  title: string;
  message?: string;
  children?: v_a3453e.ReactNode;
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
  children?: v_a3453e.ReactNode;
  button1Label: string;
  button1Action?: () => void | Promise<void> | string;
  button2Label: string;
  button2Action?: () => void | Promise<void> | string;
}

interface ChoiceDialogProps {
  visible: boolean;

  title?: string;
  message?: string;
  children?: v_a3453e.ReactNode;
  button1Label?: string;
  button1Action?: () => void | Promise<void> | string;
  button2Label?: string;
  button2Action?: () => void | Promise<void> | string;

  steps?: ChoiceDialogStep[];
  initialStep?: number; 
  onClose?: () => void;
  fullScreen?: boolean; 
  containerStyle?: v_961e77<v_7e4944>;
  contentContainerStyle?: v_7e4944; 
}

export interface ChoiceDialogRef {
  open: (config: ChoiceDialogConfig) => Promise<'button1' | 'button2'>;
}

export const v_3a67b0 = v_680bcc<ChoiceDialogRef, ChoiceDialogProps>(
  (
    {
      visible: v_cf55be,
      title: v_9f1622,
      message: v_a8cd21,
      children: v_21f619,
      button1Label: v_76205a,
      button1Action: v_9c02ac,
      button2Label: v_1719da,
      button2Action: v_37c65d,
      steps: v_eb271c,
      initialStep: v_2e5eaf = 0,
      onClose: v_0890f8,
      fullScreen: v_4e91ee = false,
      containerStyle: v_4affe9,
      contentContainerStyle: v_9aecf5,
    },
    v_6d4ed3,
  ) => {
    const [v_91943c, v_639227] = v_5ab095(v_2e5eaf);
    const [v_a52163, v_8cff8b] = v_5ab095<
      ((value: 'button1' | 'button2') => void) | null
    >(null);
    const [v_43a672, v_39975e] = v_5ab095<ChoiceDialogConfig | null>(null);
    const [v_72c4b8, v_6a010d] = v_5ab095(false);
    const v_c65f5d = v_a0daa8();

    v_c4deb2(() => {
      if (!v_cf55be) {
        v_639227(v_2e5eaf);
        v_6a010d(false);
        v_39975e(null);
        if (v_a52163) {
          v_a52163('button1'); 
          v_8cff8b(null);
        }
      }
    }, [v_cf55be, v_2e5eaf, v_a52163]);

    v_298205(v_6d4ed3, () => ({
      open: (v_74a79c): Promise<'button1' | 'button2'> => {
        return new Promise((v_6f7712) => {
          v_39975e(v_74a79c);
          v_6a010d(true);
          v_8cff8b(() => v_6f7712);
          v_639227(0);
        });
      },
    }));

    const v_902c0b = () => {
      if (v_eb271c) {
        if (v_91943c < v_eb271c.length - 1) {
          v_639227(v_91943c + 1);
        } else {

          v_7f2e65();
        }
      }
    };

    const v_c54ab6 = () => {
      if (v_eb271c && v_91943c > 0) {
        v_639227(v_91943c - 1);
      }
    };

    const v_7f2e65 = () => {
      if (v_a52163) {
        v_a52163('button1'); 
        v_8cff8b(null);
      }
      v_6a010d(false);
      v_39975e(null);
      v_0890f8?.();
    };

    const v_ac74a9 = async (
      v_9b064f,
      v_5347a3,
    ) => {
      if (!v_9b064f) return;

      try {
        const v_43c42e = await v_9b064f();
        if (typeof v_43c42e === 'string') {

          if (v_43c42e in v_ce4741) {
            v_c65f5d.navigate(v_43c42e as keyof typeof v_ce4741);
          }
        }
      } catch (v_5e9bfe) {
        console.error('ChoiceDialog action error:', v_5e9bfe);
      }

      if (v_72c4b8 && v_a52163) {
        v_a52163(v_5347a3);
        v_8cff8b(null);
        v_6a010d(false);
        v_39975e(null);
      }
    };

    const v_657bc1 = () => {
      if (v_72c4b8 && v_43a672) {
        return {
          title: v_43a672.title,
          message: v_43a672.message,
          children: v_43a672.children,
          button1Label: v_43a672.button1Label,
          button1Action: v_43a672.button1Action,
          button2Label: v_43a672.button2Label,
          button2Action: v_43a672.button2Action,
        };
      }

      if (v_eb271c && v_eb271c.length > 0) {
        const v_729796 = v_eb271c[v_91943c];
        return {
          title: v_729796.title,
          message: v_729796.message,
          children: v_729796.children,
          button1Label: v_729796.button1Label,
          button1Action: () => v_729796.button1Action(v_902c0b, v_c54ab6, v_7f2e65),
          button2Label: v_729796.button2Label,
          button2Action: () => v_729796.button2Action(v_902c0b, v_c54ab6, v_7f2e65),
        };
      }

      return {
        title: v_9f1622 || '',
        message: v_a8cd21,
        children: v_21f619,
        button1Label: v_76205a || '',
        button1Action: v_9c02ac,
        button2Label: v_1719da || '',
        button2Action: v_37c65d,
      };
    };

    const v_74a79c = v_657bc1();

    const v_dd943a = [
      {
        label: v_74a79c.button1Label,
        onPress: async () => {
          await v_ac74a9(v_74a79c.button1Action, 'button1');
          if (!v_72c4b8 && !v_eb271c) {
            v_7f2e65();
          }
        },
        variant: 'secondary' as const,
      },
      {
        label: v_74a79c.button2Label,
        onPress: async () => {
          await v_ac74a9(v_74a79c.button2Action, 'button2');
          if (!v_72c4b8 && !v_eb271c) {
            v_7f2e65();
          }
        },
        variant: 'primary' as const,
      },
    ];

    const v_a1ac21 = () => {
      const v_811d2a = v_74a79c.message;
      const v_da6269 = v_74a79c.children;

      if (!v_811d2a && !v_da6269) {
        return null;
      }

      return (
        <View style={[v_d81136.body, v_9aecf5]}>
          {v_811d2a && <Text style={v_d81136.message}>{v_74a79c.message}</Text>}
          {v_da6269 && (
            <View style={v_d81136.childrenContainer}>{v_74a79c.children}</View>
          )}
        </View>
      );
    };

    return (
      <Dialog
        visible={v_cf55be}
        title={v_74a79c.title}
        onClose={v_7f2e65}
        actions={v_dd943a}
        containerStyle={[
          v_4affe9,
          v_4e91ee ? v_d81136.fullScreenContainer : undefined,
        ]}
      >
        {v_a1ac21()}
      </Dialog>
    );
  },
);

v_3a67b0.displayName = 'ChoiceDialog';

const v_d81136 = v_472849.create({
  body: {
    paddingVertical: 4,
  },
  message: {
    fontSize: v_843035.size.medium,
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

