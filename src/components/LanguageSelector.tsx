import v_a3453e, { v_5ab095 } from 'bapkr';
import { v_3094a2, v_19b633, v_472849, v_4623af, v_aa7413, v_122070 } from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_e1e9c4, v_076c45, v_0e4a4f } from '../locales';
import { v_1bfbd0, v_843035 } from '../constants';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGE_NAMES: Record<v_076c45, string> = {
  ko: '한국어',
  'zh-CN': '简体中文',
  en: 'English',
  id: 'Bahasa Indonesia',
  ja: '日本語',
  th: 'ไทย',
  hi: 'हिन्दी',
  vi: 'Tiếng Việt',
};

export const LanguageSelector: v_a3453e.FC<LanguageSelectorProps> = ({ visible: v_cf55be, onClose: v_0890f8 }) => {
  const { i18n: v_9c213b } = v_772971();
  const [v_7c5e9b, v_56b5ad] = v_5ab095<v_076c45>(v_9c213b.language as v_076c45);

  const v_db4432 = async (language: v_076c45) => {
    try {
      await v_0e4a4f(v_05bb19);
      v_56b5ad(v_05bb19);

      setTimeout(() => {
        v_0890f8();
      }, 300);
    } catch (v_5e9bfe) {
      console.error('언어 변경 실패:', v_5e9bfe);
    }
  };

  return (
    <Modal
      visible={v_cf55be}
      transparent={true}
      animationType="fade"
      onRequestClose={v_0890f8}
    >
      <View style={v_d81136.overlay}>
        <View style={v_d81136.container}>
          <Text style={v_d81136.title}>언어 선택</Text>
          <ScrollView style={v_d81136.scrollView}>
            {Object.entries(v_e1e9c4).map(([v_c99bd2, v_3b402b]) => {
              const v_599a41 = v_7c5e9b === v_c99bd2;
              return (
                <TouchableOpacity
                  key={v_c99bd2}
                  style={[v_d81136.option, v_599a41 && v_d81136.selectedOption]}
                  onPress={() => v_db4432(v_c99bd2 as v_076c45)}
                  activeOpacity={0.7}
                >
                  <Text style={[v_d81136.optionText, v_599a41 && v_d81136.selectedOptionText]}>
                    {v_97dc05[v_c99bd2 as v_076c45]}
                  </Text>
                  {v_599a41 && <Text style={v_d81136.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={v_d81136.closeButton} onPress={v_0890f8} activeOpacity={0.7}>
            <Text style={v_d81136.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const v_d81136 = v_472849.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontSize: v_843035.size.large,
    fontFamily: 'Roboto-Bold',
    color: v_1bfbd0.headerText,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: v_1bfbd0.buttonPrimary,
  },
  optionText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Regular',
    color: v_1bfbd0.text,
  },
  selectedOptionText: {
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  checkmark: {
    fontSize: v_843035.size.mmedium,
    color: '#fff',
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: v_843035.size.medium,
    fontFamily: 'Roboto-Medium',
    color: v_1bfbd0.text,
  },
});

