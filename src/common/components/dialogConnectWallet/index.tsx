import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';

import { Chain } from 'src/common/constants/network';
import tokenIcons from 'src/common/utils/tokenIcons';
import { useAppDispatch } from 'src/store/hooks';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

import styles from './connectWallet.module.scss';
import { CryptoWallet } from 'src/common/constants/wallet';
import { toastError } from 'src/common/services/toaster';
import walletIcons from 'src/common/utils/walletIcons';

const NETWORKS = [
  // { image: tokenIcons.sol, name: 'Solana', chain: Chain.Solana },
  { image: tokenIcons.matic, name: 'Polygon', chain: Chain.Polygon },
  // { image: tokenIcons.avax, name: 'Avalanche', chain: Chain.Avalanche },
  // { image: tokenIcons.bnb, name: 'Binance Smart Chain', chain: Chain.BSC },
  // { image: tokenIcons.boba, name: 'Boba Network', chain: Chain.Boba },
  { image: tokenIcons.near, name: 'Near', chain: Chain.Near },
];

const WALLETS = [
  { key: CryptoWallet.Metamask, name: 'Metamask' },
  {
    key: CryptoWallet.BinanceWallet,
    name: 'Binance Wallet Extension',
    chains: [Chain.BSC],
  },
  {
    key: CryptoWallet.CoinbaseWallet,
    name: 'Coinbase Wallet Extension',
  },
  {
    key: CryptoWallet.FrameWallet,
    name: 'Frame Wallet',
  },
  {
    key: CryptoWallet.CloverWallet,
    name: 'Clover Wallet',
  },
];

interface DialogConnectWalletProps {
  onClose: Function;
}

const DialogConnectWallet = (props: DialogConnectWalletProps) => {
  const { onClose, } = props;

  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const { currentWallet, isConnected, connectWallet, disconnectWallet, connectSolanaWallet } = useCurrentWallet();
  const [selectedChain, setSelectedChain] = useState<Chain>();
 
  useEffect(() => {
    if (isConnected && currentWallet.chain === Chain.Solana) onClose();
  }, [isConnected]);

  useEffect(() => {
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), chain: Chain.Solana }));
    else if (currentWallet.chain === Chain.Solana) dispatch(clearWallet());
  }, [wallet.publicKey]);

  const onSelectChain = async (e: any) => {
    if (e.chain === Chain.Solana) {
      connectSolanaWallet();
    } else if (e.chain === Chain.Near) {
      await connectWallet(e.chain);
      onClose();
    } else {
      setSelectedChain(e.chain);
    }
  };
  
  const onSelectWallet = async (e: any) => {
    if (!selectedChain) return;
    try {
      await disconnectWallet();
      await connectWallet(selectedChain, e.key);
      onClose();
    } catch (err: any) {
      toastError(err.message || err);
    }
  }

  return (
    <div className={styles.connectWallet}>
      <h2>Connect wallet</h2>
      <div className={styles.content}>
        <div className={styles.step}>1. Choose network</div>
        <div className={styles.listNetwork}>
          {NETWORKS.map(e => (
            <div
              key={e.chain}
              className={cx(styles.network, e.chain === selectedChain && styles.active)}
              onClick={() => onSelectChain(e)}
            >
              <img alt="" src={e.image} />
              <div>{e.name}</div>
            </div>
          ))}
        </div>
        {selectedChain && (
          <>
            <div className={styles.step}>2. Choose wallet</div>
            <div className={styles.listWallet}>
              {WALLETS.filter(e => !e.chains || e.chains.includes(selectedChain)).map(e => (
                <div
                  key={e.name}
                  className={styles.wallet}
                  onClick={() => onSelectWallet(e)}
                >
                  <img alt="" src={walletIcons[e.key]} />
                  <div>{e.name}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DialogConnectWallet;