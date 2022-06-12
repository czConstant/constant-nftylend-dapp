import cx from "classnames";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Link, useLocation } from "react-router-dom";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import Loading from "src/common/components/loading";
import { APP_URL } from "src/common/constants/url";
import { VotingProposalItemStatus } from "../list/Voting.Proposal.Item";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  ProposalChoiceData,
  ProposalListItemData,
} from "../Voting.Services.Data";
import VotingDetails from "./Voting.Details";
import VotingResults from "./Voting.Results";
import VotingVotes from "./Voting.Votes";

const VotingDetail = ({}) => {
  const location = useLocation();
  const query = queryString.parse(location.search);
  const id = query.id;

  const defaultBreadCrumbs = useRef([
    {
      label: "Discover",
      link: APP_URL.NFT_LENDING,
    },
    {
      label: "Voting",
      link: APP_URL.NFT_LENDING_VOTING,
    },
  ]).current;

  const [breadCrumbs, setBreadCrumbs] =
    useState<BreadCrumbItem[]>(defaultBreadCrumbs);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState<ProposalListItemData>();
  const [choice, setChoice] = useState<ProposalChoiceData>();

  useEffect(() => {
    getDetail();
  }, [id]);

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
      setLoading(false);
    }
  };

  const onCastVote = async () => {
    try {
    } catch (error) {}
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
          <Link to={APP_URL.NFT_LENDING_VOTING}>{`< Back to Proposals`}</Link>
        </div>
      );
    }
    return (
      <div className={styles.detailContainer}>
        <Row>
          <Col md={8}>
            <VotingProposalItemStatus status={proposal.status} />
            <h1>{proposal.name}</h1>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: proposal.body }}
            />
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
                <Button
                  onClick={onCastVote}
                  className={styles.btnCastVote}
                  disabled={!choice}
                >
                  Cast Vote
                </Button>
              </div>
            </div>
            <VotingVotes proposal={proposal} />
          </Col>
          <Col md={4}>
            <VotingDetails proposal={proposal} />
            <VotingResults proposal={proposal} />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <BreadCrumb items={breadCrumbs} />
      <div>{renderDetail()}</div>
    </BodyContainer>
  );
};

export default VotingDetail;
