import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_7e4944, v_961e77 } from 'rcmrninabrnb';
import { v_1bfbd0, v_9b1a04 } from '../constants';

interface ReferralStatsCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  helperText?: string;
  children?: v_a3453e.ReactNode;
  containerStyle?: v_961e77<v_7e4944>;
}

export const ReferralStatsCard: v_a3453e.FC<ReferralStatsCardProps> = ({
  title: v_9f1622,
  subtitle: v_dda473,
  value: v_3b402b,
  helperText: v_43fb35,
  children: v_21f619,
  containerStyle: v_4affe9,
}) => {
  return (
    <View style={[v_d81136.card, v_4affe9]}>
      {(v_9f1622 && v_9f1622.trim()) || v_dda473 ? (
        <View style={v_d81136.titleRow}>
          {v_9f1622 && v_9f1622.trim() ? <Text style={v_d81136.title}>{v_9f1622}</Text> : null}
          {v_dda473 ? <Text style={v_d81136.subtitle}>{v_dda473}</Text> : null}
        </View>
      ) : null}
      {v_21f619 ? (
        v_21f619
      ) : (
        <>
          {v_3b402b ? <Text style={v_d81136.value}>{v_3b402b}</Text> : null}
          {v_43fb35 && v_43fb35.trim() ? <Text style={v_d81136.helper}>{v_43fb35}</Text> : null}
        </>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  card: {
    width: '100%',
    maxWidth: 780,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#2F7389',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    height: 120,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#EBF6FF',
  },
  subtitle: {
    fontSize: 12,
    color: '#D6E6EE',
    fontFamily: 'Roboto-Medium',
  },
  value: {
    marginTop: 4,
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.background,
  },
  helper: {
    marginTop: 4,
    fontSize: v_9b1a04.small,
    color: '#D6E6EE',
    fontFamily: 'Roboto-Regular',
  },
});


