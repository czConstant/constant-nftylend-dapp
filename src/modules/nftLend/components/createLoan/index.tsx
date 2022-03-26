import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

import CryptoDropdownItem from "src/common/components/cryptoDropdownItem";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

import CreateLoanForm from "./form";
import { getNftListCurrency } from "../../api";
import { requestReload, selectNftyLend } from "src/store/nftyLend";
import { AssetNft } from '../../models/nft';
import { useTransaction} from '../../hooks/useTransaction';
import { Currency } from '../../models/api';

interface CreateLoanProps {
  asset: AssetNft;
  onClose: Function;
}

const CreateLoan = (props: CreateLoanProps) => {
  const dispatch = useAppDispatch();
  const { asset, onClose } = props;
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;
  const { createLoan } = useTransaction();

  const [receiveToken, setReceiveToken] = useState<Currency>();
  const [listToken, setListToken] = useState([]);
  const [tokenBalance, setTokenBalance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    Promise.all([
      getNftListCurrency(walletChain),
      // fetchAllTokenAccounts(connection, wallet.publicKey),
    ]).then((res) => {
      // if (!res[0] || !res[1]) return;
      setTokenBalance(res);
      const list = res[0].result.map((e: any) => {
        // const balance = res[1][e.contract_address]?.uiAmount;
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
      const res = await createLoan({
        asset_token_id: asset.id,
        asset_contract_address: asset.contract_address,
        currency_contract_address: values.receiveTokenMint,
        principal: values.amount,
        rate: values.rate,
        duration: Number(values.duration.id || values.duration),
        currency_decimal: receiveToken.decimals,
        currency_id: receiveToken.id,
      });

      toastSuccess(
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
      {({ handleSubmit }) => (
        <CreateLoanForm
          listToken={listToken}
          onSubmit={handleSubmit}
          onClose={() => onClose()}
          defaultTokenMint={receiveToken?.contract_address}
          submitting={submitting}
        />
      )}
    </Form>
  );
};

export default CreateLoan;
