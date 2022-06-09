import React from "react";
import BodyContainer from "src/common/components/bodyContainer";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import styles from "../styles.module.scss";

const VotingDetail = () => {
  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <div>aaaaa</div>
    </BodyContainer>
  );
};

export default VotingDetail;
