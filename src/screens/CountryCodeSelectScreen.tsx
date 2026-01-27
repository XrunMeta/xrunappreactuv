import React, { useMemo, useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, CountryCodeListItem, SafeScrollView, SafeView } from '../components';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { COLORS, COMMON_STYLES, COUNTRY_DIAL_CODES, REGIONS_AS_COUNTRY_DIAL_CODES, FONTS, GLOBAL_REGION, getRegionsByCountryIso2, ALLOWED_COUNTRIES } from '../constants';
import { CountryDialCode } from '../types';
import { getCountries, getRegionsByCountry } from '../services';
import { loadCountriesFromApi, loadRegionsFromApi, LoadRegionsResult } from '../utils/countryUtils';

export const CountryCodeSelectScreen = () => {
  console.log('CountryCodeSelectScreen');
  const { t, i18n } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const {
    selectedCountryDialCode,
    setSelectedCountryDialCode,
    selectedRegion,
    setSelectedRegion,
    selectMode,
  } = useAppContext();
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState<CountryDialCode[]>(ALLOWED_COUNTRIES);
  const [regions, setRegions] = useState<CountryDialCode[]>(REGIONS_AS_COUNTRY_DIAL_CODES);
  const [isLoading, setIsLoading] = useState(false);

  const selectOption: CountryDialCode = useMemo(() => ({
    iso2: 'select',
    name: t('screens.countryCodeSelect.selectOption') || '선택',
    dialCode: '0',
    flagEmoji: '📍',
    countryCode: 0,
  }), [t]);

  useEffect(() => {
    if (selectMode === 'country') {
      const loadCountries = async () => {
        setIsLoading(true);
        try {
          const loadedCountries = await loadCountriesFromApi(
            () => getCountries(navigate),
            ALLOWED_COUNTRIES
          );
          setCountries(loadedCountries);
        } catch (error) {
          console.error('[CountryCodeSelect] 국가 목록 로드 실패:', error);
          setCountries(ALLOWED_COUNTRIES);
        } finally {
          setIsLoading(false);
        }
      };
      loadCountries();
    }
  }, [selectMode, navigate]);

  useEffect(() => {
    if (selectMode === 'region' && selectedCountryDialCode?.countryCode) {
      const loadRegions = async () => {
        setIsLoading(true);
        try {
          const result: LoadRegionsResult = await loadRegionsFromApi(
            (country: number) => getRegionsByCountry(country, navigate),
            selectedCountryDialCode.countryCode || 0,
            getRegionsByCountryIso2(selectedCountryDialCode.iso2)
          );
          console.log('[CountryCodeSelect] 지역 목록 로드 결과:', {
            hasRegions: result.hasRegions,
            regionsLength: result.regions.length,
            regions: result.regions,
          });

          if (result.regions.length > 0) {
            console.log('[CountryCodeSelect] 지역 목록 설정:', result.regions.length, '개');
            setRegions(result.regions);
          } else {
            console.log('[CountryCodeSelect] 지역 없음 - "선택" 옵션만 표시');
            setRegions([selectOption]);
          }
        } catch (error) {
          console.error('[CountryCodeSelect] 지역 목록 로드 실패:', error);
          const fallbackRegions = getRegionsByCountryIso2(selectedCountryDialCode.iso2);
          setRegions(fallbackRegions);
        } finally {
          setIsLoading(false);
        }
      };
      loadRegions();
    } else if (selectMode === 'region') {

      setRegions(REGIONS_AS_COUNTRY_DIAL_CODES);
    }
  }, [selectMode, selectedCountryDialCode, navigate, selectOption]);

  const baseDataSource = selectMode === 'region' ? regions : countries;

  const dataSource = useMemo(() => {
    const result = selectMode === 'region' ? [selectOption, ...baseDataSource] : baseDataSource;
    if (__DEV__ && selectMode === 'region') {
      console.log('[CountryCodeSelect] dataSource 계산:', {
        selectMode,
        regionsLength: regions.length,
        baseDataSourceLength: baseDataSource.length,
        resultLength: result.length,
        firstItem: result[0],
        secondItem: result[1],
      });
    }
    return result;
  }, [selectMode, selectOption, baseDataSource, regions]);

  const selectedItem = selectMode === 'region' ? selectedRegion : selectedCountryDialCode;

  const filteredItems = useMemo(() => {
    let items = dataSource;

    if (query.trim()) {
      const normalizedQuery = query.trim().toLowerCase();
      const numericQuery = normalizedQuery.replace(/[^0-9]/g, '');

      items = dataSource.filter((item) => {

        const searchName = item.name.toLowerCase();

        let translatedName = '';
        if (item.iso2 && item.iso2 !== 'select' && item.iso2 !== 'global' && item.iso2.length === 2) {
          const countryKey = `countries.${item.iso2.toUpperCase()}`;
          const translated = t(countryKey);
          if (translated && translated !== countryKey) {
            translatedName = translated.toLowerCase();
          }
        }
        const searchIso = item.iso2.toLowerCase();
        const searchDial = item.dialCode.replace('+', '');

        return (
          searchName.includes(normalizedQuery) ||
          (translatedName && translatedName.includes(normalizedQuery)) ||
          searchIso.includes(normalizedQuery) ||
          (numericQuery.length > 0 && searchDial.startsWith(numericQuery))
        );
      });

      const hasSelectOption = items.some(item => item.iso2 === 'select');
      if (!hasSelectOption && (normalizedQuery.includes('선택') || normalizedQuery.includes('select'))) {
        items = [selectOption, ...items];
      }
    } else {

      if (selectMode === 'region' && items[0]?.iso2 !== 'select') {
        items = [selectOption, ...items];
      }
    }

    if (__DEV__ && selectMode === 'region') {
      console.log('[CountryCodeSelect] filteredItems 계산:', {
        query,
        dataSourceLength: dataSource.length,
        itemsLength: items.length,
        firstItem: items[0],
        secondItem: items[1],
        language: i18n.language,
      });
    }

    return items;
  }, [query, dataSource, selectMode, selectOption, t, i18n.language]);

  const handleSelect = (item: CountryDialCode) => {
    console.log('[국가선택] handleSelect 호출:', {
      selectMode,
      item,
      iso2: item.iso2,
      name: item.name,
      dialCode: item.dialCode,
    });

    if (selectMode === 'region') {
      console.log('[국가선택] 지역 모드 - setSelectedRegion 호출');
      setSelectedRegion(item);
    } else {
      console.log('[국가선택] 국가 모드 - setSelectedCountryDialCode 호출 전:', {
        현재값: selectedCountryDialCode,
        새값: item,
      });
      setSelectedCountryDialCode(item);
      console.log('[국가선택] setSelectedCountryDialCode 호출 완료');
    }

    console.log('[국가선택] goBack() 호출 전');
    goBack();
    console.log('[국가선택] goBack() 호출 완료');
  };

  return (
    <SafeView style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title={selectMode === 'region' ? t('screens.countryCodeSelect.regionSelectTitle') : t('screens.countryCodeSelect.countrySelectTitle')}
        showBackButton
        onBackPress={goBack}
      />
      <View style={styles.content}>
        {selectedItem && (
          <View style={styles.currentSection}>
            <Text style={styles.sectionLabel}>{t('screens.countryCodeSelect.currentSelection')}</Text>
            <View style={styles.currentCard}>
              <View style={styles.flagCircle}>
                <Text style={styles.flagEmoji}>{selectedItem.flagEmoji}</Text>
              </View>
              <View style={styles.currentInfo}>
                <Text style={styles.currentCountry}>
                  {(() => {

                    const isRegion = selectedItem.countryCode && selectedItem.dialCode && selectedItem.iso2 !== 'select' && selectedItem.iso2 !== 'global';
                    if (isRegion) {
                      return selectedItem.name;
                    }

                    if (selectedItem.iso2 && selectedItem.iso2 !== 'select' && selectedItem.iso2 !== 'global' && selectedItem.iso2.length === 2) {
                      const countryKey = `countries.${selectedItem.iso2.toUpperCase()}`;
                      const translated = t(countryKey);
                      if (__DEV__ && i18n.language === 'zh-CN') {
                        console.log('[CountryCodeSelectScreen] 현재 선택된 국가 번역:', {
                          iso2: selectedItem.iso2,
                          key: countryKey,
                          translated,
                          original: selectedItem.name,
                          language: i18n.language,
                        });
                      }
                      return translated && translated !== countryKey ? translated : selectedItem.name;
                    }
                    return selectedItem.name;
                  })()}
                </Text>
                {selectMode === 'country' && (
                  <Text style={styles.currentDial}>{selectedItem.dialCode}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={selectMode === 'region' ? t('screens.countryCodeSelect.regionSearchPlaceholder') : t('screens.countryCodeSelect.countrySearchPlaceholder')}
            placeholderTextColor="#c4c7d1"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.buttonPrimary} />
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `${item.iso2}-${item.dialCode}-${item.name}-${index}`}
            renderItem={({ item }) => (
              <CountryCodeListItem
                country={item}
                isSelected={item.iso2 === selectedItem?.iso2 && item.dialCode === selectedItem?.dialCode}
                onPress={handleSelect}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t('screens.countryCodeSelect.noResults')}</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  content: {
    flex: 1,
    ...COMMON_STYLES.scrollContent,
  },
  currentSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: FONTS.size.msmall,
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
    fontSize: FONTS.size.xlarge,
  },
  currentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  currentCountry: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  currentDial: {
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
    color: COLORS.buttonPrimary,
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
    fontSize: FONTS.size.lsmall,
    fontFamily: 'Roboto-Medium',
    color: COLORS.headerText,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.lsmall,
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

