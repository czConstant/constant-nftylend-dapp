import { useEffect, useState } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

import BodyContainer from "src/common/components/bodyContainer";
import {
  getCollectionById,
  getCollections,
  getLoanByCollection,
  LoanByCollectionParams,
} from "src/modules/nftLend/api";
import { ListResponse, LoanData, ResponseResult } from "src/modules/nftLend/models/api";
import { LoanNft } from "src/modules/nftLend/models/loan";
import { CollectionData } from "src/modules/nftLend/models/api";
import ItemNFT from "src/modules/nftLend/components/itemNft";
import LoadingList from "src/modules/nftLend/components/loadingList";
import EmptyDetailLoan from "src/modules/nftLend/components/emptyDetailLoan";
import LoansHeader from "./Loans.Header";
import { Chain } from 'src/common/constants/network';

import styles from "./styles.module.scss";
import LoansSidebar from "./Loans.Sidebar";
import LoansToolbar from "./Loans.Toolbar";
import { CollectionNft } from 'src/modules/nftLend/models/collection';

const chains = {
  all: {
    title: 'All',
    key: Chain.None,
  },
  near: {
    title: 'Near',
    key: Chain.Near
  },
  matic: {
    title: 'Matic',
    key: Chain.Polygon,
  },
  // sol: {
  //   title: 'Solana',
  //   key: Chain.Solana
  // },
  // avax: {
  //   title: 'Avalanche',
  //   key: Chain.Avalanche,
  // },
  // bsc: {
  //   title: 'BSC',
  //   key: Chain.BSC,
  // },
  // boba: {
  //   title: 'Boba',
  //   key: Chain.Boba,
  // },
  harmony: {
    title: 'Harmony',
    key: Chain.Harmony,
  },
}

const Loans = () => {
  const location = useLocation();
  const paramCollection: LoanByCollectionParams =
    queryString.parse(location.search) || null;

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loans, setLoans] = useState<LoanNft[]>([]);
  const [resCollection, setResCollection] = useState<CollectionNft>();
  const [resCollections, setResCollections] = useState<CollectionData[]>([]);

  const defaultChain = Chain[paramCollection.network || ''] || Chain.None;
  const [selectedChain, setSelectedChain] = useState<Chain>(defaultChain);

  useEffect(() => {
    getData();
  }, [JSON.stringify(paramCollection), selectedChain]);

  const getData = async () => {
    setLoadingList(true);
    try {
      const params: LoanByCollectionParams = {
        ...paramCollection,
        network: selectedChain,
      };
      if (paramCollection.collection) {
        const _resCollection: ResponseResult = await getCollectionById(
          paramCollection.collection
        );
        params.collection_id = _resCollection.result?.id;
        setResCollection(CollectionNft.parseFromApi(_resCollection?.result));
      } else {
        const _resCollections: ListResponse = await getCollections({
          offset: 0,
          limit: 10,
        });
        setResCollections(_resCollections.result);
        setResCollection(null);
      }
      const response: ListResponse = await getLoanByCollection(params);
      const result = response.result;
      setLoans(result.map((e: LoanData) => LoanNft.parseFromApi(e)));
    } catch (error) {
    } finally {
      setLoading(false);
      setLoadingList(false);
    }
  };

  const renderChainSelect = () => {
    return (
      <div className={styles.chainSelector}>
        {Object.values(chains).map(e => (
          <div
            key={e.key}
            onClick={() => setSelectedChain(e.key)}
            className={cx(styles.item, e.key === selectedChain && styles.active)}
          >
              {e.title}
          </div>
        ))}
      </div>
    )
  };

  const renderContentList = () => {
    if (loading || loadingList) {
      return <LoadingList num_items={4} />;
    } else if (loans?.length === 0) {
      return <EmptyDetailLoan message="There is no loans yet" />;
    }

    return loans.map((loan) => loan.asset && (
      <ItemNFT key={loan?.id} loan={loan} asset={loan.asset} className={styles.loanItemContainer} />
    ));
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <LoansHeader
        collection={resCollection}
        collections={resCollections}
        isLoading={loading}
        dataLoan={loans}
      />
      <div
        className={cx([
          styles.contentWrapper,
          resCollection && styles.listContainerWrapBorder,
        ])}
      >
        {/* <LoansSidebar isLoading={loading} /> */}
        <div className={cx([styles.listContainerWrap])}>
          {!resCollection && renderChainSelect()}
          <LoansToolbar />
          <div
            className={cx(
              !loading && loans?.length === 0 && styles.wrapContentEmpty,
              styles.listContainer
            )}
          >
            {renderContentList()}
          </div>
        </div>
      </div>
    </BodyContainer>
  );
};

export default Loans;
