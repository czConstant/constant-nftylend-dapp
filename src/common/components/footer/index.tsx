import React, { memo } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import cx from "classnames";

import SocialLinks from 'src/views/apps/socialLinks';
import { APP_URL } from "src/common/constants/url";

import AppIcon from "../appIcon";
import MyPopover from '../myPopover';
import styles from "./styles.module.scss";

const Footer = () => (
  <div className={cx(isMobile && styles.mobileFooter, styles.wrapper)}>
    <div className={styles.content}>
      <div className={styles.left}>
        <Link to={APP_URL.DISCOVER}>
          <AppIcon />
        </Link>
        <div className={styles.company}>
          <span className={styles.companyName}><i className="far fa-copyright" />2019-2022 Const LLC.</span>
          <br />
          <span>3500 S dupont hwy Dover 19901 Delaware</span>
        </div>
      </div>
      <div className={styles.mid}>First NFTs Lending Solution On Near Protocol</div>
      <div className={styles.right}>
        <SocialLinks />
        <div className={styles.copyright}>
          <div>This project is in public beta <MyPopover desc="This project is in public beta. - NFTPawn's smart contract is not yet audited by well-known security organization or firm. Use at your own risk!" /></div>
          <div>Copyright © 2022 NFT Pawn. All rights reserved</div>
        </div>
      </div>
    </div>
  </div>
);

export default memo(Footer);
