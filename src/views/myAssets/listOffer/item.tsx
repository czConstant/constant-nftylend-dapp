import { useState } from "react";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import cx from 'classnames';
import { Badge, Button, Flex, Grid, GridItem, Link } from '@chakra-ui/react';

import { useAppDispatch } from "src/store/hooks";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "src/store/loadingOverlay";
import { requestReload } from "src/store/nftyLend";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { APP_URL } from "src/common/constants/url";

import { LOAN_DURATION, OFFER_STATUS } from "src/modules/nftLend/constant";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import { isEvmChain } from 'src/modules/nftLend/utils';
import { formatCurrency } from 'src/common/utils/format';
import InfoTooltip from 'src/common/components/infoTooltip';

interface ItemProps {
  offer: OfferToLoan;
  templateColumns: string;
}

const Item = (props: ItemProps) => {
  const { offer, templateColumns } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cancelOffer, liquidateLoan, closeOffer } = useTransaction();

  const [open, setOpen] = useState(false);

  const loan = offer.loan;
  const loanDuration = LOAN_DURATION.find(e => e.id === offer.duration / 86400);

  const onClaim = async () => {
    try {
      dispatch(showLoadingOverlay());
      if (!offer.loan || !offer.loan.currency) throw new Error('Offer has no loan currency');
      const res = await closeOffer({
        offer_data_address: offer.data_offer_address,
        currency_data_address: offer.data_currency_address,
        currency_contract_address: offer.loan?.currency?.contract_address,
      });
      if (res.completed) toastSuccess(
        <>
          Claim asset successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onLiquidate = async () => {
    dispatch(showLoadingOverlay());
    try {
      if (!offer.loan || !offer.loan.currency || !offer.loan.asset) throw new Error('Offer has no loan currency');

      const res = await liquidateLoan({
        asset_contract_address: offer.loan.asset.contract_address,
        asset_token_id: offer.loan.asset.token_id,
        loan_owner: offer.loan.owner,
        loan_data_address: offer.loan.data_loan_address,
        offer_data_address: offer.data_offer_address,
        asset_data_address: offer.loan.data_asset_address,
        currency_data_address: offer.data_currency_address,
      });
      if (res.completed) toastSuccess(
        <>
          Liquidate asset successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onCancel = async () => {
    dispatch(showLoadingOverlay());
    if (!offer.loan || !offer.loan.currency) throw new Error('Offer has no loan currency');
    if (!offer.loan || !offer.loan.asset) throw new Error('Offer has no loan asset');
    try {
      const res = await cancelOffer({
        currency_contract_address: offer.loan.currency.contract_address,
        currency_data_address: offer.data_currency_address,
        offer_data_address: offer.data_offer_address,
        offer_id: offer.id,
        asset_token_id: offer.loan.asset.token_id,
        asset_contract_address: offer.loan.asset.contract_address,
        nonce: offer.nonce,
      });
      if (res.completed) toastSuccess(
        <>
          Cancel offer successfully.{" "}
          {res.txExplorerUrl && (
            <a target="_blank" href={res.txExplorerUrl}>
              View transaction
            </a>
          )}
        </>
      );
      dispatch(requestReload());
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      dispatch(hideLoadingOverlay());
    }
  };

  const onViewLoan = async () => {
    navigate(`${APP_URL.LIST_LOAN}/${offer?.loan?.seo_url}`);
  };

  const showClaim = !isEvmChain(offer.chain) && offer.status === "repaid";
  const showLiquidate = offer.isLiquidated();
  const showCancel = offer.isListing() || offer.isExpired();

  const principal = offer.principal_amount;
  const interest = offer.interest_rate;
  const duration = offer.duration;

  let status = offer.status;
  let badgeVariant = 'success';

  if (showLiquidate) {
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
    <Grid alignItems='center' fontSize='sm' w='100%' textAlign='left' templateColumns={templateColumns}>
      <GridItem pl={8} py={4}>
        <Link fontWeight='semibold' textDecoration='underline' onClick={onViewLoan}>{loan.asset?.name}</Link>
      </GridItem>
      <GridItem py={4}>
        {formatCurrency(principal)} {loan?.currency?.symbol}
      </GridItem>
      <GridItem py={4}>
        {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days`}
        &nbsp;/&nbsp;
        {new BigNumber(interest).multipliedBy(100).toNumber()}%
      </GridItem>
      <GridItem py={4}>
        <Badge variant={badgeVariant}>
          {OFFER_STATUS?.[status]?.lender}
        </Badge>
      </GridItem>
      <GridItem py={4}>{moment(offer.updated_at).format("MM/DD/YYYY HH:mm A")}</GridItem>
      <GridItem pr={8} py={4}>
        <Flex w='100%' justifyContent='flex-end'>
          {showClaim && (
            <Button size='sm' variant='link' colorScheme='brand.warning' onClick={onClaim}>
              Claim <InfoTooltip label='Claim for Credit' />
            </Button>
          )}
          {showLiquidate && (
            <Button size='sm' variant='link' colorScheme='brand.warning' onClick={onLiquidate}>
              Claim <InfoTooltip label='Claim for NFT' />
            </Button>
          )}
          {showCancel && <Button size='sm' variant='link' colorScheme='whiteAlpha' onClick={onCancel}>Cancel</Button>}
        </Flex>  
      </GridItem>
    </Grid>
  );
};

export default Item;
