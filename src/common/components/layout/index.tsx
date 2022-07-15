import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Icon, IconButton } from '@chakra-ui/react';
import { MdExpandLess } from 'react-icons/md';

import Header from 'src/common/components/header';
import Footer from 'src/common/components/footer';
import styles from './styles.module.scss';
import SocialLinks from 'src/apps/pawn/views/app/socialLinks';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const [isScrollEnd, setIsScrollEnd] = useState(false)
  const [isShowScrollTop, setIsShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollEnd(window.document.body.clientHeight - window.innerHeight - window.scrollY < 200);
      setIsShowScrollTop(window.innerHeight < window.scrollY);
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
        style={{ position: 'fixed', top: 300, right: 30 }}
      >
        <SocialLinks layout='vertical' iconSize={40} />
      </motion.div>
      <motion.div
        animate={{ opacity: isShowScrollTop ? 1 : 0 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        style={{ position: 'fixed', bottom: 100, right: 30 }}
      >
        <IconButton aria-label='scroll top' borderRadius={40} onClick={() => window.scrollTo(0, 0)}>
          <Icon fontSize='3xl' as={MdExpandLess} />
        </IconButton>
      </motion.div>
    </div>
  );
};

export default Layout;