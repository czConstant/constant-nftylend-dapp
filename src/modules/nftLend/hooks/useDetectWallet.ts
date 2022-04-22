import { useWallet } from '@solana/wallet-adapter-react';

import { Chain } from 'src/common/constants/network';
import { useAppDispatch } from 'src/store/hooks';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import localStore from 'src/common/services/localStore';
import { useCurrentWallet } from './useCurrentWallet';
import { useEffect } from 'react';
import { getEvmProvider } from 'src/common/constants/wallet';

function useDetectConnectedWallet() {
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  const { currentWallet, connectEvmWallet } = useCurrentWallet();
  
  useEffect(() => {
    checkWallet();
  }, [wallet]);
  
  const checkWallet = async () => {
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);
    if (!localStore.get(localStore.KEY_WALLET_ADDRESS) || !localStore.get(localStore.KEY_WALLET_CHAIN)) return;
    if (wallet.connected) {
      return dispatch(updateWallet({ address: wallet.publicKey?.toString(), chain: Chain.Solana }));
    }
    if (!wallet.connected && currentWallet.chain === Chain.Solana) {
      return dispatch(clearWallet());
    }

    const walletName = localStore.get(localStore.KEY_WALLET_NAME);
    connectEvmWallet(walletChain, walletName)
    const provider = getEvmProvider(walletName);
    window.evmProvider = provider;
  }
};

export { useDetectConnectedWallet };