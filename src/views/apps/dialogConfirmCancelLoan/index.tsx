import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

interface DialogConfirmCancelLoanProps {
  onConfirm: Function;
  onClose: Function;
};

const DialogConfirmCancelLoan = (props: DialogConfirmCancelLoanProps) => {
  const { onClose, onConfirm } = props;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <Flex direction='column' fontSize='sm' gap={2}>
      <Text my={4} fontWeight='semibold'>Are you sure you want to cancel this loan? All incentive from listing this loan will be revoked</Text>
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

export default React.memo(DialogConfirmCancelLoan);
