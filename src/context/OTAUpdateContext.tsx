

import v_a3453e, { v_af12cb, v_de06a3, v_76a8a9, v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_aa7413, v_4623af, v_03e392, v_326be8, v_1ed974, v_39a996, v_80fa10 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import * as v_94035f from 'ryynyumnbcgyvtiickefs';
import { v_dc21b6, v_f2f2dd, v_8b3997, v_3e029d } from '../services/otaCheck';
import { v_412fbc } from '../components/AnimatedDots';

type OTAUpdateContextValue = {
  checkForUpdate: () => Promise<void>;
};

const v_969f21 = v_af12cb<OTAUpdateContextValue | undefined>(undefined);

export const v_ba5086 = (): OTAUpdateContextValue => {
  const v_16e2dd = v_76a8a9(v_969f21);
  if (v_16e2dd === undefined) {
    throw new Error('useOTAUpdate must be used within OTAUpdateProvider');
  }
  return v_16e2dd;
};

export const v_ad0e9f = ({ children: v_21f619 }: { children: v_a3453e.ReactNode }) => {
  const { t: v_8d41d7 } = v_772971();
  const [v_cf55be, v_72f90e] = v_5ab095(false);
  const [v_a63fde, v_6306c3] = v_5ab095(0);
  const [v_5fafb0, v_0fa862] = v_5ab095(false);
  const [v_a2dcc0, v_c90ab1] = v_5ab095<v_3e029d | null>(null);
  const [v_3cc252, v_39ad29] = v_5ab095(false);

  const v_7e5bd3 = v_de06a3(async () => {
    if (__DEV__) return;
    const v_34d5e3 = await v_dc21b6();
    if (v_34d5e3) {
      v_c90ab1(v_34d5e3);
      v_72f90e(true);
    }
  }, []);

  const v_02f61c = async () => {
    if (!v_a2dcc0) return;
    v_0fa862(true);
    v_6306c3(0);

    const v_593e63 = await v_f2f2dd(v_a2dcc0.url, (v_e2a85c) => v_6306c3(v_e2a85c));

    if (v_593e63) {
      await v_8b3997(v_a2dcc0.version);
      v_0fa862(false);
      v_6306c3(1);

      if (v_326be8.OS === 'android') {
        v_03e392.alert(
          v_8d41d7('common.versionUpdate.updateComplete'),
          v_8d41d7('common.versionUpdate.restartMessage'),
          [{
            text: v_8d41d7('common.versionUpdate.confirm'),
            onPress: () => {

              const v_4b4bb9 = (v_80fa10 as any).ForceKill;
              if (v_4b4bb9?.killProcess) {
                v_4b4bb9.killProcess();
              } else {
                v_1ed974.exitApp();
              }
            },
          }],
          { cancelable: false }
        );
      } else {
        v_39ad29(true);
      }
    } else {
      v_0fa862(false);
      v_03e392.alert(v_8d41d7('common.messages.error'), v_8d41d7('common.versionUpdate.downloadFailed'));
    }
  };

  const v_3b402b = { checkForUpdate: v_7e5bd3 };

  return (
    <OTAUpdateContext.Provider value={v_3b402b}>
      {v_21f619}

      {!v_cf55be ? null : v_3cc252 ? (
        <Modal visible transparent={false} animationType="fade">
          <View style={v_d81136.fullScreenContainer}>
            <ActivityIndicator size="large" color="#4A90E2" style={{ marginBottom: 30, transform: [{ scale: 1.5 }] }} />
            <Text style={v_d81136.fullScreenTitle}>{v_8d41d7('common.versionUpdate.updateComplete')}</Text>
            <Text style={v_d81136.fullScreenMessage}>{v_8d41d7('common.versionUpdate.restartRequired')}</Text>
          </View>
        </Modal>
      ) : (
        <Modal visible animationType="slide" transparent={false}>
          <View style={v_d81136.fullScreenContainer}>
            <View style={v_d81136.contentContainer}>
              <Text style={v_d81136.fullScreenTitle}>{v_8d41d7('common.versionUpdate.title')}</Text>
              <Text style={v_d81136.fullScreenMessage}>
                {v_a2dcc0?.description || v_8d41d7('common.versionUpdate.message')}
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
