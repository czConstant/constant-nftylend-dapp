import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { APP_URL } from "src/common/constants/url";

import ButtonCreateLoan from "../buttonCreateLoan";
import AppIcon from "../appIcon";
import styles from "./styles.module.scss";
import { Box, Flex } from '@chakra-ui/react';

const HeaderMobile = ({}) => {
  const { isConnected } = useCurrentWallet()

  const [toggle, setToggle] = useState(false)

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
    <Flex direction='column' bgColor='black' className={cx(styles.mobileContainer, toggle && styles.toggle)}>
      <Flex alignItems='center' justifyContent='space-between' px={4}>
        <Link onTouchEnd={onCloseToggle} to={APP_URL.HOME}>
          <AppIcon dark />
        </Link>
        <div onClick={onToggle} className={styles.burgerContainer}>
          <div>
            <div className={styles.topBar} />
            <div className={styles.bottomBar} />
          </div>
        </div>
      </Flex>
      <Flex flex={1} direction='column' px={4} py={8} gap={4} justifyContent='space-between'>
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
          {isConnected && (
            <li>
              <Link onTouchEnd={onToggle} to={APP_URL.DASHBOARD}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
        <ButtonCreateLoan />
      </Flex>
    </Flex>
  );
};

export default HeaderMobile;
