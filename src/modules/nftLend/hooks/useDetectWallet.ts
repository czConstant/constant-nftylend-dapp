import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AvalancheChainConfig, BobaNetworkConfig, BscChainConfig, Chain, PolygonChainConfig } from 'src/common/constants/network';
import { useAppDispatch } from 'src/store/hooks';
import { clearWallet, updateWallet } from 'src/store/nftyLend';
import localStore from 'src/common/services/localStore';
import { getEvmProvider } from 'src/common/constants/wallet';
import { useCurrentWallet } from './useCurrentWallet';
import { isEvmChain } from '../utils';

function useDetectConnectedWallet() {
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  const { currentWallet } = useCurrentWallet();

  useEffect(() => {
    checkWallet();
  }, [wallet]);

  const checkWallet = async () => {
    const walletChain = localStore.get(localStore.KEY_WALLET_CHAIN);
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
        chain: walletChain,
        name: walletName,
      }));
    }
  }
};

export { useDetectConnectedWallet };