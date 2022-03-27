import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';

import { SOL_CLUSTER } from '../../common/constants/config';

const toPubkey = (key: PublicKey | string) => typeof(key) === 'string' ? new PublicKey(key) : key;

export const getLinkSolScanTx = (txHash?: string) => `https://solscan.io/tx/${txHash}?cluster=${SOL_CLUSTER}`;
export const getLinkSolScanAccount = (address?: string) => `https://solscan.io/account/${address}?cluster=${SOL_CLUSTER}`;
export const getLinkSolScanExplorer = (address?: string) => `https://solscan.io/address/${address}?cluster=${SOL_CLUSTER}`;
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

export const getBalanceToken = async (connection: Connection, publicKey: PublicKey | string, tokenMint: PublicKey | string) => {
  try {
    let addresses = await PublicKey.findProgramAddress(
      [toPubkey(publicKey).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPubkey(tokenMint).toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const associatedAcc = addresses[0];
    const res = await connection.getParsedAccountInfo(associatedAcc);
    return (res.value?.data as ParsedAccountData).parsed?.info?.tokenAmount?.uiAmount;
  } catch (err) {
    console.log("🚀 ~ file: index.js ~ line 70 ~ useEffect ~ err", err)
  }
};

export const getCluster = () => {
  if (SOL_CLUSTER === 'testnet') return WalletAdapterNetwork.Testnet;
  if (SOL_CLUSTER === 'mainnet-beta') return WalletAdapterNetwork.Mainnet;
  return WalletAdapterNetwork.Devnet;
};

export const calculateTotalPay = (principal: number, interest: number, duration: number /* seconds */, startedAt: number /* timestamp seconds */) => {
  const DAY_SECS = 86400;
  const payAt = moment().unix();

  const maxLoanDay = duration / DAY_SECS;
  let loanDay = maxLoanDay;
  if (payAt < startedAt + duration && payAt > startedAt) {
    loanDay = Math.floor((payAt - startedAt) / DAY_SECS) + 1;
  }
  if (loanDay >= maxLoanDay) {
    loanDay = maxLoanDay;
  }

  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .dividedToIntegerBy(10000)
    .multipliedBy(loanDay)
    .dividedToIntegerBy(365);
  let secondaryInterest = new BigNumber(0);
  if (maxLoanDay > loanDay) {
    // 50% interest remain day
    secondaryInterest = new BigNumber(principal)
      .multipliedBy(interest)
      .dividedToIntegerBy(10000)
      .multipliedBy(maxLoanDay - loanDay)
      .dividedToIntegerBy(365)
      .dividedToIntegerBy(2);
  }
  // 1% fee (base on principal amount)
  const matchingFee = new BigNumber(principal).dividedToIntegerBy(100);

  return new BigNumber(principal)
    .plus(primaryInterest)
    .plus(secondaryInterest)
    .plus(matchingFee)
    .toNumber();
};

export const getAccountInfo = async (connection: Connection, publicKey: PublicKey | string) => {
  try {
    const res = await connection.getAccountInfo(toPubkey(publicKey));
    return res;
  } catch (err) {
    console.log("🚀 ~ file: index.js ~ line 70 ~ useEffect ~ err", err);
  }
};