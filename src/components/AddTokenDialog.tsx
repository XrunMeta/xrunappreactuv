import v_a3453e, { v_c4deb2, v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_cf9c33,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_4623af,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_c2fdd1 } from './Dialog';
import { v_4b1173 } from '../context/AlertDialogContext';
import { v_843035 } from '../constants';

type TokenOption = {
  id: string;
  name: string;
  contract: string;
  symbol: string;
  decimals: number;
  icon: any;
};

const v_6361f0 = [
  {
    id: 'pol',
    name: 'POL',
    contract: '0x00000000000000000000000057565e028bc78be6',
    symbol: 'POL',
    decimals: 18,
    icon: require('../../assets/icon_polyganscan_color.png'),
  },
  {
    id: 'xrun',
    name: 'XRUN',
    contract: '0x0000000000000000000000004450b9f4f5d7300e',
    symbol: 'XRUN',
    decimals: 18,
    icon: require('../../assets/xrun-round-logo.png'),
  },
];

interface AddTokenDialogProps {
  visible: boolean;
  onClose: () => void;
}

type Step = 0 | 1 | 2;

export const AddTokenDialog: v_a3453e.FC<AddTokenDialogProps> = ({
  visible: v_cf55be,
  onClose: v_0890f8,
}) => {
  const { t: v_8d41d7 } = v_772971();
  const { showAlert: v_889fad } = v_4b1173();
  const [v_729796, v_fd7d1f] = v_5ab095<Step>(0);
  const [v_04cb77, v_96a9ed] = v_5ab095<TokenOption | null>(null);
  const [v_bf7657, v_d134da] = v_5ab095('');

  v_c4deb2(() => {
    if (!v_cf55be) {
      v_fd7d1f(0);
      v_96a9ed(null);
      v_d134da('');
    }
  }, [v_cf55be]);

  const v_91f0db = v_bf7657 || v_04cb77?.contract || '';

  const v_9f1622 = v_df9f57(
    () => (v_729796 === 2 ? 'Confirm Token add' : 'Add Token'),
    [v_729796],
  );

  const v_b6f01b = async () => {
    if (v_729796 === 0) {
      if (!v_04cb77) {
        await v_889fad(v_8d41d7('components.addTokenDialog.alerts.tokenSelect'), v_8d41d7('components.addTokenDialog.errors.tokenRequired'));
        return;
      }
      v_fd7d1f(1);
      v_d134da(v_04cb77.contract);
      return;
    }

    if (v_729796 === 1) {
      if (!v_91f0db) {
        await v_889fad(v_8d41d7('components.addTokenDialog.alerts.addressRequired'), v_8d41d7('components.addTokenDialog.errors.addressRequired'));
        return;
      }
      v_fd7d1f(2);
      return;
    }

    await v_889fad(v_8d41d7('components.addTokenDialog.alerts.tokenAdd'), v_8d41d7('components.addTokenDialog.success.tokenAdded'));
    v_0890f8();
  };

  const v_716e90 = () => {
    if (v_729796 === 2) {
      return null;
    }

    return (
      <View>
        <View style={v_d81136.tabRow}>
          <Text style={[v_d81136.tabLabel, v_729796 === 0 && v_d81136.tabLabelActive]}>
            Token
          </Text>
          <Text style={[v_d81136.tabLabel, v_729796 === 1 && v_d81136.tabLabelActive]}>
            Contract
          </Text>
        </View>
        <View style={v_d81136.tabIndicator}>
          <View
            style={[
              v_d81136.tabProgress,
              { width: `${((v_729796 + 1) / 2) * 100}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  const v_f84c70 = () => (
    <View style={v_d81136.listContainer}>
      {v_6361f0.map((v_21cc31) => {
        const v_26dce6 = v_04cb77?.id === v_21cc31.id;
        return (
          <TouchableOpacity
            key={v_21cc31.id}
            style={[v_d81136.tokenRow, v_26dce6 && v_d81136.tokenRowActive]}
            activeOpacity={0.7}
            onPress={() => v_96a9ed(v_21cc31)}
          >
            <View style={v_d81136.tokenIcon}>
              <View style={v_d81136.iconCircle}>
                <Image source={v_21cc31.icon} style={v_d81136.tokenImage} />
              </View>
            </View>
            <Text style={v_d81136.tokenLabel}>{v_21cc31.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const v_ba3568 = () => (
    <View style={v_d81136.contractWrapper}>
      <TextInput
        style={v_d81136.contractInput}
        placeholder="Contract address"
        placeholderTextColor="#a6a6a6"
        value={v_91f0db}
        onChangeText={v_d134da}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const v_2fe31b = () => (
    <View style={v_d81136.summaryWrapper}>
      <View style={v_d81136.summaryItem}>
        <Text style={v_d81136.summaryLabel}>Contract address</Text>
        <Text style={v_d81136.summaryValue}>{v_91f0db}</Text>
      </View>
      <View style={v_d81136.summaryItem}>
        <Text style={v_d81136.summaryLabel}>Token Name</Text>
        <Text style={v_d81136.summaryValue}>{v_04cb77?.name}</Text>
      </View>
      <View style={v_d81136.summaryItem}>
        <Text style={v_d81136.summaryLabel}>Token Symbol</Text>
        <Text style={v_d81136.summaryValue}>{v_04cb77?.symbol}</Text>
      </View>
      <View style={v_d81136.summaryItem}>
        <Text style={v_d81136.summaryLabel}>Digits</Text>
        <Text style={v_d81136.summaryValue}>
          {v_04cb77?.decimals ?? '18'}
        </Text>
      </View>
    </View>
  );

  const v_a1ac21 = () => {
    if (v_729796 === 0) {
      return (
        <>
          {v_716e90()}
          {v_f84c70()}
        </>
      );
    }

    if (v_729796 === 1) {
      return (
        <>
          {v_716e90()}
          {v_ba3568()}
        </>
      );
    }

    return v_2fe31b();
  };

  return (
    <Dialog
      visible={v_cf55be}
      title={v_9f1622}
      onClose={v_0890f8}
      containerStyle={v_d81136.dialogContainer}
      actions={[
        {
          label: v_729796 === 2 ? 'Add token' : 'Next',
          onPress: v_b6f01b,
          variant: 'primary',
        },
      ]}
    >
      {v_a1ac21()}
    </Dialog>
  );
};

const v_d81136 = v_472849.create({
  dialogContainer: {
    paddingHorizontal: 24,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tabLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
  tabLabelActive: {
    color: '#1a2e35',
  },
  tabIndicator: {
    height: 6,
    backgroundColor: '#dcdcdc',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tabProgress: {
    height: '100%',
    backgroundColor: '#ffdc04',
    borderRadius: 4,
  },
  listContainer: {
    gap: 12,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: v_472849.hairlineWidth,
    borderColor: '#ececec',
  },
  tokenRowActive: {
    backgroundColor: '#fdf7d1',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tokenImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tokenLabel: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  contractWrapper: {
    marginTop: 4,
  },
  contractInput: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  summaryWrapper: {
    gap: 16,
  },
  summaryItem: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#b8b8b8',
  },
  summaryValue: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
});


