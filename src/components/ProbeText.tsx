

import v_a3453e, { v_c4deb2, v_df9f57 } from 'bapkr';
import { v_19b633, v_1c94f1 } from 'rcmrninabrnb';
import { v_c980a8, v_eae756 } from '../services/screenProbe';

type Props = v_1c94f1 & {

  probeScreen: string;

  probeKey: string;
  children?: v_a3453e.ReactNode;
};

function v_bb8cd3(children: v_a3453e.ReactNode): string {
  return v_a3453e.Children.toArray(v_21f619)
    .map((v_367d87) => {
      if (typeof v_367d87 === 'string') return v_367d87;
      if (typeof v_367d87 === 'number') return String(v_367d87);
      return '';
    })
    .join('');
}

export const ProbeText: v_a3453e.FC<Props> = ({ probeScreen: v_b9ac04, probeKey: v_7a9a66, children: v_21f619, ...v_83bbcd }) => {
  const v_9b6134 = v_df9f57(() => v_bb8cd3(v_21f619), [v_21f619]);

  v_c4deb2(() => {
    v_c980a8(v_b9ac04, v_7a9a66, v_9b6134);
    return () => v_eae756(v_b9ac04, v_7a9a66);
  }, [v_b9ac04, v_7a9a66, v_9b6134]);

  return <Text {...v_83bbcd}>{v_21f619}</Text>;
};
