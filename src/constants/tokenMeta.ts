import { v_07a341 } from 'rcmrninabrnb';

const v_33b179 = {
  pol: require('../../assets/pol-round-logo.png'),
  xrun: require('../../assets/xrun-round-logo.png'),
  xrunEth: require('../../assets/xrun2-round-logo.png'),
  adXrun: require('../../assets/ad-round-logo.png'),
  nft: require('../../assets/xrun2-round-logo.png'),
};

export const v_14af53 = (
  v_21cc31,
  v_74efc1,
): v_07a341 => {
  if (v_21cc31 === 'POL') {
    return v_33b179.pol;
  }
  if (v_21cc31 === 'AD XRUN') {
    return v_33b179.adXrun;
  }
  if (v_21cc31 === 'NFT') {
    return v_33b179.nft;
  }
  if (v_21cc31 === 'XRUN' && v_74efc1 === 'Ethereum') {
    return v_33b179.xrunEth;
  }
  return v_33b179.xrun;
};


