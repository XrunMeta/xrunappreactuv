import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog } from './Dialog';
import { OptionButton } from './OptionButton';

const TYPE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Send', value: 'send' },
  { label: 'Receive', value: 'receive' },
] as const;

const RANGE_OPTIONS = [
  { label: '7 Days', value: '7d' },
  { label: '14 Days', value: '14d' },
  { label: '30 Days', value: '30d' },
] as const;

export type WalletFilterType = (typeof TYPE_OPTIONS)[number]['value'];
export type WalletFilterRange = (typeof RANGE_OPTIONS)[number]['value'];

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

  return (
    <Dialog
      visible={visible}
      title="Filter"
      onClose={onClose}
      actions={[
        { label: 'Reset', onPress: handleReset, variant: 'secondary' },
        { label: 'Confirm', onPress: handleConfirm, variant: 'primary' },
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


