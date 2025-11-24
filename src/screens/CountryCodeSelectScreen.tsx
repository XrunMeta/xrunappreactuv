import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, CountryCodeListItem } from '../components';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { COLORS, COUNTRY_DIAL_CODES, REGIONS_AS_COUNTRY_DIAL_CODES } from '../constants';
import { CountryDialCode } from '../types';

export const CountryCodeSelectScreen = () => {
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
    if (selectMode === 'region') {
      setSelectedRegion(item);
    } else {
      setSelectedCountryDialCode(item);
    }
    goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        title={selectMode === 'region' ? '지역 선택' : '국가 선택'}
        showBackButton
        onBackPress={goBack}
      />
      <View style={styles.content}>
        {selectedItem && (
          <View style={styles.currentSection}>
            <Text style={styles.sectionLabel}>현재 선택</Text>
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
            placeholder={selectMode === 'region' ? '지역을 검색하세요' : '국가를 검색하세요'}
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
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.headerText,
  },
  currentDial: {
    fontSize: 16,
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
    fontSize: 15,
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
    fontSize: 15,
    color: '#9ca3af',
    fontFamily: 'Roboto-Regular',
  },
});

