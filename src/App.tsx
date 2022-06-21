import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NftPawn from '@nftpawn-js/core';
// import { Scrollbars } from 'react-custom-scrollbars-2';
import { ChakraProvider } from '@chakra-ui/react'

import ModalManager from 'src/common/components/modal';
// import ModalManager from 'src/common/components/modalCustom';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';
import { APP_CLUSTER } from 'src/common/constants/config';

import AppRouter from './navigation';
import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';
import { NearWalletProvider } from './modules/near/hooks/withNearWalletProvider';

import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import { useDetectConnectedWallet } from './modules/nftLend/hooks/useDetectWallet';
import customTheme from './theme';

export default function App() {
  const dispatch = useAppDispatch();
  useDetectConnectedWallet();

  useEffect(() => {
    NftPawn.init({ cluster: APP_CLUSTER }).then(() => {
      dispatch(updateConfigs(NftPawn.getConfig()));
    });
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <BrowserRouter>
        <NearWalletProvider>
          <SolanaWalletProvider>
          {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
            <AppRouter />
          {/* </Scrollbars> */}
          <ModalManager />
          <ToastContainer />
          <MyLoadingOverlay />

          </SolanaWalletProvider>
        </NearWalletProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}