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
import { useAppDispatch, useAppSelector } from './store/hooks';
import { clearWallet, selectNftyLend, updateConfigs, updateWallet } from './store/nftyLend';
import { Chain } from './common/constants/network';

export default function App() {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;
  const wallet = useWallet();
  
  useEffect(() => {
    console.log("🚀 ~ file: App.tsx ~ line 25 ~ useEffect ~ wallet?.publicKey", wallet?.publicKey)
    if (wallet?.publicKey) dispatch(updateWallet({ address: wallet.publicKey.toString(), network: Chain.Solana }));
    else if (walletChain === Chain.Solana) dispatch(clearWallet());
  }, [wallet.publicKey]);

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