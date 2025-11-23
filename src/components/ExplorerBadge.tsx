import v_a3453e from 'bapkr';
import {
  v_cf9c33,
  v_07a341,
  v_02846d,
  v_961e77,
  v_472849,
  v_19b633,
  v_5e8657,
  v_4623af,
  v_3094a2,
  v_7e4944,
} from 'rcmrninabrnb';

interface ExplorerBadgeProps {
  label: string;
  caption?: string;
  iconSource: v_07a341;
  onPress?: () => void;
  compact?: boolean;
  style?: v_961e77<v_7e4944>;
  labelStyle?: v_961e77<v_5e8657>;
  captionStyle?: v_961e77<v_5e8657>;
  iconStyle?: v_961e77<v_02846d>;
}

export const ExplorerBadge: v_a3453e.FC<ExplorerBadgeProps> = ({
  label: v_2869c1,
  caption: v_6044a8,
  iconSource: v_c1dd95,
  onPress: v_719eed,
  compact: v_c22a7a = false,
  style: v_7fa4e4,
  labelStyle: v_5ddb12,
  captionStyle: v_6f3000,
  iconStyle: v_2d9767,
}) => {
  const v_231753 = v_719eed ? v_4623af : v_3094a2;

  return (
    <Container
      style={[v_d81136.container, v_c22a7a && v_d81136.compactContainer, v_7fa4e4]}
      activeOpacity={0.8}
      onPress={v_719eed}
    >
      <Image
        source={v_c1dd95}
        style={[v_d81136.icon, v_c22a7a && v_d81136.compactIcon, v_2d9767]}
        resizeMode="contain"
      />
      <View style={v_d81136.textColumn}>
        <Text
          style={[v_d81136.label, v_c22a7a && v_d81136.compactLabel, v_5ddb12]}
          numberOfLines={1}
        >
          {v_2869c1}
        </Text>
        {v_6044a8 ? (
          <Text
            style={[
              v_d81136.caption,
              v_c22a7a && v_d81136.compactCaption,
              v_6f3000,
            ]}
            numberOfLines={1}
          >
            {v_6044a8}
          </Text>
        ) : null}
      </View>
    </Container>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  compactContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  compactIcon: {
    width: 18,
    height: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1a2e35',
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#5f6478',
  },
  compactLabel: {
    fontSize: 13,
    color: '#1f6880',
  },
  compactCaption: {
    fontSize: 11,
  },
  textColumn: {
    justifyContent: 'center',
  },
});


