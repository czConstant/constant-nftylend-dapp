import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";

import styles from "./styles.module.scss";
import AppIcon from "../appIcon";
import ButtonCreateLoan from "../buttonCreateLoan";
import { Link, NavLink, useLocation } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import ButtonSolWallet from "../buttonSolWallet";
import { useWallet } from "@solana/wallet-adapter-react";

const HeaderMobile = ({}) => {
  const location = useLocation();
  const { publicKey } = useWallet();
  const isFirst = useRef(true);

  const [toggle, setToggle] = useState(false);

  const onToggle = () => {
    setToggle((v) => {
      if (!v === true) {
        window.document.body.style.overflow = "hidden";
      } else {
        window.document.body.style.overflow = "auto";
      }
      return !v;
    });
  };

  const onCloseToggle = () => {
    window.document.body.style.overflow = "auto";
    setToggle(false);
  };

  return (
    <div className={cx(styles.mobileContainer, toggle && styles.toggle)}>
      <div className={styles.headerWrap}>
        <Link onTouchEnd={onCloseToggle} to={APP_URL.HOME}>
          <AppIcon dark />
        </Link>
        <div onClick={onToggle} className={styles.burgerContainer}>
          <div>
            <div className={styles.topBar} />
            <div className={styles.bottomBar} />
          </div>
        </div>
      </div>
      <ul className={cx(styles.menu)}>
        <li>
          <Link onTouchEnd={onToggle} to={APP_URL.DISCOVER}>
            Discover
          </Link>
        </li>
        <li>
          <Link onTouchEnd={onToggle} to={APP_URL.LIST_LOAN}>
            Listing Loans
          </Link>
        </li>
        <li>
          <Link onTouchEnd={onToggle} to={APP_URL.VOTING}>
            Proposal
          </Link>
        </li>
        {/* <li>
          <Link onTouchEnd={onToggle} to={APP_URL.NFT_PAWN_BLOG}>
            News
          </Link>
        </li> */}
        {publicKey && (
          <li>
            <Link onTouchEnd={onToggle} to={APP_URL.DASHBOARD}>
              Dashboard
            </Link>
          </li>
        )}

        <div className={styles.bottom}>
          <ButtonCreateLoan />
          <ButtonSolWallet
            classNameDisconnect={styles.disconnectButton}
            showBtnDisConnect={true}
          />
        </div>
      </ul>
    </div>
  );
};

export default HeaderMobile;
