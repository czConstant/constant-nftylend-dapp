import React, { memo } from "react";
import { Button } from "react-bootstrap";
import styles from "./styles.module.scss";

interface VotingMakeProposalProps {}

const VotingMakeProposal: React.FC<VotingMakeProposalProps> = ({}) => {
  return <Button className={styles.btnMakeProposal}>Make a Proposals</Button>;
};

export default memo(VotingMakeProposal);
