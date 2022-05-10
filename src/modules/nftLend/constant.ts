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
    lender: "Offer Sent",
    borrower: "New",
    loan: "New",
  },
  approved: {
    id: "approved",
    name: "Approved",
    lender: "Accepted",
    borrower: "Accepted",
    loan: "Accepted",
  },
  rejected: {
    id: "rejected",
    name: "Rejected",
    lender: "Rejected",
    borrower: "Rejected",
    loan: "Rejected",
  },
  cancelled: {
    id: "cancelled",
    name: "Cancelled",
    lender: "Cancelled",
    borrower: "Cancelled",
    loan: "Cancelled",
  },
  repaid: {
    id: "repaid",
    name: "Repaid",
    lender: "Repaid",
    borrower: "Repaid",
    loan: "Done",
  },
  liquidated: {
    id: "liquidated",
    name: "Liquidated",
    lender: "Done",
    borrower: "Done",
    loan: "Defaulted",
  },
  overdue: {
    id: "overdue",
    name: "Overdue",
    lender: "Liquidated",
    borrower: "Defaulted",
    loan: "Defaulted",
  },
  done: {
    id: "done",
    name: "Done",
    lender: "Done",
    borrower: "Done",
    loan: "Done",
  },
  expired: {
    id: "expired",
    name: "Expired",
    lender: "Expired",
    borrower: "Expired",
    loan: "Expired",
  },
};

export const LOAN_DURATION = [
  {
    id: 10,
    label: "10 days",
  },
  {
    id: 30,
    label: "30 days",
  },
  {
    id: 60,
    label: "60 days",
  },
];

if (APP_CLUSTER === "testnet") {
  LOAN_DURATION.unshift({
    id: 0.01,
    label: "0.01 days",
  });
  LOAN_DURATION.unshift({
    id: new BigNumber(60 / 86400).toNumber(),
    label: "60 seconds",
  });
}
