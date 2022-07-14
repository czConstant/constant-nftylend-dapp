import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";
import { Flex, Text, Link as LinkText, Icon, Box } from "@chakra-ui/react";

import AppIcon from "src/common/components/appIcon";
import { APP_URL } from "src/common/constants/url";

import styles from "./styles.module.scss";
import HeaderMobile from "./index.mobile";
import ButtonConnectWallet from "../buttonConnectWallet";
import ButtonWalletDropdown from "../buttonWalletDropdown";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { APP_CLUSTER } from "src/common/constants/config";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";

// import "@solana/wallet-adapter-react-ui/styles.css";
import ButtonSearchLoans from "src/views/apps/ButtonSearchLoans";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectUserSettings } from "src/store/nftyLend";
import { closeModal, openModal } from "src/store/modal";
import DialogSettingNotification from "../dialogSettingNotification";
import { RiShareBoxLine } from "react-icons/ri";
import ButtonUserNoti from "src/views/apps/ButtonUserNoti";

const Header = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isConnected, isFromParas } = useCurrentWallet()
  const { email, is_verified } = useAppSelector(selectUserSettings)

  const onUpdateEmail = async () => {
    const id = "addEmailModal";
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: "dark",
        title: "Settings",
        modalProps: {
          centered: true,
          contentClassName: styles.modalContent,
        },
        render: () => <DialogSettingNotification onClose={close} />,
      })
    );
  };

  if (isMobile) return <HeaderMobile />;

  const isHome = location.pathname === "/";
  const showTestnetBanner = APP_CLUSTER !== "mainnet";
  const showAddEmailBanner = APP_CLUSTER !== "testnet" && !email;
  const showVerifyBanner = APP_CLUSTER !== "testnet" && email && !is_verified;
  const showIncentiveBanner = APP_CLUSTER !== "testnet" && isHome;
  const headerHeight =
    60 +
    (showTestnetBanner ? 40 : 0) +
    (showVerifyBanner || showAddEmailBanner ? 40 : 0) +
    (showIncentiveBanner ? 40 : 0);

  return (
    <>
      <Box h={`${headerHeight}px`} />
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
                className={cx(
                  location.pathname === APP_URL.DISCOVER && styles.active
                )}
              >
                Discover
              </Link>
              <Link
                to={APP_URL.LIST_LOAN}
                className={cx(
                  location.pathname === APP_URL.LIST_LOAN && styles.active
                )}
              >
                Listing Loans
              </Link>
              <Link
                to={APP_URL.VOTING}
                className={cx(
                  location.pathname === APP_URL.VOTING && styles.active
                )}
              >
                Proposal
              </Link>
              <Link
                to={APP_URL.LEADERBOARD}
                className={cx(location.pathname === APP_URL.LEADERBOARD && styles.active)}
              >
                Leaderboard
              </Link>
              <a
                target="_blank"
                href={APP_URL.NFT_PAWN_BLOG}
                className={cx(
                  location.pathname === APP_URL.VOTING && styles.active
                )}
              >
                News
              </a>
              <Link
                to={APP_URL.PAWN_PROTOCOL}
                className={cx(
                  location.pathname === APP_URL.PAWN_PROTOCOL && styles.active
                )}
              >
                Pawn Protocol
              </Link>
            </div>
          </div>
          <Flex alignItems="center" gap={2}>
            {/* <div className={styles.hiddenSolButton}>
            <WalletModalProvider className={styles.solModal}>
              <WalletMultiButton className={styles.solButton}>
                <div id="solButton" />
              </WalletMultiButton>
            </WalletModalProvider>
          </div> */}
            <ButtonSearchLoans className={styles.search} />
            {isConnected && <ButtonUserNoti />}
            {isConnected ? (
              <ButtonWalletDropdown />
            ) : (
              <ButtonConnectWallet
                className={styles.connectButton}
                fontSize="sm"
                color="text.secondary"
              />
            )}
          </Flex>
        </div>
        {showTestnetBanner && (
          <Flex
            height={10}
            alignItems="center"
            justifyContent="center"
            bgColor="rgba(255, 192, 122, 0.2)"
          >
            <Text fontWeight="medium" fontSize="sm" color="brand.warning.400">
              You are on the NFT Pawn test network. For the mainnet version,
              visit&nbsp;
              <LinkText fontWeight="semibold" href="https://nftpawn.financial">
                https://nftpawn.financial <Icon as={RiShareBoxLine} />
              </LinkText>
            </Text>
          </Flex>
        )}
        {showAddEmailBanner && (
          <>
            <Flex
              height={10}
              alignItems="center"
              justifyContent="center"
              bgColor="rgba(224, 85, 102, 0.2)"
            >
              <Text fontWeight="medium" fontSize="sm" color="brand.danger.400">
                Please update email{" "}
                <LinkText fontWeight="bold" onClick={onUpdateEmail}>
                  here <Icon as={RiShareBoxLine} />
                </LinkText>{" "}
                to receive notifications.
              </Text>
            </Flex>
          </>
        )}
        {showVerifyBanner && (
          <>
            <Flex
              height={10}
              alignItems="center"
              justifyContent="center"
              bgColor="rgba(224, 85, 102, 0.2)"
            >
              <Text fontWeight="medium" fontSize="sm" color="brand.danger.400">
                Please check your mailbox to complete verification from NFT
                Pawn.
              </Text>
            </Flex>
          </>
        )}
        {showIncentiveBanner && (
          <Flex
            height={10}
            alignItems="center"
            justifyContent="center"
            bgColor="rgba(56, 115, 250, 0.2)"
          >
            <Text fontWeight="medium" fontSize="sm" color="brand.info.400">
              Our incentive program is live. Check out full details
              <LinkText
                fontWeight="semibold"
                href="https://medium.com/@nftpawnprotocol/nft-pawn-tutorial-how-to-liquidate-your-nfts-and-get-free-pwp-tokens-1248f8e73b81"
              >
                {" "}
                here <Icon as={RiShareBoxLine} />
              </LinkText>
            </Text>
          </Flex>
        )}
      </div>
    </>
  );
};

export default memo(Header);
