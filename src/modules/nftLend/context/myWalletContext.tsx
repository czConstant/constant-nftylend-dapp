import moment from 'moment-timezone';
import { createContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { AvalancheChainConfig, BobaNetworkConfig, BscChainConfig, Chain, ChainConfigs, PolygonChainConfig } from 'src/common/constants/network';
import { CryptoWallet, getEvmProvider } from 'src/common/constants/wallet';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearWallet, selectCurrentWallet, updateUserSettings, updateWallet } from 'src/store/nftyLend';
import { connectUserFromRefer } from 'src/modules/nftLend/api';

import { getUserSettings } from '../api';
import { isEvmChain } from '../utils';
import { nearSignText } from 'src/modules/near/utils';

// ** Defaults
const defaultProvider = {
  currentWallet: { address: '', chain: Chain.None },
  isConnected: false,
  isFromParas: false,
  connectSolanaWallet: () => null,
  connectEvmWallet: () => null,
  connectNearWallet: () => null,
  connectWallet: () => null,
  disconnectWallet: () => null,
  switchChain: () => null,
  syncUserSettings: () => null,
}

const MyWalletContext = createContext(defaultProvider)

const MyWalletProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet);
  const [cookie, setCookkie, removeCookie] = useCookies(['referral_code'])

  useEffect(() => {
    if (!currentWallet.address) return
    syncUserSettings().then(res => {
      if (!res.result.is_connected && currentWallet.chain === Chain.Near) {
        const timestamp = moment().unix()
        nearSignText(currentWallet.address, String(timestamp)).then(signature => {
          connectUserFromRefer({ address: currentWallet.address, network: Chain.Near, timestamp, signature, referrer_code: cookie.referral_code })
        })
      }
    })
  }, [currentWallet])

  const syncUserSettings = async () => {
    try {
      const res = await getUserSettings(currentWallet.address, currentWallet.chain)
      dispatch(updateUserSettings(res.result))
      return res
    } catch (err) { }
  }

  const connectSolanaWallet = async () => {
    const el = document.getElementById('solButton');
    if (el) el.click();
  };

  const connectNearWallet = async () => {
    const nearAccounts =  await window.nearSelector?.getAccounts();
    const isSignedIn = await window.nearSelector?.isSignedIn();
    if (isSignedIn && nearAccounts.length > 0) {
      dispatch(updateWallet({
        address: nearAccounts[0]?.accountId,
        chain: Chain.Near,
        name: 'near',
      }));
    } else {
      window.nearSelector?.show();
    }
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

  const values = {
    currentWallet,
    isConnected: currentWallet.address && currentWallet.chain,
    connectSolanaWallet,
    connectEvmWallet,
    connectNearWallet,
    connectWallet,
    disconnectWallet,
    switchChain,
    syncUserSettings,
    isFromParas: cookie.referral_code === 'paras'
  }

  return <MyWalletContext.Provider value={values}>{children}</MyWalletContext.Provider>
}

export { MyWalletContext, MyWalletProvider }
