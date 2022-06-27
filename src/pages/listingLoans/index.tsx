import { useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import debounce from 'lodash/debounce';

import { GetListingLoanParams, getListingLoans } from "src/modules/nftLend/api";
import { ListResponse, LoanData } from "src/modules/nftLend/models/api";
import { LoanNft } from "src/modules/nftLend/models/loan";
import CardNftLoan from "src/views/apps/CardNftLoan";
import LoadingList from "src/views/apps/loadingList";
import EmptyDetailLoan from "src/views/apps/emptyDetailLoan";
import { Chain } from 'src/common/constants/network';
import { CollectionNft } from 'src/modules/nftLend/models/collection';
import Loading from 'src/common/components/loading';
import CollectionInfo from 'src/views/listingLoans/collectionInfo';
import useSessionStorage from 'src/modules/nftLend/hooks/useSessionStorage';

import styles from "./styles.module.scss";
import SelectSortBy from 'src/views/listingLoans/selectSortBy';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import SectionContainer from 'src/common/components/sectionContainer';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [collection, setCollection] = useState<CollectionNft>();
  const [sortBy, setSortBy] = useSessionStorage('listing_loan_sort', '-created_at');

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
    debounceFetchLoans();
  }, [JSON.stringify(pageQuery), selectedChain, sortBy]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const params: GetListingLoanParams = {
        sort: sortBy,
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

  const debounceFetchLoans = useMemo(() => debounce(fetchLoans, 500), []);

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

  return (
    <Flex direction='column' bgColor='black'>
      {pageQuery.collection && <CollectionInfo collection_seo={pageQuery.collection} />}
      <SectionContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
        <Flex direction='column' gap={4} pb={8}>
          {/* {!collection && renderChainSelect()} */}
          <Flex justifyContent='flex-end' mt={12}>
            <SelectSortBy defaultValue={sortBy} onChange={setSortBy} />
          </Flex>
          {!loading && loans?.length === 0 && <EmptyDetailLoan message="There is no loans yet" />}
          <Grid templateColumns={['1fr', 'repeat(auto-fill, minmax(250px, 1fr))']} gap={8}>
            {loans.map((loan) => loan.asset && (
              <GridItem key={loan?.id}>
                <CardNftLoan loan={loan} asset={loan.asset} className={styles.loanItemContainer} />
              </GridItem>
            ))}
            {(loading) && <LoadingList num_items={4} />}
          </Grid>
          {hasMore && <div id="loading" style={{ margin: 20 }}><Loading /></div>}
        </Flex>
      </SectionContainer>
    </Flex>
  );
};

export default ListingLoans;
