import React, { memo, useRef } from "react";
import VotingHeader from "./Voting.Header";
import styles from "./styles.module.scss";
import VotingList from "./list";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import cx from 'classnames';
import { isMobile } from "react-device-detect";
import BodyContainer from 'src/common/components/bodyContainer';
import { Flex } from '@chakra-ui/react';

const Voting = () => {
  const defaultBreadCrumbs = useRef<BreadCrumbItem[]>([
    {
      label: "Discover",
      link: APP_URL.DISCOVER,
    },
    {
      label: "Proposal",
    },
  ]);
  return (
    <>
      <VotingHeader />
      <BodyContainer className={cx(isMobile && styles.votingMobileContainer, styles.votingContainer)}>
        <Flex direction='column' px={4} py={8}>
          <BreadCrumb items={defaultBreadCrumbs.current} />
          <VotingList />
        </Flex>
      </BodyContainer>
    </>
    // <div className={cx(isMobile && styles.votingMobileContainer, styles.votingContainer)}>
    // </div>
  );
};

export default Voting;
