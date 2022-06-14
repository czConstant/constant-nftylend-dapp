import cx from "classnames";
import React, { memo, useEffect, useState } from "react";
import Loading from "src/common/components/loading";
import { formatCurrencyByLocale, shortCryptoAddress } from "src/common/utils/format";
import { getLinkNearExplorer } from "src/modules/near/utils";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  ProposalListItemData,
  ProposalVotesData,
} from "../Voting.Services.Data";
import { YourVoted } from "./Voting.Results";
import icShare from "../images/ic_share.svg";
import { isMobile } from "react-device-detect";

interface VotingVotesProps {
  proposal: ProposalListItemData;
  isRefresh?: boolean;
  currentWallet: any;
}

const VotingVotes: React.FC<VotingVotesProps> = ({
  proposal,
  isRefresh,
  currentWallet,
}) => {
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
    return votes.map((vote) => (
      <div className={styles.votedListItem} key={vote.id}>
        {isMobile ? (
          <React.Fragment>
            <div>
              <a
                target={"_blank"}
                href={getLinkNearExplorer(vote.user.address)}
              >
                {vote?.user.address}
              </a>
              {vote.user.address === currentWallet.address && <YourVoted />}
            </div>
            <div>
              <div>{vote.proposal_choice.name}</div>
              <div>
                <div>
                  {formatCurrencyByLocale(vote?.power_vote?.toString(), 0)}
                </div>
                <a href={vote.ipfs_hash} target="_blank">
                  <img src={icShare} />
                </a>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <a
                target={"_blank"}
                href={getLinkNearExplorer(vote.user.address)}
              >
                {shortCryptoAddress(vote?.user.address, 8)}
              </a>
              {vote.user.address === currentWallet.address && <YourVoted />}
            </div>
            <div>{vote.proposal_choice.name}</div>
            <div>
              <div>
                {formatCurrencyByLocale(vote?.power_vote?.toString(), 0)}
              </div>
              <a href={vote.ipfs_hash} target="_blank">
                <img src={icShare} />
              </a>
            </div>
          </React.Fragment>
        )}
      </div>
    ));
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
