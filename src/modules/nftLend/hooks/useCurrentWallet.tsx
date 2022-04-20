import * as nearAPI from 'near-api-js';

import { Chain, ChainConfigs } from 'src/common/constants/network';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearWallet, selectCurrentWallet, updateWallet } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';
import { CryptoWallet, getEvmProvider } from 'src/common/constants/wallet';
import { getNearConfig, initNear } from 'src/modules/near/utils';

function useCurrentWallet() {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet);

  const connectSolanaWallet = async () => {
    const el = document.getElementById('solButton');
    if (el) el.click();
  };

  const connectNearWallet = async () => {
    if (!window.nearAccount) await initNear();
    const signedIn = window.nearAccount.isSignedIn();
    if (signedIn) {
      dispatch(updateWallet({
        address: window.nearAccount.getAccountId(),
        chain: Chain.Near,
        name: 'near',
      }));
    } else {
      const connection = new nearAPI.WalletConnection(window.near, null);
      connection.requestSignIn(getNearConfig().contractName);
    }
  };

  const connectEvmWallet = async (chain: Chain, wallet?: CryptoWallet) => {
    const provider = getEvmProvider(wallet);
    window.evmProvider = provider;
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
    await provider.send('eth_requestAccounts', []);
    const accounts = await provider.listAccounts();
    dispatch(updateWallet({ address: accounts[0], chain, wallet, name: wallet }));
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
    connectWallet,
    disconnectWallet,
    switchChain,
  };
};

export { useCurrentWallet };