import { useEffect } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cx from 'classnames';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useWallet } from '@solana/wallet-adapter-react';

import { AvalancheChainConfig, Chain, PolygonChainConfig } from 'src/common/constants/network';
import tokenIcons from 'src/common/utils/tokenIcons';
import { useAppDispatch } from 'src/store/hooks';
import { toastError } from 'src/common/services/toaster';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import styles from './connectWallet.module.scss';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

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
  const wallet = useWallet();
  const { currentWallet, isConnected, connectEvmWallet, connectSolanaWallet } = useCurrentWallet();

  useEffect(() => {
    if (isConnected && currentWallet.chain === Chain.Solana) onClose();
  }, [isConnected]);

  useEffect(() => {
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), chain: Chain.Solana }));
    else if (currentWallet.chain === Chain.Solana) dispatch(clearWallet());
  }, [wallet.publicKey]);

  const onSelect = async (e: any) => {
    if (e.chain === Chain.Solana) {
      connectSolanaWallet();
    } else {
      await connectEvmWallet(e.chain);
      onClose();
    }
  };

  // const renderHiddenSolButton = () => {
  //   return (
  //     <WalletModalProvider className={styles.modalContainer}>
  //       <WalletMultiButton className={cx(styles.solButton)}>
  //         <div id="solButton" />
  //       </WalletMultiButton>
  //     </WalletModalProvider>
  //   )
  // }

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
        {/* {!isConnected && renderHiddenSolButton()} */}
      </div>
    </div>
  );
};

export default ConnectWalletModal;