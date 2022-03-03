import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import cx from 'classnames';

import BodyContainer from 'src/common/components/bodyContainer';
import ButtonSolWallet from 'src/common/components/buttonSolWallet';
import { getBalanceToken, getLinkSolScanAccount } from 'src/common/utils/solana';
import { APP_ENV } from 'src/common/constants/url';

import styles from './styles.module.scss';
import bgCover from './images/bg_cover.png';
import { shortCryptoAddress } from 'src/common/utils/format';
import { WalletDisconnectButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Tab, Tabs } from 'react-bootstrap';
import ListAsset from 'src/modules/nftLend/components/listAsset';

const TABS = {
  owned: 'My Assets',
  loan: 'Loans',
  offer: 'Offers',
  offer_received: 'OffersReceived',
};

const MyAsset = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [balance, setBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [selectedTab, setSelectedTab] = useState(TABS.owned);

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((res) => {
        setBalance(new BigNumber(res).dividedBy(LAMPORTS_PER_SOL).toNumber());
      });
      getBalanceToken(connection, publicKey, APP_ENV.REACT_SOL_USDC_MINT).then(
        (res) => {
          setUsdcBalance(res);
        },
      );
    }
  }, [publicKey]);

  return (
    <>
      <img className={styles.cover} alt="cover" src={bgCover} />
      <BodyContainer className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.contentAvatar}>
              <img src="https://ethernity.io/images/default-avatar.jpg" alt="Avatar" />
            </div>
            {(connected && publicKey) ? (
              <>
                <div className={styles.addressWrap}>
                  <a target='_blank' href={`${getLinkSolScanAccount(publicKey.toString())}`}>{shortCryptoAddress(publicKey?.toString(), 10)}</a>
                  <CopyToClipboard
                    onCopy={() => alert('Copied address!')}
                    text={publicKey?.toString()}
                  >
                    <i className="far fa-copy" />
                  </CopyToClipboard>
                </div>
                <div className={styles.priceWrap}>
                  <label>Balance</label>
                  <div className={styles.balance}>
                    <span>{balance}</span> SOL
                  </div>
                  {
                    usdcBalance && <div className={styles.balance}>
                      <span>{usdcBalance}</span> USDC
                    </div>
                  }
                </div>
                <div className={styles.connectButtonWrap}>
                  <WalletModalProvider>
                    <WalletDisconnectButton
                      className={cx(
                        styles.connectButton,
                        styles.disconnectButton,
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
                onSelect={(e) => setSelectedTab(e || '')}
                className={styles.tabWrapper}
              >
                <Tab eventKey={TABS.owned} tabClassName={styles.tab} title="My Assets">
                  <ListAsset />
                </Tab>
                <Tab
                  eventKey={TABS.loan}
                  tabClassName={styles.tab}
                  title="Loans"
                >
                  {/* <ListLoan /> */}
                </Tab>
                <Tab
                  eventKey={TABS.offer}
                  tabClassName={styles.tab}
                  title="Offers made"
                >
                  {/* <ListOffer /> */}
                </Tab>
                <Tab
                  eventKey={TABS.offer_received}
                  tabClassName={styles.tab}
                  title="Offers received"
                >
                  {/* <ListOfferReceive /> */}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </BodyContainer>
    </>
  )
};

export default MyAsset;
