import React, { memo } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import { ProposalChoiceData } from "../Voting.Services.Data";
import { formatCurrencyByLocale } from "src/common/utils/format";
import { Button } from "react-bootstrap";

interface VotingVoteConfirmProps {
  onClose?: () => void;
  onConfirm?: () => void;
  choice: ProposalChoiceData;
  balance: number;
}

const VotingVoteConfirm: React.FC<VotingVoteConfirmProps> = ({
  onClose,
  choice,
  balance = 0,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  if (!choice) return null;

  const disabled = balance === 0;

  return (
    <div className={cx(styles.choiceWrapper, styles.confirmVote)}>
      <div className={styles.choiceTitle}>
        <h5>Confirm Vote</h5>
      </div>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        <div className={styles.section}>
          <h5>Voting for</h5>
          <div className={styles.choiceName}>{choice.name}</div>
        </div>
        <div className={styles.section}>
          <h5>Your Voting Power</h5>
          <div className={styles.choiceName}>
            {formatCurrencyByLocale(balance)}
          </div>
        </div>
        {balance === 0 && (
          <div className={styles.warningBalance0}>
            Hold some PWP in your wallet at the snapshot block to get voting
            power for future proposals.
          </div>
        )}
        <Button
          disabled={disabled}
          onClick={handleConfirm}
          className={styles.btnConfirmVote}
        >
          Confirm Vote
        </Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default memo(VotingVoteConfirm);
