import React from "react";
import cx from "classnames";

import styles from "./styles.module.scss";
import { isMobile } from "react-device-detect";

interface BodyContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BodyContainer = (props: BodyContainerProps) => {
  const { className, children } = props;

  return (
    <div className={cx(className, styles.bodyContainer)}>
      <div>{children}</div>
    </div>
  );
};

export default BodyContainer;
