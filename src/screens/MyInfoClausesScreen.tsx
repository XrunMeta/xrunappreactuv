import v_a3453e from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_122070, v_4623af } from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_729608 } from '../components';
import { v_1bfbd0 } from '../constants';
import { v_a0daa8, v_ce4741 } from '../navigation';
import { v_700ef9 } from '../context';
import { v_9dd03c } from '../types';

export const v_41dfd5 = () => {
  const { t: v_8d41d7 } = v_772971();
  const { goBack: v_c7ac57, navigate: v_9b57fc } = v_a0daa8();
  const { setSelectedClauseId: v_48a083 } = v_700ef9();

  const v_6121dc = (id: v_9dd03c) => {
    v_48a083(v_389afb);
    v_9b57fc(v_ce4741.myInfoClauseDetail);
  };

  const clauses: { id: v_9dd03c; label: string }[] = [
    { id: 'service', label: v_8d41d7('screens.myInfoClauses.serviceClause') },
    { id: 'location', label: v_8d41d7('screens.myInfoClauses.locationClause') },
    { id: 'personal', label: v_8d41d7('screens.myInfoClauses.personalClause') },
  ];

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header title={v_8d41d7('screens.myInfoClauses.title')} onBackPress={v_c7ac57} showBackButton />
      <ScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={v_d81136.inner}>
          {v_ec67b4.map((v_1b50c3) => (
            <TouchableOpacity
              key={v_1b50c3.id}
              style={v_d81136.card}
              onPress={() => v_6121dc(v_1b50c3.id)}
              activeOpacity={0.85}
            >
              <Text style={v_d81136.cardText}>{v_1b50c3.label}</Text>
            </TouchableOpacity>
          ))}
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    gap: 16,
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
    fontSize: 12,
    fontFamily: 'Roboto-SemiBold',
    color: '#343434',
  },
});


