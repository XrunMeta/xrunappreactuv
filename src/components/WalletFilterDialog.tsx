import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Dialog } from './Dialog';
import { OptionButton } from './OptionButton';

export type WalletFilterType = 'all' | 'send' | 'receive';
export type WalletFilterRange = '7d' | '14d' | '30d';

interface WalletFilterDialogProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (selection: { type: WalletFilterType; range: WalletFilterRange }) => void;
  defaultType?: WalletFilterType;
  defaultRange?: WalletFilterRange;
}

export const WalletFilterDialog: React.FC<WalletFilterDialogProps> = ({
  visible,
  onClose,
  onApply,
  defaultType = 'all',
  defaultRange = '7d',
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState<WalletFilterType>(defaultType);
  const [range, setRange] = useState<WalletFilterRange>(defaultRange);

  useEffect(() => {
    setType(defaultType);
    setRange(defaultRange);
  }, [defaultType, defaultRange, visible]);

  const handleReset = () => {
    setType('all');
    setRange('7d');
    onApply?.({ type: 'all', range: '7d' });
    onClose();
  };

  const handleConfirm = () => {
    onApply?.({ type, range });
    onClose();
  };

  const TYPE_OPTIONS = [
    { label: t('components.walletFilterDialog.all'), value: 'all' as const },
    { label: t('components.walletFilterDialog.send'), value: 'send' as const },
    { label: t('components.walletFilterDialog.receive'), value: 'receive' as const },
  ];

  const RANGE_OPTIONS = [
    { label: t('components.walletFilterDialog.days7'), value: '7d' as const },
    { label: t('components.walletFilterDialog.days14'), value: '14d' as const },
    { label: t('components.walletFilterDialog.days30'), value: '30d' as const },
  ];

  return (
    <Dialog
      visible={visible}
      title={t('components.walletFilterDialog.title')}
      onClose={onClose}
      actions={[
        { label: t('components.walletFilterDialog.reset'), onPress: handleReset, variant: 'secondary' },
        { label: t('components.walletFilterDialog.confirm'), onPress: handleConfirm, variant: 'primary' },
      ]}
      containerStyle={styles.dialogCard}
    >
      <View style={styles.group}>
        {TYPE_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={type === option.value}
            onPress={() => setType(option.value)}
            flex={1}
            style={styles.optionButton}
          />
        ))}
      </View>

      <View style={styles.group}>
        {RANGE_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={range === option.value}
            onPress={() => setRange(option.value)}
            flex={1}
            style={styles.optionButton}
          />
        ))}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogCard: {
    width: '100%',
    maxWidth: 343,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    marginRight: 8,
  },
});

