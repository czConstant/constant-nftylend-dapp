import React from "react";
import BodyContainer from "src/common/components/bodyContainer";
import styles from "./styles.module.scss";
import cx from "classnames";
import { Button } from "react-bootstrap";

import imgTitle from "./assets/title.png";
import imgTitle2 from "./assets/title2.png";
import imgTitle3 from "./assets/title3.png";
import imgWhatNFTy from "./assets/what_nfty.png";
import imgHowItWork from "./assets/how_it_work.png";
import icDiscord from "./assets/ic_discord.svg";
import icTwitter from "./assets/btn_twitter.png";
import icFacebook from "./assets/btn_facebook.png";
import icYoutube from "./assets/btn_youtube.png";

import gemini from "./assets/partner/gemini.png";
import beam from "./assets/partner/beam.png";
import harmony from "./assets/partner/harmony.png";
import kucoin from "./assets/partner/kucoin.png";
import trueusd from "./assets/partner/trueusd.png";
import neutral from "./assets/partner/neutral.png";
import band_protocol from "./assets/partner/band_protocol.png";
import ont from "./assets/partner/ont.png";

import fantom from "./assets/partner/fantom.png";
import cardano from "./assets/partner/cardano.png";
import tomo from "./assets/partner/tomo.png";
import chainlink from "./assets/partner/chainlink.png";
import vechain from "./assets/partner/vechain.png";
import polygon from "./assets/partner/polygon.png";
import fetchai from "./assets/partner/fetchai.png";
import nano from "./assets/partner/nano.png";
import { useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import ButtonCreateLoan from "src/common/components/buttonCreateLoan";

const logoPartners = [
  gemini,
  beam,
  harmony,
  kucoin,
  trueusd,
  neutral,
  band_protocol,
  ont,
];

const logoOursPartners = [
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
    <BodyContainer className={styles.wrapper}>
      <section className={cx(styles.section, styles.sectionBG)}>
        <img alt="NFTy Lend" src={imgTitle} />
        <h2>The leading of NFTs Lending platform</h2>
        <p>
          The first marketplace for NFTs P2P Lending. The fastest way to liquid
          your NFTs. Lenders and Borrowers are connected by our smart contract.
        </p>
        <div className={styles.groupButton}>
          <ButtonCreateLoan hiddenIcon={true}  />
          {/* <Button>Borrow</Button> */}
          <Button onClick={() => navigate(APP_URL.NFT_LENDING_LIST_LOAN)}>Lend</Button>
        </div>
      </section>
      <section className={cx(styles.section)}>
        <img alt="NFTy Lend" src={imgTitle2} />
        <h1>What is NFTy Lend?</h1>
        <p>
          NFTy Lend is an autonomous P2P lending marketplace powered by smart
          contracts.
        </p>
        <div className={styles.bgWhatNFTy}>
          <img alt="NFTy Lend" src={imgWhatNFTy} />
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
          <img alt="NFTy Lend" src={imgHowItWork} />
        </div>
      </section>
      <section className={cx(styles.section)}>
        <img alt="NFTy Lend" src={imgTitle2} />
        <h1>Partner</h1>
        <p>Our smart contracts handle the rest.</p>
        <div className={styles.wrapPartner}>
          {logoPartners.map((v) => (
            <div key={v}>
              <img src={v} />
            </div>
          ))}
        </div>
      </section>
      <section className={cx(styles.section)}>
        <div className={styles.sectionBgOurPartner}>
          <img alt="NFTy Lend" src={imgTitle3} />
          <h1>What do our Partner think about working with us</h1>
          <div className={styles.wrapPartner}>
            {logoOursPartners.map((v) => (
              <div key={v}>
                <img src={v} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={cx(styles.section)}>
        <div className={styles.sectionBgJoin}>
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
      </section>
    </BodyContainer>
  );
};

export default Home;
