import { useEffect, useState } from "react";
import { Form } from "react-final-form";

import CryptoDropdownItem from "src/common/components/cryptoDropdownItem";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { useAppDispatch } from "src/store/hooks";

import CreateLoanForm from "./form";
import { getNftListCurrency } from "../../api";
import { requestReload } from "src/store/nftyLend";
import { AssetNft } from '../../models/nft';
import { useTransaction} from '../../hooks/useTransaction';
import { Currency } from '../../models/api';
import { useCurrentWallet } from '../../hooks/useCurrentWallet';
import { isAssetOwner } from '../../utils';

interface CreateLoanProps {
  asset?: AssetNft;
  onClose: Function;
}

const CreateLoan = (props: CreateLoanProps) => {
  const dispatch = useAppDispatch();
  const { asset, onClose } = props;
  const { currentWallet, isConnected } = useCurrentWallet();
  const { createLoan } = useTransaction();

  const [receiveToken, setReceiveToken] = useState<Currency>();
  const [listToken, setListToken] = useState([]);
  const [tokenBalance, setTokenBalance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    Promise.all([
      getNftListCurrency(currentWallet.chain),
    ]).then((res) => {
      setTokenBalance(res);
      const list = res[0].result.map((e: any) => {
        return {
          ...e,
          label: (
            <CryptoDropdownItem
              icon={e.icon_url}
              name={e.name}
              symbol={e.symbol}
              // balance={balance}
            />
          ),
        };
      });
      setListToken(list);
      if (list.length > 0) {
        setReceiveToken(list[0]);
      }
    });
  }, []);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    const receiveToken: any = listToken.find(
      (e: any) => e.contract_address === values.receiveTokenMint
    );
    if (!receiveToken) return;
    try {
      setSubmitting(true);
      const asset_token_id = values.token_id || asset?.token_id;
      const asset_contract_address = values.asset_contract_address || asset?.contract_address;
      if (!asset) {
        const isOwner = await isAssetOwner(currentWallet.address, currentWallet.chain, asset_contract_address, asset_token_id);
        if (!isOwner) throw new Error('This asset is not owned by current account');
      }
      const res = await createLoan({
        asset_token_id,
        asset_contract_address,
        currency_contract_address: values.receiveTokenMint,
        principal: values.amount,
        rate: values.rate / 100,
        duration: Number(values.duration.id || values.duration),
        currency_decimal: receiveToken.decimals,
        currency_id: receiveToken.id,
      });

      if (res.completed) toastSuccess(
        <>
          Create loan successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
      onClose();
    } catch (err: any) {
      toastError(err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ values, handleSubmit }) => (
        <CreateLoanForm
          isManual={!asset}
          listToken={listToken}
          onSubmit={handleSubmit}
          onClose={() => onClose()}
          defaultTokenMint={receiveToken?.contract_address}
          submitting={submitting}
          values={values}
        />
      )}
    </Form>
  );
};

export default CreateLoan;
