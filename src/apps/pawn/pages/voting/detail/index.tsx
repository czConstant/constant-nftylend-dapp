import { Grid, GridItem } from '@chakra-ui/react';
import BigNumber from "bignumber.js";
import cx from "classnames";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link, useLocation } from "react-router-dom";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import Loading from "src/common/components/loading";
import { APP_URL } from "src/common/constants/url";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { useToken } from "src/modules/nftLend/hooks/useToken";
import {
  VotingProposalItemHistoryStatus,
  VotingProposalItemStatus,
  VotingProposalItemType,
} from "../list/Voting.Proposal.Item";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  CurrencyPWPTokenData,
  ProposalCheckVoteParams,
  ProposalListItemData,
  ProposalTypes,
  ProposalVoteCheckData,
} from "../Voting.Services.Data";
import VotingDetails from "./Voting.Details";
import VotingResults from "./Voting.Results";
import VotingVote from "./Voting.Vote";
import VotingVotes from "./Voting.Votes";

const VotingDetail = ({}) => {
  const location = useLocation();
  const query = queryString.parse(location.search);
  const id = query.id;

  const defaultBreadCrumbs = useRef([
    {
      label: "Discover",
      link: APP_URL.DISCOVER,
    },
    {
      label: "Proposal",
      link: APP_URL.VOTING,
    },
  ]).current;

  const [breadCrumbs, setBreadCrumbs] =
    useState<BreadCrumbItem[]>(defaultBreadCrumbs);

  const { currentWallet, isConnected } = useCurrentWallet();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState<ProposalListItemData>();
  const { getBalance } = useToken();
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyPWPTokenData | null>(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [yourVote, setYourVote] = useState<ProposalVoteCheckData | null>();

  useEffect(() => {
    getData();
  }, [id]);

  const fetchBalance = async () => {
    const currencies = await VotingServices.getCurrenciesPWP();
    const balance = await getBalance(currencies.contract_address);
    setBalance(
      new BigNumber(balance).dividedBy(10 ** currencies.decimals).toNumber()
    );
    setCurrency(currencies);
  };

  const getData = async () => {
    try {
      await Promise.all([fetchBalance(), getDetail(), checkVoteProposal()]);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsRefresh(false);
    }
  };

  const checkVoteProposal = async () => {
    try {
      const params: ProposalCheckVoteParams = {
        address: currentWallet.address,
        proposal_id: id,
        network: currentWallet?.chain,
      };
      const response: ProposalVoteCheckData =
        await VotingServices.checkVoteProposal(params);
      setYourVote(response);
    } catch (error) {}
  };

  const onRefreshData = () => {
    setIsRefresh(true);
    getData();
  };

  const getDetail = async () => {
    try {
      const response: ProposalListItemData = await VotingServices.getProposal(
        id?.toString()
      );
      if (response) {
        setProposal(response);
        setBreadCrumbs((value) => [
          ...defaultBreadCrumbs,
          {
            label: response.name,
          },
        ]);
      }
    } catch (error) {
    } finally {
    }
  };

  const renderDetail = () => {
    if (loading)
      return (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      );
    else if (!proposal || !id) {
      return (
        <div className={styles.loadingWrap}>
          <h5>No proposals found</h5>
          <Link to={APP_URL.VOTING}>{`< Back to Proposals`}</Link>
        </div>
      );
    }

    return (
      <div className={styles.detailContainer}>
        <Grid templateColumns={['1fr', '1.5fr 1fr']} columnGap={32}>
          <GridItem>
            <div className={styles.tagsWrap}>
              <VotingProposalItemHistoryStatus status={proposal.status} />
              <VotingProposalItemType type={proposal.type} />
            </div>
            <h1>{proposal.name}</h1>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: proposal.body }}
            />
            <VotingVote
              proposal={proposal}
              onRefreshData={onRefreshData}
              balance={balance}
              currency={currency}
              yourVote={yourVote}
            />
            {proposal.type != ProposalTypes.Proposal && (
              <VotingVotes
                proposal={proposal}
                isRefresh={isRefresh}
                currentWallet={currentWallet}
              />
            )}
          </GridItem>
          <GridItem justifyContent='flex-end'>
            <VotingDetails proposal={proposal} />
            {proposal.type != ProposalTypes.Proposal && (
              <VotingResults proposal={proposal} yourVote={yourVote} />
            )}
          </GridItem>
        </Grid>
      </div>
    );
  };

  return (
    <BodyContainer
      className={cx(isMobile && styles.mbDetailWrapper, styles.wrapper)}
    >
      <BreadCrumb items={breadCrumbs} />
      <div>{renderDetail()}</div>
    </BodyContainer>
  );
};

export default VotingDetail;
