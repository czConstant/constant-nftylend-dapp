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
} from "src/common/utils/solana";
import { APP_ENV } from "src/common/constants/url";
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

  const location = useLocation();

  const tabActive = queryString.parse(location.search)?.tab || TABS.owned;

  console.log(tabActive);

  const [balance, setBalance] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  console.log(
    "🚀 ~ file: index.tsx ~ line 38 ~ MyAsset ~ currencies",
    currencies
  );
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
      <BodyContainer className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.contentAvatar}>
              <img
                src="https://ethernity.io/images/default-avatar.jpg"
                alt="Avatar"
              />
            </div>
            {connected && publicKey ? (
              <>
                <div className={styles.addressWrap}>
                  <a
                    target="_blank"
                    href={`${getLinkSolScanAccount(publicKey.toString())}`}
                  >
                    {shortCryptoAddress(publicKey?.toString(), 10)}
                  </a>
                  <CopyToClipboard
                    onCopy={() => toastSuccess("Copied address!")}
                    text={publicKey?.toString()}
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
                      <span>{e.balance}</span> {e.symbol}
                    </div>
                  ))}
                </div>
                <div className={styles.connectButtonWrap}>
                  <WalletModalProvider>
                    <WalletDisconnectButton
                      className={cx(
                        styles.connectButton,
                        styles.disconnectButton
                      )}
                    />
                  </WalletModalProvider>
                </div>
              </>
            ) : (
              <div className={styles.connectButtonWrap}>
                <ButtonSolWallet className={styles.connectButton} />
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
