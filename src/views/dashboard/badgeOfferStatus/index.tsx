import { Badge } from '@chakra-ui/react';

import { OFFER_STATUS } from "src/modules/nftLend/constant";
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { LoanNft } from 'src/modules/nftLend/models/loan';

interface BadgeOfferStatusProps {
  offer: OfferToLoan;
  loan?: LoanNft
}

const BadgeOfferStatus = (props: BadgeOfferStatusProps) => {
  const { offer, loan } = props;

  let status = offer.status;
  let badgeVariant = 'success';

  if (offer.isOverdue()) {
    status = 'overdue';
  } else if (loan?.isExpired()) {
    status = 'expired';
  }

  if (["overdue"].includes(status)) {
    badgeVariant = 'warning';
  } else if (["cancelled", "expired"].includes(status)) {
    badgeVariant = 'danger';
  } else if (["repaid", "approved"].includes(status)) {
    badgeVariant = 'info';
  }

  return (
    <Badge variant={badgeVariant}>
      {OFFER_STATUS[status]?.name}
    </Badge>
  )
};

export default BadgeOfferStatus;
