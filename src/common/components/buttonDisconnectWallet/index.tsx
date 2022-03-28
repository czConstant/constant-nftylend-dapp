import { memo } from 'react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CopyToClipboard } from "react-copy-to-clipboard";

import { clearWallet, selectNftyLend } from 'src/store/nftyLend';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import styles from './styles.module.scss';
import { shortCryptoAddress } from 'src/common/utils/format';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';

interface ButtonConnectWalletProps {
  className?: string;
}

const ButtonConnectWallet = (props: ButtonConnectWalletProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const onDisconnect = () => {
    dispatch(clearWallet());
  };

  if (walletChain === Chain.Solana) {
    return (
      <WalletModalProvider className={styles.modalContainer}>
        <WalletMultiButton className={cx(styles.disconnectButton, className)} />
      </WalletModalProvider>
    );
  }

  return (
    <Dropdown className={cx(styles.wrapper, className)}>
      <Dropdown.Toggle className={styles.disconnectButton}>
        <span className={className}>{shortCryptoAddress(walletAddress)}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item eventKey="copy">
          <CopyToClipboard
            onCopy={() => toastSuccess("Copied address!")}
            text={walletAddress}
          >
            <div className={styles.item}>Copy address</div>
          </CopyToClipboard>
        </Dropdown.Item>
        <Dropdown.Item eventKey="disconnect" onClick={onDisconnect}>
          <div className={styles.item}>Disconnect</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ButtonConnectWallet);
