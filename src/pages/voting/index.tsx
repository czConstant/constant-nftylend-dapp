import React, { memo } from "react";
import VotingHeader from "./Voting.Header";
import styles from "./styles.module.scss";

const Voting = () => {
  return (
    <div className={styles.votingContainer}>
      <VotingHeader />
    </div>
  );
};

export default memo(Voting);
