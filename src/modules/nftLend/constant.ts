import BigNumber from 'bignumber.js';
import { APP_CLUSTER } from 'src/common/constants/config';

export const LOAN_STATUS = [
  {
    id: "new",
    name: "New",
    seo_url: "new",
  },
  {
    id: "created",
    name: "Created",
    seo_url: "created",
  },
  {
    id: "approved",
    name: "Approved",
    seo_url: "approved",
  },
  {
    id: "done",
    name: "Done",
    seo_url: "done",
  },
  {
    id: "cancelled",
    name: "Cancelled",
    seo_url: "cancelled",
  },
  {
    id: "liquidated",
    name: "Liquidated",
    seo_url: "liquidated",
  },
  {
    id: "expired",
    name: "Expired",
    seo_url: "expired",
  },
];

export const LOAN_TRANSACTION_ACTIVITY = [
  {
    id: "listed",
    name: "Listed",
  },
  {
    id: "cancelled",
    name: "Cancelled",
  },
  {
    id: "offered",
    name: "Offered",
  },
  {
    id: "repaid",
    name: "Repaid",
  },
  {
    id: "liquidated",
    name: "Liquidated",
  },
];

export const OFFER_STATUS = {
  new: {
    id: "new",
    name: "New",
  },
  approved: {
    id: "approved",
    name: "Approved",
  },
  rejected: {
    id: "rejected",
    name: "Rejected",
  },
  cancelled: {
    id: "cancelled",
    name: "Cancelled",
  },
  repaid: {
    id: "repaid",
    name: "Repaid",
  },
  liquidated: {
    id: "liquidated",
    name: "Liquidated",
  },
  overdue: {
    id: "overdue",
    name: "Defaulted",
  },
  done: {
    id: "done",
    name: "Done",
  },
  expired: {
    id: "expired",
    name: "Expired",
  },
};

export const PWP_TX_TYPE = {
  incentive: {
    id: 'incentive',
    name: 'Incentive',
  },
  claim: {
    id: 'claim',
    name: 'Claim',
  },
}

export const INCENTIVE_TX_TYPE = {
  borrower_loan_delisted: {
    id: 'borrower_loan_delisted',
    name: 'Delisted Loan',
  },
  borrower_loan_listed: {
    id: 'borrower_loan_listed',
    name: 'Listed Loan',
  },
  user_airdrop_reward: {
    id: 'user_airdrop_reward',
    name: 'AirDrop Reward',
  },
  user_ama_reward: {
    id: 'user_ama_reward',
    name: 'AMA Reward',
  },
  lender_loan_matched: {
    id: 'lender_loan_matched',
    name: 'Matched Loan',
  },
  claim: {
    id: 'claim',
    name: 'Claim Reward',
  },
}

export const LOAN_DURATION = [
  {
    id: 10 * 86400,
    label: "10 days",
  },
  {
    id: 30 * 86400,
    label: "30 days",
  },
  {
    id: 60 * 86400,
    label: "60 days",
  },
];

if (APP_CLUSTER !== "mainnet") {
  LOAN_DURATION.unshift({
    id: 60,
    label: "60 seconds",
  });
}
