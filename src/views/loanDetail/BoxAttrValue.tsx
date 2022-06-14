import { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import InfoTooltip from 'src/common/components/infoTooltip';

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
        {desc && <InfoTooltip label={desc} />}
      </Flex>
      <Text fontWeight='bold'>{value}</Text>
    </Box>
  )
};

export default BoxAttrValue;