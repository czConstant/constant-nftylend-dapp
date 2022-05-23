import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { APP_CLUSTER } from '../../common/constants/config';
import store from 'src/store';

const SOL_CLUSTER = APP_CLUSTER === 'mainnet' ? 'mainnet-beta' : 'devnet';

const toPubkey = (key: PublicKey | string) => typeof(key) === 'string' ? new PublicKey(key) : key;

export const getSolanaLendingProgramId = () => {
  return store.getState().nftyLend.configs.program_id;
};

export const getLinkSolScanExplorer = (address?: string, type?: 'tx' | 'address') => `https://solscan.io/${type}/${address}?cluster=${SOL_CLUSTER}`;
export const getLinkETHScanAddress = (address?: string) => `https://etherscan.io/address/${address}`;
export const getLinkETHScanTokenId = (address?: string, id: string) => `https://etherscan.io/token/${address}?a=${id}`;

export const fetchAllTokenAccounts = async (connection: Connection, publicKey: PublicKey | string) => {
  try {
    const res = await connection.getParsedTokenAccountsByOwner(toPubkey(publicKey), { programId: TOKEN_PROGRAM_ID });
    const accounts: Map<String, any> = new Map();
    res.value.forEach((e) => {
      const address = e?.account?.data?.parsed?.info?.mint;
      accounts.set(address, { ...e?.account?.data?.parsed?.info?.tokenAmount, publicKey: e.pubkey.toString() });
    });
    return accounts;
  } catch (err) {
    console.log("🚀 ~ file: utils.js ~ line 14 ~ fetchAllTokenAccounts ~ err", err)
  }
};

export const getAssociatedAccount = async (publicKey: PublicKey | string, tokenMint: PublicKey | string) => {
  try {
    const res = await PublicKey.findProgramAddress(
      [toPubkey(publicKey).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPubkey(tokenMint).toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return res[0].toString();
  } catch (err) {
    console.log("🚀 ~ file: index.js ~ line 70 ~ useEffect ~ err", err)
  }
};

export const getBalanceSolToken = async (connection: Connection, publicKey: PublicKey | string, tokenMint: PublicKey | string) => {
  try {
    let addresses = await PublicKey.findProgramAddress(
      [toPubkey(publicKey).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPubkey(tokenMint).toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const associatedAcc = addresses[0];
    const res = await connection.getParsedAccountInfo(associatedAcc);
    return (res.value?.data as ParsedAccountData).parsed?.info?.tokenAmount?.amount;
  } catch (err) {
    console.log("🚀 ~ file: index.js ~ line 70 ~ useEffect ~ err", err)
  }
};

export const getCluster = () => {
  if (SOL_CLUSTER === 'mainnet-beta') return WalletAdapterNetwork.Mainnet;
  return WalletAdapterNetwork.Devnet;
};

export const getAccountInfo = async (connection: Connection, publicKey: PublicKey | string) => {
  try {
    const res = await connection.getAccountInfo(toPubkey(publicKey));
    return res;
  } catch (err) {
    console.log("🚀 ~ file: index.js ~ line 70 ~ useEffect ~ err", err);
  }
};