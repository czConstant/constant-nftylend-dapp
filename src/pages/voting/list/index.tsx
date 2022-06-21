import { Heading } from "@chakra-ui/react";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "src/common/components/loading";
import styles from "../styles.module.scss";
import { VOTING_STATUS } from "../Voting.Constant";
import VotingServices from "../Voting.Services";
import {
  ProposalListItemData,
  ProposalStatus,
  ProposalTypeData
} from "../Voting.Services.Data";
import VotingProposalItem from "./Voting.Proposal.Item";

const VotingList = () => {
  const configs = useSelector((state) => state?.nftyLend?.configs);
  const proposalTypes: ProposalTypeData[] = configs?.proposals || [];

  const defaultType: ProposalTypeData = proposalTypes.find((v) => v.active);

  const refFilters = useRef(VOTING_STATUS).current;
  const refTypes = useRef(proposalTypes).current;

  const [rows, setRows] = useState<ProposalListItemData[]>([]);
  const [type, setType] = useState<string>(defaultType?.key);
  const [status, setStatus] = useState<ProposalStatus>(
    ProposalStatus.ProposalStatusCreated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [status, type]);

  const getData = async () => {
    try {
      setLoading(true);
      await Promise.all([getRows()]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getRows = async () => {
    try {
      const findStatus = VOTING_STATUS.find((v) => v.key === status);
      const _rows = await VotingServices.getProposals({
        status: findStatus?.filters || findStatus?.key,
        type: type,
      });
      setRows(_rows);
    } catch (error) {}
  };

  const renderList = () => {
    if (loading)
      return (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      );
    else if (rows.length === 0) {
      return (
        <div className={styles.loadingWrap}>
          <h5>No proposals found</h5>
        </div>
      );
    }
    return rows.map((r: ProposalListItemData) => (
      <VotingProposalItem proposal={r} key={r.id} />
    ));
  };

  return (
    <div className={styles.listContainer}>
      <Heading as="h1" mb={2}>
        Proposals
      </Heading>
      <div className={cx(styles.choiceWrapper, styles.listRows)}>
        <div className={cx(styles.choiceHeader, styles.listRowsHeader)}>
          {refTypes.map((filter) => (
            <Button
              className={cx(
                filter.key === type ? styles.typeActive : "",
                styles.statusWrap
              )}
              disabled={!filter.active}
              key={filter.key}
              onClick={() => setType(filter.key)}
            >
              {filter.name}
              {!filter.active && (
                <span className={styles.comingSoon}>Coming Soon</span>
              )}
            </Button>
          ))}
        </div>
        <div className={styles.filterContainer}>
          {refFilters.map((filter) => (
            <Button
              className={cx(
                filter.key === status ? styles[`${filter.key}`] : "",
                styles.statusWrap
              )}
              style={
                filter.key === status
                  ? { backgroundColor: filter.color }
                  : undefined
              }
              key={filter.key}
              onClick={() => setStatus(filter.key)}
            >
              <img src={filter.icon} />
              {filter.name}
            </Button>
          ))}
        </div>

        {renderList()}
      </div>
    </div>
  );
};

export default VotingList;
