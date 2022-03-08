import { memo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';

import ButtonSolWallet from 'src/common/components/buttonSolWallet';
import AppIcon from 'src/common/components/appIcon';
import { APP_URL } from 'src/common/constants/url';

import styles from './styles.module.scss';
import ButtonCreateLoan from '../buttonCreateLoan';

const Header = () => {
  const location = useLocation();
  const { publicKey } = useWallet();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link to={APP_URL.NFT_LENDING}>
            <AppIcon dark />
          </Link>
          <div className={styles.divider} />
          <div className={styles.menus}>
            <Link 
              to={APP_URL.NFT_LENDING}
              className={cx(location.pathname === APP_URL.NFT_LENDING && styles.active)}
            >
              Discover
            </Link>
            <Link
              to={APP_URL.NFT_LENDING_LIST_LOAN}
              className={cx(location.pathname === APP_URL.NFT_LENDING_LIST_LOAN && styles.active)}
            >
              Listing Loans
            </Link>
            {publicKey && <Link to={APP_URL.NFT_LENDING_MY_NFT} className={cx(location.pathname === APP_URL.NFT_LENDING_MY_NFT && styles.active)}>My Assets</Link>}
            <ButtonCreateLoan />
          </div>
        </div>
        <div className={styles.right}>
          <ButtonSolWallet className={styles.connectButton} />
        </div>
        {/* {walletAccount && networkVersion !== ethNetwork && (
          <div className={styles.warningNetwork}>
            Your wallet is connected to the {ETH_CHAIN_NAME[networkVersion]} network. To use NFTy Lending, please switch to {ETH_CHAIN_NAME[ethNetwork]}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default memo(Header);
