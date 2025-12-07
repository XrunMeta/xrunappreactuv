import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header, CountryCodeListItem, SafeScrollView, SafeView } from '../components';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { COLORS, COMMON_STYLES, COUNTRY_DIAL_CODES, REGIONS_AS_COUNTRY_DIAL_CODES, FONTS } from '../constants';
import { CountryDialCode } from '../types';

export const CountryCodeSelectScreen = () => {
  console.log('CountryCodeSelectScreen');
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();
  const {
    selectedCountryDialCode,
    setSelectedCountryDialCode,
    selectedRegion,
    setSelectedRegion,
    selectMode,
  } = useAppContext();
  const [query, setQuery] = useState('');

  const dataSource = selectMode === 'region' ? REGIONS_AS_COUNTRY_DIAL_CODES : COUNTRY_DIAL_CODES;
  const selectedItem = selectMode === 'region' ? selectedRegion : selectedCountryDialCode;

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return dataSource;
    }

    const normalizedQuery = query.trim().toLowerCase();
    const numericQuery = normalizedQuery.replace(/[^0-9]/g, '');

    return dataSource.filter((item) => {
      const searchName = item.name.toLowerCase();
      const searchIso = item.iso2.toLowerCase();
      const searchDial = item.dialCode.replace('+', '');

      return (
        searchName.includes(normalizedQuery) ||
        searchIso.includes(normalizedQuery) ||
        (numericQuery.length > 0 && searchDial.startsWith(numericQuery))
      );
    });
  }, [query, dataSource]);

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
                <Text style={styles.currentCountry}>{selectedItem.name}</Text>
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

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.iso2}
          renderItem={({ item }) => (
            <CountryCodeListItem
              country={item}
              isSelected={item.iso2 === selectedItem?.iso2}
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
});

