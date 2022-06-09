import React from "react";
import { ProposalListItemData, ProposalStatus } from "../Voting.Services.Data";
import styles from "../styles.module.scss";
import moment from "moment-timezone";
import icArrowNext from "../images/ic_arrow_next.svg";
import { useNavigate } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";

interface VotingProposalItemProps {
  proposal?: ProposalListItemData;
}

interface VotingProposalItemStatusProps {
  status: ProposalStatus;
}

export const VotingProposalItemStatus: React.FC<
  VotingProposalItemStatusProps
> = ({ status }) => {
  return <div></div>;
};

const VotingProposalItem: React.FC<VotingProposalItemProps> = ({
  proposal,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(
          `${APP_URL.NFT_LENDING_VOTING_DETAIL.replace(
            ":id",
            proposal?.id.toString()
          )}`
        )
      }
      className={styles.itemVotingProposal}
    >
      <div>
        <h6>{proposal?.name}</h6>
        <span className={styles.date}>
          Ends {moment(proposal?.end).format(`DD MMM, YYYY HH:mm A`)}
        </span>
      </div>
      <img src={icArrowNext} />
    </div>
  );
};

export default VotingProposalItem;
