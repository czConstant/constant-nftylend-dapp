import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

import {
  fetchAllTokenAccounts,
  getAssociatedAccount,
  getLinkSolScanTx,
} from "src/common/utils/solana";
import CryptoDropdownItem from "src/common/components/cryptoDropdownItem";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { useAppDispatch } from "src/store/hooks";

import CreateLoanForm from "./form";
import { getNftListCurrency } from "../../api";
import { requestReload } from "src/store/nftLend";
import CreateLoanTransaction from "../../transactions/createLoan";

interface CreateLoanProps {
  connection: Connection;
  wallet: WalletContextState;
  nftMint: string;
  onClose: Function;
}

const CreateLoan = (props: CreateLoanProps) => {
  const dispatch = useAppDispatch();
  const { connection, wallet, nftMint, onClose } = props;

  const [nftAssociated, setNftAssociated] = useState("");
  const [receiveToken, setReceiveToken] = useState();
  const [receiveTokenAssociated, setReceiveTokenAssociated] = useState("");
  const [listToken, setListToken] = useState([]);
  const [tokenBalance, setTokenBalance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) return;
    Promise.all([
      getNftListCurrency(),
      fetchAllTokenAccounts(connection, wallet.publicKey),
    ]).then((res) => {
      if (!res[0] || !res[1]) return;
      setTokenBalance(res);
      const list = res[0].result.map((e: any) => {
        const balance = res[1][e.contract_address]?.uiAmount;
        return {
          ...e,
          label: (
            <CryptoDropdownItem
              icon={e.icon_url}
              name={e.name}
              symbol={e.symbol}
              balance={balance}
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

  useEffect(() => {
    if (!nftMint || !wallet.publicKey) return;
    getAssociatedAccount(wallet.publicKey.toString(), nftMint).then((res) => {
      setNftAssociated(res || "");
    });
  }, [nftMint]);

  useEffect(() => {
    if (!receiveToken?.contract_address || !wallet.publicKey) return;
    getAssociatedAccount(
      wallet.publicKey.toString(),
      receiveToken?.contract_address
    ).then((res) => {
      setReceiveTokenAssociated(res || "");
    });
  }, [receiveToken]);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    const receiveToken: any = listToken.find(
      (e: any) => e.contract_address === values.receiveTokenMint
    );
    if (!receiveToken) return;
    const transaction = new CreateLoanTransaction(connection, wallet);
    try {
      setSubmitting(true);

      const res = await transaction.run(
        nftMint,
        nftAssociated,
        values.receiveTokenMint,
        receiveTokenAssociated,
        {
          principal: values.amount * 10 ** receiveToken.decimals,
          rate: values.rate * 100,
          duration: parseFloat(values.duration?.id || values.duration) * 86400,
        }
      );

      if (res?.txHash) {
        toastSuccess(
          <>
            Create loan successfully.{" "}
            <a target="_blank" href={getLinkSolScanTx(res.txHash)}>
              View transaction
            </a>
          </>
        );
        dispatch(requestReload());
        onClose();
      }
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
