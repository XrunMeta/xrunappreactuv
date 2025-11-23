import v_a3453e, { v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_9cabcb,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_ecee91 } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0, v_202d44 } from '../constants';
import { v_da1883 } from '../types';

export const v_379bd1 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { selectedCountryDialCode: v_459d5e, setSelectedCountryDialCode: v_f693e7 } = v_700ef9();
  const [v_7c5791, v_c57190] = v_5ab095('');

  const v_daa71c = v_df9f57(() => {
    if (!v_7c5791.trim()) {
      return v_202d44;
    }

    const v_470e34 = v_7c5791.trim().toLowerCase();
    const v_5a09fa = v_470e34.replace(/[^0-9]/g, '');

    return v_202d44.filter((v_b9bbbd) => {
      const v_cd2b74 = v_b9bbbd.name.toLowerCase();
      const v_73b9dc = v_b9bbbd.iso2.toLowerCase();
      const v_62656e = v_b9bbbd.dialCode.replace('+', '');

      return (
        v_cd2b74.includes(v_470e34) ||
        v_73b9dc.includes(v_470e34) ||
        (v_5a09fa.length > 0 && v_62656e.startsWith(v_5a09fa))
      );
    });
  }, [v_7c5791]);

  const v_6121dc = (country: v_da1883) => {
    v_f693e7(v_b9bbbd);
    v_c7ac57();
  };

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title="국가 선택" showBackButton onBackPress={v_c7ac57} />
      <View style={v_d81136.content}>
        <View style={v_d81136.currentSection}>
          <Text style={v_d81136.sectionLabel}>현재 위치</Text>
          <View style={v_d81136.currentCard}>
            <View style={v_d81136.flagCircle}>
              <Text style={v_d81136.flagEmoji}>{v_459d5e.flagEmoji}</Text>
            </View>
            <View style={v_d81136.currentInfo}>
              <Text style={v_d81136.currentCountry}>{v_459d5e.name}</Text>
              <Text style={v_d81136.currentDial}>{v_459d5e.dialCode}</Text>
            </View>
          </View>
        </View>

        <View style={v_d81136.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={v_d81136.searchInput}
            value={v_7c5791}
            onChangeText={v_c57190}
            placeholder="국가를 검색하세요"
            placeholderTextColor="#c4c7d1"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={v_daa71c}
          keyExtractor={(v_8c0b26) => v_8c0b26.iso2}
          renderItem={({ item: v_8c0b26 }) => (
            <CountryCodeListItem
              country={v_8c0b26}
              isSelected={v_8c0b26.iso2 === v_459d5e.iso2}
              onPress={v_6121dc}
            />
          )}
          contentContainerStyle={v_d81136.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={v_d81136.emptyState}>
              <Text style={v_d81136.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  currentSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
    fontFamily: 'Roboto-Medium',
  },
  currentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f9fafc',
  },
  flagCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 24,
  },
  currentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  currentCountry: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  currentDial: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.buttonPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f2f4f7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
    fontFamily: 'Roboto-Regular',
  },
});

