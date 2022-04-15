import { APP_CLUSTER } from 'src/common/constants/config'
import * as nearAPI from 'near-api-js';

export function getNearConfig(): nearAPI.ConnectConfig  {
  switch (APP_CLUSTER) {
  case 'mainnet':
    return {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
      contractName: '',
    };
  default:
    return {
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
      contractName: 'dev-1649927134070-80628902826751',
    }
  }
};

export const getLinkNearExplorer = (address?: string, type?: 'tx' | 'address') => {
  const domain = APP_CLUSTER === 'mainnet' ? `https://explorer.near.org` : `https://explorer.testnet.near.org`;
  const path = type === 'tx' ? 'transactions' : 'accounts';
  return `${domain}/${path}/${address}`;
}

export async function initNear() {
  window.nearInitPromise = initNearContract();
  return window.nearInitPromise;
}

async function initNearContract() {
  // Initializing connection to the NEAR node.
  window.nearWallet = {};
  const config = getNearConfig();
  window.nearWallet.near = await nearAPI.connect({ ...config, keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() });
  window.nearWallet.connection = new nearAPI.WalletConnection(window.nearWallet.near, 'nftpawn');
  const accountId = window.nearWallet.connection.getAccountId();
  window.nearWallet.account = await window.nearWallet.near.account(accountId);
}

export async function getNearNftsByOwner(owner: string) {
  let result = await window.nearWallet.account
    .viewFunction(owner, "nft_tokens_for_owner", {
        account_id: owner,
        from_index: "0",
        limit: 64,
      });
  return result;
}