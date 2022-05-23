import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';

import styles from './styles.module.scss';
import { AssetNft } from '../../models/nft';
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
      <h2>Confirm Payment</h2>
      <div>You are about to order <strong style={{ color: '#3772ff' }}>{asset.name}</strong></div>
      <div className={styles.amount}>
        <span>Total</span>
        <strong>{formatCurrency(amount)} {symbol}</strong>
      </div>
      <div className={styles.note}>You will be redirected to your wallet to confirm your transaction</div>
      <div className={cx(styles.actions)}>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} className={styles.btnConnect}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ModalConfirmAmount);
