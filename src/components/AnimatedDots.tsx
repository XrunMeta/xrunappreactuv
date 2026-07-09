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
  dotsStyle: _dotsStyle,
  containerStyle,
}) => {
  const match = text.match(TRAILING_DOTS_RE);
  const base = match ? text.slice(0, match.index).trimEnd() : text;
  const count = 3;
  const interval = 400;
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (!match) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev % count) + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [match]);
  if (!match) {
    return <Text style={[style, containerStyle]}>{text}</Text>;
  }
  const dotsStr = '.'.repeat(step) + ' '.repeat(count - step);
  return <Text style={[style, containerStyle]}>{`${base}${dotsStr}`}</Text>;
};

export const styles = StyleSheet.create({});
