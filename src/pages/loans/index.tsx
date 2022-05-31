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
import CardNftLoan from "src/views/apps/CardNftLoan";
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
  const pageQuery: GetListingLoanParams =
    queryString.parse(location.search) || null;

  const [loans, setLoans] = useState<LoanNft[]>([]);
  const [collection, setCollection] = useState<CollectionNft>();
  const [resCollections, setResCollections] = useState<CollectionData[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loansRef = useRef<LoanNft[]>([]);
  const page = useRef(1);
  const loadingVisible = useRef(false);

  const defaultChain = Chain[pageQuery.network || ''] || Chain.None;
  const [selectedChain, setSelectedChain] = useState<Chain>(defaultChain);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('loading');
      if (!el) return;
      if (el.getBoundingClientRect().bottom <= window.innerHeight) {
        const prev = loadingVisible.current;
        loadingVisible.current = true;
        setTimeout(() => !prev && debounceFetchLoans(), 0);
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
    fetchLoans();

    if (pageQuery.collection) fetchCollection();
    else setCollection(null);
  }, [JSON.stringify(pageQuery), selectedChain]);

  const fetchCollection = async (): Promise<CollectionNft> => {
    if (!pageQuery.collection) throw new Error('No collection selected');
    const params: GetListingLoanParams = {
      ...pageQuery,
      network: selectedChain,
    };
    const res: ResponseResult = await getCollectionById(pageQuery.collection);
    params.collection_id = res.result?.id;
    setCollection(CollectionNft.parseFromApi(res?.result));
    return CollectionNft.parseFromApi(res?.result);
  }

  const fetchLoans = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let collectionId;
      if (pageQuery.collection) {
        collectionId = collection?.id;
        if (!collectionId) collectionId = (await fetchCollection()).id;
      }
      const params: GetListingLoanParams = {
        ...pageQuery,
        network: selectedChain,
        page: page.current,
        limit: PAGE_SIZE,
        collection_id: collectionId,
      };
      const response: ListResponse = await getListingLoans(params);
      // Check for duplicate fetching when scroll to end of list
      if (params.page !== page.current) return;

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

  const debounceFetchLoans = useMemo(() => debounce(fetchLoans, 100), []);

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
      <CardNftLoan key={loan?.id} loan={loan} asset={loan.asset} className={styles.loanItemContainer} />
    ));
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <LoansHeader
        collection={collection}
        collections={resCollections}
        dataLoan={loans}
      />
      <div
        className={cx([
          styles.contentWrapper,
          collection && styles.listContainerWrapBorder,
        ])}
      >
        {/* <LoansSidebar isLoading={loading} /> */}
        <div className={cx([styles.listContainerWrap])}>
          {/* {!collection && renderChainSelect()} */}
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
