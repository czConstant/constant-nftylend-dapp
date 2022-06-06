import { memo, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'src/store/hooks';
import { formatCurrency, shortCryptoAddress } from 'src/common/utils/format';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import tokenIcons from 'src/common/utils/tokenIcons';
import { closeModal, openModal } from 'src/store/modal';
import DialogConnectWallet from 'src/common/components/dialogConnectWallet';
import walletIcons from 'src/common/utils/walletIcons';
import DialogSettingNotification from 'src/common/components/dialogSettingNotification';

import IconMyAsset from './images/ic_my_assets.svg'
import IconChange from './images/ic_change_wallet.svg'
import IconCopy from './images/ic_copy_address.svg'
import IconDisconnect from './images/ic_disconnect.svg'
import styles from './styles.module.scss';
import { APP_URL } from 'src/common/constants/url';
import { useToken } from 'src/modules/nftLend/hooks/useToken';

interface ButtonWalletDropdownProps {
  className?: string;
}

const ButtonWalletDropdown = (props: ButtonWalletDropdownProps) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isConnected, currentWallet, disconnectWallet } = useCurrentWallet();
  const { getNativeBalance } = useToken();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (isConnected) {
      getNativeBalance().then(res => setBalance(res));
    };
  }, [currentWallet]);

  const onChangeWallet = () => {
    // const id = 'connectWalletModal';
    // const close = () => dispatch(closeModal({ id }))
    // dispatch(openModal({
    //   id,
    //   theme: 'dark',
    //   modalProps: {
    //     centered: true,
    //     contentClassName: styles.modalContent,
    //   },
    //   render: () => <DialogConnectWallet onClose={close} />,
    // }))
    window.nearSelector?.show();
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
        {/* {walletIcons[currentWallet.name] && <img alt="" src={walletIcons[currentWallet.name]} />} */}
        <div className={styles.address}>
          {shortCryptoAddress(currentWallet.address, 10)}
          &nbsp;
        </div>
        <div className={styles.balance}>
          | {formatCurrency(balance)} {currentWallet.chain.toString()}
        </div>
        <img alt="" src={tokenIcons[currentWallet.chain.toLowerCase()]} />
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu} align="end">
        <Dropdown.Item eventKey="dashboard" onClick={() => navigate(APP_URL.DASHBOARD)}>
          <div className={styles.item}><img src={IconMyAsset} />Dashboard</div>
        </Dropdown.Item>
        <Dropdown.Item eventKey="myAssets" onClick={() => navigate(APP_URL.MY_NFT)}>
          <div className={styles.item}><img src={IconMyAsset} />My Assets</div>
        </Dropdown.Item>
        <Dropdown.Item eventKey="copy">
          <CopyToClipboard
            onCopy={() => toastSuccess("Copied address!")}
            text={currentWallet.address}
          >
            <div className={styles.item}><img src={IconCopy} />Copy address</div>
          </CopyToClipboard>
        </Dropdown.Item>
        <Dropdown.Item eventKey="setting" onClick={onEnableNotification}>
          <div className={styles.item}><img src={IconMyAsset} />Settings</div>
        </Dropdown.Item>
        <Dropdown.Item eventKey="changeWallet" onClick={onChangeWallet}>
          <div className={styles.item}><img src={IconChange} />Change wallet</div>
        </Dropdown.Item>
        <Dropdown.Item eventKey="disconnect" onClick={disconnectWallet}>
          <div className={styles.item}><img src={IconDisconnect} />Disconnect</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ButtonWalletDropdown);
