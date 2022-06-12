import React, { memo } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import { ProposalListItemData } from "../Voting.Services.Data";
import { ProgressBar } from "react-bootstrap";

interface VotingVotesProps {
  proposal: ProposalListItemData;
}

const VotingResults: React.FC<VotingVotesProps> = ({ proposal }) => {
  const totalPercent = proposal.choices.reduce(
    (p, c) => parseFloat(c.power_vote) + p,
    0
  );

  const getPercent = (powper_vote: number = 0) => {
    if (!totalPercent) return 0;
    return (powper_vote / totalPercent) * 100;
  };

  return (
    <div className={cx(styles.choiceWrapper, styles.blockWrapper)}>
      <div className={styles.choiceTitle}>
        <h5>Current Result</h5>
      </div>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        {proposal.choices.map((choice) => (
          <div className={styles.choiceItemWrap} key={choice.id}>
            <div className={styles.choiceItemTitle}>{choice.name}</div>
            <ProgressBar now={getPercent(parseFloat(choice.power_vote))} />
            <div className={styles.choiceItemInfoWrap}>
              <div>
                {choice.power_vote} Vote
                {parseFloat(choice.power_vote) > 1 ? "s" : ""}
              </div>
              <div>{getPercent(parseFloat(choice.power_vote))}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(VotingResults);
