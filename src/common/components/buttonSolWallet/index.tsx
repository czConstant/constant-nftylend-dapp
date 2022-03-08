import { memo } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cx from 'classnames';

import '@solana/wallet-adapter-react-ui/styles.css';
import styles from './styles.module.scss';

interface ButtonSolWalletProps {
  className?: string;
}

const ButtonSolWallet = (props: ButtonSolWalletProps) => {
  const { className } = props;

  return (
    <WalletModalProvider className={styles.modalContainer}>
      <WalletMultiButton className={cx(className, styles.button)} />
    </WalletModalProvider>
  );
};

export default memo(ButtonSolWallet);
