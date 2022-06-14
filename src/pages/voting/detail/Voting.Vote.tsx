import cx from "classnames";
import { last } from "lodash";
import moment from "moment-timezone";
import React, { memo, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import ButtonConnectWallet from "src/common/components/buttonConnectWallet";
import Loading from "src/common/components/loading";
import { toastError, toastSuccess } from "src/common/services/toaster";
import { nearSignText } from "src/modules/near/utils";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { closeModal, openModal } from "src/store/modal";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  CurrencyPWPTokenData,
  ProposalChoiceData,
  ProposalListItemData,
  ProposalStatus,
  ProposalVoteCheckData,
  ProposalVoteData,
  ProposalVoteMessage,
  ProposalVoteRequest,
} from "../Voting.Services.Data";
import VotingVoteConfirm from "./Voting.Vote.Confirm";

interface VotingVotesProps {
  proposal: ProposalListItemData;
  onRefreshData: () => void;
  balance: number;
  currency?: CurrencyPWPTokenData;
  yourVote?: ProposalVoteCheckData | null;
}

const VotingVote: React.FC<VotingVotesProps> = ({
  proposal,
  onRefreshData,
  balance,
  yourVote,
}) => {
  const dispatch = useDispatch();

  const [choice, setChoice] = useState<ProposalChoiceData>();
  const [loading, setLoading] = useState(false);
  const { currentWallet, isConnected } = useCurrentWallet();

  const onCastVote = async () => {
    try {
      setLoading(true);
      const message: ProposalVoteMessage = {
        timestamp: moment().unix(),
        space: `vote.pwp`,
        version: "1.0",
        type: "vote",
        payload: {
          choice: [parseFloat(choice?.choice)],
          proposal: last(proposal.ipfs_hash.split("/"))?.toString(),
        },
      };
      const strMessage = JSON.stringify(message);
      const signature = await nearSignText(currentWallet?.address, strMessage);
      const data: ProposalVoteRequest = {
        network: proposal.network,
        address: currentWallet?.address,
        message: strMessage,
        signature,
        version: "1.0",
      };
      const response: ProposalVoteData = await VotingServices.voteProposal(
        data
      );
      toastSuccess("Cast Vote Successfully");
      onRefreshData();
    } catch (error) {
      toastError(error?.message || error);
    } finally {
      onRefreshData();
      setLoading(false);
    }
  };

  const showConfirm = () => {
    dispatch(
      openModal({
        id: "confirmVoteModal",
        theme: "dark",
        title: 'Confirm Vote',
        modalProps: {
          centered: true,
        },
        render: () => (
          <VotingVoteConfirm
            onClose={() => dispatch(closeModal({ id: "confirmVoteModal" }))}
            onConfirm={onCastVote}
            balance={balance}
            choice={choice}
          />
        ),
      })
    );
  };

  if (
    proposal.status !== ProposalStatus.ProposalStatusCreated ||
    Boolean(yourVote)
  )
    return null;

  let disabled = loading || !choice;

  return (
    <div className={cx(styles.choiceWrapper, styles.blockWrapper)}>
      <div className={styles.choiceTitle}>
        <h5>Cast your vote</h5>
      </div>
      <div className={cx(styles.contentWrapper, styles.choiceFormWrap)}>
        {proposal.choices.map((_choice, i) => (
          <Button
            onClick={() => setChoice(_choice)}
            className={styles.choiceItem}
            key={_choice.id}
          >
            <span className={styles.choiceItemCircle}>
              {choice?.id === _choice.id && (
                <span
                  className={cx(
                    styles.choiceItemCircle,
                    styles.choiceItemCircleActive
                  )}
                />
              )}
            </span>
            {_choice.name}
          </Button>
        ))}
        <div> </div>
        {isConnected ? (
          <Button
            className={cx(styles.btnCastVote)}
            type="submit"
            disabled={disabled}
            onClick={showConfirm}
          >
            {loading ? <Loading dark /> : "Cast Vote"}
          </Button>
        ) : (
          <ButtonConnectWallet
            className={cx(styles.btnCastVote, styles.btnConnect)}
          />
        )}
      </div>
    </div>
  );
};

export default memo(VotingVote);
