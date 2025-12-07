import v_a3453e, { v_5ab095, v_c4deb2 } from 'bapkr';
import {
  v_472849,
  v_aa7413,
  v_4623af,
  v_3094a2,
  v_19b633,
  v_cf9c33,
  v_79c4f2,
  v_39a996,
} from 'rcmrninabrnb';
import { v_772971 } from 'jmpfvteuuztnp';
import { v_25515d } from 'zvyjokvuouwvifyzks';
import { v_533fd3, v_c03e7f } from '../types';
import { v_843035 } from '../constants';

interface PredefinedToken {
  symbol: string;
  currency: number;
  subcurrency: number;
  name: string;
  icon: any;
}

interface AddTokenModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  activeTab: 'Token' | 'Contract' | 'Confirm';
  setActiveTab: (tab: 'Token' | 'Contract' | 'Confirm') => void;
  selectedToken: PredefinedToken | null;
  contractAddress: string;
  setContractAddress: (address: string) => void;
  tokenName: string;
  setTokenName: (name: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (symbol: string) => void;
  tokenDecimals: string;
  setTokenDecimals: (decimals: string) => void;
  handleTokenSelect: (token: PredefinedToken) => void;
  handleTokenNext: () => void;
  handleContractNext: () => void;
  handleAddTokenConfirm: () => void;
  isAddingToken: boolean;
  existingCurrencies: number[];
  walletTokens: v_533fd3[];
  customTokens: v_c03e7f[];
}

const v_466446 = [
  {
    symbol: 'POL',
    currency: 18,
    subcurrency: 5200,
    name: 'Polygon',
    icon: require('../../assets/pol-round-logo.png'),
  },
  {
    symbol: 'XRUN',
    currency: 1,
    subcurrency: 5000,
    name: 'XRUN',
    icon: require('../../assets/xrun-round-logo.png'),
  },
];

const v_685cbf = (v_157c04, v_ecad6e, v_9ecc4d): string => {
  if (!v_157c04 || v_157c04.length < v_ecad6e + v_9ecc4d + 3) {
    return v_157c04 || '-';
  }
  return `${v_157c04.substring(0, v_ecad6e)}...${v_157c04.substring(
    v_157c04.length - v_9ecc4d,
  )}`;
};

