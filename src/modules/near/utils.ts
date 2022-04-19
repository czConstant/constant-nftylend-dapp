import * as nearAPI from 'near-api-js';
import { APP_CLUSTER } from 'src/common/constants/config'
import api from 'src/common/services/apiClient';
import store from 'src/store';

export const NEAR_DEFAULT_GAS = 30000000000000;

export function getNearConfig(): nearAPI.ConnectConfig  {
  switch (APP_CLUSTER) {
  case 'mainnet':
    return {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
      contractName: store.getState().nftyLend.configs.near_nftypawn_address,
    };
  default:
    return {
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
      contractName: store.getState().nftyLend.configs.near_nftypawn_address,
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
  const config = getNearConfig();
  window.near = await nearAPI.connect({ ...config, keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() });
  window.nearAccount = new nearAPI.WalletAccount(window.near, null);
}

export async function getBalanceNearToken(owner: string, contractAddress: string): Promise<any> {
  const ftContract = await window.near.loadContract(
    contractAddress,
    { viewMethods: ["ft_balance_of"], changeMethods: [""], sender: owner }
  );
  return new Promise((resolve, reject) => {
    try {
      ftContract.ft_balance_of({ account_id: owner }).then((res: number) => {
        resolve(res);
      });
    } catch (err) {
      reject(err);
    }
  })
}

export async function getNearNftsByOwner(owner: string): Promise<Array<any>> {
  let accounts = await api.get(`https://helper.testnet.near.org/account/${owner}/likelyNFTs`) as Array<string>;
  let list = [];
  const account = await window.near.account(owner);
  for (let id of accounts) {
    const result = await account.viewFunction(id, "nft_tokens_for_owner", {
        account_id: owner,
        from_index: "0",
        limit: 64,
      });
    list.push(...result.map((e: any) => ({ ...e, contract_address: id })));
  }
  return list;
}
