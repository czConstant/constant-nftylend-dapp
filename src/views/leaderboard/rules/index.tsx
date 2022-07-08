import { Box, Heading, ListItem, OrderedList } from '@chakra-ui/react'

const Rules = () => {
  return (
    <Box>
      <Heading as='h2' fontSize='xl' ml={2} mb={2}>Rules</Heading>
      <Box bgColor='background.darker' px={4} py={8} borderRadius={16} borderColor='background.border' borderWidth={2}>
        <OrderedList fontSize='sm' spacing={2}>
          <ListItem>Point calculating: Matched = 1 Point, Matching = 1 Point</ListItem>
          <ListItem>Reward would be reviewed and calculated monthly basis by NFTPawn Team.</ListItem>
        </OrderedList>
      </Box>
    </Box>
  )
}

export default Rules