import { Box, Flex, Heading, Icon, List, ListItem, Text } from '@chakra-ui/react'
import { FiCheckCircle, FiGift, FiKey } from 'react-icons/fi'

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
const rules = [
  'Our system calculates your points on a monthly basis. Matching = 1 point to Borrower, Delist -1 point to Borrower, Matched: 1 point to Borrower, 2 points to Lender.',
  'Rewards are reviewed and updated by the NFTPawn Team on a monthly basis.',
  'All NFT holders of the whitelisted NFT Collections can participate.',
  'For any questions or concerns, please contact NFT Pawn via our social media channels. The NFTPawn team\'s decision will be final. All rights reserved.',
]
const rewards = [
  { label: '1', desc: '1 Gen 0 Battle Boars Collection ~ 30 NEAR'},
  { label: '2', desc: '1 Cartel NFT (rarity score 200) ~ 24 NEAR'},
  { label: '3', desc: '1 Cartel NFT (rarity score 150) ~ 16 NEAR'},
  { label: '4', desc: '15,000 PWP'},
  { label: '5', desc: '15,000 PWP'},
]

const ProgramDetail = () => {
  return (
    <Box>
      <Heading as='h2' fontSize='2xl' mb={2}>Program Detail</Heading>
      <Text color='text.secondary'>NFT Pawn Leadership Ranking is a program to provide incentives for customers to enjoy NFT P2P Matching with goals in mind.</Text>
      <Flex my={8} gap={8} fontSize='sm'>
        <Box flex={1} bgColor='background.darker' p={4} borderRadius={16} borderColor='background.border' borderWidth={2}>
          <Text mb={4} color='brand.primary.300' fontSize='xl' fontWeight='bold'>For Borrowers</Text>
          <List spacing={2}>
            {forBorrowers.map(e => (
              <ListItem>
                <Flex gap={2}>
                  <Icon mt={1} color='brand.primary.300' as={FiCheckCircle} />
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
                  <Icon mt={1} color='brand.info.400' as={FiCheckCircle} />
                  <Text>{e}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
      <Box fontSize='sm' bgColor='background.darker' px={4} py={8} borderRadius={16} borderColor='background.border' borderWidth={2}>
        <Flex gap={8}>
          <Box flex={1}>
            <Text mb={4} color='brand.warning.400' fontSize='xl' fontWeight='bold'>Rules</Text>
            <List spacing={2}>
              {rules.map(e => (
                <ListItem>
                  <Flex gap={2}>
                    <Icon mt={1} color='brand.warning.400' as={FiKey} />
                    <Text>{e}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box flex={1}>
            <Text mb={4} color='brand.success.600' fontSize='xl' fontWeight='bold'>Rewards</Text>
            <List spacing={2}>
              {rewards.map(e => (
                <ListItem>
                  <Flex gap={2}>
                    <Icon mt={1} color='brand.success.600' as={FiGift} />
                    <Text>Rank {e.label}: {e.desc}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default ProgramDetail