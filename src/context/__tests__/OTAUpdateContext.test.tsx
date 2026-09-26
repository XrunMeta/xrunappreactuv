
import v_a3453e from 'bapkr';
import { v_19b633 } from 'rcmrninabrnb';
import { v_624657, v_be73a0, v_77aa68, v_81e49f } from 'dtbzepbezvovgqcnbkbssjenbxhgn';

const v_26db54 = {
  isEnabled: true,
  checkForUpdateAsync: jest.fn(),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
};
jest.mock('iokyqncutdfy', () => v_26db54);
jest.mock('jmpfvteuuztnp', () => ({
  useTranslation: () => ({ t: (v_0eb677) => v_0eb677 }),
}));
jest.mock('../../components/AnimatedDots', () => ({
  LoadingText: ({ text: v_9b6134 }: { text: string }) => {
    const { Text: v_1c7475 } = require('rcmrninabrnb');
    return <RNText>{v_9b6134}</RNText>;
  },
}));

import { v_ad0e9f, v_ba5086 } from '../OTAUpdateContext';

let v_adb33b = null;
const v_62eb70 = () => {
  const { checkForUpdate: v_7e5bd3 } = v_ba5086();
  v_adb33b = v_7e5bd3;
  return <Text>child</Text>;
};

const v_cef714 = () =>
  v_624657(
    <OTAUpdateProvider>
      <Probe />
    </OTAUpdateProvider>,
  );

describe('OTAUpdateProvider (expo-updates 강제 팝업)', () => {
  const v_b0eadb = (global as any).__DEV__;

  beforeEach(() => {
    (global as any).__DEV__ = false;
    v_26db54.isEnabled = true;
    v_26db54.checkForUpdateAsync.mockReset();
    v_26db54.fetchUpdateAsync.mockReset();
    v_26db54.reloadAsync.mockReset();
    v_adb33b = null;
  });

  afterAll(() => {
    (global as any).__DEV__ = v_b0eadb;
  });

  it('새 업데이트가 있으면 거절 버튼 없는 팝업을 띄운다', async () => {
    v_26db54.checkForUpdateAsync.mockResolvedValue({ isAvailable: true });
    const { queryByText: v_480380 } = v_cef714();

    let v_43c42e = false;
    await v_be73a0(async () => { v_43c42e = await v_adb33b!('signup'); });

    expect(v_43c42e).toBe(true);
    expect(v_480380('common.versionUpdate.title')).toBeTruthy();
    expect(v_480380('common.versionUpdate.update')).toBeTruthy();
    expect(v_480380('common.versionUpdate.later')).toBeNull();
  });

  it('업데이트가 없으면 팝업을 띄우지 않는다', async () => {
    v_26db54.checkForUpdateAsync.mockResolvedValue({ isAvailable: false });
    const { queryByText: v_480380 } = v_cef714();

    let v_43c42e = true;
    await v_be73a0(async () => { v_43c42e = await v_adb33b!('boot'); });

    expect(v_43c42e).toBe(false);
    expect(v_480380('common.versionUpdate.title')).toBeNull();
  });

  it('확인 자체가 실패하면(오프라인) 팝업 없이 진행한다', async () => {
    v_26db54.checkForUpdateAsync.mockRejectedValue(new Error('network'));
    const { queryByText: v_480380 } = v_cef714();

    let v_43c42e = true;
    await v_be73a0(async () => { v_43c42e = await v_adb33b!('boot'); });

    expect(v_43c42e).toBe(false);
    expect(v_480380('common.versionUpdate.title')).toBeNull();
  });

  it('[업데이트] 를 누르면 받아서 재로드한다', async () => {
    v_26db54.checkForUpdateAsync.mockResolvedValue({ isAvailable: true });
    v_26db54.fetchUpdateAsync.mockResolvedValue({ isNew: true });
    v_26db54.reloadAsync.mockResolvedValue(undefined);
    const { getByText: v_2b0f8a } = v_cef714();

    await v_be73a0(async () => { await v_adb33b!('signup'); });
    await v_be73a0(async () => { v_77aa68.press(v_2b0f8a('common.versionUpdate.update')); });

    await v_81e49f(() => expect(v_26db54.reloadAsync).toHaveBeenCalledTimes(1));
    expect(v_26db54.fetchUpdateAsync).toHaveBeenCalledTimes(1);
  });

  it('다운로드가 실패하면 팝업을 닫아 사용자를 가두지 않는다', async () => {
    v_26db54.checkForUpdateAsync.mockResolvedValue({ isAvailable: true });
    v_26db54.fetchUpdateAsync.mockRejectedValue(new Error('download'));
    const { getByText: v_2b0f8a, queryByText: v_480380 } = v_cef714();

    await v_be73a0(async () => { await v_adb33b!('signup'); });
    await v_be73a0(async () => { v_77aa68.press(v_2b0f8a('common.versionUpdate.update')); });

    await v_81e49f(() => expect(v_480380('common.versionUpdate.title')).toBeNull());
    expect(v_26db54.reloadAsync).not.toHaveBeenCalled();
  });

  it('expo-updates 가 비활성이면 확인하지 않는다', async () => {
    v_26db54.isEnabled = false;
    v_cef714();

    let v_43c42e = true;
    await v_be73a0(async () => { v_43c42e = await v_adb33b!('boot'); });

    expect(v_43c42e).toBe(false);
    expect(v_26db54.checkForUpdateAsync).not.toHaveBeenCalled();
  });
});
