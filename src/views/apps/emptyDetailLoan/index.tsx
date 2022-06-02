import React from "react";
import { Button } from "react-bootstrap";

import styles from "./styles.module.scss";
import imgEmpty from "./assets/img_detail_empty.png";
import { APP_URL } from "src/common/constants/url";
import { useNavigate } from "react-router-dom";

interface EmptyDetailLoanProps {
  message?: string;
}

const EmptyDetailLoan = (props: EmptyDetailLoanProps) => {
  const { message } = props;
  const navigate = useNavigate();
  return (
    <div className={styles.emptyWrap}>
      <img alt="NFT Lending Empty" src={imgEmpty} />
      <h3>{message || 'Sorry, we couldn’t find this Loans.'}</h3>
      <Button onClick={() => navigate(APP_URL.DISCOVER)}>Discover</Button>
    </div>
  );
};

export default EmptyDetailLoan;
