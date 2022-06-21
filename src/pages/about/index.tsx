import BodyContainer from "src/common/components/bodyContainer";
import styles from "./styles.module.scss";
import cx from "classnames";
import { Col, Row } from "react-bootstrap";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import { isMobile } from "react-device-detect";
import { Button, Divider, Flex, Heading, Text } from '@chakra-ui/react';

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

import { DISCORD_URL, GITBOOK_URL } from "src/common/constants/url";

const DURATION = 1000;

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
          Near Protocol
        </strong>
        Max Token Supply
        <br />
        <strong style={{ color: "white" }}>9,000,000,000 PWP</strong>
        Initial Token Circulation
        <br />
        <strong style={{ color: "white" }}>1,890,000,000 PWP</strong>
      </div>
    ),
  },
  {
    title: "Governance",
    desc: "Steps towards complete decentralization, NFT Pawn is managed by a decentralized community of PWP token-holders and their delegates, who propose and vote on upgrades to the protocol.",
  },
  {
    title: "Burn Token",
    desc: "The PWP token burning events are scheduled to occur every quarter until 7,200,000,000 PWP are finally destroyed, which represents 80% of the total PWP ever issued (9,000,000,000 PWP)",
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

const PawwnProtocol = () => {
  return (
    <BodyContainer
      className={cx(isMobile && styles.mobileWrapper, styles.wrapper)}
    >
      <div className={styles.bottomMask} />
      <Fade duration={DURATION}>
        <section className={cx(styles.section, styles.sectionBG)}>
          <div className={cx(styles.coloredText, styles.title)}>Pawn Protocol</div>
          <Heading as='h1' fontSize='3xl' mt={12}>The leading NFTs Lending Protocol</Heading>
          <Text my={4} className={styles.subtitle}>
            The first NFTs P2P Lending Solution on Near Protocol. Collateralise your NFTs and create loan offers. Pawn Protocol’s open source NFT Collateral Service SDK can be integrated with ten lines of code to any serviced application holding user balances.
          </Text>
          <Flex mt={8} className={styles.groupButton} gap={4}>
            <Button
              w={200} h={55} borderRadius={50}
              onClick={() => window.open(DISCORD_URL, '_blank')}
            >
              Join Discord
            </Button>
            <Button
              w={200} h={55} bgImage='linear-gradient(242deg, #0012ff 0%, #006ed0 100%)'
              borderRadius={50} onClick={() => window.open(GITBOOK_URL, '_blank')}
            >
              Documents
            </Button>
          </Flex>
        </section>
      </Fade>
      <Fade bottom duration={DURATION}>
        <section className={cx(styles.section)}>
          <div className={cx(styles.coloredText)}>PAWN PROTOCOL</div>
          <h2>What is Pawn Protocol?</h2>
          <Text className={styles.subtitle}>
            Pawn Protocol is a P2P Lending platform for NFT Market powered by Smart Contract Technology. Pawn Protocol doesn't need deposits, NFTs and crypto, freeze account transactions, require signup - you can use our protocol everywhere in the world with access to the internet. NFT Pawn is the first application we build that utilized the Pawn Protocol infrastructure.
          </Text>
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
          <div className={cx(styles.coloredText)}>PAWN PROTOCOL</div>
          <h2>How Does It Work?</h2>
          <Text className={styles.subtitle}>
            Whether you want to borrow or invest, you choose to fulfil an existing order on the marketplace or negotiate your rate and term. Our smart contracts handle the rest.
          </Text>
          <div className={styles.bgHowItWork}>
            <img
              alt="NFT Pawn"
              src={isMobile ? imgHowItWorkMobile : imgHowItWork}
            />
          </div>
        </section>
      </Fade>
      <Fade>
        <section
          className={cx(styles.section)}
          style={{ position: "relative" }}
        >
          <div className={cx(styles.coloredText)}>PAWN PROTOCOL</div>
          <h2>What Is NFT Pawn?</h2>
          <div className={styles.textLeftWrap}>
            <div className={styles.textLeft}>
              <div className={styles.text}>
                <span>NFT Pawn</span> is aiming to <span>solve a real</span>
              </div>
              <div className={styles.text}>
                <span>problem</span> with <span>the usability of NFTs</span> as
              </div>
              <div className={styles.text}>
                <span>lending assets on multichain.</span> The pawnshop
              </div>
              <div className={styles.text}>
                paradigm will<span> become completely decentralized</span>.
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
              <div className={cx(styles.coloredText)}>PAWN PROTOCOL</div>
              <Text fontSize='3xl' fontWeight='semibold'>Tokenomics & Utilities</Text>
              <Text className={styles.subtitle}>
                The Pawn Protocol token unlock exclusive rewards when staking,
                use to pay transaction fees, either allow PWP holders to propose
                and vote on changes to Pawn Protocol products, open-source
                codebase, and to have a voice in key business decisions and the
                overall direction of the project
              </Text>
            </div>
            {/* <section
              className={cx(styles.section, styles.sectionToken)}
              style={{ position: "relative" }}
            >
              <div className={cx(styles.coloredText)}>PAWN PROTOCOL</div>
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
      <Divider mt={32} />
    </BodyContainer>
  );
};

export default PawwnProtocol;
