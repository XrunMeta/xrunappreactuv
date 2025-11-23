import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components';
import { COLORS } from '../constants';
import { useAppNavigation } from '../navigation';
import { useAppContext } from '../context';
import { ClauseId } from '../types';

const clauseMap: Record<
  ClauseId,
  { title: string; updatedAt: string; sections: { heading: string; body: string }[] }
> = {
  service: {
    title: 'Terms of Service',
    updatedAt: 'Last update on August 2021',
    sections: [
      {
        heading: 'Terms',
        body:
          'Lorem ipsum dolor sit amet, consectetur adip ielit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent facilisis leo.',
      },
      {
        heading: 'Use License',
        body:
          'Adipiscing tempus feugiat viverra iaculis modo quisque dictum quis tellus. Odio et a ac pretium nulla pharetra in. Cursus aenean condimentum volutpat ullamcorper eu, feugiat sed massa.',
      },
    ],
  },
  location: {
    title: 'Personal Location Information',
    updatedAt: 'Last update on August 2021',
    sections: [
      {
        heading: 'Collection',
        body:
          'We collect location data to enhance XRUN experiences. Data is stored securely and used only for gameplay features described in this document.',
      },
      {
        heading: 'Usage',
        body:
          'Location information is never shared with third parties and can be deleted at any time through account settings.',
      },
    ],
  },
  personal: {
    title: 'Personal Information Usage',
    updatedAt: 'Last update on August 2021',
    sections: [
      {
        heading: 'Scope',
        body:
          'We process essential profile details (name, email, wallet) to provide membership and wallet services.',
      },
      {
        heading: 'Retention',
        body:
          'Information is retained only while the account is active or as required by local regulations. You may request deletion at any time.',
      },
    ],
  },
};

export const ClauseDetailScreen = () => {
  const { goBack } = useAppNavigation();
  const { selectedClauseId } = useAppContext();
  const content = clauseMap[selectedClauseId];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={content.title} onBackPress={goBack} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={styles.updatedAt}>{content.updatedAt}</Text>
          {content.sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={goBack}>
            <Text style={styles.secondaryText}>Declined</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={goBack}>
            <Text style={styles.primaryText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  updatedAt: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#8e9bae',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#10192d',
    marginBottom: 12,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
    color: '#8e9bae',
  },
  buttonRow: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e6ed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343a5a',
  },
  secondaryText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#10192d',
  },
  primaryText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
});


