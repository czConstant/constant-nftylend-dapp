import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import shuffle from 'lodash/shuffle';

import { APP_URL } from 'src/common/constants/url';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { getListingLoans } from 'src/modules/nftLend/api';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { getImageThumb } from 'src/modules/nftLend/utils';
import { LoanData } from 'src/modules/nftLend/models/api';

const examples = [
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/d5c12b4eb46e676d72569a2084345c94/6ef0628f',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/dcs_pfp_1650520191170.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://i.imgur.com/fO3tI1t.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/smokeheads_pfp_1652898735936.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/puppies_pfp_1653869027436.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/483970a827af847e0b031c7d90d70baf/6cc644f1',
]

const Introduce = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [pictures, setPictures] = useState([])
  const [displayPictures, setDisplayPictures] = useState([])

  useEffect(() => {
    getListingLoans({ page: 1, limit: 30 }).then(res => {
      setPictures(res.result.map((e: LoanData) => {
        return e.asset?.token_url;
      }))
    })
  }, [])

  useEffect(() => {
    if (pictures.length === 0) return;
    setTimeout(() => controls.start({ translateX: 0 }), 1000);
    (function randomPic() {
      const list = shuffle(pictures);
      setDisplayPictures(list.slice(0, 6));
      setTimeout(randomPic, 5000);
    })()
  }, [pictures])

  const animateImg = (url: string, i: number) => {
    return (
      <motion.img
        key={i}
        initial={{ translateX: '500%' }}
        animate={controls}
        transition={{ ease: 'easeOut', duration: (i+1) * 0.5 }}
        alt=""
        src={getImageThumb({ url, width: 300, height: 300 })}
      />
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.introduce}>
        <div className={styles.left}>
          <h1>
            Create, Explore<br/>
            & Collect Digital<br/>
            Art NFTs
          </h1>
          <p>Buy and sell NETs from the world's artists. More than 1000 premium digital artworks are aviable to be your's</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(APP_URL.LIST_LOAN)}
          >
              Start Collecting
          </motion.button>
        </div>
        <div className={styles.right}>
          <div className={styles.imageRow}>
            {displayPictures.slice(0, 3).map((e, i) => animateImg(e, i))}
          </div>
          <div className={styles.imageRow}>
            {displayPictures.slice(3, 6).map((e, i) => animateImg(e, i))}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Introduce;