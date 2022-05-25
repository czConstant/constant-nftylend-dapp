import { useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import debounce from 'lodash/debounce';

import BodyContainer from "src/common/components/bodyContainer";
import {
  getCollectionById,
  getCollections,
  GetListingLoanParams,
  getListingLoans,
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
import Loading from 'src/common/components/loading';

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
}

const PAGE_SIZE = 20;

const Loans = () => {
  const location = useLocation();
  const paramCollection: GetListingLoanParams =
    queryString.parse(location.search) || null;

  const [loans, setLoans] = useState<LoanNft[]>([]);
  const [resCollection, setResCollection] = useState<CollectionNft>();
  const [resCollections, setResCollections] = useState<CollectionData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loansRef = useRef<LoanNft[]>([]);
  const page = useRef(1);
  const loadingVisible = useRef(false);

  const defaultChain = Chain[paramCollection.network || ''] || Chain.None;
  const [selectedChain, setSelectedChain] = useState<Chain>(defaultChain);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('loading');
      if (!el) return;
      if (el.getBoundingClientRect().bottom <= window.innerHeight) {
        const prev = loadingVisible.current;
        loadingVisible.current = true;
        setTimeout(() => !prev && debounceGetData(), 0);
      } else { 
        loadingVisible.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  useEffect(() => {
    loansRef.current = loans;
  }, [loans])

  useEffect(() => {
    loansRef.current = [];
    page.current = 1;
    getData();
  }, [JSON.stringify(paramCollection), selectedChain]);

  const getData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const params: GetListingLoanParams = {
        ...paramCollection,
        network: selectedChain,
        page: page.current,
        limit: PAGE_SIZE,
      };
      // if (paramCollection.collection) {
      //   const _resCollection: ResponseResult = await getCollectionById(
      //     paramCollection.collection
      //   );
      //   params.collection_id = _resCollection.result?.id;
      //   setResCollection(CollectionNft.parseFromApi(_resCollection?.result));
      // } else {
      //   const _resCollections: ListResponse = await getCollections({
      //     offset: 0,
      //     limit: 10,
      //   });
      //   setResCollections(_resCollections.result);
      //   setResCollection(null);
      // }
      const response: ListResponse = await getListingLoans(params);
      if (response.result.length < PAGE_SIZE) setHasMore(false);
      else page.current += 1;

      const validLoans = response.result.map((e: LoanData) => {
        try {
          const loan = LoanNft.parseFromApi(e);
          return loan;
        } catch {
          return null;
        }
      }).filter((e: any) => !!e);
      setLoans([ ...loansRef.current, ...validLoans ]);
    } finally {
      setLoading(false);
    }
  };

  const debounceGetData = useMemo(() => debounce(getData, 100), []);

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
    if (!loading && loans?.length === 0) {
      return <EmptyDetailLoan message="There is no loans yet" />;
    }

    return loans.map((loan) => loan.asset && (
      <ItemNFT key={loan?.id} loan={loan} asset={loan.asset} className={styles.loanItemContainer} />
    ));
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      {/* <LoansHeader
        collection={resCollection}
        collections={resCollections}
        isLoading={loading}
        dataLoan={loans}
      /> */}
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
            {(loading) && <LoadingList num_items={4} />}
          </div>
          {hasMore && <div id="loading" style={{ margin: 20 }}><Loading /></div>}
        </div>
      </div>
    </BodyContainer>
  );
};

export default Loans;
