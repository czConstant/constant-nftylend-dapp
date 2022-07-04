import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import cx from 'classnames'
import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion'

import { formatCurrency } from "src/common/utils/format";
import { APP_URL } from "src/common/constants/url";

import styles from "./styles.module.scss";
import CardNftMedia from "../CardNftMedia";
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { calculateMaxInterest } from 'src/modules/nftLend/utils';

export const mediaTypes = {
  video: ["mov", "mp4", "video"],
  img: ["jpg", "png", "gif", "jpeg", "image"],
};

export interface CardNftLoanProps {
  loan?: LoanNft;
  asset: AssetNft;
  isWhitelist?: boolean;
  onClickItem?: Function;
  onViewLoan?: Function;
  onCancelLoan?: Function;
  className?: string;
}

const CardNftLoan = (props: CardNftLoanProps) => {
  const { loan, isWhitelist, asset, onClickItem, onViewLoan, onCancelLoan, className } = props;
  const navigate = useNavigate();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(asset?.detail);
  const controls = useAnimation()

  if (!asset) return <div className={styles.itemContainer} />;

  useEffect(() => {
    controls.start({ opacity: 1 }, { duration: 0.2 })
  }, [])

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
  }, [asset]);

  const getExtraData = async () => {
    setLoadingDetail(true);
    try {
      const res = await asset.fetchDetail();
      setDetail(res);
    } finally {
      setLoadingDetail(false);
    }
  };

  const onView = () => {
    if (onClickItem) return onClickItem(asset);
    if (loan?.seo_url)
      navigate(`${APP_URL.LIST_LOAN}/${loan?.seo_url}`);
  };

  const loanDuration = LOAN_DURATION.find(e => e.id === loan?.duration / 86400);

  const maxInterestAmount = calculateMaxInterest(loan?.principal_amount, loan?.interest_rate, loan?.duration)

  return (
    <Box minW={250} className={cx(className, styles.cardNftLoan)} as={motion.div} initial={{ opacity: 0 }} animate={controls}>
      <a onClick={onView}>
        <CardNftMedia
          name={asset.name}
          className={styles.image}
          loading={loadingDetail}
          detail={detail}
        />
        <Flex direction='column' p={4}>
          <Flex alignItems='flex-start' justifyContent='space-between'>
            <Box>
              <Text fontWeight='medium' noOfLines={2}>{asset.name}</Text>
              <Text color='text.secondary' fontSize='xs'>{asset.collection?.name}</Text>
            </Box>
            {/* <div className={styles.chain}>{asset.chain}</div> */}
          </Flex>
          {!loan && isWhitelist && (
            <Flex alignItems='center' className={styles.whitelistTag} px={4} py={1} borderBottomRightRadius={12}>
              <Text fontSize='sm' fontWeight='bold'>Whitelisted</Text>
            </Flex>
          )}
          <div className={styles.actions}>
            {onViewLoan && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onViewLoan();
                }}
              >
                View Loan
              </Button>
            )}
            {onCancelLoan && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onCancelLoan();
                }}
                className={styles.btnCancel}
              >
                Cancel
              </Button>
            )}
          </div>
          {loan?.interest_rate && loan?.duration && (
            <Flex alignItems='center' bgColor='background.gray' py={4} mx={-4} mb={-4}>
              <Flex direction='column' alignItems='center' flex={2} gap={1} px={2}>
                <Text variant='label' fontSize='9px'>Principal + Max Profit</Text>
                <Flex alignItems='center' gap={1} lineHeight='18px'>
                  <Image h='14px' borderRadius='20px' src={loan?.currency?.icon_url} />
                  <Text fontSize='md' fontWeight='medium'>{formatCurrency(loan.principal_amount)}</Text>
                  <Text fontSize='md' fontWeight='medium' color='brand.success.600'>+{formatCurrency(maxInterestAmount, 4)}</Text>
                  <Text fontSize='xs'>({formatCurrency(loan.interest_rate * 100)}% APR)</Text>
                </Flex>
              </Flex>
              <Flex direction='column' alignItems='center' flex={1} gap={1} px={2} borderLeftColor='background.border' borderLeftWidth={2}>
                <Text variant='label' fontSize='9px'>Duration</Text>
                <Text fontSize='sm' fontWeight='medium' lineHeight='18px'>
                  {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(loan?.duration).dividedBy(86400).toNumber())} days`}
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      </a>
    </Box>
  );
};

export default CardNftLoan;
