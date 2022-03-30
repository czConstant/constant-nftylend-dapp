import { useEffect } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cx from 'classnames';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useWallet } from '@solana/wallet-adapter-react';

import { AvalancheChainConfig, Chain, ChainAvalancheID, ChainPolygonID, PolygonChainConfig } from 'src/common/constants/network';
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
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), chain: Chain.Solana }));
    else if (walletChain === Chain.Solana) dispatch(clearWallet());
  }, [wallet.publicKey]);

  const onSelect = async (e: any) => {
    if (e.chain === Chain.Solana) {
      const el = document.getElementById('solButton');
      if (el) el.click();
    } else {
      if (!window.ethereum) {
        return toastError('Metamask not installed');
      }
      const providerOptions = { };
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      const instance = await web3Modal.connect();

      const chainConfigs = {
        [Chain.Polygon]: PolygonChainConfig,
        [Chain.Avalanche]: AvalancheChainConfig,
      }
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfigs[e.chain]],
      })
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfigs[e.chain]?.chainId }],
      });

      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();
      dispatch(updateWallet({ address: accounts[0], chain: e.chain }));
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
        <div className={styles.step}>Choose network</div>
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