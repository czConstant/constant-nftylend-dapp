import React, { useEffect } from 'react';
import * as nearAPI from 'near-api-js';
import queryString from "query-string";
import { useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { requestReload, selectNftyLend, updateWallet } from 'src/store/nftyLend';
import localStore from 'src/common/services/localStore';
import { getLinkNearExplorer, getNearConfig } from '../utils';
import { Chain } from 'src/common/constants/network';
import { toastSuccess } from 'src/common/services/toaster';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';

const NearProvider = ({ children }) => {
  const near_nftypawn_address = useAppSelector(selectNftyLend).configs.near_nftypawn_address;
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = queryString.parse(location.search);
    const txHash = params.transactionHashes as string;
    const token_id = params.token_id as string;
    const contract_address = params.contract_address as string;
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);
    if (walletChain === Chain.Near && token_id && contract_address) {
      api.post(API_URL.NFT_LEND.SYNC_NEAR, { token_id, contract_address }).then(res => {
        dispatch(requestReload())
      });
    }
    if (walletChain === Chain.Near && txHash) {
      window.history.replaceState(null, '', window.location.pathname);
      toastSuccess(<>
        Transaction is successful.{" "}
        <a target="_blank" href={getLinkNearExplorer(txHash, 'tx')}>
          View transaction
        </a>
      </>);
    }
  }, []);

  useEffect(() => {
    window.nearInitPromise = initNearContract().then(() => {
      checkConnected()
    });
  }, [near_nftypawn_address])

  const checkConnected = () => {
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);
    const isBackFromNear = !!queryString.parse(location.search).account_id;
    if (window.near && (isBackFromNear || walletChain === Chain.Near))  {
      const signedIn = window.nearAccount.isSignedIn();
      if (signedIn) {
        window.history.replaceState(null, '', window.location.pathname);
        dispatch(updateWallet({
          address: window.nearAccount.getAccountId(),
          chain: Chain.Near,
          name: 'near',
        }));
      }
    }
  }

  const initNearContract = async () => {
    // Initializing connection to the NEAR node.
    const config = getNearConfig();
    window.near = await nearAPI.connect({
      ...config,
      contractName: near_nftypawn_address,
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    });
    window.nearAccount = new nearAPI.WalletAccount(window.near, null);
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

function withNearProvider(WrappedComponent: any) {
  class HOC extends React.PureComponent{
    render() {
      return (
        <NearProvider>
          <WrappedComponent {...this.props} />
        </NearProvider>
      )
    }
  }
  return HOC;
}

export { NearProvider };
export default withNearProvider;