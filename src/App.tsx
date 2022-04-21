import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';

// import ModalManager from 'src/common/components/modal';
import ModalManager from 'src/common/components/modalCustom';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';

import AppRouter from './navigation';
import { getSystemConfigs } from './modules/nftLend/api';
import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';
import { NearProvider } from './modules/near/hooks/withNearProvider';

import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import { useDetectConnectedWallet } from './modules/nftLend/hooks/useDetectWallet';

export default function App() {
  const dispatch = useAppDispatch();
  useDetectConnectedWallet();

  useEffect(() => {
    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });
  }, []);

  return (
    <BrowserRouter>
      <NearProvider>
        <SolanaWalletProvider>
        {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
          <AppRouter />
        {/* </Scrollbars> */}
        <ModalManager />
        <ToastContainer />
        <MyLoadingOverlay />

        </SolanaWalletProvider>
      </NearProvider>
    </BrowserRouter>
  );
}