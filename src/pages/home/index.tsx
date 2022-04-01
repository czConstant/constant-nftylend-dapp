import React from "react";
import BodyContainer from "src/common/components/bodyContainer";
import styles from "./styles.module.scss";
import cx from "classnames";
import { Button } from "react-bootstrap";

import imgTitle from "./assets/title.png";
import imgTitle2 from "./assets/title2.png";
import imgWhatNFTy from "./assets/what_nfty.png";
import imgWhatNFTyMobile from "./assets/what_nfty_mobile.png";
import imgHowItWork from "./assets/how_it_work.png";
import icDiscord from "./assets/ic_discord.svg";
import icTwitter from "./assets/btn_twitter.png";
import icFacebook from "./assets/btn_facebook.png";
import icYoutube from "./assets/btn_youtube.png";
import imgMBCommunity1 from "./assets/mobile_img_1_communicate.png";
import imgMBCommunity2 from "./assets/mobile_img_2_communicate.png";

import fantom from "./assets/partner/fantom.png";
import cardano from "./assets/partner/cardano.png";
import tomo from "./assets/partner/tomo.png";
import chainlink from "./assets/partner/chainlink.png";
import vechain from "./assets/partner/vechain.png";
import polygon from "./assets/partner/polygon.png";
import band_protocol from "./assets/partner/band_protocol.png";
import fetchai from "./assets/partner/fetchai.png";
import nano from "./assets/partner/nano.png";

import press1 from "./assets/partner/press/1.png";
import press2 from "./assets/partner/press/2.png";
import press3 from "./assets/partner/press/3.png";
import press4 from "./assets/partner/press/4.png";
import press5 from "./assets/partner/press/5.png";
import press6 from "./assets/partner/press/6.png";
import press7 from "./assets/partner/press/7.png";
import press8 from "./assets/partner/press/8.png";
import press9 from "./assets/partner/press/9.png";
import press10 from "./assets/partner/press/10.png";
import press11 from "./assets/partner/press/11.png";
import press12 from "./assets/partner/press/12.png";

import { useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import ButtonCreateLoan from "src/common/components/buttonCreateLoan";
import { isMobile } from "react-device-detect";

const logoPress = [
  press1,
  press2,
  press3,
  press4,
  press5,
  press6,
  press7,
  press8,
  press9,
  press10,
  press11,
  press12,
];

const logoPartners = [
  fantom,
  cardano,
  tomo,
  chainlink,
  vechain,
  polygon,
  fetchai,
  nano,
  band_protocol,
];

export const OnBoardingHeader = () => (
  <div className={styles.headerWrapper}>
    <h5>Create, explore, & collect digital art NFTs</h5>
    <h1>The new creative economy.</h1>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <BodyContainer
      className={cx(isMobile && styles.mobileWrapper, styles.wrapper)}
    >
      <section className={cx(styles.section, styles.sectionBG)}>
        <img alt="NFT Pawn" src={imgTitle} className={styles.imgLogo} />
        <h2>The leading of NFTs Lending platform</h2>
        <p>
          The first marketplace for NFTs P2P Lending. The fastest way to liquid
          your NFTs. Lenders and Borrowers are connected by our smart contract.
        </p>
        <div className={styles.groupButton}>
          <ButtonCreateLoan hiddenIcon={true} title="Borrow" />
          {/* <Button>Borrow</Button> */}
          <Button onClick={() => navigate(APP_URL.NFT_LENDING_LIST_LOAN)}>
            Lend
          </Button>
        </div>
      </section>
      <section className={cx(styles.section)}>
        <h4 className={styles.sectionTitle}>PAWN PROTOCOL</h4>
        {/* <img alt="NFT Pawn" src={imgTitle} className={styles.imgLogo} /> */}
        <h1>What is NFT Pawn?</h1>
        <p>
          NFT Pawn is an autonomous P2P lending marketplace powered by smart
          contracts.
        </p>
        <div className={styles.bgWhatNFTy}>
          <img alt="NFT Pawn" src={isMobile ? imgWhatNFTyMobile : imgWhatNFTy} />
        </div>
      </section>
      <section className={cx(styles.section, styles.sectionHIW)}>
        <h1>How it works?</h1>
        <p>
          Whether you want to invest or borrow, you choose to fulfill an
          existing order on the marketplace or negotiate your rate and term. Our
          smart contracts handle the rest.
        </p>
        <div className={styles.bgHowItWork}>
          <img alt="NFT Pawn" src={imgHowItWork} />
        </div>
      </section>
      <section className={cx(styles.section)}>
        <h4 className={styles.sectionTitle}>PAWN PROTOCOL</h4>
        <h1>Press</h1>
        {/* <p>Our smart contracts handle the rest.</p> */}
        <div className={styles.wrapPartner}>
          {logoPress.map((v, i) => (
            <div key={i}>
              <img src={v} />
            </div>
          ))}
        </div>
      </section>
      <section className={cx(styles.section)}>
        <div className={styles.sectionBgOurPartner}>
        <h4 className={styles.sectionTitle}>PAWN PROTOCOL</h4>
          <h1>Partners</h1>
          <div className={styles.wrapPartner}>
            {logoPartners.map((v) => (
              <div key={v}>
                <img src={v} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <section className={cx(styles.section)}>
        <div className={styles.sectionBgJoin}>
          <div className={styles.sectionBgJoinTop}>
            <h1>Join our communities</h1>
            <p>MyConstant redefines banking using decentralized thinking.</p>
            <div className={styles.groupButton}>
              <a target="_blank" href="https://discord.gg/ncjPApdgBz">
                <img src={icDiscord} /> Discord
              </a>
              <a target="_blank" href="https://twitter.com/myconstantp2p">
                <img src={icTwitter} />
              </a>
              <a target="_blank" href="https://www.facebook.com/myconstantp2p">
                <img src={icFacebook} />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/channel/UCedaWJPf9sgsy5JajmqBAtg"
              >
                <img src={icYoutube} />
              </a>
            </div>
          </div>
          {isMobile && (
            <>
              <img src={imgMBCommunity2} className={styles.joinCommunicateBG} />
              <img
                src={imgMBCommunity1}
                className={styles.joinCommunicateLogo}
              />
            </>
          )}
        </div>
      </section> */}
    </BodyContainer>
  );
};

export default Home;
