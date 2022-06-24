import BigNumber from "bignumber.js";
import * as nearAPI from "near-api-js";
import { AccountView, CodeResult } from "near-api-js/lib/providers/provider";

import { APP_CLUSTER } from "src/common/constants/config";
import api from "src/common/services/apiClient";
import { NearNft } from "src/modules/near/models/nearNft";

export const NEAR_DEFAULT_GAS =
  nearAPI.utils.format.parseNearAmount("0.0000000003")
export const NEAR_TX_REVERSE =
  nearAPI.utils.format.parseNearAmount("0.05")
export const NEAR_STORATE_AMOUNT_PER_BYTE =
  nearAPI.utils.format.parseNearAmount("0.00001")
export const NEAR_PARAS_CREATOR = 'x.paras.near'

export enum NEAR_LOAN_STATUS {
  Open = 0,
  Processing = 1,
  Done = 2,
  Liquidated = 3,
  Refunded = 4,
  Canceled = 5,
}

export function getNearConfig(): nearAPI.ConnectConfig {
  switch (APP_CLUSTER) {
  case 'mainnet':
    return {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.near.org',
      helperUrl: 'https://api.kitwallet.app',
      explorerUrl: 'https://explorer.mainnet.near.org',
    };
  default:
    return {
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://testnet-api.kitwallet.app',
      explorerUrl: 'https://explorer.testnet.near.org',
    }
  }
}

export const getLinkNearExplorer = (
  address?: string,
  type?: "tx" | "address"
) => {
  const domain =
    APP_CLUSTER === "mainnet"
      ? `https://explorer.near.org`
      : `https://explorer.testnet.near.org`;
  const path = type === "tx" ? "transactions" : "accounts";
  return `${domain}/${path}/${address}`;
};

export async function getNearBalance(
  address: string
): Promise<number | string> {
  const res = await getNearProvider().query<AccountView>({
    request_type: "view_account",
    account_id: address,
    finality: "final",
  });
  const storageAmount = new BigNumber(Number(NEAR_STORATE_AMOUNT_PER_BYTE)).multipliedBy(res.storage_usage)
  const lockedAmount = new BigNumber(res.locked)
  const available = new BigNumber(res.amount).minus(storageAmount).minus(Number(NEAR_TX_REVERSE)).minus(lockedAmount).toString(10)
  return nearAPI.utils.format.formatNearAmount(available);
}

export async function getBalanceNearToken(
  owner: string,
  contractAddress: string
): Promise<any> {
  const res = await nearViewFunction(contractAddress, "ft_balance_of", {
    account_id: owner,
  });
  return res;
}

export async function getNearNftsByOwner(owner: string): Promise<Array<any>> {
  let accounts = (await api.get(
    `${getNearConfig().helperUrl}/account/${owner}/likelyNFTs`
  )) as Array<string>;
  let list = [];
  for (let id of accounts) {
    try {
      const metadata = await nearViewFunction(id, "nft_metadata");
      const result = await nearViewFunction(id, "nft_tokens_for_owner", {
        account_id: owner,
        from_index: "0",
        // limit: 64,
      });
      list.push(
        ...result.map((e: any) => {
          e.contract_address = id;
          return NearNft.parse(e, metadata);
        })
      );
    } catch (err) {
      console.log("🚀 ~ file: utils.ts ~ line 64 ~ getNearNftsByOwner ~ err", err);
    }
  }
  return list;
}

export const getNearProvider = () => {
  const { nodeUrl } = window.nearSelector.network;
  const provider = new nearAPI.providers.JsonRpcProvider({ url: nodeUrl });

  return provider;
};

export const nearViewFunction = async (
  accountId: string,
  methodName: string,
  args?: any
) => {
  const res = await getNearProvider().query<CodeResult>({
    request_type: "call_function",
    account_id: accountId,
    finality: "optimistic",
    method_name: methodName,
    args_base64: args
      ? Buffer.from(JSON.stringify(args)).toString("base64")
      : "",
  });
  return JSON.parse(Buffer.from(res.result).toString());
};

function toHexString(byteArray: any) {
  return Array.from(byteArray, function (byte: any) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export const nearSignText = async (accountId: string, data: string): Promise<string> => {
  try {
    const msg = Buffer.from(data);
    let signature: any;
    let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    let keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);

    if (keyPair) {
      signature = keyPair.sign(msg).signature;
    } else if (window.near?.isSender) {
      if (!window.near.account().connection.signer.signMessage) throw Error('Please unlock your Sender wallet and reload again')
      const res = await window.near.account().connection.signer.signMessage(data, accountId, getNearConfig().networkId)
      signature = res.signature
    }
    const signatureToHex = toHexString(signature);
    return signatureToHex;
  } catch (error) {
    throw error;
  }
};
