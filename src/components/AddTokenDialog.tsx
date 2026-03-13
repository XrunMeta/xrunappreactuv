import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Dialog } from './Dialog';
import { useAlertDialog } from '../context/AlertDialogContext';
import { FONTS } from '../constants';

type TokenOption = {
  id: string;
  name: string;
  contract: string;
  symbol: string;
  decimals: number;
  icon: any;
};

const TOKEN_OPTIONS: TokenOption[] = [
  {
    id: 'pol',
    name: 'POL',
    contract: '0x54B81270257a7987F94056F313B92c92B3A1E878',
    symbol: 'POL',
    decimals: 18,
    icon: require('../../assets/pol-round-logo.png'),
  },
  {
    id: 'xrun',
    name: 'XRUN',
    contract: '0xe61C95a80b5206EFbA5743c40d964aa86BA6Df27',
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

export const AddTokenDialog: React.FC<AddTokenDialogProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { showAlert } = useAlertDialog();
  const [step, setStep] = useState<Step>(0);
  const [selectedToken, setSelectedToken] = useState<TokenOption | null>(null);
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    if (!visible) {
      setStep(0);
      setSelectedToken(null);
      setContractAddress('');
    }
  }, [visible]);

  const contractValue = contractAddress || selectedToken?.contract || '';

  const title = useMemo(
    () => (step === 2 ? 'Confirm Token add' : 'Add Token'),
    [step],
  );

  const handlePrimaryAction = async () => {
    if (step === 0) {
      if (!selectedToken) {
        await showAlert(t('components.addTokenDialog.alerts.tokenSelect'), t('components.addTokenDialog.errors.tokenRequired'));
        return;
      }
      setStep(1);
      setContractAddress(selectedToken.contract);
      return;
    }

    if (step === 1) {
      if (!contractValue) {
        await showAlert(t('components.addTokenDialog.alerts.addressRequired'), t('components.addTokenDialog.errors.addressRequired'));
        return;
      }
      setStep(2);
      return;
    }

    await showAlert(t('components.addTokenDialog.alerts.tokenAdd'), t('components.addTokenDialog.success.tokenAdded'));
    onClose();
  };

  const renderTabs = () => {
    if (step === 2) {
      return null;
    }

    return (
      <View>
        <View style={styles.tabRow}>
          <Text style={[styles.tabLabel, step === 0 && styles.tabLabelActive]}>
            Token
          </Text>
          <Text style={[styles.tabLabel, step === 1 && styles.tabLabelActive]}>
            Contract
          </Text>
        </View>
        <View style={styles.tabIndicator}>
          <View
            style={[
              styles.tabProgress,
              { width: `${((step + 1) / 2) * 100}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderTokenList = () => (
    <View style={styles.listContainer}>
      {TOKEN_OPTIONS.map((token) => {
        const isActive = selectedToken?.id === token.id;
        return (
          <TouchableOpacity
            key={token.id}
            style={[styles.tokenRow, isActive && styles.tokenRowActive]}
            activeOpacity={0.7}
            onPress={() => setSelectedToken(token)}
          >
            <View style={styles.tokenIcon}>
              <View style={styles.iconCircle}>
                <Image source={token.icon} style={styles.tokenImage} />
              </View>
            </View>
            <Text style={styles.tokenLabel}>{token.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderContractInput = () => (
    <View style={styles.contractWrapper}>
      <TextInput
        style={styles.contractInput}
        placeholder="Contract address"
        placeholderTextColor="#a6a6a6"
        value={contractValue}
        onChangeText={setContractAddress}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryWrapper}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Contract address</Text>
        <Text style={styles.summaryValue}>{contractValue}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Token Name</Text>
        <Text style={styles.summaryValue}>{selectedToken?.name}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Token Symbol</Text>
        <Text style={styles.summaryValue}>{selectedToken?.symbol}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Digits</Text>
        <Text style={styles.summaryValue}>
          {selectedToken?.decimals ?? '18'}
        </Text>
      </View>
    </View>
  );

  const renderBody = () => {
    if (step === 0) {
      return (
        <>
          {renderTabs()}
          {renderTokenList()}
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          {renderTabs()}
          {renderContractInput()}
        </>
      );
    }

    return renderSummary();
  };

  return (
    <Dialog
      visible={visible}
      title={title}
      onClose={onClose}
      containerStyle={styles.dialogContainer}
      actions={[
        {
          label: step === 2 ? 'Add token' : 'Next',
          onPress: handlePrimaryAction,
          variant: 'primary',
        },
      ]}
    >
      {renderBody()}
    </Dialog>
  );
};

const styles = StyleSheet.create({
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
    fontSize: FONTS.size.medium,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.msmall,
    fontFamily: 'Roboto-Regular',
    color: '#b8b8b8',
  },
  summaryValue: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: '#121212',
  },
});


