import v_a3453e, { v_c4deb2, v_e662ae } from 'bapkr';
import { v_a2349e, v_472849, v_19b633, v_5e8657 } from 'rcmrninabrnb';

interface AnimatedDotsProps {

  count?: number;

  interval?: number;

  duration?: number;

  style?: v_5e8657;
}

export const AnimatedDots: v_a3453e.FC<AnimatedDotsProps> = ({
  count: v_9e8c70 = 3,
  interval: v_ad1d65 = 200,
  duration: v_a712cf = 900,
  style: v_7fa4e4,
}) => {
  const v_4e4b20 = v_e662ae(
    Array.from({ length: v_9e8c70 }, () => new v_a2349e.Value(0))
  ).current;

  v_c4deb2(() => {
    const v_506870 = v_4e4b20.map((v_df9f11, v_ebec57) =>
      v_a2349e.loop(
        v_a2349e.sequence([
          v_a2349e.delay(v_ebec57 * v_ad1d65),
          v_a2349e.timing(v_df9f11, {
            toValue: 1,
            duration: v_a712cf / 2,
            useNativeDriver: true,
          }),
          v_a2349e.timing(v_df9f11, {
            toValue: 0,
            duration: v_a712cf / 2,
            useNativeDriver: true,
          }),
          v_a2349e.delay((v_9e8c70 - 1 - v_ebec57) * v_ad1d65),
        ])
      )
    );
    v_506870.forEach(v_1614db => v_1614db.start());
    return () => v_506870.forEach(v_1614db => v_1614db.stop());
  }, [v_9e8c70, v_ad1d65, v_a712cf, v_4e4b20]);

  return (
    <>
      {v_4e4b20.map((v_df9f11, v_ebec57) => (
        <Animated.Text key={v_ebec57} style={[v_7fa4e4, { opacity: v_df9f11 }]}>
          .
        </Animated.Text>
      ))}
    </>
  );
};

interface LoadingTextProps {
  text: string;
  style?: v_5e8657;

  dotsStyle?: v_5e8657;

  containerStyle?: any;
}

const v_6895ad = /(\s*(?:\.{3}|…|(?:\. ?){2,3}))\s*$/;

export const LoadingText: v_a3453e.FC<LoadingTextProps> = ({
  text: v_9b6134,
  style: v_7fa4e4,
  dotsStyle: v_bec0ff,
  containerStyle: v_4affe9,
}) => {
  const v_a63110 = v_9b6134.match(v_6895ad);
  if (!v_a63110) {
    return <Text style={v_7fa4e4}>{v_9b6134}</Text>;
  }
  const v_694b25 = v_9b6134.slice(0, v_a63110.index).trimEnd();

  return (
    <Text style={[v_7fa4e4, v_4affe9]}>
      {v_694b25}
      <AnimatedDots style={v_bec0ff || v_7fa4e4} />
    </Text>
  );
};

export const v_d81136 = v_472849.create({});
