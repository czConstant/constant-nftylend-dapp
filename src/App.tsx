import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';

import ModalManager from 'src/common/components/modal';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';

import AppRouter from './navigation';
import { getSystemConfigs } from './modules/nftLend/api';
import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });
  }, []);

  return (
    <SolanaWalletProvider>
      <BrowserRouter>
      {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
        <AppRouter />
      {/* </Scrollbars> */}
      </BrowserRouter>
      <ModalManager />
      <ToastContainer />
      <MyLoadingOverlay />
    </SolanaWalletProvider>
  );
}