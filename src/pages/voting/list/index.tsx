import React, { memo, useEffect, useRef, useState } from "react";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import { ProposalListItemData, ProposalStatus } from "../Voting.Services.Data";
import VotingProposalItem from "./Voting.Proposal.Item";
import cx from "classnames";
import { Button } from "react-bootstrap";
import Loading from "src/common/components/loading";
import { VOTING_STATUS } from "../Voting.Constant";
import { Heading } from '@chakra-ui/react';

const VotingList = () => {
  const refFilters = useRef(VOTING_STATUS).current;

  const [rows, setRows] = useState<ProposalListItemData[]>([]);
  const [status, setStatus] = useState<ProposalStatus>(
    ProposalStatus.ProposalStatusCreated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [status]);

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
      <Heading as='h1' mb={2}>Proposals</Heading>
      <div className={cx(styles.choiceWrapper, styles.listRows)}>
        <div className={cx(styles.choiceHeader, styles.listRowsHeader)}>
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
