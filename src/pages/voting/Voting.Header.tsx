import { Player } from "@lottiefiles/react-lottie-player";
import bgCircle from "./images/bgBubble.webp";
import VotingMakeProposal from "./Voting.Make.Proposal";
import styles from "./styles.module.scss";
import ideals from "./images/ideals.json";
import { Box, Flex } from '@chakra-ui/react';

const VotingHeader = () => {
  return (
    <Box overflow='hidden' minH={300} bgColor='black' position='relative' className={styles.votingHeader}>
      <img
        src={bgCircle}
        className={styles.positionBubbleCircle}
        height={600}
      />
      <Flex mt={[20, 0]} direction={['column', 'row']} alignItems='center' justifyContent='space-evenly' className={styles.votingHeaderContent}>
        <Flex direction='column' px={4} py={8}>
          <h3>Shape NFTPawn</h3>
          <p>Have a say on the future of NFTPawn with your own proposal</p>
          <VotingMakeProposal />
        </Flex>
        <Box display={['none', 'block']} className={styles.wrapImgIdeals} >
          <Player
            autoplay
            loop
            src={ideals}
            style={{ height: "100%", width: "400px" }}
            className={styles.imgIdeals}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default VotingHeader;
