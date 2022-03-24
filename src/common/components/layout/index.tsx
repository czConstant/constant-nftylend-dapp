import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Header from 'src/common/components/header';
import Footer from 'src/common/components/footer';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import styles from './styles.module.scss';
import { clearWallet, selectNftyLend, updateWallet } from 'src/store/nftyLend';
import { Chain } from 'src/common/constants/network';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;