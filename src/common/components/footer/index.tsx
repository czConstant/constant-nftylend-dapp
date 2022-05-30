import React, { memo } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import cx from "classnames";

import { APP_URL } from "../../constants/url";
import AppIcon from "../appIcon";

import styles from "./styles.module.scss";
import MyPopover from '../myPopover';

const Footer = () => (
  <div className={cx(isMobile && styles.mobileFooter, styles.wrapper)}>
    <div className={styles.content}>
      <div className={styles.left}>
        <Link to={APP_URL.NFT_LENDING}>
          <AppIcon dark />
        </Link>
        <div className={styles.copyright}>
          <div>This project is in public beta <MyPopover desc="This project is in public beta. - NFTPawn's smart contract is not yet audited by well-known security organization or firm. Use at your own risk!" /></div>
          <div>Copyright © 2022 NFT Pawn. All rights reserved</div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.menus}>
          <Link to={APP_URL.NFT_LENDING}>Discover</Link>
          <Link to={APP_URL.NFT_LENDING_LIST_LOAN}>Listing Loans</Link>
          <Link to={APP_URL.NFT_LENDING_VOTING}>Voting</Link>
          <Link to={APP_URL.NFT_LENDING_TERM_OF_SERVICE}>
            Terms of Services
          </Link>
          <Link to={APP_URL.NFT_LENDING_FAQS}>FAQs</Link>
          <a
            target={"_blank"}
            href={
              "https://docs.nftpawn.financial/overview/introduction-myconstant"
            }
          >
            Docs
          </a>
        </div>
        <div className={styles.company}>
          <span className={styles.companyName}><i className="far fa-copyright" />2019-2022 Const LLC.</span>
          <br />
          <span>3500 S dupont hwy Dover 19901 Delaware</span>
        </div>
      </div>
    </div>
  </div>
);

export default memo(Footer);
