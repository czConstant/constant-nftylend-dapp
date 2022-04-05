import { memo } from 'react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CopyToClipboard } from "react-copy-to-clipboard";

import { clearWallet } from 'src/store/nftyLend';
import { useAppDispatch } from 'src/store/hooks';
import { shortCryptoAddress } from 'src/common/utils/format';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import styles from './styles.module.scss';
import tokenIcons from 'src/common/utils/tokenIcons';

interface ButtonDisconnectWalletProps {
  className?: string;
}

const ButtonDisconnectWallet = (props: ButtonDisconnectWalletProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const { currentWallet } = useCurrentWallet();

  const onDisconnect = () => {
    dispatch(clearWallet());
  };

  if (currentWallet.chain === Chain.Solana) {
    return (
      <WalletModalProvider className={styles.modalContainer}>
        <WalletMultiButton className={cx(styles.disconnectButton, className)} />
      </WalletModalProvider>
    );
  }

  return (
    <Dropdown className={cx(styles.wrapper, className)}>
      <Dropdown.Toggle className={styles.disconnectButton}>
        <img alt="" src={tokenIcons[currentWallet.chain.toLowerCase()]} />
        <span className={className}>{shortCryptoAddress(currentWallet.address)}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item eventKey="copy">
          <CopyToClipboard
            onCopy={() => toastSuccess("Copied address!")}
            text={currentWallet.address}
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

export default memo(ButtonDisconnectWallet);
