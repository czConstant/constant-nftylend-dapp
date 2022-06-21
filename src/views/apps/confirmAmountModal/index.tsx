import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Button, Flex } from '@chakra-ui/react';

import styles from './styles.module.scss';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { formatCurrency } from 'src/common/utils/format';

interface ModalConfirmAmountProps {
  asset: AssetNft;
  amount: number;
  symbol: string;
  onConfirm: Function;
  onClose: Function;
};

const ModalConfirmAmount = (props: ModalConfirmAmountProps) => {
  const { asset, amount, symbol, onClose, onConfirm } = props;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <div className={cx(isMobile && styles.moModalConfirmAmount, styles.confirmAmount)}>
      {isMobile && (
        <a onClick={onClose} className={styles.btnClose} >
          <i className="fas fa-times"></i>
        </a>
      )}
      <div>You are about to order <strong style={{ color: '#3772ff' }}>{asset.name}</strong></div>
      <div className={styles.amount}>
        <span>Total</span>
        <strong>{formatCurrency(amount)} {symbol}</strong>
      </div>
      <div className={styles.note}>You will be redirected to your wallet to confirm your transaction</div>
      <Flex alignItems='center' gap={4}>
        <Button flex={1} onClick={onClose} variant='solid' colorScheme='whiteAlpha'>
          Cancel
        </Button>
        <Button flex={1}  onClick={handleConfirm}>
          Confirm
        </Button>
      </Flex>
    </div>
  );
};

export default React.memo(ModalConfirmAmount);
