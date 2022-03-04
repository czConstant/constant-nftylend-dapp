import { FC, useMemo } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletExtensionWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98';
import { clusterApiUrl } from '@solana/web3.js';

import { getSolCluster } from '../utils/solana';

export const SolanaWalletProvider: FC = (props) => {
  const network = getSolCluster();
  const endpoint = clusterApiUrl(network);

  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter({ network }),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new Coin98WalletAdapter({ network }),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {props.children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useSolanaWallet = useWallet;
