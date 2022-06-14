import { useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import debounce from 'lodash/debounce';

import BodyContainer from "src/common/components/bodyContainer";
import { GetListingLoanParams, getListingLoans } from "src/modules/nftLend/api";
import { ListResponse, LoanData } from "src/modules/nftLend/models/api";
import { LoanNft } from "src/modules/nftLend/models/loan";
import CardNftLoan from "src/views/apps/CardNftLoan";
import LoadingList from "src/views/apps/loadingList";
import EmptyDetailLoan from "src/views/apps/emptyDetailLoan";
import { Chain } from 'src/common/constants/network';

import styles from "./styles.module.scss";
import LoansSidebar from "./Loans.Sidebar";
import LoansToolbar from "./Loans.Toolbar";
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import Loading from 'src/common/components/loading';
import CollectionInfo from 'src/views/listingLoans/collectionInfo';

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

const ListingLoans = () => {
  const location = useLocation();
  const pageQuery: any = queryString.parse(location.search);

  const [loans, setLoans] = useState<LoanNft[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [collection, setCollection] = useState<CollectionNft>();

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
  }, [JSON.stringify(pageQuery), selectedChain]);

  const fetchLoans = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const params: GetListingLoanParams = {
        sort: '-created_at',
        network: selectedChain,
        page: page.current,
        limit: PAGE_SIZE,
        search: pageQuery.search,
        collection_seo_url: pageQuery.collection,
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

  // const renderChainSelect = () => {
  //   return (
  //     <div className={styles.chainSelector}>
  //       {Object.values(chains).map(e => (
  //         <div
  //           key={e.key}
  //           onClick={() => setSelectedChain(e.key)}
  //           className={cx(styles.item, e.key === selectedChain && styles.active)}
  //         >
  //             {e.title}
  //         </div>
  //       ))}
  //     </div>
  //   )
  // };

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
      {pageQuery.collection && <CollectionInfo collection_seo={pageQuery.collection} />}
      <div
        className={cx([
          styles.contentWrapper,
          collection && styles.listContainerWrapBorder,
        ])}
      >
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

export default ListingLoans;
