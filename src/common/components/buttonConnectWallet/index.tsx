import { memo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { ethers } from 'ethers';
import '@solana/wallet-adapter-react-ui/styles.css';

import { updateWallet } from 'src/store/nftLend';
import { toastError } from 'src/common/services/toaster';
import tokenIcons from 'src/common/utils/tokenIcons';
import { ChainPolygonID } from 'src/common/constants/network';

import CryptoDropdownItem from '../cryptoDropdownItem';
import styles from './styles.module.scss';

interface ButtonConnectWalletProps {
  className?: string;
}

const ButtonConnectWallet: React.FC<ButtonConnectWalletProps> = (
  props: ButtonConnectWalletProps
) => {
  const { className } = props;
  const dispatch = useDispatch();
  const { publicKey } = useWallet();

  const onSelect = async (symbol: string | null) => {
    if (symbol === 'MATIC') {
      if (!window.ethereum) {
        toastError('Metamask not installed');
      }
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ChainPolygonID }],
        })
        dispatch(updateWallet(accounts[0]));
        console.log("Connected to account: ", accounts[0]);
      } catch (err) {
        console.log(err)
      }
    }
  };

  return (
    <Dropdown className={cx(styles.wrapper, className)} onSelect={onSelect}>
      <Dropdown.Toggle>
        <span className={className}>Connect Wallet</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item eventKey="SOL">
          <WalletModalProvider className={styles.modalContainer}>
            <WalletMultiButton className={cx(className, styles.button)}>
              <CryptoDropdownItem className={styles.item} name="Solana" symbol="SOL" icon={tokenIcons.sol} />
            </WalletMultiButton>
          </WalletModalProvider>
        </Dropdown.Item>
        <Dropdown.Item eventKey="MATIC">
          <CryptoDropdownItem className={styles.item} name="Polygon" symbol="MATIC" icon={tokenIcons.matic} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ButtonConnectWallet);
