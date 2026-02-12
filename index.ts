import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import { v_3094a2, v_39a996, v_472849 } from 'rcmrninabrnb';
import { v_e4dfc3 } from 'tgjb';
import { v_8ecf08 } from './src/utils/env';

v_8ecf08();

const v_28f998 = v_472849.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

function v_fafd0c() {
  const [v_1a64d7, v_b96ac3] = v_5ab095<v_a3453e.ComponentType | null>(null);

  v_c4deb2(() => {
    import('./App').then((v_35f85c) => v_b96ac3(() => v_35f85c.default));
  }, []);

  if (!v_1a64d7) {
    return v_a3453e.createElement(
      v_3094a2,
      { style: v_28f998.root },
      v_a3453e.createElement(v_39a996, { size: 'large', color: '#007aff' })
    );
  }
  return v_a3453e.createElement(v_1a64d7);
}

v_e4dfc3(v_fafd0c);
