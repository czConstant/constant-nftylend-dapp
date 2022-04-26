import React from 'react';

import Header from 'src/common/components/header';
import Footer from 'src/common/components/footer';
import styles from './styles.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;