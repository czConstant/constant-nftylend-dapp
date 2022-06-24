import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { Scrollbars } from 'react-custom-scrollbars-2';
import { ChakraProvider } from '@chakra-ui/react'
import { useCookies } from 'react-cookie'
import queryString from "query-string";
import moment from 'moment-timezone';

import ModalManager from 'src/common/components/modal';
// import ModalManager from 'src/common/components/modalCustom';
import MyLoadingOverlay from 'src/common/components/myLoadingOverlay';

import AppRouter from './navigation';
import { getSystemConfigs } from './modules/nftLend/api';
import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';
import { NearWalletProvider } from './modules/near/hooks/withNearWalletProvider';

import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import { useDetectConnectedWallet } from './modules/nftLend/hooks/useDetectWallet';
import customTheme from './theme';

export default function App() {
  const dispatch = useAppDispatch();
  const [cookie, setCookkie, removeCookie] = useCookies(['referral_code'])

  useDetectConnectedWallet();

  useEffect(() => {
    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });

    const query = queryString.parse(location.search)
    if (query.r && !cookie.referral_code) {
      setCookkie('referral_code', query.r, { expires: moment().add(60, 'd').toDate() })
    }
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