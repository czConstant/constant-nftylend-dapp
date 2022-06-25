import React, { useContext, useEffect, useMemo, useState } from 'react';
import queryString from "query-string";
import { useLocation } from 'react-router-dom';

import NearWalletSelector, { AccountInfo, NetworkId } from '@near-wallet-selector/core';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import nearWalletIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import IconSender from 'src/assets/images/wallet/sender-wallet.png'

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearWallet, requestReload, selectNftyLend, updateWallet } from 'src/store/nftyLend';
import { Chain } from 'src/common/constants/network';
import localStore from 'src/common/services/localStore';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { toastSuccess } from 'src/common/services/toaster';

import { getLinkNearExplorer, getNearConfig } from '../utils';

interface WalletSelectorContextValue {
  selector: NearWalletSelector;
  accounts: Array<AccountInfo>;
  accountId: string | null;
  setAccountId: (accountId: string) => void;
}

const WalletSelectorContext = React.createContext<WalletSelectorContextValue | null>(null);

export const NearWalletProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const near_nftypawn_address = useAppSelector(selectNftyLend).configs.near_nftypawn_address;
  const location = useLocation();

  const [selector, setSelector] = useState<NearWalletSelector | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const savedAddress = useMemo(() => localStore.get(localStore.KEY_WALLET_ADDRESS), []);

  const syncAccountState = (
    currentAccountId: string | null,
    newAccounts: Array<AccountInfo>
  ) => {
    const isBackFromNear = !!queryString.parse(location.search).account_id;
    const savedChain= localStore.get(localStore.KEY_WALLET_CHAIN);

    if (savedChain !== Chain.Near && !isBackFromNear) return;
    if (!newAccounts.length) {
      dispatch(clearWallet());
      setAccountId(null);
      return;
    }

    const previousAccountId = currentAccountId || savedAddress;
    const validAccountId = previousAccountId && newAccounts.some((x) => x.accountId === previousAccountId);
    const newAccountId = validAccountId ? previousAccountId : newAccounts[0].accountId;

    setAccountId(newAccountId);
    dispatch(updateWallet({
      address: newAccountId,
      chain: Chain.Near,
      name: 'near',
    }));
  };

  const initSelector = async () => {
    try {
      console.log("🚀 ~ file: withNearWalletProvider.tsx ~ line 76 ~ initSelector ~ near_nftypawn_address", near_nftypawn_address)
      const instance = await NearWalletSelector.init({
        network: getNearConfig().networkId as NetworkId,
        contractId: near_nftypawn_address,
        wallets: [
          setupNearWallet({ iconUrl: nearWalletIconUrl }),
          setupSender({ iconUrl: IconSender }),
        ],
      });

      window.nearSelector = instance;
      const newAccounts =  await instance.getAccounts();

      syncAccountState('', newAccounts);
      setSelector(instance);
    } catch (er) {
      alert("Failed to initialise wallet selector");
    }
  }

  const checkSync = async (token_id: string, contract_address: string ) => {
    let count = 0;
    while (count < 6) {
      try {
        const res = await api.post(API_URL.NFT_LEND.SYNC_NEAR, { token_id, contract_address });
        if (res.result) {
          dispatch(requestReload());
          break;
        }
      } catch (err) { }
      await new Promise(r => setTimeout(r, 5000));
      count += 1;
    }
  }

  useEffect(() => {
    const params = queryString.parse(location.search);
    const txHash = params.transactionHashes as string;
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);

    let token_id = params.token_id as string || localStore.get(localStore.KEY_NEAT_NFT_TOKEN_ID);
    let contract_address = params.contract_address as string || localStore.get(localStore.KEY_NEAR_NFT_CONTRACT);
    if (walletChain === Chain.Near && token_id && contract_address) {
      localStore.remove(localStore.KEY_NEAR_NFT_CONTRACT);
      localStore.remove(localStore.KEY_NEAT_NFT_TOKEN_ID);
      checkSync(token_id, contract_address);
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
    if (near_nftypawn_address) initSelector();
  }, [near_nftypawn_address])

  useEffect(() => {
    if (!selector) return;
    
    const changedListener = selector.on("accountsChanged", (e) => {
      syncAccountState(accountId, e.accounts);
    });

    const signInListender = selector.on("signIn", (e) => {
      localStore.save(localStore.KEY_WALLET_CHAIN, Chain.Near);
      syncAccountState(accountId, e.accounts);
    });

    return () => {
      changedListener.remove();
      signInListender.remove();
    }
  }, [selector, accountId]);

  if (!selector) {
    return null;
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export function useNearWallet() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a NearWalletProvider"
    );
  }

  return context;
}