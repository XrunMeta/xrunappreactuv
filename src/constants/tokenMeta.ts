import { ImageSourcePropType } from 'react-native';

const icons = {
  pol: require('../../assets/pol-round-logo.png'),
  xrun: require('../../assets/xrun-round-logo.png'),
  xrunEth: require('../../assets/xrun2-round-logo.png'),
  adXrun: require('../../assets/ad-round-logo.png'),
  nft: require('../../assets/xrun2-round-logo.png'),
};

export const getTokenIcon = (
  token: string,
  network?: string,
): ImageSourcePropType => {
  if (token === 'POL') {
    return icons.pol;
  }
  if (token === 'AD XRUN') {
    return icons.adXrun;
  }
  if (token === 'NFT') {
    return icons.nft;
  }
  if (token === 'XRUN' && network === 'Ethereum') {
    return icons.xrunEth;
  }
  return icons.xrun;
};


