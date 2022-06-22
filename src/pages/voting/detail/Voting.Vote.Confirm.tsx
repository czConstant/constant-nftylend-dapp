import React, { memo } from "react";
import cx from "classnames";
import styles from "../styles.module.scss";
import {
  ProposalChoiceData,
  ProposalListItemData,
  ProposalTypes,
} from "../Voting.Services.Data";
import { formatCurrencyByLocale } from "src/common/utils/format";
import { Button } from "react-bootstrap";

interface VotingVoteConfirmProps {
  onClose?: () => void;
  onConfirm?: () => void;
  choice: ProposalChoiceData;
  balance: number;
  proposal: ProposalListItemData;
}

const VotingVoteConfirm: React.FC<VotingVoteConfirmProps> = ({
  onClose,
  choice,
  balance = 0,
  onConfirm,
  proposal,
}) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  if (!choice) return null;

  let disabled = false;

  if (balance === 0 && proposal?.type === ProposalTypes.Gov) {
    disabled = true;
  }

  return (
    <div className={cx(styles.choiceWrapper, styles.confirmVote)}>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        <div className={styles.section}>
          <h5>Proposal for</h5>
          <div className={styles.choiceName}>{choice.name}</div>
        </div>
        {proposal?.type === ProposalTypes.Gov && (
          <React.Fragment>
            <div className={styles.section}>
              <h5>Your Proposal Power</h5>
              <div className={styles.choiceName}>
                {formatCurrencyByLocale(balance)}
              </div>
            </div>
            {balance === 0 && (
              <div className={styles.warningBalance0}>
                Hold some PWP in your wallet at the snapshot block to get proposal
                power for future proposals.
              </div>
            )}
          </React.Fragment>
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
