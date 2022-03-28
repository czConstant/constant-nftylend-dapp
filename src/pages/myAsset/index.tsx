import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cx from "classnames";
import { Tab, Tabs } from "react-bootstrap";
import {
  WalletDisconnectButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import queryString from "query-string";

import BodyContainer from "src/common/components/bodyContainer";
import ButtonSolWallet from "src/common/components/buttonSolWallet";
import {
  getBalanceToken,
  getLinkSolScanAccount,
} from "src/modules/solana/utils";
import {
  formatCurrencyByLocale,
  shortCryptoAddress,
} from "src/common/utils/format";
import ListAsset from "src/modules/nftLend/components/listAsset";
import ListLoan from "src/modules/nftLend/components/listLoan";
import ListOffer from "src/modules/nftLend/components/listOffer";
import ListOfferReceive from "src/modules/nftLend/components/listOfferReceive";

import styles from "./styles.module.scss";
import bgCover from "./images/bg_cover.png";
import { toastSuccess } from "src/common/services/toaster";
import { getNftListCurrency } from "src/modules/nftLend/api";
import { Currency } from "src/modules/nftLend/models/api";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";
import ButtonDisconnectWallet from 'src/common/components/buttonDisconnectWallet';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import ButtonConnectWallet from 'src/common/components/buttonConnectWallet';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';

export const TABS = {
  owned: "my-assets",
  loan: "loans",
  offer: "offers-made",
  offer_received: "offers-received",
  history: "History",
};

const MyAsset = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const location = useLocation();

  const tabActive = queryString.parse(location.search)?.tab || TABS.owned;

  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [selectedTab, setSelectedTab] = useState(tabActive);

  useEffect(() => {
    fetchBalance();
  }, [publicKey]);

  const fetchBalance = async () => {
    if (!publicKey) return;
    const solRes = await connection.getBalance(publicKey);
    setBalance(new BigNumber(solRes).dividedBy(LAMPORTS_PER_SOL).toNumber());

    const listCurrencies = (await getNftListCurrency()).result;
    const res = await Promise.all(
      listCurrencies.map((e: Currency) =>
        getBalanceToken(connection, publicKey, e.contract_address)
      )
    );
    listCurrencies.forEach((e: any, i: number) => {
      e.balance = res[i];
    });
    setCurrencies(listCurrencies);
  };

  return (
    <>
      <img className={styles.cover} alt="cover" src={bgCover} />
      <BodyContainer
        className={cx(isMobile && styles.mbWrapper, styles.wrapper)}
      >
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.contentAvatar}>
              <img
                src="https://ethernity.io/images/default-avatar.jpg"
                alt="Avatar"
              />
            </div>
            {walletAddress ? (
              <>
                <div className={styles.addressWrap}>
                  <a
                    target="_blank"
                    href={getLinkExplorerWallet(walletAddress, walletChain)}
                  >
                    {shortCryptoAddress(walletAddress, 10)}
                  </a>
                  <CopyToClipboard
                    onCopy={() => toastSuccess("Copied address!")}
                    text={walletAddress}
                  >
                    <i className="far fa-copy" />
                  </CopyToClipboard>
                </div>
                <div className={styles.priceWrap}>
                  <label>Balance</label>
                  <div className={styles.balance}>
                    <span>{formatCurrencyByLocale(balance, 8)}</span> SOL
                  </div>
                  {currencies.map((e: Currency) => (
                    <div className={styles.balance}>
                      <span>{formatCurrencyByLocale(e.balance, 2)}</span>{" "}
                      {e.symbol}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.connectButtonWrap}>
                <ButtonConnectWallet className={styles.connectButton} />
              </div>
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.tabWrapper}>
              <Tabs
                activeKey={selectedTab}
                onSelect={(e) => setSelectedTab(e || "")}
                className={styles.tabWrapper}
              >
                <Tab
                  eventKey={TABS.owned}
                  tabClassName={styles.tab}
                  title="My Assets"
                >
                  <ListAsset />
                </Tab>
                <Tab
                  eventKey={TABS.loan}
                  tabClassName={styles.tab}
                  title="Loans"
                >
                  <ListLoan />
                </Tab>
                <Tab
                  eventKey={TABS.offer}
                  tabClassName={styles.tab}
                  title={
                    <span>
                      <i className="fas fa-arrow-up"></i> Offers made
                    </span>
                  }
                >
                  <ListOffer />
                </Tab>
                <Tab
                  eventKey={TABS.offer_received}
                  tabClassName={styles.tab}
                  title={
                    <span>
                      <i className="fas fa-arrow-down"></i> Offers received
                    </span>
                  }
                >
                  <ListOfferReceive />
                </Tab>
                {/* <Tab
                  eventKey={TABS.history}
                  tabClassName={styles.tab}
                  title="History"
                >
                  <MyListHistory />
                </Tab> */}
              </Tabs>
            </div>
          </div>
        </div>
      </BodyContainer>
    </>
  );
};

export default MyAsset;
