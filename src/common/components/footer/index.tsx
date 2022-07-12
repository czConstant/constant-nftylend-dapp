import React from 'react'
import { Link } from "react-router-dom"
import { Box, Divider, Flex, Icon, Text, Tooltip } from '@chakra-ui/react'

import SocialLinks from 'src/views/apps/socialLinks'
import { APP_URL } from "src/common/constants/url"

import AppIcon from "../appIcon"
import InfoTooltip from '../infoTooltip'
import SectionContainer from '../sectionContainer'
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'

const Footer = () => {
  const { isFromParas } = useCurrentWallet()

  return (
    <Box bgColor='black'>
      <Divider color='background.darker' />
      <SectionContainer>
        <Flex direction={['column', 'row']} pt={50} pb={30} justifyContent='space-between'>
          <Box>
            <Link to={APP_URL.DISCOVER}>
              <AppIcon />
            </Link>
            {!isFromParas && (
              <Flex mt={4} direction='column' color='text.primary' fontSize='sm'>
                <Text fontWeight='medium'><i className="far fa-copyright" />2019-2022 Const LLC.</Text>
                <Text>3500 S dupont hwy Dover 19901 Delaware</Text>
              </Flex>
            )}
          </Box>
          <Text py={4} fontWeight='medium'>First NFTs Lending Solution On Near Protocol</Text>
          <Flex direction='column' alignItems='flex-end'>
            <SocialLinks />
            <Box mt={4} color='text.secondary' fontSize='small'>
              <Flex alignItems='center' justifyContent='flex-end'>
                <Text mr={4}>This project is in public beta</Text>
                <InfoTooltip label="This project is in public beta. NFT Pawn's smart contract is not yet audited by a well-known security organization or firm. Use at your own risk!" />
              </Flex>
              <div>Copyright © 2022 NFT Pawn. All rights reserved</div>
            </Box>
          </Flex>
        </Flex>
      </SectionContainer>
    </Box>
  )
}

export default React.memo(Footer)
