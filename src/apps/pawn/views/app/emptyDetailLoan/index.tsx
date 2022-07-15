import { useNavigate } from "react-router-dom";
import { Button, Center, Flex, Heading, Image } from '@chakra-ui/react';

import { APP_URL } from "src/common/constants/url";
import imgEmpty from "./assets/img_detail_empty.png";

interface EmptyDetailLoanProps {
  message?: string;
}

const EmptyDetailLoan = (props: EmptyDetailLoanProps) => {
  const { message } = props;
  const navigate = useNavigate();
  return (
    <Flex direction='column' alignItems='center' gap={8} py={8}>
      <Image alt="NFT Lending Empty" src={imgEmpty} />
      <Heading as='h3'>{message || 'Sorry, we couldn’t find this Loans.'}</Heading>
      <Button h={12} w={200} onClick={() => navigate(APP_URL.DISCOVER)}>Discover</Button>
    </Flex>
  );
};

export default EmptyDetailLoan;
