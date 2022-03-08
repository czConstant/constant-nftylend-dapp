import { BrowserRouter } from 'react-router-dom';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletExtensionWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';

import ModalManager from 'src/common/components/modal';
import { getSolCluster } from 'src/common/utils/solana';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';

import AppRouter from './navigation';

export default function App() {
  const network = getSolCluster();
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
        <BrowserRouter>
        {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
          <AppRouter />
        {/* </Scrollbars> */}
        </BrowserRouter>
        <ModalManager />
        <ToastContainer />
        <MyLoadingOverlay />
      </WalletProvider>
    </ConnectionProvider>
  );
}