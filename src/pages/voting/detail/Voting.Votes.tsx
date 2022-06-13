import React, { memo, useEffect, useState } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import {
  ProposalListItemData,
  ProposalStatus,
  ProposalVotesData,
} from "../Voting.Services.Data";
import Loading from "src/common/components/loading";
import VotingServices from "../Voting.Services";

interface VotingVotesProps {
  proposal: ProposalListItemData;
  isRefresh?: boolean;
}

const VotingVotes: React.FC<VotingVotesProps> = ({ proposal, isRefresh }) => {
  const [votes, setVotes] = useState<ProposalVotesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proposal?.id || isRefresh) {
      getVotes();
    }
  }, [proposal?.id, isRefresh]);

  const getVotes = async () => {
    try {
      const response: ProposalVotesData[] =
        await VotingServices.getProposalVotes(proposal.id);
      setVotes(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContentVotes = () => {
    if (loading) {
      return (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      );
    } else if (votes.length === 0) {
      return (
        <div className={styles.loadingWrap}>
          <h5>No votes found</h5>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cx(styles.choiceWrapper, styles.blockWrapper)}>
      <div className={styles.choiceTitle}>
        <h5>Votes {votes.length > 0 ? `(${votes.length})` : "(-)"}</h5>
      </div>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        {renderContentVotes()}
      </div>
    </div>
  );
};

export default memo(VotingVotes);