export const AddTokenModal: v_a3453e.FC<AddTokenModalProps> = v_a3453e.memo(
  ({
    modalVisible: v_7f68e5,
    closeModal: v_cf5469,
    activeTab: v_ac1d22,
    setActiveTab: v_02dd63,
    selectedToken: v_04cb77,
    contractAddress: v_bf7657,
    setContractAddress: v_d134da,
    tokenName: v_6d4c0b,
    setTokenName: v_f4f750,
    tokenSymbol: v_d041ed,
    setTokenSymbol: v_8e9d24,
    tokenDecimals: v_eda0ea,
    setTokenDecimals: v_ba1c74,
    handleTokenSelect: v_0a49b0,
    handleTokenNext: v_66c7a3,
    handleContractNext: v_bee392,
    handleAddTokenConfirm: v_82aabf,
    isAddingToken: v_20125a,
    existingCurrencies: v_acbb08,
    walletTokens: v_849e4b,
    customTokens: v_4cad4c,
  }) => {
    const { t: v_8d41d7 } = v_772971();

    const v_3af62b = (v_a832b3): boolean => {
      const v_309ea1 = v_849e4b.some((v_21cc31) => v_21cc31.currency === v_a832b3);
      const v_c37b4e = v_4cad4c.some((v_21cc31) => v_21cc31.currency === v_a832b3);
      return v_309ea1 || v_c37b4e;
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={v_7f68e5}
        onRequestClose={v_cf5469}
      >
        <TouchableOpacity
          style={v_d81136.modalOverlay}
          activeOpacity={1}
          onPressOut={v_cf5469}
        >
          <View style={v_d81136.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={v_d81136.modalContent}
              onPress={(v_9e86fd) => v_9e86fd.stopPropagation()}
            >
              {}
              <View
                style={[
                  v_d81136.modalHeader,
                  v_ac1d22 === 'Confirm' && {
                    borderBottomWidth: 2,
                    borderBottomColor: '#DEDEDE',
                    paddingBottom: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    v_d81136.modalTitle,
                    {
                      opacity: v_ac1d22 === 'Confirm' ? 1 : 0,
                    },
                  ]}
                >
                  {v_8d41d7('screens.addToken.confirmTitle')}
                </Text>
                <TouchableOpacity onPress={v_cf5469}>
                  <Ionicons name="close" size={24} color="#000000" />
                </TouchableOpacity>
              </View>

              {}
              {v_ac1d22 !== 'Confirm' && (
                <View style={v_d81136.tabContainer}>
                  <TouchableOpacity
                    style={[v_d81136.tabButton, v_ac1d22 === 'Token' && v_d81136.activeTab]}
                    onPress={() => v_02dd63('Token')}
                  >
                    <Text
                      style={[
                        v_d81136.tabText,
                        v_ac1d22 === 'Token' && v_d81136.activeTabText,
                      ]}
                    >
                      {v_8d41d7('screens.addToken.tokenTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      v_d81136.tabButton,
                      v_ac1d22 === 'Contract' && v_d81136.activeTab,
                    ]}
                    onPress={() => v_02dd63('Contract')}
                    disabled={!v_04cb77 && v_ac1d22 !== 'Contract'}
                  >
                    <Text
                      style={[
                        v_d81136.tabText,
                        v_ac1d22 === 'Contract' && v_d81136.activeTabText,
                        !v_04cb77 && v_ac1d22 !== 'Contract' && v_d81136.disabledTab,
                      ]}
                    >
                      {v_8d41d7('screens.addToken.contractTab')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {v_ac1d22 === 'Token' && (
                <View style={v_d81136.tabContent}>
                  {v_466446.map((v_21cc31, v_a56041) => {
                    const v_1a6f6d = v_3af62b(v_21cc31.currency);
                    return (
                      <TouchableOpacity
                        key={v_a56041}
                        style={[
                          v_d81136.tokenItem,
                          v_04cb77?.symbol === v_21cc31.symbol && v_d81136.selectedToken,
                          v_1a6f6d && v_d81136.disabledToken,
                        ]}
                        onPress={() => !v_1a6f6d && v_0a49b0(v_21cc31)}
                        disabled={v_1a6f6d}
                      >
                        <Image
                          source={v_21cc31.icon}
                          style={[v_d81136.cryptoIconImage, v_1a6f6d && { opacity: 0.5 }]}
                          resizeMode="contain"
                        />
                        <Text
                          style={[v_d81136.tokenSymbol, v_1a6f6d && v_d81136.disabledText]}
                        >
                          {v_21cc31.symbol}
                        </Text>
                        {v_1a6f6d && (
                          <Text style={v_d81136.ownedText}>
                            {v_8d41d7('screens.addToken.alreadyOwned')}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={v_d81136.nextButton}
                    onPress={v_66c7a3}
                    disabled={!v_04cb77 || v_20125a}
                  >
                    <Text style={v_d81136.nextButtonText}>
                      {v_8d41d7('screens.addToken.nextButton')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {v_ac1d22 === 'Contract' && (
                <View style={v_d81136.tabContent}>
                  <TextInput
                    style={v_d81136.input}
                    placeholder={v_8d41d7('screens.addToken.contractPlaceholder')}
                    value={v_bf7657}
                    onChangeText={v_d134da}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={v_d81136.nextButton}
                    onPress={v_bee392}
                    disabled={!v_bf7657 || v_20125a}
                  >
                    <Text style={v_d81136.nextButtonText}>
                      {v_8d41d7('screens.addToken.nextButton')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {v_ac1d22 === 'Confirm' && (
                <View style={v_d81136.tabContent}>
                  <View style={v_d81136.confirmRow}>
                    <Text style={v_d81136.confirmLabel}>
                      {v_8d41d7('screens.addToken.contractAddress')}
                    </Text>
                    <Text style={v_d81136.confirmValue}>
                      {v_685cbf(v_bf7657, 6, 4)}
                    </Text>
                  </View>
                  <View style={v_d81136.confirmRow}>
                    <Text style={v_d81136.confirmLabel}>
                      {v_8d41d7('screens.addToken.tokenName')}
                    </Text>
                    <Text style={v_d81136.confirmValue}>
                      {v_6d4c0b || v_04cb77?.name}
                    </Text>
                  </View>
                  <View style={v_d81136.confirmRow}>
                    <Text style={v_d81136.confirmLabel}>
                      {v_8d41d7('screens.addToken.tokenSymbol')}
                    </Text>
                    <Text style={v_d81136.confirmValue}>
                      {v_d041ed || v_04cb77?.symbol}
                    </Text>
                  </View>
                  <View style={v_d81136.confirmRow}>
                    <Text style={v_d81136.confirmLabel}>
                      {v_8d41d7('screens.addToken.tokenDecimals')}
                    </Text>
                    <Text style={v_d81136.confirmValue}>
                      {v_eda0ea || '18'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={v_d81136.nextButton}
                    onPress={v_82aabf}
                    disabled={v_20125a}
                  >
                    {v_20125a ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Text style={v_d81136.addButtonText}>
                        {v_8d41d7('screens.addToken.addButton')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  },
);

const v_d81136 = v_472849.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: v_843035.fontSize.large,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  tabButton: {
    paddingVertical: 10,
    flex: 1,
    borderBottomWidth: 5,
    borderBottomColor: '#DEDEDE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 5,
    borderBottomColor: '#FFDC04',
  },
  tabText: {
    fontSize: v_843035.fontSize.medium,
    color: '#B8B8B8',
    fontFamily: 'Roboto-Regular',
  },
  activeTabText: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabContent: {
    minHeight: 200,
  },
  tokenItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  selectedToken: {
    backgroundColor: '#F5F5FF',
  },
  tokenSymbol: {
    fontSize: v_843035.fontSize.medium,
    color: 'black',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: v_843035.fontSize.medium,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#FAFAFA',
  },
  nextButton: {
    backgroundColor: '#FFDC04',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    marginTop: 40,
    width: 150,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: v_843035.fontSize.medium,
    fontFamily: 'Roboto-Bold',
  },
  confirmRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  confirmLabel: {
    fontSize: v_843035.fontSize.medium,
    color: '#B8B8B8',
    fontFamily: 'Roboto-Regular',
  },
  confirmValue: {
    fontSize: v_843035.fontSize.medium,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
    marginTop: 4,
  },
  addButtonText: {
    color: 'black',
    fontSize: v_843035.fontSize.medium,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  cryptoIconImage: {
    width: 24,
    height: 24,
  },
  disabledToken: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 5,
  },
  disabledText: {
    color: '#B8B8B8',
  },
  ownedText: {
    marginLeft: 'auto',
    fontSize: v_843035.fontSize.small,
    color: '#B8B8B8',
    marginTop: 3,
    fontFamily: 'Roboto-Regular',
  },
});

