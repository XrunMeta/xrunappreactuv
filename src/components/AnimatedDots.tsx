import v_a3453e, { v_c4deb2, v_5ab095 } from 'bapkr';
import { v_472849, v_19b633, v_5e8657 } from 'rcmrninabrnb';

interface AnimatedDotsProps {

  count?: number;

  interval?: number;

  style?: v_5e8657;
}

export const AnimatedDots: v_a3453e.FC<AnimatedDotsProps> = ({
  count: v_9e8c70 = 3,
  interval: v_ad1d65 = 400,
  style: v_7fa4e4,
}) => {

  const [v_729796, v_fd7d1f] = v_5ab095(1);

  v_c4deb2(() => {
    const v_cb36b1 = setInterval(() => {
      v_fd7d1f((v_ba2215) => (v_ba2215 % v_9e8c70) + 1);
    }, v_ad1d65);
    return () => clearInterval(v_cb36b1);
  }, [v_9e8c70, v_ad1d65]);

  const v_8c9d74 = '.'.repeat(v_729796) + ' '.repeat(v_9e8c70 - v_729796);
  return <Text style={v_7fa4e4}>{v_8c9d74}</Text>;
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
  dotsStyle: v_51a4fc,
  containerStyle: v_4affe9,
}) => {
  const v_a63110 = v_9b6134.match(v_6895ad);
  const v_694b25 = v_a63110 ? v_9b6134.slice(0, v_a63110.index).trimEnd() : v_9b6134;
  const v_9e8c70 = 3;
  const v_ad1d65 = 400;
  const [v_729796, v_fd7d1f] = v_5ab095(1);
  v_c4deb2(() => {
    if (!v_a63110) return;
    const v_cb36b1 = setInterval(() => {
      v_fd7d1f((v_ba2215) => (v_ba2215 % v_9e8c70) + 1);
    }, v_ad1d65);
    return () => clearInterval(v_cb36b1);
  }, [v_a63110]);
  if (!v_a63110) {
    return <Text style={[v_7fa4e4, v_4affe9]}>{v_9b6134}</Text>;
  }
  const v_8c9d74 = '.'.repeat(v_729796) + ' '.repeat(v_9e8c70 - v_729796);
  return <Text style={[v_7fa4e4, v_4affe9]}>{`${v_694b25}${v_8c9d74}`}</Text>;
};

export const v_d81136 = v_472849.create({});
