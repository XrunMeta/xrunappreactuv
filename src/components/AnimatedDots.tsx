import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextStyle, View } from 'react-native';

interface AnimatedDotsProps {

  count?: number;

  interval?: number;

  duration?: number;

  style?: TextStyle;
}

export const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  count = 3,
  interval = 200,
  duration = 900,
  style,
}) => {
  const opacities = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const loops = opacities.map((opacity, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * interval),
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.delay((count - 1 - i) * interval),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [count, interval, duration, opacities]);

  return (
    <View style={styles.row}>
      {opacities.map((opacity, i) => (
        <Animated.Text key={i} style={[style, { opacity }]}>
          .
        </Animated.Text>
      ))}
    </View>
  );
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
    <View style={[styles.rowCenter, containerStyle]}>
      <Text style={style}>{base}</Text>
      <AnimatedDots style={dotsStyle || style} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
