import React, { useState, useEffect } from "react";
import { Table, Flex, Image, Link, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { getOffersByFilter } from "src/modules/nftLend/api";
import { LoanNft } from 'src/modules/nftLend/models/loan';

import Pagination from 'src/common/components/pagination';
import { Chain } from 'src/common/constants/network';
import { LOAN_DURATION, OFFER_STATUS } from 'src/modules/nftLend/constant';
import { calculateTotalPay } from 'src/modules/nftLend/utils';
import { APP_URL } from 'src/common/constants/url';
import { formatCurrency, formatDateTime } from 'src/common/utils/format';
import { OfferToLoan } from 'src/modules/nftLend/models/offer';
import BadgeOfferStatus from '../dashboard/badgeOfferStatus';

const PAGE_SIZE = 10;

interface LendHistoryProps {
  address: string
}

const LendHistory = (props: LendHistoryProps) => {
  const { address } = props;
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<OfferToLoan[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
    fetchNFTs(1);
  }, [address]);

  const fetchNFTs = async (page: number) => {
    try {
      setLoading(true);
      const res = await getOffersByFilter({
        owner: address,
        network: Chain.Near,
        status: `${OFFER_STATUS.done.id},${OFFER_STATUS.liquidated.id}`,
        page,
        limit: pageSize,
      });
      setOffers(res.result.map(OfferToLoan.parseFromApi));
      setTotal(res.count);
    } finally {
      setLoading(false);
    }
  };

  const onViewLoan = async (e: any, loan: LoanNft) => {
    e.stopPropagation();
    navigate(`${APP_URL.LIST_LOAN}/${loan?.seo_url}`);
  };

  return (
    <Flex direction='column' gap={4}>
      <Heading as='h2' fontSize='2xl'>Lend History</Heading>
      <TableContainer borderRadius={16} color='text.primary' >
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Asset Name</Th>
              <Th>Amount</Th>
              <Th>Duration / Interest</Th>
              <Th>Created At</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {offers.map((offer, i) => {
              if (!offer.loan) return null
              const isLast = i === offers.length - 1;
              const loan = offer.loan

              const principal = offer.principal_amount
              const interest = offer.interest_rate
              const duration = offer.duration
              const loanDuration = LOAN_DURATION.find(e => e.id === duration);
              const paid_amount = offer.isDone() ? calculateTotalPay(principal, interest, duration, loan.currency?.decimals, offer.started_at) : 0

              return (
                <Tr key={offer.id}>
                  <Td borderBottomLeftRadius={isLast ? 16 : 0}>
                    <Link fontWeight='semibold' textDecoration='underline' onClick={(e) => onViewLoan(e, loan)}>{loan.asset?.name}</Link>
                  </Td>
                  <Td py={4}>
                    <Flex alignItems='center' gap={1}>
                      <Image h='14px' borderRadius='20px' src={loan?.currency?.icon_url} />
                      <Text>{formatCurrency(principal)}</Text>
                      {offer.isDone() && <Text fontWeight='bold' color='brand.success.600'>+{formatCurrency(new BigNumber(paid_amount).minus(principal))}</Text>}
                    </Flex>
                  </Td>
                  <Td py={4}>
                    {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(duration).dividedBy(86400).toNumber())} days`}
                    &nbsp;/&nbsp;
                    {new BigNumber(interest).multipliedBy(100).toNumber()}%
                  </Td>
                  <Td py={4}><BadgeOfferStatus offer={offer} loan={loan} /></Td>
                  <Td py={4}>{formatDateTime(offer.updated_at)}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justifyContent='flex-end'>
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onChangePage={(p: number) => {
            setPage(p);
            fetchNFTs(p);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default LendHistory;
