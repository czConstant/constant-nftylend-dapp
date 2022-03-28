import { useEffect } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cx from 'classnames';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useWallet } from '@solana/wallet-adapter-react';

import { Chain, ChainPolygonID } from 'src/common/constants/network';
import tokenIcons from 'src/common/utils/tokenIcons';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { toastError } from 'src/common/services/toaster';
import { clearWallet, selectNftyLend, updateWallet } from 'src/store/nftyLend';
import styles from './connectWallet.module.scss';

const NETWORKS = [
  { image: tokenIcons.sol, name: 'Solana', chain: Chain.Solana },
  { image: tokenIcons.matic, name: 'Polygon', chain: Chain.Polygon },
  { image: tokenIcons.avax, name: 'Avalanche', chain: Chain.Avalanche },
];

interface ConnectWalletModalProps {
  onClose: Function;
}

const ConnectWalletModal = (props: ConnectWalletModalProps) => {
  const { onClose, } = props;

  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;
  const wallet = useWallet();

  useEffect(() => {
    if (walletAddress) onClose();
  }, [walletAddress]);

  useEffect(() => {
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), network: Chain.Solana }));
    else if (walletChain === Chain.Solana) dispatch(clearWallet());
  }, [wallet.publicKey]);

  const onSelect = async (e: any) => {
    if (e.chain === Chain.Solana) {
      const el = document.getElementById('solButton');
      if (el) el.click();
    } else if (e.chain === Chain.Polygon) {
      if (!window.ethereum) {
        return toastError('Metamask not installed');
      }
      const providerOptions = { };
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      const instance = await web3Modal.connect();
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ChainPolygonID.toString(16)}` }],
      })

      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();
      dispatch(updateWallet({ address: accounts[0], network: Chain.Polygon }));
      onClose();
    }
  };

  const renderHiddenSolButton = () => {
    return (
      <WalletModalProvider className={styles.modalContainer}>
        <WalletMultiButton className={cx(styles.solButton)}>
          <div id="solButton" />
        </WalletMultiButton>
      </WalletModalProvider>
    )
  }

  return (
    <div className={styles.connectWallet}>
      <h2>Connect wallet</h2>
      <div className={styles.content}>
        <div>Choose network</div>
        <div className={styles.listNetwork}>
          {NETWORKS.map(e => (
            <div key={e.chain} className={styles.network} onClick={() => onSelect(e)}>
              <img alt="" src={e.image} />
              <div>{e.name}</div>
            </div>
          ))}
        </div>
        {!walletAddress && renderHiddenSolButton()}
      </div>
    </div>
  );
};

export default ConnectWalletModal;