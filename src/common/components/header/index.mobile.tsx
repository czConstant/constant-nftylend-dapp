import React, { useState } from "react";
import cx from "classnames";

import styles from "./styles.module.scss";
import AppIcon from "../appIcon";
import ButtonCreateLoan from "../buttonCreateLoan";
import { Link, NavLink, useLocation } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import ButtonSolWallet from "../buttonSolWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "react-bootstrap";

const HeaderMobile = ({}) => {
  const location = useLocation();
  const { publicKey } = useWallet();

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

  return (
    <div className={cx(styles.mobileContainer, toggle && styles.toggle)}>
      <div className={styles.headerWrap}>
        <Link to={APP_URL.HOME}>
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
        <ButtonCreateLoan />
        <li>
          <Link to={APP_URL.NFT_LENDING}>Discover</Link>
        </li>
        <li>
          <Link to={APP_URL.NFT_LENDING_LIST_LOAN}>Listing Loans</Link>
        </li>

        <div className={styles.bottom}>
          {publicKey ? (
            <Button>My Assets</Button>
          ) : (
            <ButtonSolWallet className={styles.connectButton} />
          )}
        </div>
      </ul>
    </div>
  );
};

export default HeaderMobile;
