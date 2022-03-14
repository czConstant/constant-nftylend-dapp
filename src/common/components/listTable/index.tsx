import React, { useEffect, useState } from "react";
import cx from "classnames";

import styles from "./styles.module.scss";
import { ListResponse } from "src/modules/nftLend/models/api";
import api from "src/common/services/apiClient";
import Loading from "../loading";
import EmptyList from "../emptyList";
import ItemTable from "./item";

interface ColumnProp {
  id: string;
  label: string;
}

interface ListTableProps {
  columns: ColumnProp[];
  url: string;
  params: any;
  data?: any[];
  emptyLabel?: string;
}

const ListTable: React.FC<ListTableProps> = ({
  columns,
  url,
  data,
  params,
  emptyLabel,
}) => {
  const [rows, setRows] = useState(data);
  const [loading, setLoading] = useState(Boolean(url));

  useEffect(() => {
    if (url) {
      getRows();
    }
  }, [url]);

  const getRows = async () => {
    try {
      const response: ListResponse = await api.get(url, { params });
      setRows(response.result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <Loading className={styles.loading} />;
    if (rows?.length === 0) return <EmptyList dark labelText={emptyLabel} />;
    return (
      <div className={styles.item}>
        {rows?.map((row, i) => (
            <ItemTable
              key={i}
              item={row}
              style={{
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
              }}
            />
          ))}
      </div>
    );
  };

  return (
    <div className={styles.table}>
      <div
        className={cx(styles.header, styles.row)}
        style={{
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        }}
      >
        {columns.map((col) => (
          <div key={col.id}>{col.label}</div>
        ))}
      </div>
      <div
        className={styles.body}
        style={{ padding: rows?.length > 0 ? 0 : "2rem" }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

ListTable.defaultProps = {
  data: [],
  emptyLabel: "There's no records",
};

export default ListTable;
