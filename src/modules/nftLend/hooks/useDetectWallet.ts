import { useWallet } from '@solana/wallet-adapter-react';
import queryString from "query-string";

import { AvalancheChainConfig, BobaNetworkConfig, BscChainConfig, Chain, PolygonChainConfig } from 'src/common/constants/network';
import { useAppDispatch } from 'src/store/hooks';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import localStore from 'src/common/services/localStore';
import { useCurrentWallet } from './useCurrentWallet';
import { useEffect } from 'react';
import { getEvmProvider } from 'src/common/constants/wallet';

function useDetectConnectedWallet() {
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  const { currentWallet } = useCurrentWallet();
  
  useEffect(() => {
    checkWallet();
  }, [wallet]);
  
  const checkWallet = async () => {
    if (!localStore.get(localStore.KEY_WALLET_ADDRESS) || !localStore.get(localStore.KEY_WALLET_CHAIN)) return;
    if (wallet.connected) {
      return dispatch(updateWallet({ address: wallet.publicKey?.toString(), chain: Chain.Solana }));
    }
    if (!wallet.connected && currentWallet.chain === Chain.Solana) {
      return dispatch(clearWallet());
    }
    const walletName = localStore.get(localStore.KEY_WALLET_NAME);
    const provider = getEvmProvider(walletName);
    window.evmProvider = provider;
    const accounts = await provider.listAccounts();
    provider.provider.on('accountsChanged', (e: any) => {
      dispatch(updateWallet({ address: e[0] }));
    });
    provider.provider.on('chainChanged', (e: any) => {
      if (e === PolygonChainConfig.chainId) dispatch(updateWallet({ chain: Chain.Polygon }));
      if (e === AvalancheChainConfig.chainId) dispatch(updateWallet({ chain: Chain.Avalanche }));
      if (e === BscChainConfig.chainId) dispatch(updateWallet({ chain: Chain.BSC }));
      if (e === BobaNetworkConfig.chainId) dispatch(updateWallet({ chain: Chain.Boba }));
    });
    if (accounts.length > 0) {
      dispatch(updateWallet({
        address: accounts[0],
        chain: localStore.get(localStore.KEY_WALLET_CHAIN),
        name: walletName,
      }));
    }
  }
};

export { useDetectConnectedWallet };