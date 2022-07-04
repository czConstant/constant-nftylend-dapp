import React, { memo } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import {
  ProposalListItemData,
  ProposalStatus,
  ProposalVoteCheckData,
} from "../Voting.Services.Data";
import { ProgressBar } from "react-bootstrap";
import { VotingProposalItemStatus } from "../list/Voting.Proposal.Item";
import icVoted from "../images/ic_voted.svg";
import { formatCurrency } from "src/common/utils/format";

interface VotingVotesProps {
  proposal: ProposalListItemData;
  yourVote?: ProposalVoteCheckData | null;
}

export const YourVoted = () => {
  return (
    <div className={styles.yourVoted}>
      <img src={icVoted} />
      Voted
    </div>
  );
};

const VotingResults: React.FC<VotingVotesProps> = ({ proposal, yourVote }) => {
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
            <div className={styles.choiceItemTitle}>
              <div>{choice.name}</div>
              {yourVote?.proposal_choice_id == choice.id && <YourVoted />}
            </div>
            <ProgressBar now={getPercent(parseFloat(choice.power_vote))} />
            <div className={styles.choiceItemInfoWrap}>
              <div>
                {formatCurrency(choice.power_vote || 0, 0)} Power Vote
                {parseFloat(choice.power_vote) > 1 ? "s" : ""}
              </div>
              <div>
                {formatCurrency(
                  getPercent(parseFloat(choice.power_vote)),
                  2
                )}
                %
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(VotingResults);
