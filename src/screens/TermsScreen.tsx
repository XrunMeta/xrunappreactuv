import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { SafeScrollView } from '../components';
import { useTranslation } from 'react-i18next';
import { Header } from '../components';
import { useAppNavigation } from '../navigation';
import { COMMON_STYLES } from '../constants';

const TERMS_TEXT = `
XRUN Location-Based Service Terms and Conditions

Article 1 (Purpose)
These terms and conditions relate to the rights, obligations, and responsibilities between the company and the subject of personal location information (hereinafter referred to as "user") using location-based services for location-based services provided by XRUN LLC (hereinafter referred to as "Company"), for the purpose of regulating other necessary matters.

Article 2 (Effect and Changes to Terms of Use)
1. These terms and conditions apply when the user agrees to these terms and conditions and registers as a user of location-based services in accordance with the procedures established by the company.
2. The company may change the terms and conditions for the purpose of reflecting changes in laws or location-based services.
3. If the terms and conditions are changed, the company will post the changes at least 7 days in advance through other notification pages such as the company's website.
4. However, if there is a significant change in user rights, the revised content will be posted 30 days in advance.

Article 3 (Rules other than terms and conditions)
For matters not specified in these terms and conditions, relevant laws such as the Act on Protection and Use of Location Information, the Telecommunications Business Act, the Act on Promotion and Protection of Information and Utilization of Communications Networks, etc. and guidelines set by the company, etc. follow the rules.

Article 4 (Service Content)
The company provides the following location-based services by using the user's current location or the area containing the current location collected directly or from a location information service provider.
1. Providing or recommending information search results and content using location information
2. Location sharing for convenience, location/region-based notifications, route guidance
3. Content tagging for location-based content classification (Geotagging)
4. Location-based special advertising

Article 5 (Service usage fees)
Location-based services provided by the company are free of charge. However, data communication charges incurred when using wireless services are separate, and follow the policies of each mobile operator to which the user subscribes.

Article 6 (Restriction and Suspension of Use of Services)
1. The Company may restrict, change, or suspend all or part of the location-based services if it is unable to maintain the location-based services due to various circumstances or legal reasons, such as changes in the provider's location-based service policy.
2. However, in the event of termination of the location-based services in accordance with the above clause, the Company shall notify the User in advance through another notification page such as the Company's website.

Article 7 (Rights of Subjects of Personal Location Information)
1. Users may withhold all or part of their consent to the collection, use, and provision of personal location information at any time.
2. Users may withdraw all or part of their consent to the collection, use, and provision of personal location information at any time. In this case, the Company shall destroy the personal location information within the withdrawn range and the data confirming the collection, use, and provision of location information without delay.
3. Users may request a temporary suspension of the collection, use, and provision of personal location information, in which case, the Company shall not refuse it and shall provide technical means to comply.
4. Users may request the company to view or notify the materials confirming the collection, use, and provision of location information, and may request corrections where necessary.

Article 8 (Use or provision of personal location information)
When the company uses personal location information to provide location-based services, the company will be notified in these terms and conditions and consent will be obtained. The company shall not provide personal location information to a third party without the user's consent, and in the case of providing it to a third party, the recipient and purpose of the provision shall be notified to the user in advance and consent will be obtained.

Article 9 (Legal Representative Rights)
For users under the age of 14, the company must obtain the consent of the user and the user's legal representative for the provision of location-based services using personal location information and the provision of personal location information to third parties.

Article 10 (Rights of the person responsible for protecting the consent of children under the age of 8)
If the protector consents to the use or provision of personal location information for children under the age of 8, he/she has all user rights under Article 7 of these Terms and Conditions.

Article 11 (Compensation)
If the user has suffered damage due to acts that violate Articles 15 and 26 of the Law on Protection and Use of Corporate Location Information, the user may claim compensation from the Company.

Article 12 (Limitation of Liability)
The Company shall not be liable for any damages incurred by the user if the location-based service cannot be provided in cases such as natural disasters, actions of third parties, or reasons attributable to the user.

Article 13 (Dispute Resolution)
1. The Company faithfully consults with users to resolve disputes related to location information.
2. If the dispute is not resolved, the Company and the user may apply for mediation to the Korea Communications Commission or the Personal Information Dispute Mediation Committee.

Article 14 (Company Address and Contact Information)
Company Name: XRUN
Representative: Bob Kwon
Address: First Floor, First St. Vincent Bank Ltd Building, James Street, Kingstown, St. Vincent and the Grenadines P.O. Box 1574
email: xrun@xrun.com
*Addendum Article 1 (Effective Date) These Terms and Conditions are effective as of July 11, 2022.
`;

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useAppNavigation();

  return (
    <View style={styles.container}>
      <Header title={t('screens.terms.title')} onBackPress={goBack} showBackButton />
      <SafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.contentText}>{TERMS_TEXT}</Text>
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
    fontSize: 12,
    lineHeight: 18,
    color: '#4c4e55',
    fontFamily: 'Roboto-Regular',
  },
});


