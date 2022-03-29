import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import EmptyList from "src/common/components/emptyList";
import ListTable from "src/common/components/listTable";
import Loading from "src/common/components/loading";
import { API_URL } from "src/common/constants/url";
import { useAppSelector } from "src/store/hooks";
import { selectNftyLend } from "src/store/nftyLend";

import styles from "./styles.module.scss";

const MyListHistory = ({}) => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useAppSelector(selectNftyLend).needReload;

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (publicKey) getHistory();
  }, [publicKey, status, needReload]);

  const getHistory = async () => {
    try {
    } catch (error) {}
  };

  if (!publicKey)
    return (
      <EmptyList dark labelText="Connect crypto wallet to view your assets" />
    );

  return (
    <div className={styles.wrapper}>
      <ListTable
        url={API_URL.NFT_LEND.ASSET_TRANSACTION}
        params={{
          owner: publicKey.toString(),
        }}
        emptyLabel="There is no loan"
        columns={[
          {
            id: "name",
            label: "AssetName",
          },
          {
            id: "principal",
            label: "Amount",
          },
          {
            id: "duration",
            label: "Duration",
          },
          {
            id: "interest",
            label: "Interest",
          },
          {
            id: "status",
            label: "Status",
          },
          {
            id: "txHash",
            label: "TxHash",
          },
          {
            id: "Action",
            label: "Action",
          },
        ]}
      />
      {/* <Dropdown className={styles.dropdown} onSelect={(e) => e && setStatus(e)}>
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
          <div>Duration</div>
          <div>Interest</div>
          <div>Status</div>
          <div>TxHash</div>
          <div>Action</div>
        </div>
        {!loading && loans?.length === 0 && (
          <EmptyList dark labelText="There is no loan" />
        )}
        {!loading && loans.map((e: any) => <Item key={e.id} loan={e} />)}
      </div> */}
      {loading && <Loading className={styles.loading} />}
    </div>
  );
};

export default MyListHistory;
