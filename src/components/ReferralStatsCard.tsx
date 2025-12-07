import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_7e4944, v_961e77 } from 'rcmrninabrnb';
import { v_5ade23 } from 'xbfwaaanosqvazmrqoah';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_1bfbd0, v_843035 } from '../constants';

interface ReferralStatsCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  helperText?: string;
  children?: v_a3453e.ReactNode;
  containerStyle?: v_961e77<v_7e4944>;
  icon?: keyof typeof v_25515d.glyphMap;
  iconColor?: string;
  gradientColors?: [string, string, ...string[]];
}

export const ReferralStatsCard: v_a3453e.FC<ReferralStatsCardProps> = ({
  title: v_9f1622,
  subtitle: v_dda473,
  value: v_3b402b,
  helperText: v_43fb35,
  children: v_21f619,
  containerStyle: v_4affe9,
  icon: v_9ddfab = 'trending-up',
  iconColor: v_ef160b = '#FFFFFF',
  gradientColors: v_291db0 = ['#6366F1', '#8B5CF6', '#A855F7'],
}) => {
  return (
    <View style={[v_d81136.card, v_4affe9]}>
      <LinearGradient
        colors={v_291db0}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={v_d81136.gradient}
      >
        {}
        <View style={v_d81136.backgroundIcon}>
          <Ionicons name={v_9ddfab} size={120} color={v_ef160b} style={v_d81136.iconStyle} />
        </View>

        {}
        <View style={v_d81136.content}>
          {(v_9f1622 && v_9f1622.trim()) || v_dda473 ? (
            <View style={v_d81136.titleRow}>
              <View style={v_d81136.titleLeft}>
                {v_9ddfab && (
                  <View style={v_d81136.iconContainer}>
                    <Ionicons name={v_9ddfab} size={20} color={v_ef160b} />
                  </View>
                )}
                {v_9f1622 && v_9f1622.trim() ? <Text style={v_d81136.title}>{v_9f1622}</Text> : null}
              </View>
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
      </LinearGradient>
    </View>
  );
};

const v_d81136 = v_472849.create({
  card: {
    width: '100%',
    maxWidth: 780,
    borderRadius: 28,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    height: 140,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 28,
    position: 'relative',
  },
  backgroundIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
    opacity: 0.15,
  },
  iconStyle: {
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: v_843035.size.msmall,
    fontFamily: 'Roboto-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: v_843035.size.small,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  value: {
    marginTop: 4,
    fontSize: v_843035.size.xxxlarge,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.8,
  },
  helper: {
    marginTop: 0,
    fontSize: v_843035.size.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto-Regular',
    opacity: 0.9,

  },
});

