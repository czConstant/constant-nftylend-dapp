import React from "react";
import BodyContainer from "src/common/components/bodyContainer";
import styles from "./styles.module.scss";
import cx from "classnames";
import { Button, Col, Row } from "react-bootstrap";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";

import imgTitle from "./assets/title.png";
import imgTitle2 from "./assets/title2.png";
import imgWhatNFTy from "./assets/what_nfty.png";
import imgWhatNFTyMobile from "./assets/what_nfty_mobile.png";
import imgHowItWork from "./assets/how_it_work.png";
import imgHowItWorkMobile from "./assets/how_it_work_mobile.png";
import imgMBCommunity2 from "./assets/mobile_img_2_communicate.png";
import imgIntro from "./assets/img_introduction.png";
import BgLine from "./assets/bgTokenomics.png";
import BgWindow from "./assets/bg_window.svg";
import icDiscord from "./assets/ic_discord.svg";
import icTwitter from "./assets/btn_twitter.png";
import imgCommunityLogo from "./assets/img_community_logo.png";

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

const DURATION = 1000;

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

const DATA = [
  {
    title: "Token Information",
    desc: (
      <div>
        Token Name
        <br />
        <strong style={{ color: "white" }}>PWP (Pawn Protocol Token)</strong>
        Blockchain
        <br />
        <strong style={{ color: "white" }}>
          Solana, Near, Polygon, Avalanche
        </strong>
        Max Token Supply
        <br />
        <strong style={{ color: "white" }}>900,000,000 PWP</strong>
        Initial Token Circulation
        <br />
        <strong style={{ color: "white" }}>189,900,000 PWP</strong>
      </div>
    ),
  },
  {
    title: "Governance",
    desc: "Steps towards complete decentralization, NFT Pawn is managed by a decentralized community of PWP token-holders and their delegates, who propose and vote on upgrades to the protocol.",
  },
  {
    title: "Burn Token",
    desc: "The PWP token burning events are scheduled to occur every quarter until 720,000,000 PWP are finally destroyed, which represents 80% of the total PWP ever issued (900,000,000 PWP)",
  },
  {
    title: "Staking",
    desc: "Earn PWP token as reward by staking and being a part of protocol",
  },
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
      <div className={styles.bottomMask} />
      <Fade duration={DURATION}>
        <section className={cx(styles.section, styles.sectionBG)}>
          <img alt="NFT Pawn" src={imgTitle} className={styles.imgLogo} />
          <h2>The leading of NFTs Lending platform</h2>
          <p>
            The first marketplace for NFTs P2P Lending. The fastest way to
            liquid your NFTs. Lenders and Borrowers are connected by our smart
            contract.
          </p>
          <div className={styles.groupButton}>
            <ButtonCreateLoan hiddenIcon={true} title="Borrow" />
            {/* <Button>Borrow</Button> */}
            <Button onClick={() => navigate(APP_URL.NFT_LENDING_LIST_LOAN)}>
              Lend
            </Button>
          </div>
        </section>
      </Fade>
      <Fade bottom duration={DURATION}>
        <section className={cx(styles.section)}>
          {/* <h4 className={styles.sectionTitle}>PAWN PROTOCOL</h4> */}
          <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
          <h1>What is NFT Pawn?</h1>
          <p>
            NFT Pawn is an autonomous P2P lending marketplace powered by smart
            contracts.
          </p>
          <div className={styles.bgWhatNFTy}>
            <img
              alt="NFT Pawn"
              src={isMobile ? imgWhatNFTyMobile : imgWhatNFTy}
            />
          </div>
        </section>
      </Fade>
      <Fade bottom duration={DURATION}>
        <section className={cx(styles.section, styles.sectionHIW)}>
          <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
          <h1>How it works?</h1>
          <p>
            Whether you want to invest or borrow, you choose to fulfill an
            existing order on the marketplace or negotiate your rate and term.
            Our smart contracts handle the rest.
          </p>
          <div className={styles.bgHowItWork}>
            <img
              alt="NFT Pawn"
              src={isMobile ? imgHowItWorkMobile : imgHowItWork}
            />
          </div>
        </section>
      </Fade>
      {/* <Fade duration={DURATION}>
        <section className={cx(styles.section)}>
          <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
          <h1>Press</h1>
          <div className={styles.wrapPartner}>
            {logoPress.map((v, i) => (
              <Fade key={i} duration={DURATION + i * 100}>
                <div>
                  <img src={v} />
                </div>
              </Fade>
            ))}
          </div>
        </section>
      </Fade> */}

      {/* <Fade duration={DURATION}>
        <section className={cx(styles.section)}>
          <div className={styles.sectionBgOurPartner}>
            <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
            <h1>Partners</h1>
            <div className={styles.wrapPartner}>
              {logoPartners.map((v, i) => (
                <Fade key={i} duration={DURATION + i * 100}>
                  <div>
                    <img src={v} />
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      </Fade> */}
      <Fade>
        <section
          className={cx(styles.section)}
          style={{ position: "relative" }}
        >
          <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
          <h1>Introduction</h1>
          <div className={styles.textLeftWrap}>
            <div className={styles.textLeft}>
              <div className={styles.text}>
                <span>NFT Pawn</span> is aiming to <span>solve a real</span>
              </div>
              <div className={styles.text}>
                <span>problem</span> with <span>the usability of NFTs</span> as
              </div>
              <div className={styles.text}>
                <span>lending assets on multichain.</span> We will
              </div>
              <div className={styles.text}>
                <span>decentralize the pawnshop model</span>.
              </div>
            </div>
          </div>
          {!isMobile && <img src={imgIntro} className={styles.imgIntro} />}
        </section>
      </Fade>
      <Slide duration={DURATION}>
        <Row
          style={{
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <Col
            xs={{ span: 12, order: 2 }}
            md={{ span: 7, order: 1 }}
            className={cx(styles.tokenomics, "no-scroll-bar")}
          >
            <div className={styles.bgImage}>
              {!isMobile && (
                <img className={styles.bgLine} alt="" src={BgLine} />
              )}
              <img alt="" src={BgWindow} className={styles.bgWindow} />
            </div>
            <div className={styles.list}>
              {DATA.map((d) => {
                const { title, desc } = d;
                return (
                  <div key={title} className={styles.item}>
                    <div className={styles.itemContent}>
                      <div className={styles.name}>{title}</div>
                      <div className={styles.desc}>{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col xs={{ span: 12, order: 1 }} md={{ span: 5, order: 2 }}>
            <div className={styles.titleSection}>
              <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
              <div className={styles.title}>Tokenomics & Utilities</div>
              <div className={styles.subtitle}>
                The Pawn Protocol token unlock exclusive rewards when staking,
                use to pay transaction fees, either allow PWP holders to propose
                and vote on changes to Pawn Protocol products, open-source
                codebase, and to have a voice in key business decisions and the
                overall direction of the project
              </div>
            </div>
            {/* <section
              className={cx(styles.section, styles.sectionToken)}
              style={{ position: "relative" }}
            >
              <img alt="NFT Pawn" src={imgTitle2} className={styles.imgLogo2} />
              <h1>Tokenomics & Utilities</h1>
              <p>
                The Pawn Protocol token unlock exclusive rewards when staking,
                use to pay transaction fees, either allow PWP holders to propose
                and vote on changes to Pawn Protocol products, open-source
                codebase, and to have a voice in key business decisions and the
                overall direction of the project
              </p>
            </section> */}
          </Col>
        </Row>
      </Slide>
      <Fade>
        <section className={cx(styles.section)}>
          <div className={styles.sectionBgJoin}>
            <div className={styles.sectionBgJoinTop}>
              <h1>Join our communities</h1>
              <p>NFT Pawn redefines banking using decentralized thinking.</p>
              <div className={styles.groupButton}>
                <a target="_blank" href="https://discord.gg/afKpDmv2">
                  <img src={icDiscord} /> Discord
                </a>
                <a target="_blank" href="https://twitter.com/NFTPawn_Lending">
                  <img src={icTwitter} />
                </a>
                {/* <a target="_blank" href="https://www.facebook.com/myconstantp2p">
                <img src={icFacebook} />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/channel/UCedaWJPf9sgsy5JajmqBAtg"
              >
                <img src={icYoutube} />
              </a> */}
              </div>
            </div>
            <div className={styles.sectionBgJoinBottom}>
              <img
                className={styles.joinCommunicateBG}
                alt=""
                src={imgMBCommunity2}
              />
              <img className={styles.imgToken} alt="" src={imgCommunityLogo} />
            </div>
            {/* {isMobile && (
            <>
              <img src={imgMBCommunity2} className={styles.joinCommunicateBG} />
              <img
                src={imgMBCommunity1}
                className={styles.joinCommunicateLogo}
              />
            </>
          )} */}
          </div>
        </section>
      </Fade>
    </BodyContainer>
  );
};

export default Home;
