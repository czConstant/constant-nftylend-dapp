import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';

import ModalManager from 'src/common/components/modal';
import LoadingOverlay from 'src/common/components/loadingOverlay';
import { SolanaWalletProvider } from 'src/common/contexts/SolanaWalletContext';

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
  
  return (
    <SolanaWalletProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <ModalManager />
      <ToastContainer />
      <LoadingOverlay />
    </SolanaWalletProvider>
  );
}