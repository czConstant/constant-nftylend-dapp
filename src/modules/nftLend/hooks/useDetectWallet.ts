import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import queryString from 'query-string';

import { Chain } from 'src/common/constants/network';
import { useAppDispatch } from 'src/store/hooks';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import localStore from 'src/common/services/localStore';
import { getEvmProvider } from 'src/common/constants/wallet';
import { useCurrentWallet } from './useCurrentWallet';
import { initNear } from 'src/modules/near/utils';
import { isEvmChain } from '../utils';

function useDetectConnectedWallet() {
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  const { currentWallet, connectEvmWallet } = useCurrentWallet();

  useEffect(() => {
    initNear().then(() => checkWallet());
  }, []);
  
  useEffect(() => {
    checkWallet();
  }, [wallet]);

  const checkWallet = async () => {
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);
    const isBackFromNear = !!queryString.parse(window.location.search).account_id;
    const isPreviousConnected = localStore.get(localStore.KEY_WALLET_ADDRESS) && localStore.get(localStore.KEY_WALLET_CHAIN);
    if (isBackFromNear || walletChain === Chain.Near)  {
      const accountId = window.nearWallet?.connection?.getAccountId();
      if (accountId) return dispatch(updateWallet({
          address: accountId,
          chain: Chain.Near,
          name: 'near',
        }));
    }
    if (!isPreviousConnected) return;
    /* Check SOL wallet */
    if (wallet.connected) {
      return dispatch(updateWallet({ address: wallet.publicKey?.toString(), chain: Chain.Solana }));
    }
    if (!wallet.connected && currentWallet.chain === Chain.Solana) {
      return dispatch(clearWallet());
    }
    if (!isEvmChain(walletChain)) return;
    /* Check EVM wallet */
    const walletName = localStore.get(localStore.KEY_WALLET_NAME);
    connectEvmWallet(walletChain, walletName)
  }
};

export { useDetectConnectedWallet };