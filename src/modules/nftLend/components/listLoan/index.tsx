import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Dropdown } from "react-bootstrap";
import cx from "classnames";

import { selectNftyLend } from "src/store/nftyLend";
import { useAppSelector } from "src/store/hooks";
import EmptyList from "src/common/components/emptyList";
import Loading from "src/common/components/loading";

import Item from "./item";
import { getLoansByOwner } from "../../api";
import { LOAN_STATUS } from "../../constant";
import styles from "./styles.module.scss";
import { LoanNft } from '../../models/loan';

const ListLoan = () => {
  const wallet = useWallet();
  const needReload = useAppSelector(selectNftyLend).needReload;
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Array<LoanNft>>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (walletAddress) fetchNFTs();
  }, [walletAddress, status, needReload]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const res = await getLoansByOwner({
        owner: walletAddress.toString(),
        network: walletChain.toString(),
        status,
      });
      setLoans(res.result.map(LoanNft.parseFromApi));
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress)
    return (
      <EmptyList dark labelText="Connect crypto wallet to view your assets" />
    );

  return (
    <div className={styles.wrapper}>
      <Dropdown className={styles.dropdown} onSelect={(e) => e && setStatus(e)}>
        <Dropdown.Toggle>
          <span>{status.toUpperCase() || "ALL"}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdownMenu}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {LOAN_STATUS.map((v) => (
            <Dropdown.Item eventKey={v.id} key={v.id}>
              {v.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div className={styles.table}>
        <div className={cx(styles.header, styles.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration / Interest</div>
          {/* <div>Interest</div> */}
          <div>Status</div>
          <div>TxHash</div>
          <div>Created At</div>
          <div>Action</div>
        </div>
        {!loading && loans?.length === 0 && (
          <EmptyList dark labelText="There is no loan" />
        )}
        {!loading && loans.map((e: any) => <Item key={e.id} loan={e} />)}
      </div>
      {loading && <Loading className={styles.loading} />}
    </div>
  );
};

export default ListLoan;
