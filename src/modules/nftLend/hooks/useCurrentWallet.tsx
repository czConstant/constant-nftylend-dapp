import { WalletSelector } from '@near-wallet-selector/core';

import { AvalancheChainConfig, BobaNetworkConfig, BscChainConfig, Chain, ChainConfigs, PolygonChainConfig } from 'src/common/constants/network';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearWallet, selectCurrentWallet, updateWallet } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';
import { CryptoWallet, getEvmProvider } from 'src/common/constants/wallet';

function useCurrentWallet() {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet);

  const connectSolanaWallet = async () => {
    const el = document.getElementById('solButton');
    if (el) el.click();
  };

  const connectNearWallet = async () => {
    // const isSignedIn = (window.nearSelector as WalletSelector).isSignedIn();
    // if (isSignedIn) {
    //   const wallet = await (window.nearSelector as WalletSelector).wallet()
    //   const nearAccounts = await wallet.getAccounts();
    //   if (nearAccounts.length > 0) {
    //     return dispatch(updateWallet({
    //       address: nearAccounts[0]?.accountId,
    //       chain: Chain.Near,
    //       name: 'near',
    //     }));
    //   }
    // }
    return window.nearWalletModal?.show();
  };

  const connectEvmWallet = async (chain: Chain, wallet?: CryptoWallet) => {
    const provider = getEvmProvider(wallet);
    if (wallet !== CryptoWallet.BinanceWallet) {
      try {
        await provider.send(
          'wallet_addEthereumChain',
          [ ChainConfigs[chain] ],
        );
        await provider.send(
          'wallet_switchEthereumChain',
          [{ chainId: ChainConfigs[chain]?.chainId }],
        );
      } catch (err) {
        console.log("🚀 ~ file: useCurrentWallet.tsx ~ line 32 ~ connectEvmWal ~ err", err)
      }
    }
    window.evmProvider = getEvmProvider(wallet, true);

    await provider.send('eth_requestAccounts', []);
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
      dispatch(updateWallet({ address: accounts[0], chain, wallet, name: wallet }));
    }
  };

  const connectWallet = async (chain: Chain, wallet?: CryptoWallet) => {
    if (chain === Chain.Solana) {
      return connectSolanaWallet();
    } else if (chain === Chain.Near) {
      return connectNearWallet();
    } else if (isEvmChain(chain)) {
      return connectEvmWallet(chain, wallet);
    }
  };

  const disconnectWallet = async () => {
    dispatch(clearWallet());
  };

  const switchChain = async (chain: Chain) => {
    if (isEvmChain(chain)) {
      return connectEvmWallet(chain);
    }
  };

  return {
    currentWallet,
    isConnected: currentWallet.address && currentWallet.chain,
    connectSolanaWallet,
    connectEvmWallet,
    connectNearWallet,
    connectWallet,
    disconnectWallet,
    switchChain,
  };
};

export { useCurrentWallet };