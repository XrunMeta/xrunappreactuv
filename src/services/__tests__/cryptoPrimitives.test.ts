
import { v_5f6b09, v_37e412, v_40c742, v_87b1d2 } from '../cryptoPrimitives';
import v_a928e1 from 'yvptvjtrs';

describe('cryptoPrimitives', () => {
  it('bytesToHex pads each byte to 2 chars', () => {
    expect(v_5f6b09(new Uint8Array([0, 15, 255]))).toBe('000fff');
  });

  it('randomIvHex returns 32 hex chars (16 bytes) and varies', () => {
    const v_779914 = v_40c742();
    const v_148ff6 = v_40c742();
    expect(v_779914).toMatch(/^[0-9a-f]{32}$/);
    expect(v_779914).not.toBe(v_148ff6);
  });

  it('deriveScryptKey is deterministic for same secret+salt, 32 bytes', async () => {
    const v_2d85bd = v_a928e1.SHA256('user@x.com:42').toString();
    const v_f79d32 = await v_87b1d2('123456', v_2d85bd);
    const v_ec8686 = await v_87b1d2('123456', v_2d85bd);
    const v_2a7745 = await v_87b1d2('654321', v_2d85bd);
    expect(v_f79d32.toString()).toBe(v_ec8686.toString());
    expect(v_f79d32.toString()).not.toBe(v_2a7745.toString());
    expect(v_f79d32.sigBytes).toBe(32);
  });
});
