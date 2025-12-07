import v_a3453e, { v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_9cabcb,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_ecee91, v_570c34, v_556baf } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0, v_a61db3, v_202d44, v_52495e, v_843035 } from '../constants';
import { v_da1883 } from '../types';

export const v_379bd1 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57 } = v_a0daa8();
  const {
    selectedCountryDialCode: v_459d5e,
    setSelectedCountryDialCode: v_f693e7,
    selectedRegion: v_2f03bc,
    setSelectedRegion: v_2f2d51,
    selectMode: v_479a37,
  } = v_700ef9();
  const [v_7c5791, v_c57190] = v_5ab095('');

  const v_093bd4 = v_479a37 === 'region' ? v_52495e : v_202d44;
  const v_c6e76b = v_479a37 === 'region' ? v_2f03bc : v_459d5e;

  const v_973c3e = v_df9f57(() => {
    if (!v_7c5791.trim()) {
      return v_093bd4;
    }

    const v_470e34 = v_7c5791.trim().toLowerCase();
    const v_5a09fa = v_470e34.replace(/[^0-9]/g, '');

    return v_093bd4.filter((v_8c0b26) => {
      const v_cd2b74 = v_8c0b26.name.toLowerCase();
      const v_73b9dc = v_8c0b26.iso2.toLowerCase();
      const v_62656e = v_8c0b26.dialCode.replace('+', '');

      return (
        v_cd2b74.includes(v_470e34) ||
        v_73b9dc.includes(v_470e34) ||
        (v_5a09fa.length > 0 && v_62656e.startsWith(v_5a09fa))
      );
    });
  }, [v_7c5791, v_093bd4]);

  const v_6121dc = (item: v_da1883) => {
    if (v_479a37 === 'region') {
      v_2f2d51(v_8c0b26);
    } else {
      v_f693e7(v_8c0b26);
    }
    v_c7ac57();
  };

  return (
    <SafeView style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title={v_479a37 === 'region' ? v_8d41d7('screens.countryCodeSelect.regionSelectTitle') : v_8d41d7('screens.countryCodeSelect.countrySelectTitle')}
        showBackButton
        onBackPress={v_c7ac57}
      />
      <View style={v_d81136.content}>
        {v_c6e76b && (
          <View style={v_d81136.currentSection}>
            <Text style={v_d81136.sectionLabel}>{v_8d41d7('screens.countryCodeSelect.currentSelection')}</Text>
            <View style={v_d81136.currentCard}>
              <View style={v_d81136.flagCircle}>
                <Text style={v_d81136.flagEmoji}>{v_c6e76b.flagEmoji}</Text>
              </View>
              <View style={v_d81136.currentInfo}>
                <Text style={v_d81136.currentCountry}>{v_c6e76b.name}</Text>
                {v_479a37 === 'country' && (
                  <Text style={v_d81136.currentDial}>{v_c6e76b.dialCode}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={v_d81136.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={v_d81136.searchInput}
            value={v_7c5791}
            onChangeText={v_c57190}
            placeholder={v_479a37 === 'region' ? v_8d41d7('screens.countryCodeSelect.regionSearchPlaceholder') : v_8d41d7('screens.countryCodeSelect.countrySearchPlaceholder')}
            placeholderTextColor="#c4c7d1"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={v_973c3e}
          keyExtractor={(v_8c0b26) => v_8c0b26.iso2}
          renderItem={({ item: v_8c0b26 }) => (
            <CountryCodeListItem
              country={v_8c0b26}
              isSelected={v_8c0b26.iso2 === v_c6e76b?.iso2}
              onPress={v_6121dc}
            />
          )}
          contentContainerStyle={v_d81136.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={v_d81136.emptyState}>
              <Text style={v_d81136.emptyText}>{v_8d41d7('screens.countryCodeSelect.noResults')}</Text>
            </View>
          }
        />
      </View>
    </SafeView>
  );
};

const v_d81136 = v_472849.create({
  container: {
    ...v_a61db3.container,
  },
  content: {
    flex: 1,
    ...v_a61db3.scrollContent,
  },
  currentSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: v_843035.fontSize.msmall,
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
    fontSize: v_843035.fontSize.xlarge,
  },
  currentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  currentCountry: {
    fontSize: v_843035.fontSize.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  currentDial: {
    fontSize: v_843035.fontSize.medium,
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
    fontSize: v_843035.fontSize.lsmall,
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
    fontSize: v_843035.fontSize.lsmall,
    color: '#9ca3af',
    fontFamily: 'Roboto-Regular',
  },
});

