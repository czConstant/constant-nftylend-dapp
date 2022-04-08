import { ethers } from 'ethers';
import { Chain } from 'src/common/constants/network';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getAvalancheLendingProgramId, getLinkEvmExplorer, getPolygonLendingProgramId } from '../utils';
import NftyPawn from '../abi/NFTPawn.json';
import web3 from 'web3';
import { EvmProvider } from 'src/common/constants/wallet';

export default class EvmTransaction {
  lendingProgram;
  chain: Chain;
  provider: EvmProvider;

  constructor(chain: Chain, provider: EvmProvider) {
    this.chain = chain;
    this.provider = provider;
    if (chain === Chain.Polygon) {
      this.lendingProgram = getPolygonLendingProgramId();
    } else if (chain === Chain.Avalanche) {
      this.lendingProgram = getAvalancheLendingProgramId();
    } else {
      throw new Error(`Chain ${chain} is not supported`);
    }
  }

  getAdminFee = async (): Promise<number> => {
    const signer = this.provider.getSigner(0);
    const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer);
      
    const fee = await contract.adminFeeInBasisPoints();
    const adminFee = web3.utils.toDecimal(fee);
    return adminFee;
  };

  signMessage = async (signer: ethers.providers.JsonRpcSigner, message: string) => {
    if (!message) throw new Error('Empty message to sign');
    const borrowerSig = await signer.signMessage(ethers.utils.arrayify(message));
    return borrowerSig;
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult): Promise<TransactionResult> => {
    if (res.blockNumber) {
      let count = 0;
      while (count < 6) {
        try {
          await api.post(`${API_URL.NFT_LEND.UPDATE_BLOCK_EVM.replace('{network}', this.chain)}/${res.blockNumber}`);
          break;
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
        count += 1;
      }
    }
    if (res.txHash) {
      let txExplorerUrl = `No explorer for chain ${this.chain}`;
      txExplorerUrl = getLinkEvmExplorer(res.txHash, this.chain, 'tx');
      return { ...res, txExplorerUrl };
    }
    return res;
  };
}
