import { ethers } from 'ethers';

import NftyPawn from '../abi/NFTPawn.json';
import IERC20 from '../abi/IERC20.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { formatAmountSigning, generateNonce, getMaxAllowance } from '../utils';
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Chain } from 'src/common/constants/network';

export default class OrderNowEvmTransaction extends EvmTransaction {
  async run(
    principal: number,
    assetTokenId: string,
    duration: number,
    rate: number,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    borrower: string,
    borrowerNonce: string,
    borrowerSignature: string,
    lender: string,
  ): Promise<TransactionResult> {
    try {
      const signer = this.provider.getSigner(0);

      const erc20contract = new ethers.Contract(currencyContractAddress, IERC20.abi, signer)
      const allowance = await erc20contract.allowance(lender, this.lendingProgram);
      
      if (new BigNumber(allowance._hex).lt(principal)) {
        const tx = await erc20contract.approve(this.lendingProgram, getMaxAllowance());
        await tx.wait();
      }

      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      
      const chainId = (await this.provider.getNetwork()).chainId;
      const lenderNonce = generateNonce();
      const adminFee = await this.getAdminFee();

      const principalStr = formatAmountSigning(principal, currencyDecimals);

      let lenderMsg = web3.utils.soliditySha3(
        principalStr,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        lenderNonce,
        assetContractAddress,
        currencyContractAddress,
        lender,
        this.chain === Chain.Harmony ? 2 :chainId,
      );
      const lenderSig = await this.signMessage(signer, lenderMsg || '');

      const tx = await contract.offerNow(
        principalStr,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        [borrowerNonce, lenderNonce],
        assetContractAddress,
        currencyContractAddress,
        borrower,
        [borrowerSignature, lenderSig],
        { from: lender },
      );
      const receipt = await tx.wait();

      return this.handleSuccess({
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
