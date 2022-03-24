import { memo, useEffect } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { ethers } from 'ethers';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';

import { clearWallet, selectNftyLend, updateWallet } from 'src/store/nftyLend';
import { toastError } from 'src/common/services/toaster';
import tokenIcons from 'src/common/utils/tokenIcons';
import { Chain, ChainPolygonID } from 'src/common/constants/network';

import CryptoDropdownItem from '../cryptoDropdownItem';
import styles from './styles.module.scss';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { shortCryptoAddress } from 'src/common/utils/format';

interface ButtonConnectWalletProps {
  className?: string;
}

const ButtonConnectWallet: React.FC<ButtonConnectWalletProps> = (
  props: ButtonConnectWalletProps
) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;
  const wallet = useWallet();

  useEffect(() => {
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), network: Chain.Solana }));
    else if (walletChain === Chain.Solana) dispatch(clearWallet());
  }, [wallet]);

  const onSelectChain = async (chain: Chain) => {
    if (chain === Chain.Polygon) {
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
        dispatch(updateWallet({ address: accounts[0], network: Chain.Polygon }));
      } catch (err) {
        console.log(err)
      }
    }
  };

  const onDisconnect = () => {
    dispatch(clearWallet());
  };

  if (walletChain === Chain.Solana) return (
    <WalletModalProvider className={styles.modalContainer}>
      <WalletMultiButton className={cx(className, styles.connectButton)} />
    </WalletModalProvider>
  )

  if (walletAddress) return (
    <Dropdown className={cx(styles.wrapper, className)}>
      <Dropdown.Toggle className={styles.connectButton}>
        <span className={className}>{shortCryptoAddress(walletAddress)}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item eventKey="disconnect" onClick={onDisconnect}>
          <div className={styles.item}>Disconnect</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <Dropdown className={cx(styles.wrapper, className)} onSelect={onSelectChain}>
      <Dropdown.Toggle className={styles.connectButton}>
        <span className={className}>Connect Wallet</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item eventKey={Chain.Solana}>
          <WalletModalProvider className={styles.modalContainer}>
            <WalletMultiButton className={cx(className, styles.button)}>
              <CryptoDropdownItem className={styles.item} name="Solana" symbol="SOL" icon={tokenIcons.sol} />
            </WalletMultiButton>
          </WalletModalProvider>
        </Dropdown.Item>
        <Dropdown.Item eventKey={Chain.Polygon}>
          <CryptoDropdownItem className={styles.item} name="Polygon" symbol="MATIC" icon={tokenIcons.matic} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ButtonConnectWallet);
