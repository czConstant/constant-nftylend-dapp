import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';
import { useWallet } from '@solana/wallet-adapter-react';

// import ModalManager from 'src/common/components/modal';
import ModalManager from 'src/common/components/modalCustom';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';

import AppRouter from './navigation';
import { getSystemConfigs } from './modules/nftLend/api';
import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import { useToken } from './modules/nftLend/hooks/useToken';

export default function App() {
  const dispatch = useAppDispatch();
  const { checkConnectedWallet } = useToken();
  
  useEffect(() => {
    checkConnectedWallet();
  }, []);

  useEffect(() => {
    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });
  }, []);

  return (
    <>
      <BrowserRouter>
      {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
        <AppRouter />
      {/* </Scrollbars> */}
      </BrowserRouter>
      <ModalManager />
      <ToastContainer />
      <MyLoadingOverlay />
    </>
  );
}