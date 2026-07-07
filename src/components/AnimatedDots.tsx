import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface AnimatedDotsProps {

  count?: number;

  interval?: number;

  style?: TextStyle;
}

export const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  count = 3,
  interval = 400,
  style,
}) => {

  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev % count) + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  const dotsStr = '.'.repeat(step) + ' '.repeat(count - step);
  return <Text style={style}>{dotsStr}</Text>;
};

interface LoadingTextProps {
  text: string;
  style?: TextStyle;

  dotsStyle?: TextStyle;

  containerStyle?: any;
}

const TRAILING_DOTS_RE = /(\s*(?:\.{3}|…|(?:\. ?){2,3}))\s*$/;

export const LoadingText: React.FC<LoadingTextProps> = ({
  text,
  style,
  dotsStyle,
  containerStyle,
}) => {
  const match = text.match(TRAILING_DOTS_RE);
  if (!match) {
    return <Text style={style}>{text}</Text>;
  }
  const base = text.slice(0, match.index).trimEnd();
  return (
    <Text style={[style, containerStyle]}>
      {base}
      <AnimatedDots style={dotsStyle || style} />
    </Text>
  );
};

export const styles = StyleSheet.create({});
