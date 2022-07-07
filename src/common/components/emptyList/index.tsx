import React from 'react';

import IconSadGray from './img_sad_gray.svg';
import IconSmileGray from './img_smile_gray.svg';

import { Center, Flex, Image, Text } from '@chakra-ui/react';

interface EmptyListProps {
  className?: string;
  link?: string;
  label?: string;
  labelText?: React.ReactNode;
  type?: string;
  imageSize?: number;
  dark?: boolean;
  positive?: boolean;
};

const EmptyList = (props: EmptyListProps) => {
  const { className, labelText = 'No result found', imageSize = 80, positive = false } = props;

  return (
    <Center flexDirection='column' className={className} p={8} gap={4}>
      <Image w={imageSize} src={positive ? IconSmileGray : IconSadGray} />
      <Text fontSize='lg' color='text.secondary' fontWeight='semibold'>{labelText}</Text>
    </Center>
  );
};

export default EmptyList;
