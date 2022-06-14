import icStatusClosed from "src/pages/voting/images/ic_status_closed.svg";
import icStatusSoon from "src/pages/voting/images/ic_status_soon.svg";
import icStatusVoteNow from "src/pages/voting/images/ic_status_vote_now.svg";
import { ProposalStatus } from "./Voting.Services.Data";

export const VOTING_STATUS = [
  {
    key: ProposalStatus.ProposalStatusCreated,
    name: "Vote Now",
    icon: icStatusVoteNow,
    color: "rgb(49, 208, 170)",
  },
  {
    key: ProposalStatus.ProposalStatusPending,
    name: "Soon",
    icon: icStatusSoon,
    color: "rgb(240, 185, 11)",
  },
  {
    key: ProposalStatus.ProposalStatusCancelled,
    name: "Closed",
    icon: icStatusClosed,
    color: "rgb(102, 97, 113)",
    filters: [
      ProposalStatus.ProposalStatusCancelled,
      ProposalStatus.ProposalStatusDefeated,
      ProposalStatus.ProposalStatusExecuted,
      ProposalStatus.ProposalStatusSucceeded,
    ].join(","),
  },
];
