import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';

import { APP_URL } from 'src/common/constants/url';
import SectionContainer from 'src/common/components/sectionContainer';
import { getCollections, getPlatformStats } from 'src/modules/nftLend/api';
import { CollectionData } from 'src/modules/nftLend/models/api';
import { CollectionNft } from 'src/modules/nftLend/models/collection';

import Item from './item';
import styles from './styles.module.scss';
import BigNumber from 'bignumber.js';
import { formatCurrency } from 'src/common/utils/format';

const FeaturedCollections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Array<CollectionNft>>(Array(3).fill(0));
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColletions();
    fetchStats();
  }, []);

  const fetchColletions = async () => {
    try {
      const response = await getCollections();
      const list = response.result.filter((v: any) => v?.listing_total > 0);
      setCollections(list.map((e: CollectionData) => {
        try {
          const collection = CollectionNft.parseFromApi(e);
          return collection;
        } catch {
          return null;
        }
      }).filter((e: any) => !!e));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getPlatformStats();
      setStats(response.result)
    } finally { }
  };

  return (
    <SectionContainer className={styles.wrapper}>
      <h2>Create loan offers using your NFTs</h2>
      <p className={styles.subtitle}>The first marketplace for NFTs P2P Lending. The fastest way to liquid your NFTs.<br/>Lenders and Borrowers are connected by our smart contract.</p>
      <div className={styles.featuredCollection}>
        <div className={styles.header}>
          <div className={styles.title}>Global Loans</div>
          <div className={styles.stats}>
            <div>
              <label>${stats?.total_volume}</label>
              <span>Loan Volume</span>
            </div>
            <div>
              <label>{stats?.total_loans}</label>
              <span>Number of Loans</span>
            </div>
            <div>
              <label>{formatCurrency(stats?.total_defaulted_loans * 100 / stats?.total_loans)}%</label>
              <span>Default Rate</span>
            </div>
          </div>
        </div>
        <div className={styles.list}>
          {collections.map((collection, index) => (
            <Item
              key={collection?.id || index}
              item={collection}
              loading={loading}
              onPressItem={() =>
                navigate(
                  `${APP_URL.LIST_LOAN}?collection=${collection?.seo_url}`,
                )
              }
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturedCollections;
