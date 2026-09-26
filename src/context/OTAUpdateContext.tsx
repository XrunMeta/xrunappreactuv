

import v_a3453e, { v_af12cb, v_de06a3, v_76a8a9, v_e662ae, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_aa7413, v_4623af, v_03e392 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import * as v_94035f from 'ryynyumnbcgyvtiickefs';
import { v_8cbe29 } from 'iokyqncutdfy';
import { v_412fbc } from '../components/AnimatedDots';
import { v_5401ae } from '../testIDs';

type OTAUpdateContextValue = {

  checkForUpdate: (label?: string) => Promise<boolean>;
};

const v_969f21 = v_af12cb<OTAUpdateContextValue | undefined>(undefined);

export const v_ba5086 = (): OTAUpdateContextValue => {
  const v_16e2dd = v_76a8a9(v_969f21);
  if (v_16e2dd === undefined) {
    throw new Error('useOTAUpdate must be used within OTAUpdateProvider');
  }
  return v_16e2dd;
};

const v_7d5358 = 5000;

const v_b5ae43 = <T,>(v_e2a85c, v_d799e2): Promise<T> =>
  new Promise<T>((v_6f7712, v_bad6f3) => {
    const v_cb36b1 = setTimeout(() => v_bad6f3(new Error(`timeout ${v_d799e2}ms`)), v_d799e2);
    v_e2a85c.then(
      (v_81e2ef) => { clearTimeout(v_cb36b1); v_6f7712(v_81e2ef); },
      (v_9e86fd) => { clearTimeout(v_cb36b1); v_bad6f3(v_9e86fd); },
    );
  });

export const v_ad0e9f = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const { t: v_8d41d7 } = v_772971();
  const [v_cf55be, v_72f90e] = v_5ab095(false);
  const [v_5fafb0, v_0fa862] = v_5ab095(false);
  const { downloadProgress: v_ef2000 } = v_8cbe29();
  const v_a63fde = Math.max(0, Math.min(1, v_ef2000 ?? 0));
  const v_61f9b6 = v_e662ae(false);
  const v_8f61c0 = v_e662ae(false);

  const v_7e5bd3 = v_de06a3(async (v_2869c1 = 'manual'): Promise<boolean> => {
    if (__DEV__) return false;
    if (v_8f61c0.current) return true;
    if (v_61f9b6.current) return false;
    v_61f9b6.current = true;
    try {
      const v_087631 = require('iokyqncutdfy');
      if (!v_087631.isEnabled) return false;
      const v_43c42e = await v_b5ae43<{ isAvailable?: boolean }>(v_087631.checkForUpdateAsync(), v_7d5358);
      if (!v_43c42e?.isAvailable) return false;
      console.log(`[OTA] (${v_2869c1}) 새 업데이트 감지 → 강제 업데이트 팝업`);
      v_8f61c0.current = true;
      v_72f90e(true);
      return true;
    } catch (v_49263d) {
      console.warn(`[OTA] (${v_2869c1}) 확인 실패 — 팝업 없이 진행:`, v_49263d?.message ?? v_49263d);
      return false;
    } finally {
      v_61f9b6.current = false;
    }
  }, []);

  const v_02f61c = async () => {
    if (v_5fafb0) return;
    v_0fa862(true);
    try {
      const v_087631 = require('iokyqncutdfy');
      await v_087631.fetchUpdateAsync();
      await v_087631.reloadAsync();
    } catch (v_49263d) {
      console.warn('[OTA] 업데이트 다운로드/적용 실패:', v_49263d?.message ?? v_49263d);
      v_0fa862(false);
      v_8f61c0.current = false;
      v_72f90e(false);
      v_03e392.alert(v_8d41d7('common.messages.error'), v_8d41d7('common.versionUpdate.downloadFailed'));
    }
  };

  const v_3b402b = { checkForUpdate: v_7e5bd3 };

  return (
    <OTAUpdateContext.Provider value={v_3b402b}>
      {v_21f619}

      {v_cf55be && (
        <Modal visible animationType="fade" transparent={false} onRequestClose={() => {  }}>
          <View style={v_d81136.fullScreenContainer}>
            <View style={v_d81136.contentContainer}>
              <Text style={v_d81136.fullScreenTitle}>{v_8d41d7('common.versionUpdate.title')}</Text>
              <Text testID={v_5401ae.otaupdateContext.descriptionLabel} style={v_d81136.fullScreenMessage}>
                {v_8d41d7('common.versionUpdate.message')}
              </Text>
              {v_5fafb0 ? (
                <View style={v_d81136.progressContainer}>
                  <Text style={v_d81136.progressText}>{Math.round(v_a63fde * 100)}%</Text>
                  <Progress.Bar
                    progress={v_a63fde}
                    width={250}
                    color="#4A90E2"
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    height={10}
                  />
                  <LoadingText text={v_8d41d7('common.messages.loading')} style={v_d81136.downloadingText} />
                </View>
              ) : (
                <TouchableOpacity style={v_d81136.mainButton} onPress={v_02f61c} activeOpacity={0.8}>
                  <Text style={v_d81136.mainButtonText}>{v_8d41d7('common.versionUpdate.update')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </OTAUpdateContext.Provider>
  );
};

const v_d81136 = v_472849.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fullScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
    textAlign: 'center',
  },
  fullScreenMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginBottom: 10,
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  downloadingText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    marginTop: 20,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
