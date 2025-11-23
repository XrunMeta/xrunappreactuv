import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { COLORS } from '../constants';

interface ReferralMemberRowProps {
  rank?: number | string;
  email: string;
  date?: string;
  description?: string;
  valueText?: string;
  highlight?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export const ReferralMemberRow: React.FC<ReferralMemberRowProps> = ({
  rank,
  email,
  date,
  description,
  valueText,
  highlight,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, highlight && styles.highlight]}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    marginBottom: 14,
  },
  highlight: {
    borderWidth: 1,
    borderColor: '#ffdc04',
    shadowOpacity: 0,
    elevation: 0,
  },
  rank: {
    width: 28,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  rankPlaceholder: {
    width: 28,
  },
  infoColumn: {
    flex: 1,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#979797',
  },
  metaColumn: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
    color: '#707070',
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    fontFamily: 'Roboto-SemiBold',
    color: '#1f6880',
  },
});


