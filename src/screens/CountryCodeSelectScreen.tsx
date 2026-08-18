import v_a3453e, { v_df9f57, v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_9cabcb,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_3094a2,
  v_39a996,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_ecee91, v_570c34, v_556baf } from '../components';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_1bfbd0, v_a61db3, v_202d44, v_52495e, v_843035, v_789afd, v_369014, v_1bd8ad } from '../constants';
import { v_da1883 } from '../types';
import { v_60f557, v_11e39e } from '../services';
import { v_151d5f, v_5c7129, v_107459 } from '../utils/countryUtils';
import { v_5401ae } from '../testIDs';

export const v_379bd1 = () => {
  console.log('CountryCodeSelectScreen');
  const { t: v_8d41d7, i18n: v_9c213b } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const {
    selectedCountryDialCode: v_459d5e,
    setSelectedCountryDialCode: v_f693e7,
    selectedRegion: v_2f03bc,
    setSelectedRegion: v_2f2d51,
    selectMode: v_479a37,
  } = v_700ef9();
  const [v_7c5791, v_c57190] = v_5ab095('');
  const [v_6c7bef, v_7a68da] = v_5ab095<v_da1883[]>(v_1bd8ad);
  const [v_e94fdf, v_59ad99] = v_5ab095<v_da1883[]>(v_52495e);
  const [v_cd31a8, v_deef62] = v_5ab095(false);

  const selectOption: v_da1883 = v_df9f57(() => ({
    iso2: 'select',
    name: v_8d41d7('screens.countryCodeSelect.selectOption') || '선택',
    dialCode: '0',
    flagEmoji: '📍',
    countryCode: 0,
  }), [v_8d41d7]);

  v_c4deb2(() => {
    if (v_479a37 === 'country') {
      const v_f9360f = async () => {
        v_deef62(true);
        try {
          const v_058836 = await v_151d5f(
            () => v_60f557(v_9b57fc),
            v_1bd8ad
          );
          v_7a68da(v_058836);
        } catch (v_5e9bfe) {
          console.error('[CountryCodeSelect] 국가 목록 로드 실패:', v_5e9bfe);
          v_7a68da(v_1bd8ad);
        } finally {
          v_deef62(false);
        }
      };
      v_f9360f();
    }
  }, [v_479a37, v_9b57fc]);

  v_c4deb2(() => {
    if (v_479a37 === 'region' && v_459d5e?.countryCode) {
      const v_969a8f = async () => {
        v_deef62(true);
        try {
          const result: v_107459 = await v_5c7129(
            (v_b9bbbd) => v_11e39e(v_b9bbbd, v_9b57fc),
            v_459d5e.countryCode || 0,
            v_459d5e.iso2,
            v_369014(v_459d5e.iso2)
          );
          console.log('[CountryCodeSelect] 지역 목록 로드 결과:', {
            hasRegions: v_43c42e.hasRegions,
            regionsLength: v_43c42e.regions.length,
            regions: v_43c42e.regions,
          });

          if (v_43c42e.regions.length > 0) {
            console.log('[CountryCodeSelect] 지역 목록 설정:', v_43c42e.regions.length, '개');
            v_59ad99(v_43c42e.regions);
          } else {
            console.log('[CountryCodeSelect] 지역 없음 - "선택" 옵션만 표시');
            v_59ad99([v_a35839]);
          }
        } catch (v_5e9bfe) {
          console.error('[CountryCodeSelect] 지역 목록 로드 실패:', v_5e9bfe);
          const v_80d56a = v_369014(v_459d5e.iso2);
          v_59ad99(v_80d56a);
        } finally {
          v_deef62(false);
        }
      };
      v_969a8f();
    } else if (v_479a37 === 'region') {

      v_59ad99(v_52495e);
    }
  }, [v_479a37, v_459d5e, v_9b57fc, v_a35839]);

  const v_980e13 = v_479a37 === 'region' ? v_e94fdf : v_6c7bef;

  const v_093bd4 = v_df9f57(() => {
    const v_43c42e = v_479a37 === 'region' ? [v_a35839, ...v_980e13] : v_980e13;
    if (__DEV__ && v_479a37 === 'region') {
      console.log('[CountryCodeSelect] dataSource 계산:', {
        selectMode: v_479a37,
        regionsLength: v_e94fdf.length,
        baseDataSourceLength: v_980e13.length,
        resultLength: v_43c42e.length,
        firstItem: v_43c42e[0],
        secondItem: v_43c42e[1],
      });
    }
    return v_43c42e;
  }, [v_479a37, v_a35839, v_980e13, v_e94fdf]);

  const v_c6e76b = v_479a37 === 'region' ? v_2f03bc : v_459d5e;

  const v_973c3e = v_df9f57(() => {
    let v_4622b9 = v_093bd4;

    if (v_7c5791.trim()) {
      const v_470e34 = v_7c5791.trim().toLowerCase();
      const v_5a09fa = v_470e34.replace(/[^0-9]/g, '');

      v_4622b9 = v_093bd4.filter((v_8c0b26) => {

        const v_cd2b74 = v_8c0b26.name.toLowerCase();

        let v_a2493c = '';
        if (v_479a37 === 'region') {

          const v_a4d981 = v_8c0b26.countryCode || 0;
          const v_222917 = parseInt((v_8c0b26.dialCode || '').replace('+', ''), 10);
          if (v_a4d981 > 0 && !isNaN(v_222917) && v_222917 > 0) {
            const v_9ad700 = [82, 81, 86, 1, 62];
            let v_b5249e;
            if (v_9ad700.includes(v_a4d981)) {
              v_b5249e = `regions.${v_a4d981}_${v_222917}`;
            } else {
              const v_1581b6 = v_8c0b26.name
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .replace(/\s+/g, '_')
                .toLowerCase();
              v_b5249e = `regions.${v_a4d981}_${v_1581b6}`;
            }
            const v_6dce25 = v_8d41d7(v_b5249e);
            if (v_6dce25 && v_6dce25 !== v_b5249e) {
              v_a2493c = v_6dce25.toLowerCase();
            }
          }
        } else {

          if (v_8c0b26.iso2 && v_8c0b26.iso2 !== 'select' && v_8c0b26.iso2 !== 'global' && v_8c0b26.iso2.length === 2) {
            const v_4d2349 = `countries.${v_8c0b26.iso2.toUpperCase()}`;
            const v_6dce25 = v_8d41d7(v_4d2349);
            if (v_6dce25 && v_6dce25 !== v_4d2349) {
              v_a2493c = v_6dce25.toLowerCase();
            }
          }
        }
        const v_73b9dc = v_8c0b26.iso2.toLowerCase();
        const v_62656e = v_8c0b26.dialCode.replace('+', '');

        return (
          v_cd2b74.includes(v_470e34) ||
          (v_a2493c && v_a2493c.includes(v_470e34)) ||
          v_73b9dc.includes(v_470e34) ||
          (v_5a09fa.length > 0 && v_62656e.startsWith(v_5a09fa))
        );
      });

      const v_bf5d8c = v_4622b9.some(v_8c0b26 => v_8c0b26.iso2 === 'select');
      if (!v_bf5d8c && (v_470e34.includes('선택') || v_470e34.includes('select'))) {
        v_4622b9 = [v_a35839, ...v_4622b9];
      }
    } else {

      if (v_479a37 === 'region' && v_4622b9[0]?.iso2 !== 'select') {
        v_4622b9 = [v_a35839, ...v_4622b9];
      }
    }

    if (__DEV__ && v_479a37 === 'region') {
      console.log('[CountryCodeSelect] filteredItems 계산:', {
        query: v_7c5791,
        dataSourceLength: v_093bd4.length,
        itemsLength: v_4622b9.length,
        firstItem: v_4622b9[0],
        secondItem: v_4622b9[1],
        language: v_9c213b.language,
      });
    }

    return v_4622b9;
  }, [v_7c5791, v_093bd4, v_479a37, v_a35839, v_8d41d7, v_9c213b.language]);

  const v_6121dc = (item: v_da1883) => {
    console.log('[국가선택] handleSelect 호출:', {
      selectMode: v_479a37,
      item: v_8c0b26,
      iso2: v_8c0b26.iso2,
      name: v_8c0b26.name,
      dialCode: v_8c0b26.dialCode,
    });

    if (v_479a37 === 'region') {
      console.log('[국가선택] 지역 모드 - setSelectedRegion 호출');
      v_2f2d51(v_8c0b26);
    } else {
      console.log('[국가선택] 국가 모드 - setSelectedCountryDialCode 호출 전:', {
        현재값: v_459d5e,
        새값: v_8c0b26,
      });
      v_f693e7(v_8c0b26);
      console.log('[국가선택] setSelectedCountryDialCode 호출 완료');
    }

    console.log('[국가선택] goBack() 호출 전');
    v_c7ac57();
    console.log('[국가선택] goBack() 호출 완료');
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
                <Text style={v_d81136.currentCountry}>
                  {(() => {

                    const v_e74520 = v_c6e76b.countryCode && v_c6e76b.dialCode && v_c6e76b.iso2 !== 'select' && v_c6e76b.iso2 !== 'global';
                    if (v_e74520) {
                      return v_c6e76b.name;
                    }

                    if (v_c6e76b.iso2 && v_c6e76b.iso2 !== 'select' && v_c6e76b.iso2 !== 'global' && v_c6e76b.iso2.length === 2) {
                      const v_4d2349 = `countries.${v_c6e76b.iso2.toUpperCase()}`;
                      const v_6dce25 = v_8d41d7(v_4d2349);
                      if (__DEV__ && v_9c213b.language === 'zh-CN') {
                        console.log('[CountryCodeSelectScreen] 현재 선택된 국가 번역:', {
                          iso2: v_c6e76b.iso2,
                          key: v_4d2349,
                          translated: v_6dce25,
                          original: v_c6e76b.name,
                          language: v_9c213b.language,
                        });
                      }
                      return v_6dce25 && v_6dce25 !== v_4d2349 ? v_6dce25 : v_c6e76b.name;
                    }
                    return v_c6e76b.name;
                  })()}
                </Text>
                {v_479a37 === 'country' && (
                  <Text style={v_d81136.currentDial}>{v_c6e76b.dialCode}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={v_d81136.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput testID={v_5401ae.countryCodeSelect.queryInput}
            style={v_d81136.searchInput}
            value={v_7c5791}
            onChangeText={v_c57190}
            placeholder={v_479a37 === 'region' ? v_8d41d7('screens.countryCodeSelect.regionSearchPlaceholder') : v_8d41d7('screens.countryCodeSelect.countrySearchPlaceholder')}
            placeholderTextColor="#c4c7d1"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {v_cd31a8 ? (
          <View style={v_d81136.loadingContainer}>
            <ActivityIndicator size="large" color={v_1bfbd0.buttonPrimary} />
          </View>
        ) : (
          <FlatList
            data={v_973c3e}
            keyExtractor={(v_8c0b26, v_a56041) => `${v_8c0b26.iso2}-${v_8c0b26.dialCode}-${v_8c0b26.name}-${v_a56041}`}
            renderItem={({ item: v_8c0b26 }) => (
              <CountryCodeListItem
                country={v_8c0b26}
                isSelected={v_8c0b26.iso2 === v_c6e76b?.iso2 && v_8c0b26.dialCode === v_c6e76b?.dialCode}
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
        )}
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
    fontSize: v_843035.size.msmall,
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
    fontSize: v_843035.size.xlarge,
  },
  currentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  currentCountry: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.headerText,
  },
  currentDial: {
    fontSize: v_843035.size.medium,
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
    fontSize: v_843035.size.lsmall,
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
    fontSize: v_843035.size.lsmall,
    color: '#9ca3af',
    fontFamily: 'Roboto-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

