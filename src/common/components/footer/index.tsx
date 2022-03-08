import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import { APP_URL } from '../../constants/url';
import AppIcon from '../appIcon';

import styles from './styles.module.scss';

const Footer = () => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      <div className={styles.left}>
        <Link to={APP_URL.NFT_LENDING}>
          <AppIcon dark />
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles.menus}>
          <Link to={APP_URL.NFT_LENDING}>
            Discover
          </Link>
          <Link to={APP_URL.NFT_LENDING_LIST_LOAN}>
            Listing Loans
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default memo(Footer);
