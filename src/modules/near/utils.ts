import * as nearAPI from 'near-api-js';
import { APP_CLUSTER } from 'src/common/constants/config'
import api from 'src/common/services/apiClient';
import { NearNft } from 'src/modules/near/models/nearNft';

export const NEAR_DEFAULT_GAS = nearAPI.utils.format.parseNearAmount('0.0000000003');

export function getNearConfig(): nearAPI.ConnectConfig  {
  switch (APP_CLUSTER) {
  case 'mainnet':
    return {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
    };
  default:
    return {
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    }
  }
};

export const getLinkNearExplorer = (address?: string, type?: 'tx' | 'address') => {
  const domain = APP_CLUSTER === 'mainnet' ? `https://explorer.near.org` : `https://explorer.testnet.near.org`;
  const path = type === 'tx' ? 'transactions' : 'accounts';
  return `${domain}/${path}/${address}`;
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
  let accounts = await api.get(`${getNearConfig().helperUrl}/account/${owner}/likelyNFTs`) as Array<string>;
  let list = [];
  const account = await window.near.account(owner);
  for (let id of accounts) {
    try {
      const metadata = await account.viewFunction(id, "nft_metadata")
      const result = await account.viewFunction(id, "nft_tokens_for_owner", {
        account_id: owner,
        from_index: "0",
        limit: 64,
      });
      list.push(...result.map((e: any) => {
        e.contract_address = id;
        return NearNft.parse(e, metadata)
      }))
    } catch (err) {
      console.log("🚀 ~ file: utils.ts ~ line 64 ~ getNearNftsByOwner ~ err", err)
    }
  }
  return list;
}
