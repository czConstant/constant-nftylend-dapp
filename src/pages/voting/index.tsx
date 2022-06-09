import React, { memo, useRef } from "react";
import VotingHeader from "./Voting.Header";
import styles from "./styles.module.scss";
import VotingList from "./list";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import BodyContainer from "src/common/components/bodyContainer";

const Voting = () => {
  const defaultBreadCrumbs = useRef<BreadCrumbItem[]>([
    {
      label: "Discover",
      link: APP_URL.NFT_LENDING,
    },
    {
      label: "Voting",
    },
  ]);
  return (
    <div className={styles.votingContainer}>
      <VotingHeader />
      <div className={styles.body}>
        <BreadCrumb items={defaultBreadCrumbs.current} />
        <VotingList />
      </div>
    </div>
  );
};

export default Voting;
