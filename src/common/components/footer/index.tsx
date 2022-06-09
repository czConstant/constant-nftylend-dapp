import React from 'react';
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import cx from "classnames";
import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { MdInfoOutline } from 'react-icons/md';

import SocialLinks from 'src/views/apps/socialLinks';
import { APP_URL } from "src/common/constants/url";

import AppIcon from "../appIcon";
import InfoTooltip from '../infoTooltip';
import SectionContainer from '../sectionContainer';

const Footer = () => (
  <SectionContainer>
    <Flex pt={50} pb={30} justifyContent='space-between'>
      <Box>
        <Link to={APP_URL.DISCOVER}>
          <AppIcon />
        </Link>
        <Flex mt={4} direction='column' color='text.primary' fontSize='sm'>
          <Text fontWeight='medium'><i className="far fa-copyright" />2019-2022 Const LLC.</Text>
          <Text>3500 S dupont hwy Dover 19901 Delaware</Text>
        </Flex>
      </Box>
      <Text fontWeight='medium'>First NFTs Lending Solution On Near Protocol</Text>
      <Flex direction='column' alignItems='flex-end'>
        <SocialLinks />
        <Box mt={4} color='text.secondary' fontSize='small'>
          <Flex alignItems='center' justifyContent='flex-end'>
            <Text mr={4}>This project is in public beta</Text>
            <InfoTooltip iconSize='md' label="This project is in public beta. NFT Pawn's smart contract is not yet audited by a well-known security organization or firm. Use at your own risk!" />
          </Flex>
          <div>Copyright © 2022 NFT Pawn. All rights reserved</div>
        </Box>
      </Flex>
    </Flex>
  </SectionContainer>
);

export default React.memo(Footer);
