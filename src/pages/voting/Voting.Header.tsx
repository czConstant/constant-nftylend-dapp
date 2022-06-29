import React, { memo } from "react";
import styles from "./styles.module.scss";
import globalStyles from "src/common/styles/index.module.scss";
import cx from "classnames";
import bgCircle from "./images/bgBubble.webp";
import imgPresent from "./images/imgPresents.png";
import VotingMakeProposal from "./Voting.Make.Proposal";
import { Player } from "@lottiefiles/react-lottie-player";
import ideals from "./images/ideals.json";

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
          <h3>Shape NFTPawn</h3>
          <p>Have a say on the future of NFTPawn with your own proposal</p>
          <VotingMakeProposal />
        </div>
        <div className={styles.wrapImgIdeals} >
          <Player
            autoplay
            loop
            src={ideals}
            style={{ height: "100%", width: "400px" }}
            className={styles.imgIdeals}
          />
        </div>
      </div>
    </div>
  );
};

export default VotingHeader;
