import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { isMobile } from "react-device-detect";

import AppIcon from "src/common/components/appIcon";
import { APP_URL } from "src/common/constants/url";

import styles from "./styles.module.scss";
import ButtonCreateLoan from "../buttonCreateLoan";
import HeaderMobile from "./index.mobile";
import ButtonConnectWallet from "../buttonConnectWallet";
import ButtonDisconnectWallet from "../buttonDisconnectWallet";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { APP_CLUSTER } from "src/common/constants/config";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

const Header = () => {
  const location = useLocation();
  const { isConnected } = useCurrentWallet();

  if (isMobile) return <HeaderMobile />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link to={APP_URL.HOME}>
            <AppIcon dark />
          </Link>
          <div className={styles.divider} />
          <div className={styles.menus}>
            <Link
              to={APP_URL.NFT_LENDING}
              className={cx(
                location.pathname === APP_URL.NFT_LENDING && styles.active
              )}
            >
              Discover
            </Link>
            <Link
              to={APP_URL.NFT_LENDING_LIST_LOAN}
              className={cx(
                location.pathname === APP_URL.NFT_LENDING_LIST_LOAN &&
                  styles.active
              )}
            >
              Listing Loans
            </Link>
            {isConnected && (
              <Link
                to={APP_URL.NFT_LENDING_MY_NFT}
                className={cx(
                  location.pathname === APP_URL.NFT_LENDING_MY_NFT &&
                    styles.active
                )}
              >
                My Assets
              </Link>
            )}

            <Link
              to={APP_URL.NFT_LENDING_BLOG}
              className={cx(
                location.pathname === APP_URL.NFT_LENDING_BLOG && styles.active
              )}
            >
              News
            </Link>
            <ButtonCreateLoan />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.hiddenSolButton}>
            <WalletModalProvider className={styles.solModal}>
              <WalletMultiButton className={styles.solButton}>
                <div id="solButton" />
              </WalletMultiButton>
            </WalletModalProvider>
          </div>
          {isConnected ? <ButtonDisconnectWallet /> : <ButtonConnectWallet />}
        </div>
      </div>
      {APP_CLUSTER && (
        <div className={styles.warningNetwork}>
          You are on the NFT Pawn test network, we're working toward releasing
          the mainnet soon.
        </div>
      )}
    </div>
  );
};

export default memo(Header);
