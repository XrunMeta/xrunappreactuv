import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { COLORS, COMMON_STYLES, LIST_STYLES } from '../constants';
import { useAppNavigation, ROUTES } from '../navigation';
import { useAppContext } from '../context';
import { ClauseId } from '../types';

export const MyInfoClausesScreen = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useAppNavigation();
  const { setSelectedClauseId } = useAppContext();

  const handleSelect = (id: ClauseId) => {
    setSelectedClauseId(id);
    navigate(ROUTES.myInfoClauseDetail);
  };

  const clauses: { id: ClauseId; label: string }[] = [
    { id: 'service', label: t('screens.myInfoClauses.serviceClause') },
    { id: 'location', label: t('screens.myInfoClauses.locationClause') },
    { id: 'personal', label: t('screens.myInfoClauses.personalClause') },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('screens.myInfoClauses.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {clauses.map((clause) => (
            <TouchableOpacity
              key={clause.id}
              style={styles.card}
              onPress={() => handleSelect(clause.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.cardText}>{clause.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
  },
  scrollContent: {
    ...COMMON_STYLES.scrollContent,
  },
  inner: {
    ...LIST_STYLES.small,
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#3629b7',
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
});


