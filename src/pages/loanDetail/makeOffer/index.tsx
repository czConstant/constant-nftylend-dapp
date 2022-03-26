import { useState } from "react";
import { Form } from "react-final-form";
import { NavigateFunction } from 'react-router-dom';

import { APP_URL } from "src/common/constants/url";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { getLinkSolScanTx } from "src/modules/solana/utils";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { useAppDispatch } from "src/store/hooks";
import { requestReload } from "src/store/nftyLend";
import { TABS } from "src/pages/myAsset";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';

import MakeOfferForm from './form';
import styles from "../styles.module.scss";
import { LoanNft } from 'src/modules/nftLend/models/loan';

interface LoanDetailMakeOfferProps {
  loan: LoanNft;
  onClose: Function;
  navigate: NavigateFunction
}

const LoanDetailMakeOffer = (props: LoanDetailMakeOfferProps) => {
  const { loan, onClose, navigate } = props;
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);
  const { makeOffer } = useTransaction();

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      if (!loan.currency) throw new Error('Loan has no currency');

      const res = await makeOffer({
        currency_contract_address: loan.currency.contract_address,
        currency_decimal: loan.currency.decimals,
        loan_owner: loan.owner,
        data_loan_address: loan.data_loan_address,
        principal: values.amount,
        rate: values.rate,
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
      toastError(error?.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.makeOfferFormWrapper}>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          amount: loan.principal_amount,
          rate: loan.interest_rate * 100,
          duration: LOAN_DURATION.find(
            (v) => v.id === Math.ceil(loan.duration / 86400)
          ),
        }}
      >
        {({ handleSubmit }) => (
          <MakeOfferForm
            loan={loan}
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
