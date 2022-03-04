import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BodyContainer from 'src/common/components/bodyContainer';
import Transfer from 'src/modules/nftBridge/components/transfer';

import styles from './nftBridge.module.scss';

const NftBridge = () => {
  const navigate = useNavigate();

  return (
    <BodyContainer className={styles.nftBridge}>
      <div className={styles.header}>
        <div className={styles.subtitle}>Create, explore, & collect digital art NFTs</div>
        <h1>Portal NFT Bridge</h1>
      </div>
      <div className={styles.body}>
        <Transfer />
      </div>
    </BodyContainer>
  );
};

export default NftBridge;
