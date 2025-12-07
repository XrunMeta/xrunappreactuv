import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Region } from '../constants/regions';
import { COLORS, FONTS } from '../constants';

type Props = {
  region: Region;
  isSelected?: boolean;
  onPress?: (region: Region) => void;
};

export const RegionListItem: React.FC<Props> = ({
  region,
  isSelected = false,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(region)}
    >
      <View style={styles.iconBadge}>
        <Text style={styles.iconText}>📍</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.regionName}>{region.name}</Text>
        <Text style={styles.regionNameEn}>{region.nameEn}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selected: {
    borderColor: COLORS.buttonPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  regionName: {
    fontSize: FONTS.fontSize.medium,
    color: COLORS.headerText,
    fontFamily: 'Roboto-Medium',
  },
  regionNameEn: {
    fontSize: FONTS.fontSize.small,
    color: '#8e9bae',
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
  },
});

