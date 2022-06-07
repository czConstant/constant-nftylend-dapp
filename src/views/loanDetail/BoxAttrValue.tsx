import { ReactNode } from 'react';
import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { MdInfoOutline } from 'react-icons/md';

interface BoxAttrValueProps {
  label: string;
  value: ReactNode;
  desc?: string;
}

const BoxAttrValue = (props: BoxAttrValueProps) => {
  const { label, value, desc } = props;

  return (
    <Box bgColor='background.darker' borderRadius={16} p={4}>
      <Flex gap={2} alignItems='center'>
        <Text variant='attrLabel'>{label}</Text>
        {desc && (
          <Tooltip placement='top' label={desc}>
            <span><Icon as={MdInfoOutline} /></span>
          </Tooltip>
        )}
      </Flex>
      <Text fontWeight='bold'>{value}</Text>
    </Box>
  )
};

export default BoxAttrValue;