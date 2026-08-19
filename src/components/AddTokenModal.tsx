import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { WalletData, CustomToken } from '../types';
import { FONTS } from '../constants';
import { TID } from '../testIDs';

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
  walletTokens: WalletData[];
  customTokens: CustomToken[];
}

const predefinedTokens: PredefinedToken[] = [
  {
    symbol: 'POL',
    currency: 18,
    subcurrency: 5200,
    name: 'Polygon',
    icon: require('../../assets/icon_polyganscan_color.png'),
  },
  {
    symbol: 'XRUN',
    currency: 1,
    subcurrency: 5000,
    name: 'XRUN',
    icon: require('../../assets/xrun-round-logo.png'),
  },
];

const shortenAddress = (address: string, frontChars: number, backChars: number): string => {
  if (!address || address.length < frontChars + backChars + 3) {
    return address || '-';
  }
  return `${address.substring(0, frontChars)}...${address.substring(
    address.length - backChars,
  )}`;
};

export const AddTokenModal: React.FC<AddTokenModalProps> = React.memo(
  ({
    modalVisible,
    closeModal,
    activeTab,
    setActiveTab,
    selectedToken,
    contractAddress,
    setContractAddress,
    tokenName,
    setTokenName,
    tokenSymbol,
    setTokenSymbol,
    tokenDecimals,
    setTokenDecimals,
    handleTokenSelect,
    handleTokenNext,
    handleContractNext,
    handleAddTokenConfirm,
    isAddingToken,
    existingCurrencies,
    walletTokens,
    customTokens,
  }) => {
    const { t } = useTranslation();

    const isTokenOwned = (currency: number): boolean => {
      const inWallet = walletTokens.some((token) => token.currency === currency);
      const inCustom = customTokens.some((token) => token.currency === currency);
      return inWallet || inCustom;
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              {}
              <View
                style={[
                  styles.modalHeader,
                  activeTab === 'Confirm' && {
                    borderBottomWidth: 2,
                    borderBottomColor: '#DEDEDE',
                    paddingBottom: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      opacity: activeTab === 'Confirm' ? 1 : 0,
                    },
                  ]}
                >
                  {t('screens.addToken.confirmTitle')}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#000000" />
                </TouchableOpacity>
              </View>

              {}
              {activeTab !== 'Confirm' && (
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Token' && styles.activeTab]}
                    onPress={() => setActiveTab('Token')}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'Token' && styles.activeTabText,
                      ]}
                    >
                      {t('screens.addToken.tokenTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === 'Contract' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('Contract')}
                    disabled={!selectedToken && activeTab !== 'Contract'}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'Contract' && styles.activeTabText,
                        !selectedToken && activeTab !== 'Contract' && styles.disabledTab,
                      ]}
                    >
                      {t('screens.addToken.contractTab')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {activeTab === 'Token' && (
                <View style={styles.tabContent}>
                  {predefinedTokens.map((token, index) => {
                    const isDisabled = isTokenOwned(token.currency);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.tokenItem,
                          selectedToken?.symbol === token.symbol && styles.selectedToken,
                          isDisabled && styles.disabledToken,
                        ]}
                        onPress={() => !isDisabled && handleTokenSelect(token)}
                        disabled={isDisabled}
                      >
                        <Image
                          source={token.icon}
                          style={[styles.cryptoIconImage, isDisabled && { opacity: 0.5 }]}
                          resizeMode="contain"
                        />
                        <Text
                          style={[styles.tokenSymbol, isDisabled && styles.disabledText]}
                        >
                          {token.symbol}
                        </Text>
                        {isDisabled && (
                          <Text style={styles.ownedText}>
                            {t('screens.addToken.alreadyOwned')}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleTokenNext}
                    disabled={!selectedToken || isAddingToken}
                  >
                    <Text style={styles.nextButtonText}>
                      {t('screens.addToken.nextButton')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {activeTab === 'Contract' && (
                <View style={styles.tabContent}>
                  <TextInput testID={TID.addToken.contractAddressInput}
                    style={styles.input}
                    placeholder={t('screens.addToken.contractPlaceholder')}
                    value={contractAddress}
                    onChangeText={setContractAddress}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleContractNext}
                    disabled={!contractAddress || isAddingToken}
                  >
                    <Text style={styles.nextButtonText}>
                      {t('screens.addToken.nextButton')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {}
              {activeTab === 'Confirm' && (
                <View style={styles.tabContent}>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>
                      {t('screens.addToken.contractAddress')}
                    </Text>
                    <Text style={styles.confirmValue}>
                      {shortenAddress(contractAddress, 6, 4)}
                    </Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>
                      {t('screens.addToken.tokenName')}
                    </Text>
                    <Text testID={TID.addToken.nameLabel} style={styles.confirmValue}>
                      {tokenName || selectedToken?.name}
                    </Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>
                      {t('screens.addToken.tokenSymbol')}
                    </Text>
                    <Text style={styles.confirmValue}>
                      {tokenSymbol || selectedToken?.symbol}
                    </Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>
                      {t('screens.addToken.tokenDecimals')}
                    </Text>
                    <Text style={styles.confirmValue}>
                      {tokenDecimals || '18'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleAddTokenConfirm}
                    disabled={isAddingToken}
                  >
                    {isAddingToken ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Text style={styles.addButtonText}>
                        {t('screens.addToken.addButton')}
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

const styles = StyleSheet.create({
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
    fontSize: FONTS.size.large,
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
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.medium,
    color: 'black',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.medium,
    fontFamily: 'Roboto-Bold',
  },
  confirmRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  confirmLabel: {
    fontSize: FONTS.size.medium,
    color: '#B8B8B8',
    fontFamily: 'Roboto-Regular',
  },
  confirmValue: {
    fontSize: FONTS.size.medium,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
    marginTop: 4,
  },
  addButtonText: {
    color: 'black',
    fontSize: FONTS.size.medium,
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
    fontSize: FONTS.size.small,
    color: '#B8B8B8',
    marginTop: 3,
    fontFamily: 'Roboto-Regular',
  },
});

