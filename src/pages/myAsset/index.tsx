import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cx from "classnames";
import { Tab, Tabs } from "react-bootstrap";
import queryString from "query-string";
import { Navigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import BodyContainer from "src/common/components/bodyContainer";
import { formatCurrencyByLocale, shortCryptoAddress } from "src/common/utils/format";
import ListAsset from "src/modules/nftLend/components/listAsset";
import ListLoan from "src/modules/nftLend/components/listLoan";
import ListOffer from "src/modules/nftLend/components/listOffer";
import ListOfferReceive from "src/modules/nftLend/components/listOfferReceive";
import { toastSuccess } from "src/common/services/toaster";
import { getNftListCurrency } from "src/modules/nftLend/api";
import { Currency } from "src/modules/nftLend/models/api";
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import ButtonConnectWallet from 'src/common/components/buttonConnectWallet';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';
import { APP_URL } from 'src/common/constants/url';
import { useToken } from 'src/modules/nftLend/hooks/useToken';

import bgCover from "./images/bg_cover.png";
import styles from "./styles.module.scss";

export const TABS = {
  owned: "my-assets",
  loan: "loans",
  offer: "offers-made",
  offer_received: "offers-received",
  history: "History",
};

const MyAsset = () => {
  const { getNativeBalance, getBalance } = useToken();
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const location = useLocation();

  const tabActive = queryString.parse(location.search)?.tab || TABS.owned;

  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [selectedTab, setSelectedTab] = useState(tabActive);

  useEffect(() => {
    fetchBalance();
  }, [walletAddress]);

  const fetchBalance = async () => {
    const nativeBalance = await getNativeBalance();
    setBalance(nativeBalance);

    const listCurrencies = (await getNftListCurrency(walletChain)).result;
    const res = await Promise.all(
      listCurrencies.map((e: Currency) =>
        getBalance(e.contract_address)
      )
    );
    listCurrencies.forEach((e: any, i: number) => {
      e.balance = new BigNumber(res[i]).dividedBy(10 ** listCurrencies[i].decimals);
    });
    setCurrencies(listCurrencies);
  };

  if (!walletAddress) return <Navigate to={APP_URL.NFT_LENDING} />

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
                    <span>{formatCurrencyByLocale(balance, 8)}</span>
                    {walletChain.toString()}
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
