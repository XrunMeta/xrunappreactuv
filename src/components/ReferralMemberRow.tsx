import React from 'react';
import { SIZES } from '../constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { COLORS, FONTS } from '../constants';

interface ReferralMemberRowProps {
  rank?: number | string;
  email: string;
  date?: string;
  description?: string;
  valueText?: string;
  highlight?: boolean;
  hideHighlightBorder?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export const ReferralMemberRow: React.FC<ReferralMemberRowProps> = ({
  rank,
  email,
  date,
  description,
  valueText,
  highlight,
  hideHighlightBorder = false,
  onPress,
}) => {

  const shouldShowHighlight = highlight === true && hideHighlightBorder !== true;

  return (
    <TouchableOpacity
      style={[styles.container, shouldShowHighlight && styles.highlight]}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {typeof rank !== 'undefined' ? (
        <Text style={styles.rank}>{rank}</Text>
      ) : (
        <View style={styles.rankPlaceholder} />
      )}
      <View style={styles.infoColumn}>
        <Text style={styles.email}>{email}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <View style={styles.metaColumn}>
        {date ? <Text style={styles.date}>{date}</Text> : null}
        {valueText ? <Text style={styles.value}>{valueText}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.large,
    borderRadius: SIZES.small,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: SIZES.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ededed',
    marginBottom: SIZES.xsmall,
    gap: SIZES.small,
  },

  highlight: {
    borderWidth: 1,
    borderColor: '#ffdc04',
    shadowOpacity: 0,
    elevation: 0,
  },
  rank: {
    width: 28,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: COLORS.white,
    backgroundColor: COLORS.info,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  rankPlaceholder: {
    width: 28,
  },
  infoColumn: {
    flex: 1,
  },
  email: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-medium',
    color: '#343434',
  },
  description: {
    marginTop: 4,
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-medium',
    color: '#979797',
  },
  metaColumn: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: FONTS.size.small,
    fontFamily: 'Roboto-medium',
    color: '#707070',
  },
  value: {
    marginTop: 4,
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-SemiBold',
    color: '#1f6880',
  },
});

