import cx from "classnames";
import { last } from "lodash";
import moment from "moment-timezone";
import React, { memo } from "react";
import { shortCryptoAddress } from "src/common/utils/format";
import { getLinkNearExplorer } from "src/modules/near/utils";
import { VotingProposalItemHistoryStatus } from "../list/Voting.Proposal.Item";
import styles from "../styles.module.scss";
import { ProposalListItemData, ProposalTypes } from "../Voting.Services.Data";

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
        {proposal.type !== ProposalTypes.Proposal && (
          <div className={styles.votingDetailsInfo}>
            Identifier{" "}
            <a href={proposal.ipfs_hash} target="_blank">
              {shortCryptoAddress(last(proposal.ipfs_hash?.split("/")), 8)}
            </a>
          </div>
        )}

        <div className={styles.votingDetailsInfo}>
          Creator{" "}
          <a href={getLinkNearExplorer(proposal.user.address)} target="_blank">
            {shortCryptoAddress(proposal.user.address, 8)}
          </a>
        </div>
        <div className={styles.votingDetailsTime}>
          <VotingProposalItemHistoryStatus status={proposal.status} />
          {proposal.type !== ProposalTypes.Proposal && (
            <React.Fragment>
              <div className={styles.votingDetailsTimeInfo}>
                Start Date:{" "}
                <span>{moment(proposal.start).format("YYYY-MM-DD HH:mm")}</span>
              </div>
              <div className={styles.votingDetailsTimeInfo}>
                End Date:{" "}
                <span>{moment(proposal.end).format("YYYY-MM-DD HH:mm")}</span>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(VotingDetails);
