import { APP_ENV } from "src/common/constants/url";

export const LOAN_STATUS = [
  {
    id: "new",
    name: "New",
    seo_url: "new",
    activity: "Listing",
  },
  {
    id: "created",
    name: "Created",
    seo_url: "created",
    activity: "Offered",
  },
  {
    id: "approved",
    name: "Approved",
    seo_url: "approved",
    activity: "Place Bid",
  },
  {
    id: "done",
    name: "Done",
    seo_url: "done",
    activity: "Paid",
  },
  {
    id: "cancelled",
    name: "Cancelled",
    seo_url: "cancelled",
    activity: "Cancel Listing",
  },
  {
    id: "liquidated",
    name: "Liquidated",
    seo_url: "liquidated",
    activity: "Liquidated",
  },
  {
    id: "expired",
    name: "Expired",
    seo_url: "expired",
    activity: "Canceled",
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
    name: "Overdue",
  },
  done: {
    id: "done",
    name: "Done",
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

if (APP_ENV.REACT_SOL_CLUSTER === "devnet") {
  LOAN_DURATION.unshift({
    id: 0.01,
    label: "0.1 days",
  });
}
