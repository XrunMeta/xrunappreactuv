import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { ScrollView, findNodeHandle, UIManager, Platform, Dimensions } from 'react-native';

interface KeyboardScrollContextValue {
  scrollToFocusedInput: (event: any) => void;
  registerScrollView: (ref: ScrollView | null) => void;
  setKeyboardHeight: (height: number) => void;
}

const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(null);

export const useKeyboardScroll = () => {
  const context = useContext(KeyboardScrollContext);
  return context;
};

interface KeyboardScrollProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const KeyboardScrollProvider: React.FC<KeyboardScrollProviderProps> = ({
  children,
  enabled = true,
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const focusedInputRef = useRef<any>(null);

  const registerScrollView = (ref: ScrollView | null) => {
    scrollViewRef.current = ref;
  };

  const scrollToFocusedInput = (event: any) => {
    if (!enabled || !scrollViewRef.current) {
      return;
    }

    focusedInputRef.current = event.target;

    scrollToInput(event.target);
  };

  const scrollToInput = (target: any) => {
    if (!scrollViewRef.current || !target) {
      console.log('[KeyboardScroll] 스크롤 불가:', {
        hasScrollView: !!scrollViewRef.current,
        hasTarget: !!target,
      });
      return;
    }

    try {
      const inputHandle = findNodeHandle(target);
      if (!inputHandle) {
        console.log('[KeyboardScroll] inputHandle을 찾을 수 없음');
        return;
      }

      const scrollViewHandle = findNodeHandle(scrollViewRef.current);
      if (!scrollViewHandle) {
        console.log('[KeyboardScroll] scrollViewHandle을 찾을 수 없음');
        return;
      }

      console.log('[KeyboardScroll] 스크롤 시작:', {
        keyboardHeight,
        hasInputHandle: !!inputHandle,
        hasScrollViewHandle: !!scrollViewHandle,
      });

      UIManager.measureLayout(
        inputHandle,
        scrollViewHandle,
        () => {
          console.error('[KeyboardScroll] measureLayout error');
        },
        (x, y, width, inputHeight) => {

          console.log('[KeyboardScroll] 입력 필드 측정:', {
            x,
            y,
            width,
            inputHeight,
            inputBottom: y + inputHeight,
            keyboardHeight,
          });

          const screenHeight = Dimensions.get('window').height;

          const inputBottom = y + inputHeight;

          let scrollPosition: number;

          if (keyboardHeight > 0) {

            const margin = 120; 
            const extraOffset = 100; 

            const visibleScreenHeight = screenHeight - keyboardHeight;
            const targetBottomY = visibleScreenHeight - margin - extraOffset;

            let scrollPosition = (y + inputHeight) - targetBottomY;

            scrollPosition = Math.max(0, scrollPosition);

            console.log('[KeyboardScroll] 키보드 계산:', {
              screenHeight,
              keyboardHeight,
              inputHeight,
              inputBottom: y + inputHeight,
              visibleScreenHeight,
              targetBottomY,
              extraOffset,
              finalScrollPosition: scrollPosition,
            });

            console.log('[KeyboardScroll] 최종 스크롤 위치:', scrollPosition);

            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                y: scrollPosition,
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
    } catch (error) {
      console.error('[KeyboardScroll] scrollToInput error:', error);
    }
  };

  useEffect(() => {
    if (keyboardHeight > 0 && focusedInputRef.current) {
      setTimeout(() => {
        scrollToInput(focusedInputRef.current);
      }, Platform.OS === 'ios' ? 100 : 300);
    }
  }, [keyboardHeight]);

  return (
    <KeyboardScrollContext.Provider
      value={{
        scrollToFocusedInput,
        registerScrollView,
        setKeyboardHeight,
      }}
    >
      {children}
    </KeyboardScrollContext.Provider>
  );
};

