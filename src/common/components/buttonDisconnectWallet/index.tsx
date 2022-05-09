import { memo } from 'react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useAppDispatch } from 'src/store/hooks';
import { shortCryptoAddress } from 'src/common/utils/format';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import tokenIcons from 'src/common/utils/tokenIcons';
import { closeModal, openModal } from 'src/store/modal';
import DialogConnectWallet from 'src/common/components/dialogConnectWallet';
import walletIcons from 'src/common/utils/walletIcons';
import DialogSettingNotification from 'src/common/components/dialogSettingNotification';
import styles from './styles.module.scss';

interface ButtonDisconnectWalletProps {
  className?: string;
}

const ButtonDisconnectWallet = (props: ButtonDisconnectWalletProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const { currentWallet, disconnectWallet } = useCurrentWallet();

  const onChangeWallet = () => {
    const id = 'connectWalletModal';
    const close = () => dispatch(closeModal({ id }))
    dispatch(openModal({
      id,
      theme: 'dark',
      modalProps: {
        centered: true,
        contentClassName: styles.modalContent,
      },
      render: () => <DialogConnectWallet onClose={close} />,
    }))
  };

  const onEnableNotification = () => {
    const id = 'addEmailModal';
    const close = () => dispatch(closeModal({ id }))
    dispatch(openModal({
      id,
      theme: 'dark',
      modalProps: {
        centered: true,
        contentClassName: styles.modalContent,
      },
      render: () => <DialogSettingNotification onClose={close} />,
    }))
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
        {walletIcons[currentWallet.name] && <img alt="" src={walletIcons[currentWallet.name]} />}
        <span className={className}>
          {currentWallet.chain === Chain.Near
            ? currentWallet.address
            : shortCryptoAddress(currentWallet.address)}
        </span>
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
        {/* <Dropdown.Item eventKey="changeWallet" onClick={onEnableNotification}>
          <div className={styles.item}>Notification Preference</div>
        </Dropdown.Item> */}
        <Dropdown.Item eventKey="changeWallet" onClick={onChangeWallet}>
          <div className={styles.item}>Change wallet</div>
        </Dropdown.Item>
        <Dropdown.Item eventKey="disconnect" onClick={disconnectWallet}>
          <div className={styles.item}>Disconnect</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ButtonDisconnectWallet);
