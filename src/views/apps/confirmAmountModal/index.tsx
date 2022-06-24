import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react';

import { AssetNft } from 'src/modules/nftLend/models/nft';
import { formatCurrency } from 'src/common/utils/format';

interface ModalConfirmAmountProps {
  asset: AssetNft;
  amount: number;
  symbol: string;
  onConfirm: Function;
  onClose: Function;
};

const ModalConfirmAmount = (props: ModalConfirmAmountProps) => {
  const { asset, amount, symbol, onClose, onConfirm } = props;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <Flex direction='column' fontSize='sm' gap={2}>
      <Grid templateColumns='1fr 1fr' columnGap={4} rowGap={2}>
        <GridItem>
          <Text>You are about to order</Text>
        </GridItem>
        <GridItem>
          <Text textAlign='right' fontSize='md' fontWeight='bold'>{asset.name}</Text>
        </GridItem>
        <GridItem>
          <Text>Total</Text>
        </GridItem>
        <GridItem>
          <Text textAlign='right' fontSize='md' fontWeight='bold'>{formatCurrency(amount)} {symbol}</Text>
        </GridItem>
      </Grid>
      <Text my={4} fontWeight='semibold'>You will be redirected to your wallet to confirm your transaction</Text>
      <Flex alignItems='center' gap={4}>
        <Button flex={1} onClick={onClose} variant='solid' colorScheme='whiteAlpha'>
          Cancel
        </Button>
        <Button flex={1}  onClick={handleConfirm}>
          Confirm
        </Button>
      </Flex>
    </Flex>
  );
};

export default React.memo(ModalConfirmAmount);
