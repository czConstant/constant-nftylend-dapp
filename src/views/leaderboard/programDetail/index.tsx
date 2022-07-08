import { Box, Divider, Flex, Heading, Icon, List, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'

const forBorrowers = [
  'Easy to use NFT (whitelisted) as collateral to access funds instantly.',
  'Extra security on the ownership with 2-day Liquidation Protection',
  'Secure, fast, cheap and transparent.',
]
const forLenders = [
  'Opportunity to earn high yield interest or buy your favorite NFT at a significant discount.',
  'Safe and fast with secure transactions powered by NFT Pawn SmartContract.',
  'Easy to negotiate terms.',
]

const Rules = () => {
  return (
    <Box>
      <Heading as='h2' fontSize='2xl' mb={2}>Program Detail</Heading>
      <Text color='text.secondary'>NFT Pawn Leadership Ranking is a program to provide incentives for customers to enjoy NFT P2P Matching with goals in mind.</Text>
      <Flex my={8} gap={8} fontSize='sm'>
        <Box flex={1} bgColor='background.darker' p={4} borderRadius={16} borderColor='background.border' borderWidth={2}>
          <Text mb={4} color='brand.warning.400' fontSize='xl' fontWeight='bold'>For Borrowers</Text>
          <List spacing={2}>
            {forBorrowers.map(e => (
              <ListItem>
                <Flex gap={2}>
                  <Icon mt={1} color='brand.success.600' as={FiCheckCircle} />
                  <Text>{e}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex={1} bgColor='background.darker' p={4} borderRadius={16} borderColor='background.border' borderWidth={2}>
          <Text mb={4} color='brand.info.400' fontSize='xl' fontWeight='bold'>For Lenders</Text>
          <List spacing={2}>
            {forLenders.map(e => (
              <ListItem>
                <Flex gap={2}>
                  <Icon mt={1} color='brand.success.600' as={FiCheckCircle} />
                  <Text>{e}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
      <Box bgColor='background.darker' px={4} py={8} borderRadius={16} borderColor='background.border' borderWidth={2}>
        <Text mb={4} color='brand.success.600' fontWeight='bold'>Rules</Text>
        <OrderedList fontSize='sm' spacing={2}>
          <ListItem>Our system calculates your points on a monthly basis. Matched / Matching = 1 point.</ListItem>
          <ListItem>Rewards are reviewed and updated by the NFTPawn Team on a monthly basis.</ListItem>
          <ListItem>All NFT holders of the whitelisted NFT Collections can participate.</ListItem>
          <ListItem>For any questions or concerns, please contact NFT Pawn via our social media channels. The NFTPawn team's decision will be final. All rights reserved.</ListItem>
        </OrderedList>
      </Box>
    </Box>
  )
}

export default Rules