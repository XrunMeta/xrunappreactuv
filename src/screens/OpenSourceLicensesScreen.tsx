

import v_a3453e, { v_df9f57, v_5ab095 } from 'bapkr';
import {
  v_94c965,
  v_f2c756,
  v_326be8,
  v_472849,
  v_19b633,
  v_79c4f2,
  v_4623af,
  v_3094a2,
} from 'rcmrninabrnb';
import { v_b5df25 } from 'ernurodqvmtspux';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_729608, v_570c34 } from '../components';
import { v_1bfbd0, v_a61db3, v_704d15 } from '../constants';
import {
  v_00f7e1,
  v_681165,
  v_8bf970,
  v_7851c5,
  type v_5b8d8d,
} from '../constants/licenseData';

export const v_e44da0 = () => {
  const { t: v_8d41d7 } = v_772971();
  const [v_7c5791, v_c57190] = v_5ab095('');
  const [v_591400, v_e97413] = v_5ab095<number | null>(null);

  const v_946c09 = v_df9f57(() => v_00f7e1(v_7c5791), [v_7c5791]);

  const v_0ab8c5 = (v_a56041) => {
    v_94c965.configureNext(v_94c965.Presets.easeInEaseOut);
    v_e97413((v_ba2215) => (v_ba2215 === v_a56041 ? null : v_a56041));
  };

  const v_ccd7bf = v_8bf970.length;

  return (
    <View style={v_d81136.container}>
      <StatusBar style="dark" />
      <Header
        title={v_8d41d7('screens.openSourceLicenses.title', { defaultValue: '오픈소스 라이선스' })}
        showBackButton
      />
      <SafeScrollView
        contentContainerStyle={v_d81136.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={v_d81136.list}>
          <Text style={v_d81136.intro}>
            {v_8d41d7('screens.openSourceLicenses.intro', {
              count: v_ccd7bf,
              defaultValue:
                'xrun 은 아래 오픈소스 소프트웨어와 데이터 {{count}}개를 사용합니다. 항목을 누르면 라이선스 원문을 볼 수 있어요.',
            })}
          </Text>
          <Text style={v_d81136.generatedAt}>
            {v_8d41d7('screens.openSourceLicenses.generatedAt', {
              date: v_7851c5,
              defaultValue: '생성 기준: {{date}}',
            })}
          </Text>

          <View style={v_d81136.search}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={v_d81136.searchInput}
              value={v_7c5791}
              onChangeText={v_c57190}
              placeholder={v_8d41d7('screens.openSourceLicenses.searchPlaceholder', {
                defaultValue: '이름 또는 라이선스로 검색',
              })}
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {v_946c09.length === 0 ? (
            <Text style={v_d81136.empty}>
              {v_8d41d7('screens.openSourceLicenses.empty', { defaultValue: '검색 결과가 없어요' })}
            </Text>
          ) : (
            v_946c09.map((v_b6a7e0) => (
              <View key={v_b6a7e0.id} style={v_d81136.section}>
                <Text style={v_d81136.sectionTitle}>
                  {v_8d41d7(v_b6a7e0.titleKey, { defaultValue: v_b6a7e0.title })} · {v_b6a7e0.items.length}
                </Text>
                <View style={v_d81136.sectionCard}>
                  {v_b6a7e0.items.map(({ index: v_a56041, entry: v_2b8338 }, v_ebec57) => {
                    const v_ebda8f = v_591400 === v_a56041;
                    const v_9b6134 = v_ebda8f ? v_681165(v_2b8338) : null;
                    return (
                      <LicenseRow
                        key={`${v_2b8338.section}:${v_2b8338.name}@${v_2b8338.version}:${v_ebec57}`}
                        entry={v_2b8338}
                        expanded={v_ebda8f}
                        text={v_9b6134}
                        hasBorder={v_ebec57 < v_b6a7e0.items.length - 1}
                        onPress={() => v_0ab8c5(v_a56041)}
                        t={v_8d41d7}
                      />
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </View>
      </SafeScrollView>
    </View>
  );
};

type RowProps = {
  entry: v_5b8d8d;
  expanded: boolean;
  text: string | null;
  hasBorder: boolean;
  onPress: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

const LicenseRow: v_a3453e.FC<RowProps> = ({ entry: v_2b8338, expanded: v_ebda8f, text: v_9b6134, hasBorder: v_1ba59d, onPress: v_719eed, t: v_8d41d7 }) => {
  return (
    <View style={[v_d81136.row, v_1ba59d && !v_ebda8f && v_d81136.rowBorder]}>
      <TouchableOpacity style={v_d81136.rowHeader} onPress={v_719eed} activeOpacity={0.8}>
        <View style={{ flex: 1 }}>
          <Text style={v_d81136.name} numberOfLines={1}>{v_2b8338.name}</Text>
          <Text style={v_d81136.meta} numberOfLines={1}>
            {v_2b8338.version ? `${v_2b8338.version} · ` : ''}{v_2b8338.license}
          </Text>
        </View>
        <Ionicons
          name={v_ebda8f ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#94a3b8"
        />
      </TouchableOpacity>

      {v_ebda8f && (
        <View style={v_d81136.detail}>
          {v_2b8338.url && (
            <TouchableOpacity
              style={v_d81136.link}
              onPress={() => {
                void v_f2c756.openURL(v_2b8338.url!).catch(() => undefined);
              }}
            >
              <Ionicons name="open-outline" size={14} color="#475569" />
              <Text style={v_d81136.linkText} numberOfLines={1}>{v_2b8338.url}</Text>
            </TouchableOpacity>
          )}

          {v_2b8338.notice && <Text style={v_d81136.notice}>{v_2b8338.notice}</Text>}

          <View style={v_d81136.textCard}>
            {v_9b6134 ? (
              <Text style={v_d81136.textBody} selectable>{v_9b6134}</Text>
            ) : (
              <Text style={v_d81136.textEmpty}>
                {v_8d41d7('screens.openSourceLicenses.noText', {
                  defaultValue: '이 항목의 라이선스 원문은 위 링크에서 확인할 수 있어요.',
                })}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const v_d81136 = v_472849.create({
  container: { ...v_a61db3.container },
  scrollContent: { ...v_a61db3.scrollContent },
  list: { ...v_704d15.small },
  intro: { fontSize: 13, lineHeight: 19, color: '#475569', marginBottom: 4 },
  generatedAt: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#0f172a', marginLeft: 6 },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 24 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eef1f6',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {},
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  meta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  detail: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
    backgroundColor: '#f8fafc',
  },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  linkText: { flex: 1, fontSize: 12, color: '#475569', textDecorationLine: 'underline' },
  notice: { fontSize: 12, lineHeight: 18, color: '#475569' },
  textCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
  },
  textBody: {
    fontSize: 10,
    lineHeight: 15,
    color: '#1e293b',
    fontFamily: v_326be8.select({ ios: 'Menlo', default: 'monospace' }),
  },
  textEmpty: { fontSize: 12, color: '#64748b' },
});

export default v_e44da0;
