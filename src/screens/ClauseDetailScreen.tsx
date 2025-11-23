import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_9dd03c } from '../types';

const clauseMap: Record<
  v_9dd03c,
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

export const v_5fdcb2 = () => {
  const { goBack: v_c7ac57 } = v_a0daa8();
  const { selectedClauseId: v_6e7459 } = v_700ef9();
  const v_b43b74 = v_f87e16[v_6e7459];

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_b43b74.title} onBackPress={v_c7ac57} showBackButton />
      <ScrollView contentContainerStyle={v_d81136.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={v_d81136.inner}>
          <Text style={v_d81136.updatedAt}>{v_b43b74.updatedAt}</Text>
          {v_b43b74.sections.map((v_b4fa6c) => (
            <View key={v_b4fa6c.heading} style={v_d81136.section}>
              <Text style={v_d81136.sectionHeading}>{v_b4fa6c.heading}</Text>
              <Text style={v_d81136.sectionBody}>{v_b4fa6c.body}</Text>
            </View>
          ))}
        </View>
        <View style={v_d81136.buttonRow}>
          <TouchableOpacity style={v_d81136.secondaryButton} activeOpacity={0.85} onPress={v_c7ac57}>
            <Text style={v_d81136.secondaryText}>Declined</Text>
          </TouchableOpacity>
          <TouchableOpacity style={v_d81136.primaryButton} activeOpacity={0.85} onPress={v_c7ac57}>
            <Text style={v_d81136.primaryText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: {
    flex: 1,
    backgroundColor: v_1bfbd0.background,
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


