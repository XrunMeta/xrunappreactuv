
import { getOrCreateKek, loadKek, deleteKek } from '../walletKek';
const SecureStore = require('expo-secure-store');

beforeEach(() => SecureStore.__reset());

describe('walletKek', () => {
  it('loadKek returns null when absent', async () => {
    expect(await loadKek()).toBeNull();
  });

  it('getOrCreateKek creates 32-byte key and persists it', async () => {
    const k1 = await getOrCreateKek();
    expect(k1.sigBytes).toBe(32);
    const k2 = await getOrCreateKek(); 
    expect(k1.toString()).toBe(k2.toString());
  });

  it('deleteKek removes the key', async () => {
    await getOrCreateKek();
    await deleteKek();
    expect(await loadKek()).toBeNull();
  });

  it('concurrent getOrCreateKek calls produce identical KEK', async () => {
    const [r0, r1] = await Promise.all([getOrCreateKek(), getOrCreateKek()]);

    expect(r0.toString()).toBe(r1.toString());

    const stored = await loadKek();
    expect(stored).not.toBeNull();
    expect(r0.toString()).toBe(stored!.toString());
  });
});
