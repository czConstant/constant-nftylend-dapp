import { useEffect, useState } from 'react';
import { motion } from "framer-motion"

import Introduce from 'src/views/discover/introduce';
import News from 'src/views/discover/news';
import FeaturedCollections from 'src/views/discover/featuredCollections';
import SocialLinks from 'src/views/apps/socialLinks';

const Discover = () => {
  const [isScrollEnd, setIsScrollEnd] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollEnd(window.document.body.clientHeight - window.innerHeight - window.scrollY < 200);
      console.log("🚀 ~ file: index.tsx ~ line 15 ~ handleScroll ~ window.scrollY", window.scrollY)
      console.log("🚀 ~ file: index.tsx ~ line 15 ~ handleScroll ~ window.document.body.clientHeight", window.document.body.clientHeight)
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (<>
    <Introduce />
    <News />
    <FeaturedCollections />
    <motion.div
      animate={{ opacity: isScrollEnd ? 0 : 1 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
      style={{ position: 'fixed', top: 800, right: 15 }}
    >
      <SocialLinks layout='vertical' />
    </motion.div>
  </>
  );
};

export default Discover;
