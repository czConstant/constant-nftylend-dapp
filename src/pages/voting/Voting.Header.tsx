import React, { memo } from "react";
import styles from "./styles.module.scss";
import globalStyles from "src/common/styles/index.module.scss";
import cx from "classnames";
import bgCircle from "./images/bgBubble.webp";
import imgPresent from "./images/imgPresents.png";
import VotingMakeProposal from "./Voting.Make.Proposal";

const VotingHeader = () => {
  return (
    <div className={styles.votingHeader}>
      <img
        src={bgCircle}
        className={styles.positionBubbleCircle}
        height={600}
      />
      <div className={styles.votingHeaderContent}>
        <div>
          <h3>Voting</h3>
          <p>Have your say in the future of the NFTPawn</p>
          <VotingMakeProposal />
        </div>
        <div>
          <img src={imgPresent} />
        </div>
      </div>
    </div>
  );
};

export default VotingHeader;
