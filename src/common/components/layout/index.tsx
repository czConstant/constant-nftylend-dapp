import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"

import Header from 'src/common/components/header';
import Footer from 'src/common/components/footer';
import styles from './styles.module.scss';
import SocialLinks from 'src/views/apps/socialLinks';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const [isScrollEnd, setIsScrollEnd] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollEnd(window.document.body.clientHeight - window.innerHeight - window.scrollY < 200);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
      <Footer />
      <motion.div
        animate={{ opacity: isScrollEnd ? 0 : 1 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        style={{ position: 'fixed', top: 800, right: 15 }}
      >
        <SocialLinks layout='vertical' />
      </motion.div>
    </div>
  );
};

export default Layout;