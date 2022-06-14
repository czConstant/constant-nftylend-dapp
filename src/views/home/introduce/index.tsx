import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import shuffle from 'lodash/shuffle';
import { useDispatch } from 'react-redux';

import { useEffect, useRef, useState } from 'react';
import { getListingLoans } from 'src/modules/nftLend/api';
import { getImageThumb } from 'src/modules/nftLend/utils';
import { LoanData } from 'src/modules/nftLend/models/api';

import LogoNear from './img/logo_near.svg';
import styles from './styles.module.scss';
import SectionContainer from 'src/common/components/sectionContainer';
import ButtonCreateLoan from 'src/common/components/buttonCreateLoan';

const examples = [
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/d5c12b4eb46e676d72569a2084345c94/6ef0628f',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/dcs_pfp_1650520191170.png',
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/NUDYySgehWNuXVGNJtZDP0g2SU8Tjq5NYUHBAhsr6qo',
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeihro3da5jcrpfwlbjyeai2qafxjkadgju36l6qcw57b2spdk576gm.ipfs.dweb.link/?ext=gif',
  'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://susanoo.mypinata.cloud/ipfs/QmdJXHKakL96mUNVcct6rd3UL5Nq2umac4NwibHPAtAuTA/388.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/483970a827af847e0b031c7d90d70baf/6cc644f1',
]

const NUM_PIC_POOL = 30;

const Introduce = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const dispatch = useDispatch();

  const [pictures, setPictures] = useState<string[]>([]);
  const [displayPictures, setDisplayPictures] = useState<string[]>([]);

  const displayPicturesRef = useRef<Array<string>>([]);
  const picToChange = useRef(6);
  const cardToChange = useRef(0);

  useEffect(() => {
    getListingLoans({ page: 1, limit: NUM_PIC_POOL }).then(res => {
      setPictures(res.result.map((e: LoanData) => {
        return e.asset?.token_url;
      }))
    })
  }, [])

  useEffect(() => {
    if (pictures.length === 0) return;

    setTimeout(() => controls.start({ translateX: 0 }), 1000);
    
    function changePic() {
      const list = [...displayPicturesRef.current];
      list[cardToChange.current] = pictures[picToChange.current];
      setDisplayPictures(list);

      cardToChange.current = (cardToChange.current + 1) % 6
      picToChange.current = (picToChange.current + 1) % NUM_PIC_POOL
      setTimeout(changePic, 2000);
    }

    if (pictures.length < 6) {
      setDisplayPictures([...pictures, ...(new Array(6))].slice(0, 6));
      return;
    } else {
      setDisplayPictures(pictures.slice(0, 6));
      setTimeout(changePic, 2000)
    }
  }, [pictures])

  useEffect(() => {
    displayPicturesRef.current = displayPictures;
  }, [displayPictures])

  const animateImg = (url: string, i: number) => {
    if (!url) return null;
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
    <SectionContainer className={styles.wrapper}>
      <div className={styles.left}>
        <h1>
          The leading NFT<br/>Lending Platform
        </h1>
        <p>The first P2P NFT Lending platform on<br /> <img className={styles.nearLogo} src={LogoNear} /> Protocol. The fast, secure and reliable solution you need.</p>
        <ButtonCreateLoan className={styles.createButton} title='Create a Loan' />
      </div>
      <div className={styles.right}>
        <div className={styles.imageRow}>
          {examples.slice(0, 3).map((e, i) => animateImg(e, i))}
        </div>
        <div className={styles.imageRow}>
          {examples.slice(3, 6).map((e, i) => animateImg(e, i))}
        </div>
      </div>
    </SectionContainer>
  )
};

export default Introduce;