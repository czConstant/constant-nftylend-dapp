import BigNumber from "bignumber.js";
import React from "react";
import { MdInfoOutline } from 'react-icons/md';
import { Flex, Grid, GridItem, Icon, Text, Tooltip } from '@chakra-ui/react';

import icPriceTag from "../images/ic_price_tag.svg";
import LoanDetailButtons from "./LoanDetail.Buttons";
import { OfferData } from 'src/modules/nftLend/models/api';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { isSameAddress } from 'src/common/utils/helper';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { formatCurrency } from "src/common/utils/format";

import pawnStyles from './pawnInfo.module.scss';
import styles from "../styles.module.scss";

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailPriceInfoProps extends LoanDetailProps {}

const LoanDetailPriceInfo: React.FC<LoanDetailPriceInfoProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();
  const userOffer: OfferData = loan.offers?.find(
    (v) =>
      isSameAddress(v.lender?.toString(), currentWallet.address) &&
      v.status === "new"
  );

  const loanDuration = LOAN_DURATION.find(e => e.id === loan.duration / 86400);
  const offerDuration = LOAN_DURATION.find(e => e.id === userOffer?.duration / 86400);

  return (
    <div className={styles.infoPrice}>
      <Flex direction={['column', 'row']} gap={4}> 
        <div>
          <Flex className={styles.infoPriceTags}>
            <label>Principal</label>
            <img src={icPriceTag} alt="item price" />
          </Flex>
          <div className={styles.infoPriceValue}>
            <div>{`${formatCurrency(
              loan.principal_amount,
              2
            )} ${loan.currency?.symbol}`}</div>
          </div>
        </div>
        <div className={pawnStyles.configs}>
          <Flex gap={2} alignItems='center' color='text.secondary' >
            <Text color='text.secondary' fontWeight='semibold' fontSize='sm'>
              Negotiation Terms
            </Text>
            <Tooltip placement='top' label='The following terms are negotiable: Principal, duration, and interest rate. You can set your own terms here.'>
              <span><Icon as={MdInfoOutline} /></span>
            </Tooltip>
          </Flex>
          <Flex gap={2} py={2}>
            <li className={loan.isAllowChange('principal_amount') ? pawnStyles.allow : pawnStyles.notallow }>Principal</li>
            <li className={loan.isAllowChange('duration') ? pawnStyles.allow : pawnStyles.notallow }>Duration</li>
            <li className={loan.isAllowChange('interest_rate') ? pawnStyles.allow : pawnStyles.notallow }>Interest rate</li>
          </Flex>
        </div>
      </Flex>
      <LoanDetailButtons loan={loan} userOffer={userOffer} />
      <Grid templateColumns='repeat(5, 1fr)'>
        <GridItem>
          <Text fontSize='sm' color='text.secondary'>Interest rate</Text>
          <Text fontWeight='semibold'>
            {new BigNumber(loan.interest_rate).multipliedBy(100).toNumber()}%
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize='sm' color='text.secondary'>Terms</Text>
          <Text fontWeight='semibold'>
            {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(loan.duration).dividedBy(86400).toNumber())} days`}
          </Text>
        </GridItem>
        {userOffer && (
          <>
            <GridItem>
              <Text fontSize='sm' color='brand.success.700'>
                My Principal
              </Text>
              <Text fontWeight='semibold' color='brand.success.700'>
                {userOffer?.principal_amount} {loan.currency?.symbol}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize='sm' color='brand.success.700'>
                My Interest rate
              </Text>
              <Text fontWeight='semibold' color='brand.success.700'>
                {new BigNumber(userOffer?.interest_rate)
                  .multipliedBy(100)
                  .toNumber()}
                %
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize='sm' color='brand.success.700'>
                My Terms
              </Text>
              <Text fontWeight='semibold' color='brand.success.700'>
                {offerDuration ? offerDuration.label : `${Math.ceil(new BigNumber(userOffer.duration).dividedBy(86400).toNumber())} days`}
              </Text>
            </GridItem>
          </>
        )}
      </Grid>
    </div>
  );
};

export default LoanDetailPriceInfo;
