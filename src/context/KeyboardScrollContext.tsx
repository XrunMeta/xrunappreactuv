import v_a3453e, { v_af12cb, v_76a8a9, v_e662ae, v_5ab095, v_c4deb2, v_4a8ba2 } from 'bapkr';
import { v_122070, v_efd272, v_bfa1d6, v_326be8, v_700696 } from 'rcmrninabrnb';

interface KeyboardScrollContextValue {
  scrollToFocusedInput: (event: any) => void;
  registerScrollView: (ref: v_122070 | null) => void;
  setKeyboardHeight: (height: number) => void;
}

const v_0fcf43 = v_af12cb<KeyboardScrollContextValue | null>(null);

export const v_f3168c = () => {
  const v_e3aeb3 = v_76a8a9(v_0fcf43);
  return v_e3aeb3;
};

interface KeyboardScrollProviderProps {
  children: v_4a8ba2;
  enabled?: boolean;
}

export const KeyboardScrollProvider: v_a3453e.FC<KeyboardScrollProviderProps> = ({
  children: v_21f619,
  enabled: v_d20c84 = true,
}) => {
  const v_e99f51 = v_e662ae<v_122070 | null>(null);
  const [v_7e4acc, v_de86c2] = v_5ab095(0);
  const v_0cb716 = v_e662ae<any>(null);

  const v_015ed8 = (ref: v_122070 | null) => {
    v_e99f51.current = v_6d4ed3;
  };

  const v_bf98ad = (v_d48baf) => {
    if (!v_d20c84 || !v_e99f51.current) {
      return;
    }

    v_0cb716.current = v_d48baf.target;

    v_f36d51(v_d48baf.target);
  };

  const v_f36d51 = (v_5f5d6d) => {
    if (!v_e99f51.current || !v_5f5d6d) {
      console.log('[KeyboardScroll] 스크롤 불가:', {
        hasScrollView: !!v_e99f51.current,
        hasTarget: !!v_5f5d6d,
      });
      return;
    }

    try {
      const v_7953a8 = v_efd272(v_5f5d6d);
      if (!v_7953a8) {
        console.log('[KeyboardScroll] inputHandle을 찾을 수 없음');
        return;
      }

      const v_417c5b = v_efd272(v_e99f51.current);
      if (!v_417c5b) {
        console.log('[KeyboardScroll] scrollViewHandle을 찾을 수 없음');
        return;
      }

      console.log('[KeyboardScroll] 스크롤 시작:', {
        keyboardHeight: v_7e4acc,
        hasInputHandle: !!v_7953a8,
        hasScrollViewHandle: !!v_417c5b,
      });

      v_bfa1d6.measureLayout(
        v_7953a8,
        v_417c5b,
        () => {
          console.error('[KeyboardScroll] measureLayout error');
        },
        (v_62c214, v_64877a, v_8e4fb6, v_3d0b3b) => {

          console.log('[KeyboardScroll] 입력 필드 측정:', {
            x: v_62c214,
            y: v_64877a,
            width: v_8e4fb6,
            inputHeight: v_3d0b3b,
            inputBottom: v_64877a + v_3d0b3b,
            keyboardHeight: v_7e4acc,
          });

          const v_cb21f8 = v_700696.get('window').height;

          const v_5a8f19 = v_64877a + v_3d0b3b;

          let v_79c29a;

          if (v_7e4acc > 0) {

            const v_6a9a46 = 120; 
            const v_cb7103 = 100; 

            const v_80b254 = v_cb21f8 - v_7e4acc;
            const v_1f08df = v_80b254 - v_6a9a46 - v_cb7103;

            let v_79c29a = (v_64877a + v_3d0b3b) - v_1f08df;

            v_79c29a = Math.max(0, v_79c29a);

            console.log('[KeyboardScroll] 키보드 계산:', {
              screenHeight: v_cb21f8,
              keyboardHeight: v_7e4acc,
              inputHeight: v_3d0b3b,
              inputBottom: v_64877a + v_3d0b3b,
              visibleScreenHeight: v_80b254,
              targetBottomY: v_1f08df,
              extraOffset: v_cb7103,
              finalScrollPosition: v_79c29a,
            });

            console.log('[KeyboardScroll] 최종 스크롤 위치:', v_79c29a);

            if (v_e99f51.current) {
              v_e99f51.current.scrollTo({
                y: v_79c29a,
                animated: true,
              });
              console.log('[KeyboardScroll] 스크롤 실행 완료');
            }
          } else {

            console.log('[KeyboardScroll] 키보드 높이 0, 스크롤 대기');
            return;
          }
        }
      );
    } catch (v_5e9bfe) {
      console.error('[KeyboardScroll] scrollToInput error:', v_5e9bfe);
    }
  };

  v_c4deb2(() => {
    if (v_7e4acc > 0 && v_0cb716.current) {
      setTimeout(() => {
        v_f36d51(v_0cb716.current);
      }, v_326be8.OS === 'ios' ? 100 : 300);
    }
  }, [v_7e4acc]);

  return (
    <KeyboardScrollContext.Provider
      value={{
        scrollToFocusedInput: v_bf98ad,
        registerScrollView: v_015ed8,
        setKeyboardHeight: v_de86c2,
      }}
    >
      {v_21f619}
    </KeyboardScrollContext.Provider>
  );
};

