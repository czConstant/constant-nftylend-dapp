import { memo } from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';
import { Flex, Image, Text } from '@chakra-ui/react';

interface CryptoDropdownItemProps {
  icon?: string,
  name: string,
  symbol: string,
  network?: string,
  balance?: number,
  className?: string,
}

const CryptoDropdownItem = (props: CryptoDropdownItemProps) => {
  const { name, symbol, balance, network, icon, className } = props;

  return (
    <Flex fontSize='sm' minW={balance ? 300 : 160} w='100%'  alignItems='center' justifyContent='space-between' className={className}>
      <Flex>
        <Image alt="" src={icon} width='18px' height='18px' mr={4} />
        <Text mr={2}>{name}</Text>
        <Text color='text.secondary'>{symbol}</Text>
      </Flex>
      {!!balance &&  <Text pr={2}>{balance}</Text>}
    </Flex>
  );
};

export default memo(CryptoDropdownItem);