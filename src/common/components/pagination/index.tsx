import { Flex, IconButton, Icon, Text } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface PaginationProps {
  page: number,
  total: number,
  pageSize: number,
  onChangePage: Function,
}

const Pagination = (props: PaginationProps) => {
  const { page, pageSize, total, onChangePage } = props;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <Flex alignItems='center' gap={4}>
      <Text>Showing {start} - {end} of {total}</Text>
      <IconButton borderWidth={2} colorScheme='whiteAlpha' isRound variant='outline' onClick={() => onChangePage(page - 1)} disabled={page <= 1} aria-label='prev' icon={<Icon as={MdChevronLeft} />} />
      <IconButton borderWidth={2} colorScheme='whiteAlpha' isRound variant='outline' onClick={() => onChangePage(page + 1)} disabled={page * pageSize >= total} aria-label='next' icon={<Icon as={MdChevronRight} />} />
    </Flex>
  )
};

export default Pagination;