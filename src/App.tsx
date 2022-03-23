import { useEffect } from 'react';
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
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';
import { ChainSolanaNetwork } from 'src/common/constants/network';

import AppRouter from './navigation';
import { getSystemConfigs } from './modules/nftLend/api';
import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftLend';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });
  }, []);

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