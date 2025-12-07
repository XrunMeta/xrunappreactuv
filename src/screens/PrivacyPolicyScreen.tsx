import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { COLORS, COMMON_STYLES, FONTS } from '../constants';
import { useAppNavigation } from '../navigation';

const PRIVACY_TEXT = `
PRIVACY POLICY

1. What is Privacy Policy? XRUN LLC (hereinafter referred to as the "Company") collects, uses, and provides personal information based on the consent of users, and actively guarantees the rights of users (the right to self-determination of personal information). The Company complies with relevant laws and regulations on personal information protection and the guidelines of the Republic of Korea that must be complied with by information and communication service providers. "Personal Information Handling Policy" means the guidelines that must be followed by the company so that users can use the service with confidence by protecting their valuable personal information. This privacy policy applies to XRUN account-based services (hereinafter referred to as 'services') provided by the company.

2. Collection of personal information We collect the minimum personal information necessary to provide the service. [XRUN Account] Required email, password, name, contact information, service usage history. Selected gender, age, and region of residence. Some services may collect additional personal information with the user's consent in addition to the information usually collected by the 'XRUN account' to provide various special functions. The method of collecting personal information is as follows. In the case of collecting personal information, we shall notify users in advance and ask for their consent. When the user consents to the collection of personal information and directly enters the information in the process of membership registration and use of the service. When personal information is provided from the service or affiliated organization. Information generated during the process of using PC web and mobile web/apps (device info, IP, cookies, visit time, usage records) may be collected.

3. Use of personal information Used for member management, provision and improvement of services, and development of new services. Member identification, prevention of illegal use, handling inquiries/complaints, providing notifications, preventing actions that hinder service operation, customized content recommendations, statistics on service use, and improving privacy protection environments.

4. Provision of personal information XRUN does not provide the user's personal information to third parties, except in cases where there is separate consent from the user or as stipulated by laws and regulations. Personal information may be provided to third parties within the scope necessary for users to use external affiliate services after additional consent. Certain tasks may be entrusted to external companies to provide services; we manage and supervise entrusted companies to comply with related laws.

5. Destruction of personal information Personal information is destroyed without delay when the purpose of collection and use is achieved. Electronic files are securely deleted, and printed materials are shredded or incinerated. However, some information may be stored for up to one year after withdrawal to respond to inquiries or prevent misuse.

6. Others XRUN protects user rights. Users can view or correct their personal information at any time, and may withdraw consent for collection and use. Requests are handled promptly via the service settings or customer center. XRUN complies with GDPR when serving EU users; users may request data portability, refuse processing, or file complaints with authorities.

7. Contact If you have questions about personal information protection, contact:
Personal Information Protection Officer: Wonyong Jeung
Responsible Department: XRUN Lab
Email: oth-staff@example.invalid / Customer Center: xrun@xrun.com
You may also contact national privacy agencies (KISA, Supreme Prosecutors' Office, National Police Agency) for assistance.

Announcement Date: July 11, 2022 / Effective Date: July 11, 2022
`;

export const PrivacyPolicyScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();

  return (
    <View style={styles.container}>
      <Header title={t('screens.privacyPolicy.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} backgroundColor={"#f8f8f8"}>
        <View style={styles.card}>
          <Text style={styles.contentText}>{PRIVACY_TEXT}</Text>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  contentText: {
    fontSize: FONTS.size.small,
    lineHeight: 18,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },

});


