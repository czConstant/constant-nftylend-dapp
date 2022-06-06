import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';

import SectionContainer from 'src/common/components/sectionContainer';
import { getListingLoans, getPlatformStats } from 'src/modules/nftLend/api';
import { LoanData } from 'src/modules/nftLend/models/api';

import styles from './styles.module.scss';
import { formatCurrency } from 'src/common/utils/format';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import CardNftLoan from 'src/views/apps/CardNftLoan';
import { APP_URL } from 'src/common/constants/url';

const LatestLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Array<LoanNft>>(Array(3).fill(0));
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListData();
    fetchStats();
  }, []);

  const fetchListData = async () => {
    try {
      const res = await getListingLoans({ page: 1, limit: 8 });
      const validLoans = res.result.map((e: LoanData) => {
        try {
          const loan = LoanNft.parseFromApi(e);
          return loan;
        } catch {
          return null;
        }
      }).filter((e: any) => !!e);
      setLoans(validLoans)
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
      <h2>Create loans using your NFT as collateral</h2>
      <p className={styles.subtitle}>We're the first marketplace for NFT P2P Lending and the fastest way to leverage the value of your NFTs.<br/>Connecting lenders to borrowers on our smart contract.</p>
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
          {loans.map((item, index) => item.asset && (
            <CardNftLoan
              key={item?.id}
              loan={item}
              asset={item.asset}
              className={styles.item}
            />
          ))}
        </div>
        <div className={styles.viewMore}>
          <button onClick={() => {
            window.scrollTo(0, 0);
            navigate(APP_URL.LIST_LOAN);
          }}>
            View More
          </button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default LatestLoans;
