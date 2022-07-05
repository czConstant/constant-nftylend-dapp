import React from 'react';

import noRecordWhite from './img_list_empty_white.svg';
import noRecordGray from './img_list_empty_gray.svg';

import { Center, Flex, Image, Text } from '@chakra-ui/react';

interface EmptyListProps {
  className?: string;
  link?: string;
  label?: string;
  labelText?: React.ReactNode;
  type?: string;
  imageSize?: number;
  dark?: boolean;
};

const EmptyList = (props: EmptyListProps) => {
  const { className, labelText = 'No result found', imageSize = 40, dark = false } = props;

  return (
    <Center flexDirection='column' className={className} p={8}>
      <Image w={imageSize} src={noRecordGray} />
      <Text fontSize='lg' color='text.secondary' fontWeight='semibold'>{labelText}</Text>
    </Center>
  );
};

export default EmptyList;
