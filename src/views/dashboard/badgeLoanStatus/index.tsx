import { Badge } from '@chakra-ui/react';
import moment from 'moment-timezone';

import { LOAN_STATUS } from "src/modules/nftLend/constant";
import { LoanNft } from 'src/modules/nftLend/models/loan';

interface BadgeLoanStatusProps {
  loan: LoanNft
}

const BadgeLoanStatus = (props: BadgeLoanStatusProps) => {
  const { loan } = props;

  let status = loan.status;
  let badgeVariant = 'success';
  const showPay = loan.isOngoing() && moment().isBefore(moment(loan.approved_offer?.expired_at));

  if (loan.isLiquidated()) {
    status = "liquidated";
  } else if (showPay) {
    status = 'approved';
  } else if (loan.isExpired()) {
    status = 'expired';
  }

  if (["liquidated"].includes(status)) {
    badgeVariant = 'warning';
  } else if (["new", "repaid", "created", "approved"].includes(status)) {
    badgeVariant = 'info';
  } else if (["cancelled", "expired"].includes(status)) {
    badgeVariant = 'danger';
  }

  return (
    <Badge variant={badgeVariant}>
      {LOAN_STATUS.find((v) => v.id === status)?.name || "Unknown"}
    </Badge>
  )
};

export default BadgeLoanStatus;
