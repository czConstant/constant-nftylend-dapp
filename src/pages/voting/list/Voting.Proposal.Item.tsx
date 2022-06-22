import moment from "moment-timezone";
import React from "react";
import { Link } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import icArrowNext from "../images/ic_arrow_next.svg";
import styles from "../styles.module.scss";
import { VOTING_HISTORY_STATUS, VOTING_STATUS } from "../Voting.Constant";
import {
  ProposalListItemData,
  ProposalStatus,
  ProposalTypeData,
  ProposalTypes,
} from "../Voting.Services.Data";
import cx from "classnames";
import { useSelector } from "react-redux";
import { truncate } from "lodash";

interface VotingProposalItemProps {
  proposal?: ProposalListItemData;
}

interface VotingProposalItemStatusProps {
  status: ProposalStatus;
}

export const VotingProposalItemStatus: React.FC<
  VotingProposalItemStatusProps
> = ({ status }) => {
  const findStatus = VOTING_STATUS.find((v) =>
    (v.filters || v.key).includes(status)
  );

  if (!findStatus) return null;
  return (
    <div
      className={cx(styles[`${findStatus.key}`], styles.statusWrap)}
      style={{ backgroundColor: findStatus.color }}
    >
      <img src={findStatus.icon} />
      {findStatus.name}
    </div>
  );
};

export const VotingProposalItemHistoryStatus: React.FC<
  VotingProposalItemStatusProps
> = ({ status }) => {
  const findStatus = VOTING_HISTORY_STATUS.find((v) =>
    (v.filters || v.key).includes(status)
  );

  if (!findStatus) return null;
  return (
    <div
      className={cx(styles[`${findStatus.key}`], styles.statusWrap)}
      style={{ backgroundColor: findStatus.color }}
    >
      {findStatus.name}
    </div>
  );
};

interface VotingProposalItemTypeProps {
  type: ProposalTypes;
}

export const VotingProposalItemType: React.FC<VotingProposalItemTypeProps> = ({
  type,
}) => {
  const configs = useSelector((state) => state?.nftyLend?.configs);
  const proposalTypes: ProposalTypeData[] = configs?.proposals || [];
  const findProposalType = proposalTypes.find((v) => v.key === type);
  if (!findProposalType) return null;
  return (
    <div className={cx(styles[type], styles.statusWrap, styles.tagTypeWrap)}>
      {findProposalType?.name}
    </div>
  );
};

const VotingProposalItem: React.FC<VotingProposalItemProps> = ({
  proposal,
}) => {
  return (
    <Link
      to={`${APP_URL.VOTING_DETAIL}/?id=${proposal?.id.toString()}`}
      className={styles.itemVotingProposal}
    >
      <div>
        <h6>{proposal?.name}</h6>
        <span className={styles.date}>
          {truncate(proposal?.body, {
            length: 100,
            separator: "...",
          })}
          {/* {proposal?.status === ProposalStatus.ProposalStatusPending
            ? `Starts ${moment(proposal?.start).format(`DD MMM, YYYY HH:mm A`)}`
            : `Ends ${moment(proposal?.end).format(`DD MMM, YYYY HH:mm A`)}`} */}
        </span>
      </div>
      <div className={styles.itemHistoryRightWrap}>
        <VotingProposalItemHistoryStatus status={proposal?.status} />
        <img src={icArrowNext} />
      </div>
    </Link>
  );
};

export default VotingProposalItem;
