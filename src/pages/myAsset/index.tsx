import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cx from "classnames";
import { Tab, Tabs } from "react-bootstrap";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import BodyContainer from "src/common/components/bodyContainer";
import { formatCurrencyByLocale, shortCryptoAddress } from "src/common/utils/format";
import ListAsset from "src/views/myAssets/listAsset";
import ListLoan from "src/views/myAssets/listLoan";
import ListOffer from "src/views/myAssets/listOffer";
import ListOfferReceive from "src/views/myAssets/listOfferReceive";
import { toastSuccess } from "src/common/services/toaster";
import { getNftListCurrency } from "src/modules/nftLend/api";
import { Currency } from "src/modules/nftLend/models/api";
import ButtonConnectWallet from 'src/common/components/buttonConnectWallet';
import { getLinkExplorerWallet } from 'src/modules/nftLend/utils';
import { useToken } from 'src/modules/nftLend/hooks/useToken';

import bgCover from "./images/bg_cover.png";
import styles from "./styles.module.scss";
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

export const TABS = {
  owned: "my-assets",
  loan: "loans",
  offer: "offers-made",
};

const MyAsset = () => {
  const { getNativeBalance, getBalance } = useToken();
  const { isConnected, currentWallet} = useCurrentWallet();
  const location = useLocation();

  const tabActive = queryString.parse(location.search)?.tab || TABS.owned;

  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [selectedTab, setSelectedTab] = useState(tabActive);

  useEffect(() => {
    if (isConnected) fetchBalance();
  }, [currentWallet]);

  const fetchBalance = async () => {
    const nativeBalance = await getNativeBalance();
    setBalance(nativeBalance);

    const listCurrencies = (await getNftListCurrency(currentWallet.chain)).result;
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

  // if (!walletAddress) return <Navigate to={APP_URL.DISCOVER} />

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
            {isConnected ? (
              <>
                <div className={styles.addressWrap}>
                  <a
                    target="_blank"
                    href={getLinkExplorerWallet(currentWallet.address, currentWallet.chain)}
                  >
                    {shortCryptoAddress(currentWallet.address, 16)}
                  </a>
                  <CopyToClipboard
                    onCopy={() => toastSuccess("Copied address!")}
                    text={currentWallet.address}
                  >
                    <i className="far fa-copy" />
                  </CopyToClipboard>
                </div>
                <div className={styles.priceWrap}>
                  <label>Balance</label>
                  <div className={styles.balance}>
                    <span>{formatCurrencyByLocale(balance, 8)}</span>
                    {currentWallet.chain.toString()}
                  </div>
                  {currencies.map((e: Currency) => (
                    <div key={e.symbol} className={styles.balance}>
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
                // className={styles.tabWrapper}
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
                  title={
                    <span>
                      <i className="fas fa-arrow-down"></i> Loans
                    </span>
                  }
                >
                  <ListLoan />
                </Tab>
                <Tab
                  eventKey={TABS.offer}
                  tabClassName={styles.tab}
                  title={
                    <span>
                      <i className="fas fa-arrow-up"></i> Lends
                    </span>
                  }
                >
                  <ListOffer />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </BodyContainer>
    </>
  );
};

export default MyAsset;
