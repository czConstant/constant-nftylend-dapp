import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';
import { APP_CLUSTER } from 'src/common/constants/config';


const toPubkey = (key: PublicKey | string) => typeof(key) === 'string' ? new PublicKey(key) : key;

export const getLinkPolygonExplorer = (address?: string) =>
  `https://${APP_CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/address/${address}`;