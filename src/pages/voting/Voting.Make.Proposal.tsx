import { Button } from '@chakra-ui/react';
import React, { memo } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { APP_URL } from "src/common/constants/url";
import styles from "./styles.module.scss";

interface VotingMakeProposalProps {}

const VotingMakeProposal: React.FC<VotingMakeProposalProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(APP_URL.VOTING_PROPOSAL_MAKE)}
      className={styles.btnMakeProposal}
    >
      Submit a Proposal
    </Button>
  );
};

export default memo(VotingMakeProposal);
