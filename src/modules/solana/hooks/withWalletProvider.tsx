import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletExtensionWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';

import { ChainSolanaNetwork } from 'src/common/constants/network';
import React from 'react';

const SolanaWalletProvider = ({ children }) => {
  const network = ChainSolanaNetwork;
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new SolletWalletAdapter({ network }),
    new SolletExtensionWalletAdapter({ network }),
    new Coin98WalletAdapter({ network }),
  ];
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}

function withWalletProvider(WrappedComponent: any) {
  class HOC extends React.PureComponent{
    render() {
      return (
        <SolanaWalletProvider>
          <WrappedComponent {...this.props} />
        </SolanaWalletProvider>
      )
    }
  }
  return HOC;
}

export { SolanaWalletProvider };
export default withWalletProvider;