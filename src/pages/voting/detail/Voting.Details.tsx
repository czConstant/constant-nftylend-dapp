import React, { memo } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import { ProposalListItemData, ProposalStatus } from "../Voting.Services.Data";
import { VotingProposalItemStatus } from "../list/Voting.Proposal.Item";
import moment from "moment-timezone";
import { getLinkNearExplorer } from "src/modules/near/utils";

interface VotingDetailsProps {
  proposal: ProposalListItemData;
}

const VotingDetails: React.FC<VotingDetailsProps> = ({ proposal }) => {
  return (
    <div className={cx(styles.choiceWrapper, styles.blockWrapper)}>
      <div className={styles.choiceTitle}>
        <h5>Details</h5>
      </div>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        <div className={styles.votingDetailsInfo}>
          Creator{" "}
          <a href={getLinkNearExplorer(proposal.user.address)} target="_blank">
            {proposal.user.address}
          </a>
        </div>
        <div className={styles.votingDetailsTime}>
          <VotingProposalItemStatus status={proposal.status} />
          <div className={styles.votingDetailsTimeInfo}>
            Start Date:{" "}
            <span>{moment(proposal.start).format("YYYY-MM-DD HH:mm")}</span>
          </div>
          <div className={styles.votingDetailsTimeInfo}>
            End Date:{" "}
            <span>{moment(proposal.end).format("YYYY-MM-DD HH:mm")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VotingDetails);
