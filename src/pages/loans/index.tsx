import { useEffect, useState } from "react";
import cx from 'classnames';
import BodyContainer from "src/common/components/bodyContainer";
import {
  getCollectionById,
  getCollections,
  getLoanByCollection,
  LoanByCollectionParams,
} from "src/modules/nftLend/api";
import { ListResponse, ResponseResult } from "src/modules/nftLend/models/api";
import { LoanData } from "src/modules/nftLend/models/loan";
import LoansHeader from "./Loans.Header";
import styles from "./styles.module.scss";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { CollectData } from "src/modules/nftLend/models/collection";
import LoansSidebar from "./Loans.Sidebar";
import ItemNFT from "src/modules/nftLend/components/itemNft";
import LoadingList from "src/modules/nftLend/components/loadingList";
import EmptyDetailLoan from "src/modules/nftLend/components/emptyDetailLoan";

const Loans = () => {
  const location = useLocation();
  const paramCollection: LoanByCollectionParams =
    queryString.parse(location.search) || null;

  const [loading, setLoading] = useState<boolean>(true);
  const [resLoans, resSetLoans] = useState<LoanData[]>([]);
  const [resCollection, setResCollection] = useState<CollectData>();
  const [resCollections, setResCollections] = useState<CollectData[]>([]);

  useEffect(() => {
    getData();
  }, [
    paramCollection.collection_id,
    paramCollection.exclude_ids,
    paramCollection.max_price,
    paramCollection.min_price,
  ]);

  const getData = async () => {
    try {
      const params: LoanByCollectionParams = {
        ...paramCollection,
      };
      if (paramCollection.collection_id) {
        const _resCollection: ResponseResult = await getCollectionById(
          paramCollection.collection_id
        );
        params.collection_id = _resCollection.result?.id;
        setResCollection(_resCollection?.result);
      } else {
        const _resCollections: ListResponse = await getCollections({
          offset: 0,
          limit: 10,
        });
        setResCollections(_resCollections.result);
      }
      const response: ListResponse = await getLoanByCollection(params);
      const result = response.result;
      resSetLoans(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContentList = () => {
    if (loading) {
      return <LoadingList num_items={4} />;
    } else if (resLoans?.length === 0) {
      return <EmptyDetailLoan />;
    }

    return resLoans.map((loan, index) => (
      <ItemNFT key={loan?.id} item={loan} />
    ));
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <LoansHeader
        collection={resCollection}
        isLoading={loading}
        dataLoan={resLoans}
        collections={resCollections}
      />
      <div className={styles.contentWrapper}>
        <LoansSidebar isLoading={loading} />
        <div
          className={cx(
            styles.listContainer,
            !loading && resLoans?.length === 0 && styles.wrapContentEmpty
          )}
        >
          {renderContentList()}
        </div>
      </div>
    </BodyContainer>
  );
};

export default Loans;
