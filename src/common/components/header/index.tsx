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
import ButtonWalletDropdown from "../buttonWalletDropdown";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { APP_CLUSTER } from "src/common/constants/config";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import ButtonSearchLoans from 'src/views/apps/ButtonSearchLoans';

const Header = () => {
  const location = useLocation();
  const { isConnected } = useCurrentWallet();

  if (isMobile) return <HeaderMobile />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link to={APP_URL.HOME}>
            <AppIcon />
          </Link>
          <div className={styles.divider} />
          <div className={styles.menus}>
            <Link
              to={APP_URL.DISCOVER}
              className={cx(location.pathname === APP_URL.DISCOVER && styles.active)}
            >
              Discover
            </Link>
            <Link
              to={APP_URL.LIST_LOAN}
              className={cx(location.pathname === APP_URL.LIST_LOAN && styles.active)}
            >
              Listing Loans
            </Link>
            {/* <a
              target="_blank"
              href={APP_URL.NFT_PAWN_BLOG}
              className={cx(
                location.pathname === APP_URL.NFT_PAWN_BLOG && styles.active
              )}
            >
              News
            </a> */}
            <Link
              to={APP_URL.PAWN_PROTOCOL}
              className={cx(location.pathname === APP_URL.PAWN_PROTOCOL && styles.active)}
            >
              Pawn Protocol
            </Link>
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
          <ButtonSearchLoans className={styles.search} />
          {isConnected ? <ButtonWalletDropdown /> : <ButtonConnectWallet />}
        </div>
      </div>
      {APP_CLUSTER !== 'mainnet' && (
        <div className={styles.warningNetwork}>
          You are on the NFT Pawn test network. For the mainnet version, visit&nbsp;<a href="https://nftpawn.financial">https://nftpawn.financial</a>
        </div>
      )}
    </div>
  );
};

export default memo(Header);
