import React, { useState } from "react";
import moment from "moment-timezone";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Badge, Button, Flex, Grid, GridItem, Icon, Link } from '@chakra-ui/react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

import { useAppDispatch } from "src/store/hooks";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { requestReload } from "src/store/nftyLend";
import { APP_URL } from "src/common/constants/url";
import { hideLoadingOverlay, showLoadingOverlay } from "src/store/loadingOverlay";
import { closeModal, openModal } from 'src/store/modal';
import ModalConfirmAmount from 'src/views/apps/confirmAmountModal';
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { useTransaction } from 'src/modules/nftLend/hooks/useTransaction';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { calculateTotalPay } from 'src/modules/nftLend/utils';

import { formatCurrency, formatDateTime } from 'src/common/utils/format';
import LoanDetailOffers from 'src/pages/loanDetail/pawnInfo/LoanDetail.Offers';
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import BadgeLoanStatus from '../badgeLoanStatus';

interface ItemProps {
  loan: LoanNft;
  templateColumns: string;
}

const Item = (props: ItemProps) => {
  const { loan, templateColumns } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cancelLoan, payLoan } = useTransaction();
  const { getCurrencyBalance } = useToken()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCancelLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!loan.asset) throw new Error('Loan has no asset');
      dispatch(showLoadingOverlay());
      const res = await cancelLoan({
        nonce: loan.nonce,
        asset_token_id: loan.asset.token_id || '',
        asset_contract_address: loan.asset.contract_address || '',
        loan_data_address: '' 
      });
      if (res.completed) toastSuccess(
        <>
          Cancel loan successfully.{" "}
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

  const onPayLoan = async (e) => {
    e.stopPropagation();
    const payAmount = loan?.status === "created"
      ? calculateTotalPay(
        Number(loan.approved_offer?.principal_amount),
        loan.approved_offer?.interest_rate,
        loan.approved_offer?.duration,
        loan.currency.decimals,
        moment(loan.approved_offer?.started_at).unix()
      ) : 0;
      
    const balance = await getCurrencyBalance(loan.currency)
    if (new BigNumber(balance).isLessThan(payAmount)) {
      return toastError(`Your balance (${balance} ${loan.currency?.symbol}) is not enough`)
    }

    dispatch(
      openModal({
        id: "confirmAmountModal",
        theme: "dark",
        title: 'Confirm Payment',
        render: () => (
          <ModalConfirmAmount
            onClose={() => dispatch(closeModal({ id: 'confirmAmountModal' }))}
            onConfirm={() => processPayLoan(payAmount)}
            asset={loan.asset}
            amount={payAmount}
            symbol={loan.currency?.symbol}
          />
        ),
      })
    );
  };

  const processPayLoan = async (amount: number) => {
    dispatch(showLoadingOverlay());
    try {
      if (!loan.approved_offer) throw new Error('Loan has no approved offer');
      if (!loan.currency) throw new Error('Loan has no currency');
      if (!loan.asset) throw new Error('Loan has no asset');
      const res = await payLoan({
        pay_amount: amount,
        currency_decimal: loan.currency.decimals,
        loan_data_address: loan.data_loan_address,
        offer_data_address: loan.approved_offer?.data_offer_address,
        asset_data_address: loan.data_asset_address,
        asset_token_id: loan.asset.token_id,
        asset_contract_address: loan.asset?.contract_address,
        currency_data_address: loan.approved_offer?.data_currency_address,
        currency_contract_address: loan.currency?.contract_address,
        lender: loan.approved_offer?.lender,
        admin_fee_address: loan.currency?.admin_fee_address,
        principal: loan.approved_offer.principal_amount,
        rate: loan.approved_offer.interest_rate,
        duration: loan.approved_offer.duration,
      });
      if (res.completed) toastSuccess(
        <>
          Pay loan successfully.{" "}
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
  }

  const onViewLoan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${APP_URL.LIST_LOAN}/${loan?.seo_url}`);
  };

  const renderLoan = () => {
    const showCancel = loan.isListing() || loan.isExpired();
    const showPay = loan.isOngoing();

    const principal = loan.approved_offer
      ? loan.approved_offer.principal_amount
      : loan.principal_amount;
    const interest = loan.approved_offer ? loan.approved_offer.interest_rate : loan.interest_rate;
    const duration = loan.approved_offer ? loan.approved_offer.duration : loan.duration;
    const loanDuration = LOAN_DURATION.find(e => e.id === duration);

    return (
      <Grid alignItems='center' fontSize='sm' w='100%' textAlign='left' templateColumns={templateColumns}>
        <GridItem pl={4} py={4}>
          <Icon opacity={loan.isOngoing() ? 0 : 1} as={open ? FaCaretUp : FaCaretDown} mr={4} />
          <Link fontWeight='semibold' textDecoration='underline' onClick={onViewLoan}>{loan.asset?.name}</Link>
        </GridItem>
        <GridItem py={4}>
          {formatCurrency(principal)} {loan.currency?.symbol}
        </GridItem>
        <GridItem py={4}>
          {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days`}
          &nbsp;/&nbsp;
          {new BigNumber(interest).multipliedBy(100).toNumber()}%
        </GridItem>
        <GridItem py={4}><BadgeLoanStatus loan={loan} /></GridItem>
        <GridItem py={4}>{formatDateTime(loan?.updated_at)}</GridItem>
        <GridItem pr={8} py={4}>
          <Flex w='100%' justifyContent='flex-end'>
            {showCancel && <Button size='sm' variant='link' textDecoration='underline' colorScheme='whiteAlpha' onClick={onCancelLoan}>Cancel</Button>}
            {showPay && <Button size='sm' variant='link' textDecoration='underline' colorScheme='brand.warning' onClick={onPayLoan}>Pay</Button>}
          </Flex>  
        </GridItem>
      </Grid>
    )
  }

  const defaultOpen = loan.isListing() && loan.offers.length > 0

  return loan.isOngoing() ? renderLoan() : (
    <Accordion allowToggle defaultIndex={defaultOpen ? 0 : -1} onChange={i => setOpen(i === 0)}>
      <AccordionItem border='none'>
        <AccordionButton borderRadius={0} p={0} bgColor='transparent'>
          {renderLoan()}
        </AccordionButton>
        <AccordionPanel borderWidth={1} borderColor='background.border' borderRadius={0} bgColor='black'>
          <LoanDetailOffers loan={loan} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default Item;
