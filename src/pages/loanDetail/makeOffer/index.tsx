import { useState } from "react";
import { Form } from "react-final-form";
import { NavigateFunction } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { APP_URL } from "src/common/constants/url";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { requestReload, selectNftyLend } from "src/store/nftyLend";
import { TABS } from "src/pages/myAsset";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';

import MakeOfferForm from './form';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import styles from "./makeOfferForm.module.scss";

interface LoanDetailMakeOfferProps {
  loan: LoanNft;
  onClose: Function;
  navigate: NavigateFunction
}

const LoanDetailMakeOffer = (props: LoanDetailMakeOfferProps) => {
  const { loan, onClose, navigate } = props;
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;

  const [submitting, setSubmitting] = useState(false);
  const { makeOffer } = useTransaction();

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const res = await makeOffer({
        currency_contract_address: loan.currency.contract_address,
        currency_decimal: loan.currency.decimals,
        asset_contract_address: loan.asset.contract_address,
        asset_token_id: loan.asset.token_id,
        loan_owner: loan.owner,
        lender: walletAddress,
        loan_data_address: loan.data_loan_address,
        loan_id: loan.id,
        principal: values.amount,
        rate: values.rate / 100,
        duration: values.duration?.id || values.duration,
      });
      toastSuccess(
        <>
          Make offer successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
      onClose();
      return navigate(`${APP_URL.NFT_LENDING_MY_NFT}?tab=${TABS.offer}`);
    } catch (error: any) {
      console.error(error)
      toastError(error?.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.makeOfferForm}>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          amount: loan.principal_amount,
          rate: new BigNumber(loan.interest_rate).multipliedBy(100).toNumber(),
          duration: LOAN_DURATION.find(
            (v) => v.id === Math.ceil(loan.duration / 86400)
          ),
        }}
      >
        {({ values, handleSubmit }) => (
          <MakeOfferForm
            loan={loan}
            values={values}
            onSubmit={handleSubmit}
            onClose={() => onClose()}
            // defaultTokenMint={receiveToken?.contract_address}
            submitting={submitting}
          />
        )}
      </Form>
    </div>
  );
};

export default LoanDetailMakeOffer;