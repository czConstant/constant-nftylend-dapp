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
import { initRecaptchaV3 } from 'src/common/services/recaptchaV3';
import { useDetectConnectedWallet } from 'src/modules/nftLend/hooks/useDetectWallet';
import { MyWalletProvider } from 'src/modules/nftLend/context/myWalletContext';
import { getSystemConfigs } from 'src/modules/nftLend/api';

import AppRouter from './navigation';
// import { SolanaWalletProvider } from './modules/solana/hooks/withWalletProvider';
import { NearWalletProvider } from './modules/near/hooks/withNearWalletProvider';

import { useAppDispatch } from './store/hooks';
import { updateConfigs } from './store/nftyLend';
import customTheme from './theme';

export default function App() {
  const dispatch = useAppDispatch();
  const [cookie, setCookkie, removeCookie] = useCookies(['referral_code'])

  useDetectConnectedWallet();

  useEffect(() => {
    initRecaptchaV3()

    getSystemConfigs().then(res =>{ 
      if (res.result) dispatch(updateConfigs(res.result));
    });

    const query = queryString.parse(location.search)
    if (query.r && !cookie.referral_code) {
      setCookkie('referral_code', query.r, { expires: moment().add(30, 'd').toDate() })
    }
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <BrowserRouter>
        <NearWalletProvider>
          <MyWalletProvider>
          {/* <SolanaWalletProvider> */}
            {/* <Scrollbars  style={{ width: `100vw`, height: `100vh` }}> */}
              <AppRouter />
            {/* </Scrollbars> */}
            <ModalManager />
            <ToastContainer />
            <MyLoadingOverlay />
          </MyWalletProvider>
          {/* </SolanaWalletProvider> */}
        </NearWalletProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}