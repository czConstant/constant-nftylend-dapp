import { Badge } from '@chakra-ui/react';

import { LOAN_STATUS } from "src/modules/nftLend/constant";
import { LoanNft } from 'src/modules/nftLend/models/loan';

interface BadgeLoanStatusProps {
  loan: LoanNft
}

const BadgeLoanStatus = (props: BadgeLoanStatusProps) => {
  const { loan } = props;

  let status = loan.status;
  let badgeVariant = 'success';
  let statusText = LOAN_STATUS[status]?.name || "Unknown"

  if (loan.isOverdue()) {
    statusText = "Liquidated";
  } else if (loan.isExpired()) {
    statusText = "Expired";
  }

  if (loan.isOverdue() || status === LOAN_STATUS.liquidated.id) {
    badgeVariant = 'warning';
  } else if (["new", "repaid", "created"].includes(status)) {
    badgeVariant = 'info';
  } else if (loan.isExpired() || ["cancelled"].includes(status)) {
    badgeVariant = 'danger';
  }

  return (
    <Badge variant={badgeVariant}>
      {statusText}
    </Badge>
  )
};

export default BadgeLoanStatus;
